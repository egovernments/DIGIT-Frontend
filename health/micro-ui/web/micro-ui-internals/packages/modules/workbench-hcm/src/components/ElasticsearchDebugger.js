import React, { useEffect } from 'react';

const ElasticsearchDebugger = ({ projectId, externalLoading }) => {
  useEffect(() => {
    console.log('🔍 Elasticsearch Debugger:');
    console.log('  projectId:', projectId);
    console.log('  externalLoading:', externalLoading);
    console.log('  Hook enabled:', !externalLoading && !!projectId);
    console.log('  window.ELASTIC_USE_PROXY:', window.ELASTIC_USE_PROXY);
    console.log('  Proxy mode will be used:', window.ELASTIC_USE_PROXY || false);
    
    // Test proxy health
    if (window.ELASTIC_USE_PROXY) {
      fetch('/api/health')
        .then(response => response.json())
        .then(data => {
          console.log('✅ Proxy health check:', data);
        })
        .catch(error => {
          console.error('❌ Proxy health check failed:', error);
        });
    } else {
      console.log('ℹ️ Direct connection mode (no proxy)');
    }
    
    // Check if we can reach the proxy endpoints
    if (window.ELASTIC_USE_PROXY) {
      fetch('/api/elasticsearch/_cluster/health')
        .then(response => {
          console.log('📡 Elasticsearch proxy test status:', response.status);
          return response.json();
        })
        .then(data => {
          console.log('📡 Elasticsearch proxy test response:', data);
        })
        .catch(error => {
          console.error('❌ Elasticsearch proxy test failed:', error);
        });
    }
  }, [projectId, externalLoading]);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#f0f0f0', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>🔍 ES Debug Info</h4>
      <div>ProjectID: {projectId || 'Not set'}</div>
      <div>Loading: {externalLoading ? 'Yes' : 'No'}</div>
      <div>Hook Enabled: {(!externalLoading && !!projectId) ? 'Yes' : 'No'}</div>
      <div>Proxy Mode: {window.ELASTIC_USE_PROXY ? 'Yes' : 'No'}</div>
    </div>
  );
};

export default ElasticsearchDebugger;