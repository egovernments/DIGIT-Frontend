// Web Worker for Elasticsearch data fetching - as a string export for build compatibility
export const elasticsearchWorkerString = `
// Web Worker for Elasticsearch data fetching

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
async function authenticateKibana({ origin, kibanaConfig }) {
  try {
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

// Fetch data from Elasticsearch with smart chunking strategy
async function fetchElasticsearchData({ projectName, queryParams, page, pageSize, origin, batchSize, kibanaConfig, authKey }) {
  batchSize = batchSize || 1000;
  
  try {
    postMessage({
      type: 'FETCH_START',
      payload: { projectName: projectName, page: page, pageSize: pageSize }
    });

    // SMART CHUNKING STRATEGY: First query with 100 records to get total count
    let totalRecordsAvailable = 0;
    let optimalChunkSize = batchSize;
    
    // Build the initial count query (same structure but with size: 100)
    const countQuery = await buildElasticsearchQuery({
      projectName, 
      queryParams, 
      offset: 0, 
      size: 100, 
      kibanaConfig
    });

    // Execute initial count query
    const countResponse = await fetch(
      origin + '/' + kibanaConfig.kibanaPath + '/api/console/proxy?path=%2F' + 
      kibanaConfig.projectTaskIndex + '%2F_search&method=POST', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authKey,
          'kbn-xsrf': 'true'
        },
        credentials: 'include',
        body: JSON.stringify(countQuery)
      }
    );

    if (countResponse.status === 401 || countResponse.status === 403) {
      postMessage({
        type: 'AUTHENTICATION_REQUIRED'
      });
      return;
    }

    const countData = await countResponse.json();
    if (countData && countData.hits) {
      totalRecordsAvailable = countData.hits.total.value || countData.hits.total || 0;
      
      // If more than 100 records, calculate optimal chunk size (total/10)
      if (totalRecordsAvailable > 100) {
        optimalChunkSize = Math.max(100, Math.ceil(totalRecordsAvailable / 10));
      } else {
        // Use the initial 100 records as the final result
      }
    }

    // Calculate batches using the optimal chunk size
    const effectivePageSize = Math.min(pageSize, totalRecordsAvailable);
    const totalBatches = Math.ceil(effectivePageSize / optimalChunkSize);
    let allData = [];
    let processedBatches = 0;

    // If we have <= 100 records, use the count query result
    if (totalRecordsAvailable <= 100 && countData.hits.hits) {
      allData = parseElasticsearchHits(countData.hits.hits, 0, kibanaConfig);
      processedBatches = 1;
      
      postMessage({
        type: 'FETCH_PROGRESS',
        payload: {
          batchesCompleted: 1,
          totalBatches: 1,
          dataReceived: allData.length,
          progress: 100
        }
      });
    } else {
      // Process in optimal chunks
      for (let batch = 0; batch < totalBatches; batch++) {
        const batchOffset = page * effectivePageSize + (batch * optimalChunkSize);
        const currentBatchSize = Math.min(optimalChunkSize, effectivePageSize - (batch * optimalChunkSize));

        if (currentBatchSize <= 0) break;

        // Build dynamic Elasticsearch query for this batch
        const elasticsearchQuery = await buildElasticsearchQuery({
          projectName, 
          queryParams, 
          offset: batchOffset, 
          size: currentBatchSize, 
          kibanaConfig
        });

      const response = await fetch(
        origin + '/' + kibanaConfig.kibanaPath + '/api/console/proxy?path=%2F' + 
        kibanaConfig.projectTaskIndex + '%2F_search&method=POST', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authKey,
            'kbn-xsrf': 'true'
          },
          credentials: 'include',
          body: JSON.stringify(elasticsearchQuery)
        }
      );

      if (response.status === 401 || response.status === 403) {
        postMessage({
          type: 'AUTHENTICATION_REQUIRED'
        });
        return;
      }

        const data = await response.json();
        
        if (data && data.hits && data.hits.hits) {
          const batchData = parseElasticsearchHits(data.hits.hits, batchOffset, kibanaConfig);
          allData = allData.concat(batchData);
          processedBatches++;

          // Send progress update
          postMessage({
            type: 'FETCH_PROGRESS',
            payload: {
              batchesCompleted: processedBatches,
              totalBatches: totalBatches,
              dataReceived: allData.length,
              progress: (processedBatches / totalBatches) * 100
            }
          });

          // Small delay to prevent overwhelming the main thread
          if (batch < totalBatches - 1) {
            await new Promise(function(resolve) { setTimeout(resolve, 50); });
          }
        }
      }
    }

    postMessage({
      type: 'FETCH_SUCCESS',
      payload: {
        data: allData,
        totalRecords: allData.length,
        totalRecordsAvailable: totalRecordsAvailable,
        batchesProcessed: processedBatches,
        chunkSize: optimalChunkSize,
        smartChunking: totalRecordsAvailable > 100
      }
    });

  } catch (error) {
    postMessage({
      type: 'FETCH_ERROR',
      error: error.message,
      stack: error.stack
    });
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
`;