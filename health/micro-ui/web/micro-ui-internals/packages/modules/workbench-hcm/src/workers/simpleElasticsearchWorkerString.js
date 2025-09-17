

// Simple Elasticsearch Worker String Export - for build compatibility
export const simpleElasticsearchWorkerString = `
// Simple Elasticsearch Worker - User Configurable
// Handles count query, batching, and parallel fetching automatically

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
            console.log(\`🚫 Cancelled request: \${payload.requestId}\`);
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
  const currentConfig = \`\${authConfig.origin}|\${authConfig.kibanaPath}|\${authConfig.username}|\${authConfig.password}\`;
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
      console.error(\`❌ Authentication failed after \${MAX_AUTH_RETRIES} attempts\`);
      authRetryCount = 0; // Reset for future attempts
      throw new Error(\`Authentication failed after \${MAX_AUTH_RETRIES} attempts. Please check credentials.\`);
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
    console.log(\`🔐 Starting Kibana authentication... (attempt \${authRetryCount}/\${MAX_AUTH_RETRIES})\`);
    
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
    lastAuthConfig = \`\${origin}|\${kibanaPath}|\${username}|\${password}\`;
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
    
    console.log(\`🚀 Starting Elasticsearch fetch with config:\`, {
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
    console.log(\`📊 Step 2: Getting total count for query...\`);
    
    const countQuery = { query };
    
    // Construct authKey if not provided
    let finalAuthKey = authKey || '';
    if (!finalAuthKey && username && password) {
      
      finalAuthKey = \`Basic \${BasicAuth}\`;
      console.log('🔑 Constructed Basic auth key from credentials', finalAuthKey,username,password);
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
      \`\${origin}/\${kibanaPath}/api/console/proxy?path=%2F\${indexName}%2F_count&method=POST\`,
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
    
    console.log(\`📊 Total records available: \${totalAvailable.toLocaleString()}\`);

    // Step 3: Determine effective fetch limit
    const effectiveLimit = Math.min(maxRecordLimit, totalAvailable);
    console.log(\`📊 Will fetch: \${effectiveLimit.toLocaleString()} records (limit: \${maxRecordLimit.toLocaleString()})\`);

    // Step 4: Calculate batching strategy
    const optimalBatchSize = Math.min(maxBatchSize, Math.max(1000, Math.ceil(effectiveLimit / 10)));
    const totalBatches = Math.ceil(effectiveLimit / optimalBatchSize);
    
    console.log(\`📦 Batching strategy: \${totalBatches} batches of \${optimalBatchSize} records each\`);
    console.log(\`🔄 Will process \${parallelBatches} batches in parallel\`);

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
      console.log(\`📦 Processing batches \${chunkStart + 1} to \${chunkEnd} (of \${totalBatches} total)\`);

      // Create batch promises for this chunk
      const batchPromises = [];
      
      for (let batchIndex = chunkStart; batchIndex < chunkEnd; batchIndex++) {
        const offset = batchIndex * optimalBatchSize;
        const size = Math.min(optimalBatchSize, effectiveLimit - offset);
        
        if (size <= 0) break;
        
        console.log(\`🔢 Batch \${batchIndex + 1}: offset=\${offset}, size=\${size}\`);
        
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

      // Execute this chunk of batches in parallel
      console.log(\`⏳ Executing \${batchPromises.length} batches in parallel...\`);
      const batchResults = await Promise.all(batchPromises);

      // Process results
      let hasAuthError = false;
      for (const result of batchResults) {
        if (result.error) {
          console.log(\`❌ Batch \${result.batchIndex + 1} failed: \${result.error}\`);
          if (result.error === 'AUTHENTICATION_REQUIRED') {
            hasAuthError = true;
            break; // Stop processing if authentication is required
          }
          // Continue with other batches even if one fails
        } else {
          console.log(\`✅ Batch \${result.batchIndex + 1} succeeded: \${result.hits.length} records\`);
          allHits.push(...result.hits);
          processedBatches++;
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

      console.log(\`📈 Progress: \${processedBatches}/\${totalBatches} batches completed, \${allHits.length} total records\`);

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

    // Step 6: Send final results
    console.log(\`✅ Fetch completed successfully: \${allHits.length} total records fetched\`);
    
    postMessage({
      type: 'FETCH_SUCCESS',
      payload: {
        hits: allHits,
        totalRecords: allHits.length,
        totalAvailable: totalAvailable,
        batchesProcessed: processedBatches,
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
      console.error(\`❌ Fetch failed:\`, error);
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
    let finalAuthKey = authKey || '';
    if (!finalAuthKey && username && password) {
      finalAuthKey = \`Basic \${BasicAuth}\`;
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
      \`\${origin}/\${kibanaPath}/api/console/proxy?path=%2F\${indexName}%2F_search&method=POST\`,
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
    
    if (data && data.hits && data.hits.hits) {
      return {
        batchIndex,
        hits: data.hits.hits,
        total: data.hits.total?.value || data.hits.total || data.hits.hits.length
      };
    }
    
    return {
      batchIndex,
      hits: [],
      total: 0
    };
    
  } catch (error) {
    return {
      batchIndex,
      hits: [],
      total: 0,
      error: error.message
    };
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
};`;
