// Web Worker for Elasticsearch data fetching - as a string export for build compatibility
export const elasticsearchWorkerString = `
// Web Worker for Elasticsearch data fetching

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

// Fetch data from Elasticsearch with progressive loading
async function fetchElasticsearchData({ projectName, page, pageSize, origin, batchSize, kibanaConfig, authKey }) {
  batchSize = batchSize || 1000;
  
  try {
    postMessage({
      type: 'FETCH_START',
      payload: { projectName: projectName, page: page, pageSize: pageSize }
    });

    // Calculate batches for large requests
    const totalBatches = Math.ceil(pageSize / batchSize);
    let allData = [];
    let processedBatches = 0;

    for (let batch = 0; batch < totalBatches; batch++) {
      const batchOffset = page * pageSize + (batch * batchSize);
      const currentBatchSize = Math.min(batchSize, pageSize - (batch * batchSize));

      if (currentBatchSize <= 0) break;

      const queryField = kibanaConfig.queryField || 'projectName';
      const elasticsearchQuery = {
        "_source": [
          "Data.geoPoint",
          "Data.@timestamp", 
          "Data.productName",
          "Data.memberCount",
          "Data.administrativeArea",
          "Data.quantity",
          "Data.userName"
        ],
        "query": {
          "term": {
            ["Data." + queryField + ".keyword"]: projectName
          }
        },
        "from": batchOffset,
        "size": currentBatchSize
      };

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
        const batchData = data.hits.hits.map(function(hit, index) {
          const source = hit._source && hit._source.Data ? hit._source.Data : {};
          const geoPoint = source.geoPoint || {};
          
          return {
            id: hit._id || ('task-' + (batchOffset + index)),
            plannedStartDate: source['@timestamp'] ? new Date(source['@timestamp']).toISOString() : "NA",
            resourcesQuantity: source.quantity || "NA",
            latitude: geoPoint[1] || geoPoint.lat || "NA",
            longitude: geoPoint[0] || geoPoint.lon || "NA",
            createdBy: source.userName || "NA",
            resourcesCount: 1,
            locationAccuracy: "NA",
            productName: source.productName || "NA",
            memberCount: source.memberCount || "NA",
            administrativeArea: source.administrativeArea || "NA",
            quantity: source.quantity || "NA"
          };
        });

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

    postMessage({
      type: 'FETCH_SUCCESS',
      payload: {
        data: allData,
        totalRecords: allData.length,
        batchesProcessed: processedBatches
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