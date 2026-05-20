// Simple Elasticsearch Worker String Export - for build compatibility
export const simpleElasticsearchWorkerString = `
// Simple Elasticsearch Worker
// Directly calls _search (no _count step), supports aggregations

const activeRequests = new Map();
let currentRequestId = null;
let isCancelled = false;

self.onmessage = async function(e) {
  const { type, payload } = e.data;
  try {
    switch (type) {
      case 'FETCH_DATA':
        await fetchElasticsearchData(payload);
        break;
      case 'CANCEL_REQUEST':
        if (payload.requestId) {
          activeRequests.delete(payload.requestId);
          if (currentRequestId === payload.requestId) {
            isCancelled = true;
          }
          postMessage({ type: 'FETCH_CANCELLED', payload: { requestId: payload.requestId } });
        }
        break;
      default:
        postMessage({ type: 'ERROR', error: 'Unknown message type: ' + type });
    }
  } catch (error) {
    postMessage({ type: 'ERROR', error: error.message, stack: error.stack });
  }
};

async function fetchElasticsearchData(config) {
  const {
    indexName,
    query,
    sourceFields,
    aggs,
    maxRecordLimit = 10000,
    kibanaPath = 'kibana/api/console/proxy',
    origin = self.location.origin,
    authKey,
    requestId = Date.now().toString()
  } = config;

  try {
    currentRequestId = requestId;
    isCancelled = false;
    activeRequests.set(requestId, true);

    postMessage({ type: 'FETCH_START', payload: { requestId } });

    const headers = {
      'Content-Type': 'application/json',
      'kbn-xsrf': 'true'
    };
    if (authKey) {
      headers.Authorization = authKey;
    }

    // Build search body: raw hits + optional aggregations in one call
    const searchBody = {
      size: Math.min(maxRecordLimit, 10000),
      _source: sourceFields,
      query: query || { match_all: {} }
    };

    // Add aggregations if provided
    if (aggs) {
      searchBody.aggs = aggs;
    }

    // kibanaPath should contain the full proxy path (e.g. "kibana-upgrade/s/bauchi-dashboard/api/console/proxy")
    var proxyBase = kibanaPath;
    while (proxyBase.charAt(0) === '/') proxyBase = proxyBase.substring(1);
    const response = await fetch(
      origin + '/' + proxyBase + '?path=%2F' + indexName + '%2F_search&method=POST',
      {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(searchBody)
      }
    );

    if (response.status === 401 || response.status === 403) {
      postMessage({
        type: 'FETCH_ERROR',
        error: 'Authentication failed (' + response.status + ')',
        payload: { requestId }
      });
      return;
    }

    if (!response.ok) {
      const errorText = await response.text();
      postMessage({
        type: 'FETCH_ERROR',
        error: 'ES request failed: ' + response.status + ' ' + errorText,
        payload: { requestId }
      });
      return;
    }

    const data = await response.json();

    if (isCancelled) {
      postMessage({ type: 'FETCH_CANCELLED', payload: { requestId } });
      return;
    }

    const hits = data?.hits?.hits || [];
    const totalAvailable = data?.hits?.total?.value || hits.length;
    const aggregations = data?.aggregations || null;

    postMessage({
      type: 'FETCH_SUCCESS',
      payload: {
        hits,
        totalRecords: hits.length,
        totalAvailable,
        aggregations,
        batchesProcessed: 1,
        config: { indexName, size: searchBody.size },
        requestId
      }
    });

  } catch (error) {
    if (!isCancelled) {
      postMessage({
        type: 'FETCH_ERROR',
        error: error.message,
        payload: { requestId }
      });
    }
  } finally {
    if (requestId) activeRequests.delete(requestId);
  }
}

self.onerror = function(error) {
  postMessage({ type: 'WORKER_ERROR', error: error.message });
};
`;
