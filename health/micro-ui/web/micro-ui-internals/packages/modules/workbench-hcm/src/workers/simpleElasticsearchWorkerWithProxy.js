// Simple Elasticsearch Worker with Proxy Support
// This worker can connect through a proxy server or directly to Kibana/Elasticsearch

export const createProxyAwareWorkerString = (useProxy = false) => {
  const proxyConfig = useProxy ? `
    // Proxy configuration
    const USE_PROXY = true;
    const PROXY_PATH = '/console/proxy/elasticsearch';
    
    // Transform Kibana console proxy URLs to use our proxy server
    function transformUrl(kibanaPath, elasticsearchPath, origin) {
      if (!USE_PROXY) {
        return (path) => \`\${origin}/\${kibanaPath}/api/console/proxy?path=\${encodeURIComponent(path)}&method=POST\`;
      }
      // Use our proxy server instead
      return (path) => \`\${origin}\${PROXY_PATH}\${path}\`;
    }
    
    // Get headers for requests
    function getRequestHeaders(authKey, username, password, isProxy = false) {
      const headers = {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      };
      
      if (!isProxy) {
        headers['kbn-xsrf'] = 'true';
      }
      
      if (authKey) {
        headers['Authorization'] = authKey;
      } else if (username && password) {
        headers['Authorization'] = \`Basic \${btoa(\`\${username}:\${password}\`)}\`;
      }
      
      return headers;
    }
  ` : `
    // Direct connection configuration (original behavior)
    const USE_PROXY = false;
    
    function transformUrl(kibanaPath, elasticsearchPath, origin) {
      return (path) => \`\${origin}/\${kibanaPath}/api/console/proxy?path=\${encodeURIComponent(path)}&method=POST\`;
    }
    
    function getRequestHeaders(authKey, username, password, isProxy = false) {
      const headers = {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'kbn-xsrf': 'true'
      };
      
      if (authKey) {
        headers['Authorization'] = authKey;
      } else if (username && password) {
        headers['Authorization'] = \`Basic \${btoa(\`\${username}:\${password}\`)}\`;
      }
      
      return headers;
    }
  `;

  // Return the complete worker string with proxy support
  return proxyConfig + `
    
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
        if (!USE_PROXY) {
          await authenticateKibana(payload);
        } else {
          // Skip authentication for proxy mode
          postMessage({
            type: 'AUTHENTICATION_SUCCESS',
            payload: { message: 'Using proxy server, authentication handled by proxy' }
          });
        }
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

// Main fetch function
async function fetchElasticsearchData(config) {
  const {
    indexName,
    query,
    sourceFields,
    maxRecordLimit = 100000,
    maxBatchSize = 10000,
    parallelBatches = 4,
    kibanaPath,
    authKey,
    username,
    password,
    requiresAuth,
    origin,
    requestId
  } = config;

  // Set current request ID
  currentRequestId = requestId;
  isCancelled = false;

  // Register request
  if (requestId) {
    activeRequests.set(requestId, true);
  }

  try {
    postMessage({
      type: 'FETCH_START',
      payload: { requestId }
    });

    // Check if request was cancelled
    if (!activeRequests.has(requestId)) {
      console.log(\`Request \${requestId} was cancelled before starting\`);
      return;
    }

    // Get URL transformer
    const getUrl = transformUrl(kibanaPath, null, origin);
    
    // Step 1: Get total count
    console.log('📊 Getting total count...');
    const countQuery = {
      query: query,
      size: 0
    };
    
    const headers = getRequestHeaders(authKey, username, password, USE_PROXY);
    
    const countResponse = await fetch(
      getUrl(\`/\${indexName}/_count\`).replace('&method=POST', ''),
      {
        method: 'POST',
        headers: headers,
        credentials: USE_PROXY ? 'same-origin' : 'include',
        body: JSON.stringify(countQuery)
      }
    );

    if (!countResponse.ok) {
      throw new Error(\`Count query failed: \${countResponse.status} \${countResponse.statusText}\`);
    }

    const countData = await countResponse.json();
    const totalAvailable = countData.count || 0;
    console.log(\`📊 Total available records: \${totalAvailable.toLocaleString()}\`);

    // Calculate batches
    const recordsToFetch = Math.min(totalAvailable, maxRecordLimit);
    const batchSize = Math.min(maxBatchSize, recordsToFetch);
    const totalBatches = Math.ceil(recordsToFetch / batchSize);
    
    console.log(\`📊 Will fetch \${recordsToFetch.toLocaleString()} records in \${totalBatches} batches\`);

    // Fetch data in batches
    const allHits = [];
    let batchesCompleted = 0;

    for (let i = 0; i < totalBatches; i += parallelBatches) {
      if (isCancelled || !activeRequests.has(requestId)) {
        console.log(\`🚫 Fetch cancelled at batch \${i}\`);
        break;
      }

      const batchPromises = [];
      const currentBatchCount = Math.min(parallelBatches, totalBatches - i);

      for (let j = 0; j < currentBatchCount; j++) {
        const batchIndex = i + j;
        const from = batchIndex * batchSize;
        const size = Math.min(batchSize, recordsToFetch - from);

        const searchQuery = {
          query: query,
          from: from,
          size: size,
          _source: sourceFields
        };

        batchPromises.push(
          fetch(
            getUrl(\`/\${indexName}/_search\`).replace('&method=POST', ''),
            {
              method: 'POST',
              headers: headers,
              credentials: USE_PROXY ? 'same-origin' : 'include',
              body: JSON.stringify(searchQuery)
            }
          ).then(async response => {
            if (!response.ok) {
              throw new Error(\`Batch \${batchIndex} failed: \${response.status}\`);
            }
            const data = await response.json();
            return data.hits?.hits || [];
          })
        );
      }

      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(hits => allHits.push(...hits));
      
      batchesCompleted += currentBatchCount;
      const progress = Math.round((batchesCompleted / totalBatches) * 100);
      
      postMessage({
        type: 'FETCH_PROGRESS',
        payload: {
          progress,
          batchesCompleted,
          totalBatches,
          recordsReceived: allHits.length
        }
      });
    }

    // Send success message
    postMessage({
      type: 'FETCH_SUCCESS',
      payload: {
        hits: allHits,
        totalRecords: allHits.length,
        totalAvailable,
        batchesProcessed: batchesCompleted,
        config: {
          indexName,
          maxRecordLimit,
          batchSize,
          totalBatches
        }
      }
    });

  } catch (error) {
    console.error('❌ Fetch error:', error);
    postMessage({
      type: 'FETCH_ERROR',
      error: error.message
    });
  } finally {
    if (requestId) {
      activeRequests.delete(requestId);
    }
  }
}

// Kibana authentication (only for direct connection)
async function authenticateKibana(authConfig) {
  const { origin, kibanaPath, username, password, requestId } = authConfig;
  
  try {
    postMessage({ type: 'AUTHENTICATION_START' });
    
    const loginResponse = await fetch(origin + '/' + kibanaPath + '/internal/security/login', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'content-type': 'application/json',
        'kbn-version': '7.12.0',
        'kbn-xsrf': 'true'
      },
      credentials: 'include',
      body: JSON.stringify({
        providerType: 'basic',
        providerName: 'basic',
        currentURL: origin + '/' + kibanaPath + '/',
        params: { username, password }
      })
    });
    
    if (loginResponse.ok) {
      isAuthenticated = true;
      authSessionExpiry = Date.now() + AUTH_SESSION_TIMEOUT;
      lastAuthConfig = \`\${origin}|\${kibanaPath}|\${username}|\${password}\`;
      authRetryCount = 0;
      
      postMessage({
        type: 'AUTHENTICATION_SUCCESS',
        payload: {
          authenticated: true,
          sessionExpiry: authSessionExpiry
        }
      });
    } else {
      throw new Error(\`Authentication failed: \${loginResponse.status}\`);
    }
    
  } catch (error) {
    console.error('❌ Authentication error:', error);
    isAuthenticated = false;
    authSessionExpiry = null;
    lastAuthConfig = null;
    authRetryCount++;
    
    postMessage({
      type: 'AUTHENTICATION_ERROR',
      error: error.message
    });
  } finally {
    authenticationInProgress = false;
    authenticationPromise = null;
  }
}

console.log(\`✅ Elasticsearch worker initialized (Proxy mode: \${USE_PROXY})\`);
`;
};