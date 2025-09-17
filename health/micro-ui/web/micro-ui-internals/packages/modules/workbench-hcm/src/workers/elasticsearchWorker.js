// Web Worker for Elasticsearch data fetching with deduplication

// Global state for request management
const activeRequests = new Map(); // Track active fetch requests by requestId
const batchCache = new Map(); // Cache successful batch results by batch key
const inFlightBatches = new Map(); // Track in-flight batch requests to prevent duplicates
let currentRequestId = null;
let isCancelled = false;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL
const MAX_PARALLEL_BATCHES = 4; // Process 4 batches in parallel

// Helper function to generate batch key for deduplication
function generateBatchKey(index, offset, size, queryParams) {
  const paramsStr = JSON.stringify(queryParams || {});
  return `${index}_${offset}_${size}_${paramsStr}`;
}

// Clean expired cache entries
function cleanCache() {
  const now = Date.now();
  for (const [key, value] of batchCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      batchCache.delete(key);
      console.log(`🗑️ Removed expired cache entry: ${key}`);
    }
  }
}

// Helper function to get nested values from objects
function getNestedValue(obj, path) {
  if (!path) return obj;
  
  const keys = path.split('.');
  let value = obj;
  
  for (let i = 0; i < keys.length; i++) {
    if (value === null || value === undefined) {
      return undefined;
    }
    value = value[keys[i]];
  }
  
  return value;
}

// Build Elasticsearch query based on configuration
async function buildElasticsearchQuery({ projectName, queryParams, offset, size, kibanaConfig }) {
  let elasticsearchQuery;
  
  if (kibanaConfig.customQuery) {
    // Use custom query if provided
    elasticsearchQuery = typeof kibanaConfig.customQuery === 'function' 
      ? kibanaConfig.customQuery(projectName, queryParams, offset, size)
      : kibanaConfig.customQuery;
    
    // Ensure from and size are set
    elasticsearchQuery.from = elasticsearchQuery.from || offset;
    elasticsearchQuery.size = elasticsearchQuery.size || size;
  } else {
    // Default query structure with dynamic source fields
    const sourceFields = kibanaConfig.sourceFields || [
      "Data.geoPoint",
      "Data.@timestamp", 
      "Data.productName",
      "Data.memberCount",
      "Data.additionalDetails.administrativeArea",
      "Data.quantity",
      "Data.status",
      "Data.userName"
    ];
    
    // Build query conditions array to support multiple parameters
    let queryConditions = [];
    
    // Handle multiple query parameters
    if (queryParams && typeof queryParams === 'object') {
      Object.keys(queryParams).forEach(function(field) {
        const value = queryParams[field];
        if (value !== null && value !== undefined && value !== '') {
          const dataPrefix = kibanaConfig.dataPrefix || 'Data';
          const queryPath = dataPrefix ? dataPrefix + '.' + field : field;
          
          // Determine query type for this field
          const fieldConfig = kibanaConfig.fieldConfigs && kibanaConfig.fieldConfigs[field];
          const queryType = fieldConfig ? fieldConfig.queryType : (kibanaConfig.queryType || 'term');
          
          if (queryType === 'match') {
            queryConditions.push({
              "match": {
                [queryPath]: value
              }
            });
          } else if (queryType === 'range') {
            queryConditions.push({
              "range": {
                [queryPath]: value  // value should be an object like { "gte": "2024-01-01" }
              }
            });
          } else if (queryType === 'terms') {
            queryConditions.push({
              "terms": {
                [queryPath + '.keyword']: Array.isArray(value) ? value : [value]
              }
            });
          } else if (queryType === 'wildcard') {
            queryConditions.push({
              "wildcard": {
                [queryPath + '.keyword']: value
              }
            });
          } else {
            // Default term query
            queryConditions.push({
              "term": {
                [queryPath + '.keyword']: value
              }
            });
          }
        }
      });
    } else if (projectName) {
      // Fallback to single projectName query for backward compatibility
      const queryField = kibanaConfig.queryField || 'projectName';
      const queryPath = kibanaConfig.dataPrefix ? kibanaConfig.dataPrefix + '.' + queryField : 'Data.' + queryField;
      
      queryConditions.push(
        kibanaConfig.queryType === 'match' ? {
          "match": {
            [queryPath]: projectName
          }
        } : {
          "term": {
            [queryPath + '.keyword']: projectName
          }
        }
      );
    }
    
    // Build the final query
    let finalQuery;
    if (queryConditions.length === 0) {
      finalQuery = { "match_all": {} };
    } else if (queryConditions.length === 1) {
      finalQuery = queryConditions[0];
    } else {
      finalQuery = {
        "bool": {
          "must": queryConditions
        }
      };
    }
    
    elasticsearchQuery = {
      "_source": sourceFields,
      "query": finalQuery,
      "from": offset,
      "size": size
    };
    
    // Add any additional query parameters
    if (kibanaConfig.additionalFilters) {
      if (elasticsearchQuery.query.bool) {
        elasticsearchQuery.query.bool.must = elasticsearchQuery.query.bool.must.concat(kibanaConfig.additionalFilters);
      } else {
        elasticsearchQuery.query = {
          "bool": {
            "must": [
              elasticsearchQuery.query
            ].concat(kibanaConfig.additionalFilters)
          }
        };
      }
    }
    
    // Add sorting if specified
    if (kibanaConfig.sort) {
      elasticsearchQuery.sort = kibanaConfig.sort;
    }
  }
  
  return elasticsearchQuery;
}

// Parse Elasticsearch hits into structured data
function parseElasticsearchHits(hits, offset, kibanaConfig) {
  let batchData;
  
  if (kibanaConfig.dataParser) {
    // Use custom data parser if provided (note: functions can't be passed to workers, so this would need serialization)
    batchData = hits.map(function(hit, index) {
      // Custom parsing would need to be serialized/deserialized
      return hit;
    });
  } else {
    // Default data parsing
    batchData = hits.map(function(hit, index) {
      // Support different data structures
      const dataPrefix = kibanaConfig.dataPrefix || 'Data';
      const source = hit._source && hit._source[dataPrefix] ? hit._source[dataPrefix] : hit._source || {};
      
      // Map fields based on configuration or use defaults
      if (kibanaConfig.fieldMappings) {
        const mapped = { id: hit._id || ('record-' + (offset + index)) };
        
        Object.keys(kibanaConfig.fieldMappings).forEach(function(targetField) {
          const sourceField = kibanaConfig.fieldMappings[targetField];
          const value = getNestedValue(source, sourceField);
          mapped[targetField] = value !== undefined ? value : "NA";
        });
        
        return mapped;
      } else {
        // Default mapping for backwards compatibility
        const geoPoint = source.geoPoint || {};
        
        return {
          id: hit._id || ('task-' + (offset + index)),
          plannedStartDate: source['@timestamp'] ? new Date(source['@timestamp']).toISOString() : "NA",
          resourcesQuantity: source.quantity || "NA",
          latitude: geoPoint[1] || geoPoint.lat || "NA",
          longitude: geoPoint[0] || geoPoint.lon || "NA",
          createdBy: source.userName || "NA",
          resourcesCount: 1,
          locationAccuracy: "NA",
          productName: source.productName || "NA",
          memberCount: source.memberCount || "NA",
          administrativeArea: source.additionalDetails && source.additionalDetails.administrativeArea || "NA",
          quantity: source.quantity || "NA",
          status: source.status || "NA",
          userId: source.userId || "NA",
          startDate: source.startDate || null,
          endDate: source.endDate || null,
          isDeleted: source.isDeleted || false,
          channel: source.channel || null,
          additionalDetails: source.additionalDetails || {}
        };
      }
    });
  }
  
  return batchData;
}

// Worker message handler
self.onmessage = async function(e) {
  const { type, payload } = e.data;

  try {
    switch (type) {
      case 'AUTHENTICATE_KIBANA':
        await authenticateKibana(payload);
        break;
      case 'FETCH_ELASTICSEARCH_DATA':
        await fetchElasticsearchData(payload);
        break;
      case 'CANCEL_REQUEST':
        if (payload.requestId) {
          // Cancel specific request
          if (activeRequests.has(payload.requestId)) {
            activeRequests.delete(payload.requestId);
            console.log(`🚫 Cancelled request: ${payload.requestId}`);
          }
          
          // Also handle legacy cancellation
          if (currentRequestId === payload.requestId) {
            isCancelled = true;
          }
          
          // Clear any in-flight batches for this request
          for (const [key, value] of inFlightBatches.entries()) {
            if (value.requestId === payload.requestId) {
              inFlightBatches.delete(key);
            }
          }
          
          postMessage({
            type: 'FETCH_CANCELLED',
            payload: { requestId: payload.requestId }
          });
        }
        break;
      case 'CLEAR_CACHE':
        batchCache.clear();
        inFlightBatches.clear();
        console.log('🗑️ All caches cleared');
        break;
      default:
        postMessage({
          type: 'ERROR',
          error: 'Unknown message type: ' + type
        });
    }
  } catch (error) {
    postMessage({
      type: 'ERROR',
      error: error.message,
      stack: error.stack
    });
  }
};

// Authenticate with Kibana
async function authenticateKibana({ origin, kibanaConfig, requestId }) {
  try {
    // Set current request ID if provided
    if (requestId) {
      currentRequestId = requestId;
      isCancelled = false;
    }
    
    postMessage({
      type: 'AUTHENTICATION_START'
    });

    const loginResponse = await fetch(origin + '/' + kibanaConfig.kibanaPath + '/internal/security/login', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'origin': origin,
        'pragma': 'no-cache',
        'priority': 'u=1, i',
        'referer': origin + '/digit-ui/employee/dss/dashboard/provincial-health-dashboard-llin?province=Cabo%20Delgado%20Bloco1&projectTypeId=dbd45c31-de9e-4e62-a9b6-abb818928fd1',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-elastic-internal-origin': 'Kibana',
        'kbn-xsrf': 'true',
        'x-kbn-context': '{"type":"application","name":"security_login","url":"/' + kibanaConfig.kibanaPath + '/login"}'
      },
      credentials: 'include',
      body: JSON.stringify({
        "providerType": kibanaConfig.username,
        "providerName": kibanaConfig.password,
        "currentURL": origin + "/" + kibanaConfig.kibanaPath + "/login"
      })
    });

    if (loginResponse.ok) {
      postMessage({
        type: 'AUTHENTICATION_SUCCESS'
      });
    } else {
      throw new Error('Kibana authentication failed: ' + loginResponse.statusText);
    }
  } catch (error) {
    postMessage({
      type: 'AUTHENTICATION_ERROR',
      error: error.message
    });
  }
}

// Fetch single batch with deduplication
async function fetchSingleBatchWithDedup(batchInfo, origin, kibanaConfig, authKey, requestId) {
  const { batchIndex, batchOffset, currentBatchSize, projectName, queryParams } = batchInfo;
  const batchKey = generateBatchKey(kibanaConfig.projectTaskIndex || 'default', batchOffset, currentBatchSize, queryParams);
  
  console.log(`[Batch ${batchIndex}] 🔍 Checking batch key: ${batchKey}`);
  
  // Check cache first
  if (batchCache.has(batchKey)) {
    const cached = batchCache.get(batchKey);
    console.log(`[Batch ${batchIndex}] ✅ Using cached data (${cached.data.length} records)`);
    return {
      batchIndex,
      data: cached.data,
      totalHits: cached.totalHits,
      fromCache: true
    };
  }
  
  // Check if batch is already being fetched
  if (inFlightBatches.has(batchKey)) {
    console.log(`[Batch ${batchIndex}] ⏳ Waiting for in-flight batch...`);
    const existingPromise = inFlightBatches.get(batchKey);
    
    // If it's from a different request, wait for it
    if (existingPromise.requestId !== requestId) {
      try {
        const result = await existingPromise.promise;
        console.log(`[Batch ${batchIndex}] ✅ Reusing in-flight result`);
        return result;
      } catch (err) {
        console.log(`[Batch ${batchIndex}] ⚠️ In-flight batch failed, retrying...`);
      }
    }
  }
  
  // Create new fetch promise
  console.log(`[Batch ${batchIndex}] 🚀 Fetching new batch: offset=${batchOffset}, size=${currentBatchSize}`);
  
  const fetchPromise = (async () => {
    try {
      const elasticsearchQuery = await buildElasticsearchQuery({
        projectName, 
        queryParams, 
        offset: batchOffset, 
        size: currentBatchSize, 
        kibanaConfig
      });

      // Construct authKey if not provided
      let finalAuthKey = authKey;
      if (!finalAuthKey && kibanaConfig.username && kibanaConfig.password) {
        const basicAuth = btoa(`${kibanaConfig.username}:${kibanaConfig.password}`);
        finalAuthKey = `Basic ${basicAuth}`;
      }
      
      const searchHeaders = {
        'Content-Type': 'application/json',
        'kbn-xsrf': 'true'
      };
      
      // Only add Authorization header if we have an auth key
      if (finalAuthKey) {
        searchHeaders.Authorization = finalAuthKey;
      }

      const response = await fetch(
        origin + '/' + kibanaConfig.kibanaPath + '/api/console/proxy?path=%2F' + 
        kibanaConfig.projectTaskIndex + '%2F_search&method=POST', 
        {
          method: 'POST',
          headers: searchHeaders,
          credentials: 'include',
          body: JSON.stringify(elasticsearchQuery)
        }
      );

      if (response.status === 401 || response.status === 403) {
        throw new Error('AUTHENTICATION_REQUIRED');
      }

      const data = await response.json();
      
      if (data && data.hits && data.hits.hits) {
        const batchData = parseElasticsearchHits(data.hits.hits, batchOffset, kibanaConfig);
        
        const result = {
          batchIndex,
          data: batchData,
          totalHits: data.hits.total?.value || data.hits.total || batchData.length,
          fromCache: false
        };
        
        // Cache the successful result
        batchCache.set(batchKey, {
          ...result,
          timestamp: Date.now()
        });
        
        console.log(`[Batch ${batchIndex}] ✅ Fetched and cached ${batchData.length} records`);
        return result;
      }
      
      return {
        batchIndex,
        data: [],
        totalHits: 0,
        fromCache: false
      };
    } finally {
      // Clean up in-flight tracking
      inFlightBatches.delete(batchKey);
    }
  })();
  
  // Track in-flight batch
  inFlightBatches.set(batchKey, {
    promise: fetchPromise,
    requestId: requestId
  });
  
  return fetchPromise;
}

// Fetch data from Elasticsearch with smart chunking strategy and deduplication
async function fetchElasticsearchData({ projectName, queryParams, page, pageSize, origin, batchSize, kibanaConfig, authKey, requestId }) {
  batchSize = batchSize || 1000;
  
  try {
    // Set current request ID and reset cancelled flag
    if (requestId) {
      currentRequestId = requestId;
      isCancelled = false;
      activeRequests.set(requestId, true);
    }
    
    // Clean old cache entries
    cleanCache();
    
    // Check if request was cancelled before starting
    if (isCancelled) {
      postMessage({
        type: 'FETCH_CANCELLED',
        payload: { requestId: requestId }
      });
      return;
    }
    
    postMessage({
      type: 'FETCH_START',
      payload: { projectName: projectName, page: page, pageSize: pageSize, requestId: requestId }
    });

    // SMART CHUNKING STRATEGY: Use _count API to get accurate total count
    let totalRecordsAvailable = 0;
    let optimalChunkSize = batchSize;
    
    // Build the count query for _count API (only needs query, no _source or pagination)
    const baseQuery = await buildElasticsearchQuery({
      projectName, 
      queryParams, 
      offset: 0, 
      size: 0, 
      kibanaConfig
    });
    
    // Create count-specific query (only query part needed for _count API)
    const countQuery = {
      query: baseQuery.query
    };

    // Check if cancelled before count query
    if (isCancelled) {
      postMessage({
        type: 'FETCH_CANCELLED',
        payload: { requestId: requestId }
      });
      return;
    }

    // Execute _count API query for accurate count
    console.log(`📊 Step 2: Getting total count for query...`);
    
    // Construct authKey if not provided
    let finalAuthKey = authKey;
    if (!finalAuthKey && kibanaConfig.username && kibanaConfig.password) {
      const basicAuth = btoa(`${kibanaConfig.username}:${kibanaConfig.password}`);
      finalAuthKey = `Basic ${basicAuth}`;
      console.log('🔑 Constructed Basic auth key from credentials');
    }
    
    const countHeaders = {
      'Content-Type': 'application/json',
      'kbn-xsrf': 'true'
    };
    
    // Only add Authorization header if we have an auth key
    if (finalAuthKey) {
      countHeaders.Authorization = finalAuthKey;
    }
    
    const countResponse = await fetch(
      origin + '/' + kibanaConfig.kibanaPath + '/api/console/proxy?path=%2F' + 
      kibanaConfig.projectTaskIndex + '%2F_count&method=POST', 
      {
        method: 'POST',
        headers: countHeaders,
        credentials: 'include',
        body: JSON.stringify(countQuery)
      }
    );

    if (countResponse.status === 401 || countResponse.status === 403) {
      postMessage({
        type: 'AUTHENTICATION_REQUIRED',
        payload: { requestId: requestId }
      });
      return;
    }

    const countData = await countResponse.json();
    if (countData && (countData.count !== undefined)) {
      totalRecordsAvailable = countData.count || 0;
      
      // Calculate optimal chunk size based on actual total count with maximum limit
      if (totalRecordsAvailable > 100) {
        const calculatedChunkSize = Math.ceil(totalRecordsAvailable / 10);
        // Use a reasonable batch size, but allow larger batches for big datasets
        // Cap individual batch size at 50,000 for better performance
        optimalChunkSize = Math.min(50000, Math.max(100, calculatedChunkSize));
      } else {
        // For small datasets, use smaller chunks
        optimalChunkSize = Math.max(50, totalRecordsAvailable);
      }
      
      console.log(`📊 _count API returned: ${totalRecordsAvailable} total records available`);
      console.log(`📦 Optimal chunk size: ${optimalChunkSize} (max 50,000 enforced)`);
      console.log(`🔢 calculatedChunkSize was: ${Math.ceil(totalRecordsAvailable / 10)} before max limit applied`);
    } else {
      console.warn('_count API failed, falling back to default chunk size');
      totalRecordsAvailable = pageSize; // Fallback estimate
    }

    // Calculate batches using the optimal chunk size
    // Use totalRecordsAvailable but respect reasonable pageSize limits
    // Only limit if pageSize is significantly smaller than available records (not just default limits)
    let effectivePageSize;
    if (pageSize < 50000 && pageSize < totalRecordsAvailable * 0.5) {
      // Respect intentional pageSize limits (when pageSize is < 50k and less than half of available data)
      effectivePageSize = pageSize;
      console.log(`📊 Respecting pageSize limit: ${pageSize} (total available: ${totalRecordsAvailable})`);
    } else {
      // Fetch all available records
      effectivePageSize = totalRecordsAvailable;
      console.log(`📊 Fetching all available records: ${totalRecordsAvailable}`);
    }
    
    const totalBatches = Math.ceil(effectivePageSize / optimalChunkSize);
    console.log(`📊 Will fetch ${effectivePageSize} records in ${totalBatches} batches of ${optimalChunkSize} each`);
    let allData = [];
    let processedBatches = 0;
    let cachedBatches = 0;

    // Check if cancelled before processing results
    if (isCancelled) {
      postMessage({
        type: 'FETCH_CANCELLED',
        payload: { requestId: requestId }
      });
      return;
    }

    // For small datasets, fetch data directly instead of using the count result
    if (totalRecordsAvailable <= 100) {
      console.log(`📦 Small dataset (${totalRecordsAvailable} records) - fetching directly`);
      
      // Build a simple query to fetch all records directly
      const smallDataQuery = await buildElasticsearchQuery({
        projectName, 
        queryParams, 
        offset: 0, 
        size: totalRecordsAvailable, 
        kibanaConfig
      });
      
      // Construct authKey if not provided for small data query
      let finalAuthKey = authKey;
      if (!finalAuthKey && kibanaConfig.username && kibanaConfig.password) {
        const basicAuth = btoa(`${kibanaConfig.username}:${kibanaConfig.password}`);
        finalAuthKey = `Basic ${basicAuth}`;
      }
      
      const smallDataHeaders = {
        'Content-Type': 'application/json',
        'kbn-xsrf': 'true'
      };
      
      // Only add Authorization header if we have an auth key
      if (finalAuthKey) {
        smallDataHeaders.Authorization = finalAuthKey;
      }

      const smallDataResponse = await fetch(
        origin + '/' + kibanaConfig.kibanaPath + '/api/console/proxy?path=%2F' + 
        kibanaConfig.projectTaskIndex + '%2F_search&method=POST', 
        {
          method: 'POST',
          headers: smallDataHeaders,
          credentials: 'include',
          body: JSON.stringify(smallDataQuery)
        }
      );
      
      if (smallDataResponse.ok) {
        const smallData = await smallDataResponse.json();
        if (smallData && smallData.hits && smallData.hits.hits) {
          allData = parseElasticsearchHits(smallData.hits.hits, 0, kibanaConfig);
          processedBatches = 1;
          
          postMessage({
            type: 'FETCH_PROGRESS',
            payload: {
              batchesCompleted: 1,
              totalBatches: 1,
              dataReceived: allData.length,
              progress: 100,
              requestId: requestId
            }
          });
        }
      }
    } else {
      // Process in optimal chunks with parallel batch fetching (4 at a time)
      console.log(`📦 Processing ${totalBatches} batches in parallel chunks of ${MAX_PARALLEL_BATCHES}`);
      
      // Process batches in parallel chunks
      console.log(`🚀 Starting to process ${totalBatches} total batches with MAX_PARALLEL_BATCHES=${MAX_PARALLEL_BATCHES}`);
      for (let chunkStart = 0; chunkStart < totalBatches; chunkStart += MAX_PARALLEL_BATCHES) {
        // Check if cancelled before each chunk
        if (isCancelled || !activeRequests.has(requestId)) {
          postMessage({
            type: 'FETCH_CANCELLED',
            payload: { requestId: requestId }
          });
          return;
        }
        
        const chunkEnd = Math.min(chunkStart + MAX_PARALLEL_BATCHES, totalBatches);
        console.log(`📦 Processing chunk ${chunkStart + 1} to ${chunkEnd} (out of ${totalBatches} total batches)`);
        const batchPromises = [];
        
        // Create parallel batch requests for this chunk
        for (let batch = chunkStart; batch < chunkEnd; batch++) {
          const batchOffset = page * effectivePageSize + (batch * optimalChunkSize);
          const currentBatchSize = Math.min(optimalChunkSize, effectivePageSize - (batch * optimalChunkSize));
          console.log(`🔢 Batch ${batch}: offset=${batchOffset}, size=${currentBatchSize}, page=${page}, effectivePageSize=${effectivePageSize}`);

          if (currentBatchSize <= 0) break;

          // Create batch info
          const batchInfo = {
            batchIndex: batch,
            batchOffset,
            currentBatchSize,
            projectName,
            queryParams
          };

          // Add batch promise to parallel execution
          batchPromises.push(
            fetchSingleBatchWithDedup(batchInfo, origin, kibanaConfig, authKey, requestId)
              .catch(error => {
                console.error(`[Batch ${batch}] ❌ Failed:`, error.message);
                return { batchIndex: batch, data: [], totalHits: 0, error: error.message };
              })
          );
        }
        
        // Execute batch chunk in parallel with Promise.all
        console.log(`⏳ Processing batches ${chunkStart + 1} to ${chunkEnd} in parallel...`);
        const batchResults = await Promise.all(batchPromises);
        
        // Process results from parallel batch execution
        console.log(`📊 Processing ${batchResults.length} batch results from Promise.all`);
        for (const result of batchResults) {
          if (result.error) {
            console.log(`❌ Batch ${result.batchIndex} failed with error: ${result.error}`);
            if (result.error === 'AUTHENTICATION_REQUIRED') {
              postMessage({ 
                type: 'AUTHENTICATION_REQUIRED',
                payload: { requestId: requestId }
              });
              return;
            }
            // Continue with other batches even if one fails
          } else {
            console.log(`✅ Batch ${result.batchIndex} succeeded with ${result.data.length} records`);
            allData = allData.concat(result.data);
            if (result.fromCache) cachedBatches++;
            processedBatches++;
          }
        }
        console.log(`📈 After processing chunk: allData.length=${allData.length}, processedBatches=${processedBatches}`);

        // Send progress update after each parallel chunk
        postMessage({
          type: 'FETCH_PROGRESS',
          payload: {
            batchesCompleted: processedBatches,
            totalBatches: totalBatches,
            dataReceived: allData.length,
            progress: (processedBatches / totalBatches) * 100,
            cachedBatches: cachedBatches,
            requestId: requestId
          }
        });

        // Small delay between chunks to prevent overwhelming the server
        if (chunkEnd < totalBatches) {
          await new Promise(function(resolve) { setTimeout(resolve, 100); });
        }
      }
      
      console.log(`📊 Parallel batch processing complete: ${cachedBatches}/${processedBatches} batches from cache`);
    }

    // Final check before sending success
    if (isCancelled) {
      postMessage({
        type: 'FETCH_CANCELLED',
        payload: { requestId: requestId }
      });
      return;
    }

    postMessage({
      type: 'FETCH_SUCCESS',
      payload: {
        data: allData,
        totalRecords: allData.length,
        totalRecordsAvailable: totalRecordsAvailable,
        batchesProcessed: processedBatches,
        cachedBatches: cachedBatches || 0,
        chunkSize: optimalChunkSize,
        smartChunking: totalRecordsAvailable > 100,
        requestId: requestId
      }
    });
    
    console.log(`✅ Fetch completed: ${allData.length} records (${cachedBatches || 0}/${processedBatches} from cache)`);

  } catch (error) {
    // Don't send error if request was cancelled
    if (!isCancelled) {
      postMessage({
        type: 'FETCH_ERROR',
        error: error.message,
        stack: error.stack,
        payload: { requestId: requestId }
      });
    }
  } finally {
    // Clean up request tracking
    if (requestId) {
      activeRequests.delete(requestId);
    }
  }
}

// Handle worker errors
self.onerror = function(error) {
  postMessage({
    type: 'WORKER_ERROR',
    error: error.message,
    filename: error.filename,
    lineno: error.lineno
  });
};