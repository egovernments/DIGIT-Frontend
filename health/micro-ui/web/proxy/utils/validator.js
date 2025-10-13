/**
 * Environment Validation Utility
 * Validates proxy server configuration and connectivity
 */

const { createAxiosInstance } = require('./axiosClient');
const { elasticsearchLogger, kibanaLogger } = require('./logger');

/**
 * Validate and test connectivity to Elasticsearch and Kibana
 * @param {Object} config - Configuration object
 * @param {string} config.ELASTICSEARCH_URL - Elasticsearch URL
 * @param {string} config.KIBANA_URL - Kibana URL
 * @param {string} config.ES_USERNAME - Elasticsearch username
 * @param {string} config.ES_PASSWORD - Elasticsearch password
 */
const validateEnvironment = ({ ELASTICSEARCH_URL, KIBANA_URL, ES_USERNAME, ES_PASSWORD }) => {
  // Test connectivity on startup with delay
  setTimeout(async () => {
    await testElasticsearchConnection(ELASTICSEARCH_URL, ES_USERNAME, ES_PASSWORD);
    await testKibanaConnection(KIBANA_URL, ES_USERNAME, ES_PASSWORD);
  }, 2000);
};

/**
 * Test Elasticsearch connectivity
 */
const testElasticsearchConnection = async (url, username, password) => {
  try {
    const esClient = createAxiosInstance(url, {
      'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
    });
    
    await esClient.get('/_cluster/health');
    elasticsearchLogger('info')('Connectivity test passed');
  } catch (error) {
    elasticsearchLogger('error')('Connectivity test failed:', error.message);
    if (error.response && error.response.status === 401) {
      elasticsearchLogger('error')('Authentication required - check ES_USERNAME and ES_PASSWORD environment variables');
    } else {
      elasticsearchLogger('error')('Check ELASTICSEARCH_URL environment variable');
    }
  }
};

/**
 * Test Kibana connectivity
 */
const testKibanaConnection = async (url, username, password) => {
  try {
    const kibanaClient = createAxiosInstance(url, {
      'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
    });
    
    // Try multiple endpoints to find one that works
    let kibanaWorking = false;
    const testEndpoints = ['/api/status', '/api/saved_objects/_find?type=index-pattern', '/app/kibana', '/status', '/', '/api/features'];
    
    for (const endpoint of testEndpoints) {
      try {
        const response = await kibanaClient.get(endpoint);
        kibanaLogger('info')(`Connectivity test passed (endpoint: ${endpoint}, status: ${response.status})`);
        kibanaWorking = true;
        break;
      } catch (endpointError) {
        if (endpointError.response) {
          kibanaLogger('debug')(`Tested ${endpoint} - Status: ${endpointError.response.status}`);
        }
        // Continue to next endpoint
      }
    }
    
    if (!kibanaWorking) {
      kibanaLogger('warn')('Health check did not find a working endpoint');
      kibanaLogger('info')('Proxy may still work for actual Kibana API requests');
    }
  } catch (error) {
    kibanaLogger('error')('Connectivity test failed:', error.message);
    kibanaLogger('error')('Check KIBANA_URL environment variable and network connectivity');
    kibanaLogger('info')('Note: Kibana proxy may still work even if health check fails');
  }
};

module.exports = {
  validateEnvironment,
  testElasticsearchConnection,
  testKibanaConnection
};