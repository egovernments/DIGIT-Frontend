// Simple Elasticsearch Worker - User Configurable
// Handles count query, batching, and parallel fetching automatically
// Now includes Scroll API support for large datasets (>10k records)

// Global state for request management
const activeRequests = new Map();
let currentRequestId = null;
let isCancelled = false;

// Global authentication state
let isAuthenticated = false;
let authenticationInProgress = false;
let authenticationPromise = null;
let lastAuthConfig = null;
const AUTH_SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
let authSessionExpiry = null;
let authRetryCount = 0;
const MAX_AUTH_RETRIES = 3;

// Worker message handler
self.onmessage = async function(e) {
  const { type, payload } = e.data;

  try {
    switch (type) {
      case 'AUTHENTICATE_KIBANA':
        await authenticateKibana(payload);
        break;
      case 'FETCH_DATA':
        await fetchElasticsearchData(payload);
        break;
      case 'CANCEL_REQUEST':
        if (payload.requestId) {
          if (activeRequests.has(payload.requestId)) {
            activeRequests.delete(payload.requestId);
            console.log(`🚫 Cancelled request: ${payload.requestId}`);
          }
          
          if (currentRequestId === payload.requestId) {
            isCancelled = true;
          }
          
          postMessage({
            type: 'FETCH_CANCELLED',
            payload: { requestId: payload.requestId }
          });
        }
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

// Check if authentication is still valid
function isAuthenticationValid(authConfig) {
  if (!isAuthenticated || !authSessionExpiry || !lastAuthConfig) {
    return false;
  }
  
  // Check if session expired
  if (Date.now() > authSessionExpiry) {
    console.log('🔐 Authentication session expired');
    isAuthenticated = false;
    authSessionExpiry = null;
    lastAuthConfig = null;
    return false;
  }
  
  // Check if auth config changed
  const currentConfig = `${authConfig.origin}|${authConfig.kibanaPath}|${authConfig.username}|${authConfig.password}`;
  if (lastAuthConfig !== currentConfig) {
    console.log('🔐 Authentication config changed, re-authentication required');
    isAuthenticated = false;
    authSessionExpiry = null;
    lastAuthConfig = null;
    return false;
  }
  
  return true;
}

// Authenticate with Kibana (with concurrent request handling)
async function authenticateKibana(authConfig) {
  const { origin, kibanaPath, username, password, requestId } = authConfig;
  
  try {
    // Check if already authenticated and session is valid
    if (isAuthenticationValid(authConfig)) {
      console.log('✅ Using existing authentication session');
      authRetryCount = 0; // Reset retry count on successful validation
      return;
    }
    
    // Check if we've exceeded max retries
    if (authRetryCount >= MAX_AUTH_RETRIES) {
      console.error(`❌ Authentication failed after ${MAX_AUTH_RETRIES} attempts`);
      authRetryCount = 0; // Reset for future attempts
      throw new Error(`Authentication failed after ${MAX_AUTH_RETRIES} attempts. Please check credentials.`);
    }
    
    // If authentication is already in progress, wait for it
    if (authenticationInProgress && authenticationPromise) {
      console.log('⏳ Authentication already in progress, waiting...');
      try {
        await authenticationPromise;
        return;
      } catch (error) {
        console.log('⚠️ Previous authentication failed, retrying...');
        // Continue with new authentication attempt
      }
    }
    
    // Start new authentication
    authenticationInProgress = true;
    authRetryCount++; // Increment retry count
    console.log(`🔐 Starting Kibana authentication... (attempt ${authRetryCount}/${MAX_AUTH_RETRIES})`);
    
    postMessage({
      type: 'AUTHENTICATION_START'
    });

    // Create authentication promise
    authenticationPromise = (async () => {
      const loginResponse = await fetch(origin + '/' + kibanaPath + '/internal/security/login', {
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
          'x-kbn-context': '{"type":"application","name":"security_login","url":"/' + kibanaPath + '/login"}'
        },
        credentials: 'include',
        body: JSON.stringify({
          "providerType": username,
          "providerName": password,
          "currentURL": origin + "/" + kibanaPath + "/login"
        })
      });

      if (!loginResponse.ok) {
        throw new Error('Kibana authentication failed: ' + loginResponse.statusText);
      }
      
      return loginResponse;
    })();

    // Wait for authentication to complete
    await authenticationPromise;
    
    // Mark as authenticated and set session expiry
    isAuthenticated = true;
    authSessionExpiry = Date.now() + AUTH_SESSION_TIMEOUT;
    lastAuthConfig = `${origin}|${kibanaPath}|${username}|${password}`;
    authRetryCount = 0; // Reset retry count on successful authentication
    
    console.log('✅ Kibana authentication successful');
    postMessage({
      type: 'AUTHENTICATION_SUCCESS'
    });
    
  } catch (error) {
    // Reset authentication state on failure
    isAuthenticated = false;
    authSessionExpiry = null;
    lastAuthConfig = null;
    
    console.error('❌ Kibana authentication failed:', error);
    postMessage({
      type: 'AUTHENTICATION_ERROR',
      error: error.message
    });
    throw error;
  } finally {
    // Reset authentication progress state
    authenticationInProgress = false;
    authenticationPromise = null;
  }
}

// Main fetch function
async function fetchElasticsearchData(config) {
  const {
    // Required parameters
    indexName,
    query,
    sourceFields,
    
    // Optional parameters with defaults
    maxRecordLimit = 100000,
    maxBatchSize = 10000,
    parallelBatches = 4,
    
    // Connection parameters
    kibanaPath = 'kibana',
    origin = self.location.origin,
    authKey,
    
    // Authentication parameters
    username,
    password,
    requiresAuth = true,
    
    // Request tracking
    requestId = Date.now().toString()
  } = config;

  try {
    // Set current request ID and reset cancelled flag
    currentRequestId = requestId;
    isCancelled = false;
    activeRequests.set(requestId, true);
    
    console.log(`🚀 Starting Elasticsearch fetch with config:`, {
      indexName,
      maxRecordLimit,
      maxBatchSize,
      parallelBatches,
      requestId
    });

    // Check if request was cancelled before starting
    if (isCancelled) {
      postMessage({
        type: 'FETCH_CANCELLED',
        payload: { requestId }
      });
      return;
    }

    postMessage({
      type: 'FETCH_START',
      payload: { requestId }
    });

    // Step 1: Authenticate with Kibana if required
    if (requiresAuth && username && password) {
      console.log('🔐 Step 1: Authenticating with Kibana...');
      
      try {
        await authenticateKibana({
          origin,
          kibanaPath,
          username,
          password,
          requestId
        });
        
        // Wait a moment after authentication
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if cancelled after authentication
        if (isCancelled) {
          postMessage({
            type: 'FETCH_CANCELLED',
            payload: { requestId }
          });
          return;
        }
        
      } catch (error) {
        postMessage({
          type: 'AUTHENTICATION_REQUIRED',
          payload: { requestId, error: error.message }
        });
        return;
      }
    }

    // Step 2: Get total count using _count API
    console.log(`📊 Step 2: Getting total count for query...`);
    
    const countQuery = { query };
    
    // Construct authKey if not provided
    let finalAuthKey = authKey;
    if (!finalAuthKey && username && password) {
      const basicAuth = btoa(`${username}:${password}`);
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
      `${origin}/${kibanaPath}/api/console/proxy?path=%2F${indexName}%2F_count&method=POST`,
      {
        method: 'POST',
        headers: countHeaders,
        credentials: 'include',
        body: JSON.stringify(countQuery)
      }
    );

    if (countResponse.status === 401 || countResponse.status === 403) {
      // Reset authentication state
      isAuthenticated = false;
      authSessionExpiry = null;
      lastAuthConfig = null;
      
      console.error('❌ Authentication failed for count API');
      postMessage({
        type: 'AUTHENTICATION_REQUIRED',
        payload: { 
          requestId, 
          error: 'Authentication failed. Please check your credentials and try again.' 
        }
      });
      return;
    }
    
    const countData = await countResponse.json();
    const totalAvailable = countData?.count || 0;
    
    console.log(`📊 Total records available: ${totalAvailable.toLocaleString()}`);

    // Step 3: Determine effective fetch limit
    const effectiveLimit = Math.min(maxRecordLimit, totalAvailable);
    console.log(`📊 Will fetch: ${effectiveLimit.toLocaleString()} records (limit: ${maxRecordLimit.toLocaleString()})`);

    // Step 4: Check if we need to use Scroll API for large datasets
    const MAX_WINDOW_SIZE = 10000; // Elasticsearch's default max_result_window
    // Use Scroll API only if:
    // 1. We want to fetch more than 10k records AND
    // 2. The total available data is more than 10k (otherwise regular search will work)
    const needsScrollAPI = effectiveLimit > MAX_WINDOW_SIZE && totalAvailable > MAX_WINDOW_SIZE;
    
    console.log(`🔍 Scroll API Decision: effectiveLimit=${effectiveLimit}, totalAvailable=${totalAvailable}, needsScrollAPI=${needsScrollAPI}`);
    
    if (needsScrollAPI) {
      console.log(`🔄 Using Scroll API for large dataset (${effectiveLimit} > ${MAX_WINDOW_SIZE})`);
      return await fetchDataUsingScrollAPI({
        indexName,
        query,
        sourceFields,
        effectiveLimit,
        maxBatchSize,
        requestId,
        kibanaPath,
        origin,
        finalAuthKey: finalAuthKey || authKey,
        username,
        password
      });
    }

    // Step 5: Calculate batching strategy for regular API
    const optimalBatchSize = Math.min(maxBatchSize, Math.max(1000, Math.ceil(effectiveLimit / 10)));
    const totalBatches = Math.ceil(effectiveLimit / optimalBatchSize);
    
    console.log(`📦 Batching strategy: ${totalBatches} batches of ${optimalBatchSize} records each`);
    console.log(`🔄 Will process ${parallelBatches} batches in parallel`);

    // Check if cancelled before processing
    if (isCancelled) {
      postMessage({
        type: 'FETCH_CANCELLED',
        payload: { requestId }
      });
      return;
    }

    // Step 5: Process batches in parallel chunks
    const allHits = [];
    let processedBatches = 0;

    for (let chunkStart = 0; chunkStart < totalBatches; chunkStart += parallelBatches) {
      // Check if cancelled before each chunk
      if (isCancelled || !activeRequests.has(requestId)) {
        postMessage({
          type: 'FETCH_CANCELLED',
          payload: { requestId }
        });
        return;
      }

      const chunkEnd = Math.min(chunkStart + parallelBatches, totalBatches);
      console.log(`📦 Processing batches ${chunkStart + 1} to ${chunkEnd} (of ${totalBatches} total)`);

      // Create batch promises for this chunk
      const batchPromises = [];
      
      for (let batchIndex = chunkStart; batchIndex < chunkEnd; batchIndex++) {
        const offset = batchIndex * optimalBatchSize;
        const size = Math.min(optimalBatchSize, effectiveLimit - offset);
        
        if (size <= 0) break;
        
        console.log(`🔢 Batch ${batchIndex + 1}: offset=${offset}, size=${size}`);
        
        const searchQuery = {
          _source: sourceFields,
          query: query,
          from: offset,
          size: size
        };
        
        const batchPromise = fetchSingleBatch(
          indexName,
          searchQuery,
          batchIndex,
          kibanaPath,
          origin,
          finalAuthKey || authKey,
          username,
          password
        );
        
        batchPromises.push(batchPromise);
      }

      // Execute this chunk of batches in parallel with retry logic
      console.log(`⏳ Executing ${batchPromises.length} batches in parallel...`);
      const batchResults = await Promise.all(batchPromises);

      // Process results and identify failed batches for retry
      let hasAuthError = false;
      const failedBatches = [];
      
      for (const result of batchResults) {
        if (result.error) {
          console.log(`❌ Batch ${result.batchIndex + 1} failed: ${result.error}`);
          if (result.error === 'AUTHENTICATION_REQUIRED') {
            hasAuthError = true;
            break; // Stop processing if authentication is required
          }
          // Mark batch for retry if it's not an auth error
          failedBatches.push(result.batchIndex);
        } else {
          console.log(`✅ Batch ${result.batchIndex + 1} succeeded: ${result.hits.length} records`);
          allHits.push(...result.hits);
          processedBatches++;
        }
      }

      // Retry failed batches (up to 2 retries per batch)
      if (!hasAuthError && failedBatches.length > 0) {
        console.log(`🔄 Retrying ${failedBatches.length} failed batches...`);
        
        for (const failedBatchIndex of failedBatches) {
          let retryCount = 0;
          const maxRetries = 2;
          let retrySuccess = false;
          
          while (retryCount < maxRetries && !retrySuccess && !isCancelled) {
            retryCount++;
            console.log(`🔄 Retry ${retryCount}/${maxRetries} for batch ${failedBatchIndex + 1}`);
            
            // Wait a bit before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            
            const offset = failedBatchIndex * optimalBatchSize;
            const size = Math.min(optimalBatchSize, effectiveLimit - offset);
            
            const retrySearchQuery = {
              _source: sourceFields,
              query: query,
              from: offset,
              size: size
            };
            
            try {
              const retryResult = await fetchSingleBatch(
                indexName,
                retrySearchQuery,
                failedBatchIndex,
                kibanaPath,
                origin,
                finalAuthKey || authKey,
                username,
                password
              );
              
              if (retryResult.error) {
                console.log(`❌ Retry ${retryCount} failed for batch ${failedBatchIndex + 1}: ${retryResult.error}`);
              } else {
                console.log(`✅ Retry ${retryCount} succeeded for batch ${failedBatchIndex + 1}: ${retryResult.hits.length} records`);
                allHits.push(...retryResult.hits);
                processedBatches++;
                retrySuccess = true;
              }
            } catch (error) {
              console.log(`❌ Retry ${retryCount} failed for batch ${failedBatchIndex + 1}: ${error.message}`);
            }
          }
          
          if (!retrySuccess) {
            console.error(`💀 Batch ${failedBatchIndex + 1} failed permanently after ${maxRetries} retries`);
          }
        }
      }
      
      // If authentication error occurred, stop and report the error
      if (hasAuthError) {
        console.error('❌ Authentication failed during batch processing');
        
        // Reset authentication state
        isAuthenticated = false;
        authSessionExpiry = null;
        lastAuthConfig = null;
        
        postMessage({
          type: 'AUTHENTICATION_REQUIRED',
          payload: { 
            requestId, 
            error: 'Authentication expired during batch processing. Please retry the operation.',
            partialResults: allHits.length > 0 ? allHits : null,
            recordsReceived: allHits.length
          }
        });
        return;
      }

      // Send progress update
      const progress = (processedBatches / totalBatches) * 100;
      postMessage({
        type: 'FETCH_PROGRESS',
        payload: {
          batchesCompleted: processedBatches,
          totalBatches: totalBatches,
          recordsReceived: allHits.length,
          progress: progress,
          requestId: requestId
        }
      });

      console.log(`📈 Progress: ${processedBatches}/${totalBatches} batches completed, ${allHits.length} total records`);

      // Small delay between chunks to prevent overwhelming the server
      if (chunkEnd < totalBatches) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Final check before sending success
    if (isCancelled) {
      postMessage({
        type: 'FETCH_CANCELLED',
        payload: { requestId }
      });
      return;
    }

    // Step 6: Send final results with detailed summary
    const fetchSummary = {
      recordsFetched: allHits.length,
      totalAvailable: totalAvailable,
      expectedBatches: totalBatches,
      processedBatches: processedBatches,
      completionRate: ((allHits.length / totalAvailable) * 100).toFixed(1) + '%',
      avgRecordsPerBatch: processedBatches > 0 ? Math.round(allHits.length / processedBatches) : 0
    };
    
    console.log(`✅ Fetch completed:`, fetchSummary);
    
    if (allHits.length < totalAvailable) {
      console.warn(`⚠️ Incomplete fetch: Expected ${totalAvailable}, got ${allHits.length} (${fetchSummary.completionRate})`);
    }
    
    postMessage({
      type: 'FETCH_SUCCESS',
      payload: {
        hits: allHits,
        totalRecords: allHits.length,
        totalAvailable: totalAvailable,
        batchesProcessed: processedBatches,
        fetchSummary: fetchSummary,
        config: {
          indexName,
          maxRecordLimit,
          maxBatchSize,
          parallelBatches,
          effectiveLimit,
          optimalBatchSize,
          totalBatches
        },
        requestId: requestId
      }
    });

  } catch (error) {
    // Don't send error if request was cancelled
    if (!isCancelled) {
      console.error(`❌ Fetch failed:`, error);
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

// Fetch a single batch
async function fetchSingleBatch(indexName, searchQuery, batchIndex, kibanaPath, origin, authKey, username, password) {
  try {
    // Construct authKey if not provided
    let finalAuthKey = authKey;
    if (!finalAuthKey && username && password) {
      const basicAuth = btoa(`${username}:${password}`);
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
      `${origin}/${kibanaPath}/api/console/proxy?path=%2F${indexName}%2F_search&method=POST`,
      {
        method: 'POST',
        headers: searchHeaders,
        credentials: 'include',
        body: JSON.stringify(searchQuery)
      }
    );

    if (response.status === 401 || response.status === 403) {
      // Reset authentication state to force re-authentication on next attempt
      isAuthenticated = false;
      authSessionExpiry = null;
      lastAuthConfig = null;
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    const data = await response.json();
    
    console.log(`🔍 Batch ${batchIndex + 1} response:`, {
      status: response.status,
      hasData: !!data,
      hasHits: !!(data && data.hits),
      hasHitsArray: !!(data && data.hits && data.hits.hits),
      hitsLength: data?.hits?.hits?.length || 0,
      totalValue: data?.hits?.total?.value || data?.hits?.total || 0,
      searchQuery: searchQuery
    });
    
    if (data && data.hits && data.hits.hits) {
      const result = {
        batchIndex,
        hits: data.hits.hits,
        total: data.hits.total?.value || data.hits.total || data.hits.hits.length
      };
      console.log(`✅ Batch ${batchIndex + 1} parsed successfully: ${result.hits.length} records`);
      return result;
    }
    
    console.warn(`⚠️ Batch ${batchIndex + 1} returned no valid data:`, data);
    return {
      batchIndex,
      hits: [],
      total: 0
    };
    
  } catch (error) {
    console.error(`❌ Batch ${batchIndex + 1} failed with error:`, {
      message: error.message,
      status: error.status,
      stack: error.stack,
      searchQuery: searchQuery
    });
    
    return {
      batchIndex,
      hits: [],
      total: 0,
      error: error.message
    };
  }
}

// Scroll API implementation for large datasets
async function fetchDataUsingScrollAPI({
  indexName,
  query,
  sourceFields,
  effectiveLimit,
  maxBatchSize,
  requestId,
  kibanaPath,
  origin,
  finalAuthKey,
  username,
  password
}) {
  console.log(`🔄 Starting Scroll API fetch for ${effectiveLimit} records`);
  
  const allHits = [];
  let scrollId = null;
  let fetchedCount = 0;
  let scrollBatch = 0;
  const scrollSize = Math.min(maxBatchSize, 5000); // Scroll batch size
  const scrollTimeout = '5m'; // Keep scroll context alive for 5 minutes
  
  try {
    // Step 1: Initial scroll search
    const initialQuery = {
      _source: sourceFields,
      query: query,
      size: scrollSize
    };
    
    console.log(`📜 Initiating scroll search with batch size: ${scrollSize}`);
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add authentication headers
    if (finalAuthKey) {
      headers['Authorization'] = `ApiKey ${finalAuthKey}`;
    } else if (username && password) {
      headers['Authorization'] = `Basic ${btoa(`${username}:${password}`)}`;
    }
    
    const initialResponse = await fetch(
      `${origin}/${kibanaPath}/api/console/proxy?path=${encodeURIComponent(`/${indexName}/_search?scroll=${scrollTimeout}`)}&method=POST`,
      {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify(initialQuery)
      }
    );
    
    if (initialResponse.status === 401 || initialResponse.status === 403) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }
    
    const initialData = await initialResponse.json();
    
    if (!initialData || !initialData.hits || !initialData.hits.hits) {
      throw new Error('Invalid initial scroll response');
    }
    
    scrollId = initialData._scroll_id;
    const firstBatch = initialData.hits.hits;
    allHits.push(...firstBatch);
    fetchedCount += firstBatch.length;
    scrollBatch++;
    
    console.log(`📜 Initial scroll batch ${scrollBatch}: ${firstBatch.length} records (total: ${fetchedCount})`);
    
    // Send progress update
    postMessage({
      type: 'FETCH_PROGRESS',
      payload: {
        batchesCompleted: scrollBatch,
        totalBatches: Math.ceil(effectiveLimit / scrollSize),
        recordsProcessed: fetchedCount,
        totalRecords: effectiveLimit,
        progress: (fetchedCount / effectiveLimit) * 100,
        requestId: requestId
      }
    });
    
    // Step 2: Continue scrolling until we have all data or reach limit
    while (scrollId && fetchedCount < effectiveLimit && !isCancelled) {
      const scrollQuery = {
        scroll: scrollTimeout,
        scroll_id: scrollId
      };
      
      console.log(`📜 Fetching scroll batch ${scrollBatch + 1}...`);
      
      const scrollResponse = await fetch(
        `${origin}/${kibanaPath}/api/console/proxy?path=${encodeURIComponent('/_search/scroll')}&method=POST`,
        {
          method: 'POST',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify(scrollQuery)
        }
      );
      
      if (scrollResponse.status === 401 || scrollResponse.status === 403) {
        throw new Error('AUTHENTICATION_REQUIRED');
      }
      
      const scrollData = await scrollResponse.json();
      
      if (!scrollData || !scrollData.hits || !scrollData.hits.hits) {
        console.log(`📜 No more data in scroll batch ${scrollBatch + 1}`);
        break;
      }
      
      const batchHits = scrollData.hits.hits;
      
      if (batchHits.length === 0) {
        console.log(`📜 Empty scroll batch ${scrollBatch + 1}, ending scroll`);
        break;
      }
      
      // Limit the number of records we add to not exceed effectiveLimit
      const remainingLimit = effectiveLimit - fetchedCount;
      const hitsToAdd = batchHits.slice(0, remainingLimit);
      
      allHits.push(...hitsToAdd);
      fetchedCount += hitsToAdd.length;
      scrollBatch++;
      scrollId = scrollData._scroll_id;
      
      console.log(`📜 Scroll batch ${scrollBatch}: ${hitsToAdd.length} records (total: ${fetchedCount})`);
      
      // Send progress update
      postMessage({
        type: 'FETCH_PROGRESS',
        payload: {
          batchesCompleted: scrollBatch,
          totalBatches: Math.ceil(effectiveLimit / scrollSize),
          recordsProcessed: fetchedCount,
          totalRecords: effectiveLimit,
          progress: (fetchedCount / effectiveLimit) * 100,
          requestId: requestId
        }
      });
      
      // Small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Step 3: Clear scroll context
    if (scrollId) {
      try {
        console.log(`📜 Clearing scroll context: ${scrollId}`);
        await fetch(
          `${origin}/${kibanaPath}/api/console/proxy?path=%2F_search%2Fscroll&method=DELETE`,
          {
            method: 'DELETE',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify({ scroll_id: scrollId })
          }
        );
      } catch (clearError) {
        console.warn(`⚠️ Failed to clear scroll context: ${clearError.message}`);
      }
    }
    
    // Step 4: Send final results
    const fetchSummary = {
      recordsFetched: allHits.length,
      totalAvailable: effectiveLimit,
      expectedBatches: Math.ceil(effectiveLimit / scrollSize),
      processedBatches: scrollBatch,
      completionRate: ((allHits.length / effectiveLimit) * 100).toFixed(1) + '%',
      avgRecordsPerBatch: scrollBatch > 0 ? Math.round(allHits.length / scrollBatch) : 0,
      method: 'Scroll API'
    };
    
    console.log(`✅ Scroll API fetch completed:`, fetchSummary);
    
    if (allHits.length < effectiveLimit) {
      console.warn(`⚠️ Incomplete scroll fetch: Expected ${effectiveLimit}, got ${allHits.length} (${fetchSummary.completionRate})`);
    }
    
    postMessage({
      type: 'FETCH_SUCCESS',
      payload: {
        hits: allHits,
        totalRecords: allHits.length,
        totalAvailable: effectiveLimit,
        batchesProcessed: scrollBatch,
        fetchSummary: fetchSummary,
        config: {
          indexName,
          method: 'Scroll API',
          scrollSize,
          effectiveLimit
        },
        requestId: requestId
      }
    });
    
  } catch (error) {
    console.error(`❌ Scroll API fetch failed:`, error);
    
    // Clear scroll context on error
    if (scrollId) {
      try {
        await fetch(
          `${origin}/${kibanaPath}/api/console/proxy?path=%2F_search%2Fscroll&method=DELETE`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              ...(finalAuthKey ? { 'Authorization': `ApiKey ${finalAuthKey}` } : 
                  username && password ? { 'Authorization': `Basic ${btoa(`${username}:${password}`)}` } : {})
            },
            credentials: 'include',
            body: JSON.stringify({ scroll_id: scrollId })
          }
        );
      } catch (clearError) {
        console.warn(`⚠️ Failed to clear scroll context on error: ${clearError.message}`);
      }
    }
    
    if (error.message === 'AUTHENTICATION_REQUIRED') {
      // Reset authentication state
      isAuthenticated = false;
      authSessionExpiry = null;
      lastAuthConfig = null;
      
      postMessage({
        type: 'AUTHENTICATION_REQUIRED',
        payload: { 
          requestId, 
          error: 'Authentication expired during scroll fetch. Please retry the operation.',
          partialResults: allHits.length > 0 ? allHits : null,
          recordsReceived: allHits.length
        }
      });
    } else {
      postMessage({
        type: 'FETCH_ERROR',
        payload: {
          error: error.message,
          details: error.stack,
          requestId: requestId,
          partialResults: allHits.length > 0 ? allHits : null,
          recordsReceived: allHits.length
        }
      });
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