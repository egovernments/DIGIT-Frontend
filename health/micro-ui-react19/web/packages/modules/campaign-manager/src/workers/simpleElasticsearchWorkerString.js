// Simple Elasticsearch Worker String Export - for build compatibility
export const simpleElasticsearchWorkerString = `
// Simple Elasticsearch Worker
// Handles count query, batching, and parallel fetching automatically

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
    maxRecordLimit = 100000,
    maxBatchSize = 10000,
    parallelBatches = 4,
    kibanaPath = 'kibana',
    origin = self.location.origin,
    authKey,
    requestId = Date.now().toString()
  } = config;

  try {
    currentRequestId = requestId;
    isCancelled = false;
    activeRequests.set(requestId, true);

    if (isCancelled) {
      postMessage({ type: 'FETCH_CANCELLED', payload: { requestId } });
      return;
    }

    postMessage({ type: 'FETCH_START', payload: { requestId } });

    // Step 1: Get total count
    const countHeaders = {
      'Content-Type': 'application/json',
      'kbn-xsrf': 'true'
    };
    if (authKey) {
      countHeaders.Authorization = authKey;
    }

    const countResponse = await fetch(
      origin + '/' + kibanaPath + '/api/console/proxy?path=%2F' + indexName + '%2F_count&method=POST',
      {
        method: 'POST',
        headers: countHeaders,
        credentials: 'include',
        body: JSON.stringify({ query })
      }
    );

    if (countResponse.status === 401 || countResponse.status === 403) {
      postMessage({
        type: 'FETCH_ERROR',
        error: 'Authentication failed (' + countResponse.status + ')',
        payload: { requestId }
      });
      return;
    }

    const countData = await countResponse.json();
    const totalAvailable = countData?.count || 0;

    // Step 2: Determine effective fetch limit
    const effectiveLimit = Math.min(maxRecordLimit, totalAvailable);

    if (effectiveLimit === 0) {
      postMessage({
        type: 'FETCH_SUCCESS',
        payload: {
          hits: [],
          totalRecords: 0,
          totalAvailable: 0,
          batchesProcessed: 0,
          config: { indexName, effectiveLimit: 0, totalBatches: 0 },
          requestId
        }
      });
      return;
    }

    // Step 3: Decide between regular search and scroll API
    const MAX_WINDOW_SIZE = 10000;
    const needsScrollAPI = effectiveLimit > MAX_WINDOW_SIZE && totalAvailable > MAX_WINDOW_SIZE;

    if (needsScrollAPI) {
      return await fetchWithScrollAPI({
        indexName, query, sourceFields, effectiveLimit, maxBatchSize,
        requestId, kibanaPath, origin, authKey
      });
    }

    // Step 4: Regular batched search
    const optimalBatchSize = Math.min(maxBatchSize, Math.max(1000, Math.ceil(effectiveLimit / 10)));
    const totalBatches = Math.ceil(effectiveLimit / optimalBatchSize);
    const allHits = [];
    let processedBatches = 0;

    for (let chunkStart = 0; chunkStart < totalBatches; chunkStart += parallelBatches) {
      if (isCancelled || !activeRequests.has(requestId)) {
        postMessage({ type: 'FETCH_CANCELLED', payload: { requestId } });
        return;
      }

      const chunkEnd = Math.min(chunkStart + parallelBatches, totalBatches);
      const batchPromises = [];

      for (let batchIndex = chunkStart; batchIndex < chunkEnd; batchIndex++) {
        const offset = batchIndex * optimalBatchSize;
        const size = Math.min(optimalBatchSize, effectiveLimit - offset);
        if (size <= 0) break;

        batchPromises.push(fetchSingleBatch(
          indexName,
          { _source: sourceFields, query, from: offset, size },
          batchIndex, kibanaPath, origin, authKey
        ));
      }

      const batchResults = await Promise.all(batchPromises);

      for (const result of batchResults) {
        if (result.error) {
          if (result.error === 'AUTHENTICATION_REQUIRED') {
            postMessage({
              type: 'FETCH_ERROR',
              error: 'Authentication failed during batch processing',
              payload: { requestId }
            });
            return;
          }
        } else {
          allHits.push(...result.hits);
          processedBatches++;
        }
      }

      postMessage({
        type: 'FETCH_PROGRESS',
        payload: {
          batchesCompleted: processedBatches,
          totalBatches,
          recordsReceived: allHits.length,
          progress: (processedBatches / totalBatches) * 100,
          requestId
        }
      });

      if (chunkEnd < totalBatches) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    if (isCancelled) {
      postMessage({ type: 'FETCH_CANCELLED', payload: { requestId } });
      return;
    }

    postMessage({
      type: 'FETCH_SUCCESS',
      payload: {
        hits: allHits,
        totalRecords: allHits.length,
        totalAvailable,
        batchesProcessed: processedBatches,
        config: { indexName, effectiveLimit, totalBatches },
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

async function fetchSingleBatch(indexName, searchQuery, batchIndex, kibanaPath, origin, authKey) {
  try {
    const headers = { 'Content-Type': 'application/json', 'kbn-xsrf': 'true' };
    if (authKey) headers.Authorization = authKey;

    const response = await fetch(
      origin + '/' + kibanaPath + '/api/console/proxy?path=%2F' + indexName + '%2F_search&method=POST',
      {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(searchQuery)
      }
    );

    if (response.status === 401 || response.status === 403) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    const data = await response.json();

    if (data?.hits?.hits) {
      return { batchIndex, hits: data.hits.hits, total: data.hits.total?.value || data.hits.hits.length };
    }

    return { batchIndex, hits: [], total: 0 };
  } catch (error) {
    return { batchIndex, hits: [], total: 0, error: error.message };
  }
}

async function fetchWithScrollAPI({
  indexName, query, sourceFields, effectiveLimit, maxBatchSize,
  requestId, kibanaPath, origin, authKey
}) {
  const allHits = [];
  const scrollTimeout = '5m';
  const scrollSize = Math.min(maxBatchSize, 5000);
  let scrollId = null;
  let scrollBatch = 0;

  try {
    const headers = { 'Content-Type': 'application/json', 'kbn-xsrf': 'true' };
    if (authKey) headers.Authorization = authKey;

    // Initial scroll search
    const initialResponse = await fetch(
      origin + '/' + kibanaPath + '/api/console/proxy?path=' +
        encodeURIComponent('/' + indexName + '/_search?scroll=' + scrollTimeout) + '&method=POST',
      {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ _source: sourceFields, query, size: scrollSize })
      }
    );

    if (initialResponse.status === 401 || initialResponse.status === 403) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    const initialData = await initialResponse.json();
    if (!initialData?.hits?.hits) throw new Error('Invalid initial scroll response');

    scrollId = initialData._scroll_id;
    allHits.push(...initialData.hits.hits);
    scrollBatch++;

    postMessage({
      type: 'FETCH_PROGRESS',
      payload: {
        batchesCompleted: scrollBatch,
        totalBatches: Math.ceil(effectiveLimit / scrollSize),
        recordsReceived: allHits.length,
        progress: (allHits.length / effectiveLimit) * 100,
        requestId
      }
    });

    // Continue scrolling
    while (scrollId && allHits.length < effectiveLimit && !isCancelled) {
      const scrollResponse = await fetch(
        origin + '/' + kibanaPath + '/api/console/proxy?path=' +
          encodeURIComponent('/_search/scroll') + '&method=POST',
        {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({ scroll: scrollTimeout, scroll_id: scrollId })
        }
      );

      if (scrollResponse.status === 401 || scrollResponse.status === 403) {
        throw new Error('AUTHENTICATION_REQUIRED');
      }

      const scrollData = await scrollResponse.json();
      if (!scrollData?.hits?.hits?.length) break;

      const remainingLimit = effectiveLimit - allHits.length;
      const hitsToAdd = scrollData.hits.hits.slice(0, remainingLimit);
      allHits.push(...hitsToAdd);
      scrollBatch++;
      scrollId = scrollData._scroll_id;

      postMessage({
        type: 'FETCH_PROGRESS',
        payload: {
          batchesCompleted: scrollBatch,
          totalBatches: Math.ceil(effectiveLimit / scrollSize),
          recordsReceived: allHits.length,
          progress: (allHits.length / effectiveLimit) * 100,
          requestId
        }
      });

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Clear scroll context
    if (scrollId) {
      try {
        await fetch(
          origin + '/' + kibanaPath + '/api/console/proxy?path=' +
            encodeURIComponent('/_search/scroll') + '&method=DELETE',
          {
            method: 'DELETE',
            headers,
            credentials: 'include',
            body: JSON.stringify({ scroll_id: scrollId })
          }
        );
      } catch (e) { /* ignore cleanup errors */ }
    }

    postMessage({
      type: 'FETCH_SUCCESS',
      payload: {
        hits: allHits,
        totalRecords: allHits.length,
        totalAvailable: effectiveLimit,
        batchesProcessed: scrollBatch,
        config: { indexName, method: 'Scroll API', scrollSize, effectiveLimit },
        requestId
      }
    });

  } catch (error) {
    // Clear scroll on error
    if (scrollId) {
      try {
        const headers = { 'Content-Type': 'application/json', 'kbn-xsrf': 'true' };
        if (authKey) headers.Authorization = authKey;
        await fetch(
          origin + '/' + kibanaPath + '/api/console/proxy?path=' +
            encodeURIComponent('/_search/scroll') + '&method=DELETE',
          {
            method: 'DELETE', headers, credentials: 'include',
            body: JSON.stringify({ scroll_id: scrollId })
          }
        );
      } catch (e) { /* ignore */ }
    }

    postMessage({
      type: 'FETCH_ERROR',
      error: error.message,
      payload: { requestId, partialResults: allHits.length > 0 ? allHits : null }
    });
  }
}

self.onerror = function(error) {
  postMessage({ type: 'WORKER_ERROR', error: error.message });
};
`;
