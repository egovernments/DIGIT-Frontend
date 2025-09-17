import React, { useState } from 'react';
import useSimpleElasticsearch from '../hooks/useSimpleElasticsearch';

const ElasticsearchDebugTest = () => {
  const [testQuery, setTestQuery] = useState({
    match_all: {}
  });

  // Test with simpleElasticsearch
  const {
    data,
    loading,
    error,
    metadata,
    fetchData
  } = useSimpleElasticsearch({
    indexName: 'your-index-name', // Replace with your actual index
    query: testQuery,
    sourceFields: ['*'], // Fetch all fields
    maxRecordLimit: 100000, // Request 100K records
    maxBatchSize: 10000,    // Batch size 10K
    enabled: false,         // Don't auto-fetch
    autoFetch: false
  });

  const handleTest = () => {
    console.log('🧪 Starting Elasticsearch test with 100K limit...');
    fetchData();
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Elasticsearch Limit Debug Test</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Configuration:</strong>
        <ul>
          <li>maxRecordLimit: 100,000</li>
          <li>maxBatchSize: 10,000</li>
          <li>Worker: simpleElasticsearch</li>
        </ul>
      </div>

      <button 
        onClick={handleTest} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test 100K Limit'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <strong>Results:</strong>
        {loading && <p>⏳ Loading...</p>}
        {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
        {data && (
          <div>
            <p>✅ Fetched: <strong>{data.length.toLocaleString()}</strong> records</p>
            <p>📊 Total Available: <strong>{metadata.totalAvailable?.toLocaleString()}</strong></p>
            <p>📦 Total Records: <strong>{metadata.totalRecords?.toLocaleString()}</strong></p>
            <p>🔄 Batches Processed: <strong>{metadata.batchesProcessed}</strong></p>
            
            {data.length === 10000 && (
              <p style={{ color: 'orange', fontWeight: 'bold' }}>
                ⚠️ Exactly 10K records returned - this suggests a limit is being applied!
              </p>
            )}
            
            {data.length === 100000 && (
              <p style={{ color: 'green', fontWeight: 'bold' }}>
                ✅ 100K limit working correctly!
              </p>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <strong>Debug Info:</strong>
        <br />Check browser console for detailed logs from the worker.
        <br />Look for messages like "📊 Will fetch: X records (limit: Y)"
      </div>
    </div>
  );
};

export default ElasticsearchDebugTest;