import React, { useState } from 'react';
import useSimpleElasticsearch from '../hooks/useSimpleElasticsearch';

const SimpleElasticsearchExample = () => {
  // Example configuration
  const [config, setConfig] = useState({
    indexName: 'health-project-task-index',
    query: {
      "match_all": {} // You can customize this query
    },
    sourceFields: [
      "Data.geoPoint",
      "Data.@timestamp",
      "Data.productName",
      "Data.userName",
      "Data.quantity",
      "Data.status"
    ],
    maxRecordLimit: 50000,  // Fetch max 50k records
    maxBatchSize: 5000,     // 5k records per batch
    parallelBatches: 3,     // 3 batches in parallel
    authKey: 'kbn ES_VERSION',
    enabled: false,         // Don't auto-fetch
    autoFetch: false
  });

  // Advanced query examples
  const queryExamples = {
    matchAll: {
      "match_all": {}
    },
    termQuery: {
      "term": {
        "Data.status.keyword": "ACTIVE"
      }
    },
    rangeQuery: {
      "range": {
        "Data.@timestamp": {
          "gte": "2024-01-01",
          "lte": "2024-12-31"
        }
      }
    },
    boolQuery: {
      "bool": {
        "must": [
          {
            "term": {
              "Data.status.keyword": "ACTIVE"
            }
          },
          {
            "range": {
              "Data.quantity": {
                "gte": 1
              }
            }
          }
        ]
      }
    }
  };

  // Use the hook
  const {
    data,
    loading,
    error,
    progress,
    metadata,
    fetchData,
    cancelFetch,
    progressPercentage,
    batchProgress,
    recordsProgress
  } = useSimpleElasticsearch(config);

  // Handle form changes
  const handleConfigChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQueryChange = (queryType) => {
    setConfig(prev => ({
      ...prev,
      query: queryExamples[queryType]
    }));
  };

  const handleFetch = () => {
    fetchData();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#333', marginBottom: '24px' }}>
        🔍 Simple Elasticsearch Worker Example
      </h2>

      {/* Configuration Panel */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '24px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ marginTop: 0, color: '#495057' }}>Configuration</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
              Index Name:
            </label>
            <input
              type="text"
              value={config.indexName}
              onChange={(e) => handleConfigChange('indexName', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
              Auth Key:
            </label>
            <input
              type="text"
              value={config.authKey}
              onChange={(e) => handleConfigChange('authKey', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
              Max Record Limit:
            </label>
            <input
              type="number"
              value={config.maxRecordLimit}
              onChange={(e) => handleConfigChange('maxRecordLimit', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
              Max Batch Size:
            </label>
            <input
              type="number"
              value={config.maxBatchSize}
              onChange={(e) => handleConfigChange('maxBatchSize', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
              Parallel Batches:
            </label>
            <input
              type="number"
              value={config.parallelBatches}
              onChange={(e) => handleConfigChange('parallelBatches', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Query Type:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {Object.keys(queryExamples).map(queryType => (
              <button
                key={queryType}
                onClick={() => handleQueryChange(queryType)}
                style={{
                  padding: '6px 12px',
                  border: JSON.stringify(config.query) === JSON.stringify(queryExamples[queryType]) 
                    ? '2px solid #007bff' : '1px solid #ced4da',
                  borderRadius: '4px',
                  background: JSON.stringify(config.query) === JSON.stringify(queryExamples[queryType])
                    ? '#e7f3ff' : 'white',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {queryType}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Current Query:
          </label>
          <pre style={{
            background: '#f1f3f4',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '150px'
          }}>
            {JSON.stringify(config.query, null, 2)}
          </pre>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleFetch}
            disabled={loading || !config.indexName || !config.authKey}
            style={{
              padding: '10px 20px',
              background: loading ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {loading ? '🔄 Fetching...' : '🚀 Fetch Data'}
          </button>
          
          {loading && (
            <button
              onClick={cancelFetch}
              style={{
                padding: '10px 20px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              🛑 Cancel
            </button>
          )}
        </div>
      </div>

      {/* Progress Panel */}
      {loading && (
        <div style={{
          background: '#e3f2fd',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid #bbdefb'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#1976d2' }}>
            📊 Progress: {progressPercentage.toFixed(1)}%
          </h4>
          
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            height: '20px',
            marginBottom: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#4caf50',
              height: '100%',
              width: `${progressPercentage}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          <div style={{ fontSize: '14px', color: '#555' }}>
            📦 Batches: {batchProgress} | 📄 Records: {recordsProgress}
          </div>
        </div>
      )}

      {/* Error Panel */}
      {error && (
        <div style={{
          background: '#ffebee',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid #ffcdd2'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#d32f2f' }}>❌ Error</h4>
          <div style={{ color: '#666', fontSize: '14px' }}>{error}</div>
        </div>
      )}

      {/* Results Panel */}
      {data.length > 0 && (
        <div style={{
          background: '#e8f5e8',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid #c8e6c9'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#2e7d32' }}>
            ✅ Results: {metadata.totalRecords.toLocaleString()} records fetched
          </h4>
          
          <div style={{ fontSize: '14px', color: '#555', marginBottom: '12px' }}>
            📊 Total Available: {metadata.totalAvailable.toLocaleString()} | 
            📦 Batches Processed: {metadata.batchesProcessed} |
            ⚙️ Batch Size: {metadata.config?.optimalBatchSize.toLocaleString()}
          </div>

          <details style={{ marginTop: '12px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500', color: '#2e7d32' }}>
              View Raw Data (First 5 Records)
            </summary>
            <pre style={{
              background: '#f1f3f4',
              padding: '12px',
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto',
              maxHeight: '300px',
              marginTop: '8px'
            }}>
              {JSON.stringify(data.slice(0, 5), null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        background: '#fff3cd',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #ffeaa7'
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#856404' }}>💡 Instructions</h4>
        <ul style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          <li>Configure your Elasticsearch index, query, and limits above</li>
          <li>The worker automatically handles count queries and optimal batching</li>
          <li>Returns raw Elasticsearch hits without any formatting</li>
          <li>Supports cancellation and real-time progress updates</li>
          <li>All configuration is user-controlled</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleElasticsearchExample;