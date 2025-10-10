/**
 * Elastic Proxy Configuration
 * 
 * This utility provides configuration for connecting to Elasticsearch
 * through a proxy server instead of direct connection.
 */

/**
 * Get the proxy endpoint for Elasticsearch/Kibana requests
 * @param {boolean} useProxy - Whether to use the proxy server
 * @returns {Object} Configuration object with endpoint details
 */
export const getElasticProxyConfig = (useProxy = false) => {
  // Check if we should use the proxy server
  const shouldUseProxy = useProxy || window.ELASTIC_USE_PROXY || process.env.REACT_APP_ELASTIC_USE_PROXY === 'true';
  
  if (shouldUseProxy) {
    // Use the proxy server running in the same container
    return {
      useProxy: true,
      kibanaPath: 'console/proxy/kibana',
      elasticsearchPath: 'console/proxy/elasticsearch',
      origin: window.location.origin,
      // The proxy server handles the actual Kibana/Elasticsearch URLs
      proxyEndpoint: '/console/proxy'
    };
  }
  
  // Fall back to direct connection (existing behavior)
  return {
    useProxy: false,
    kibanaPath: window.KIBANA_PATH || 'kibana',
    elasticsearchPath: null,
    origin: window.location.origin,
    proxyEndpoint: null
  };
};

/**
 * Transform the Kibana console proxy URL to use our proxy server
 * @param {string} originalUrl - The original Kibana console proxy URL
 * @param {Object} config - The proxy configuration
 * @returns {string} The transformed URL
 */
export const transformProxyUrl = (originalUrl, config) => {
  if (!config.useProxy) {
    return originalUrl;
  }
  
  // Parse the original URL
  // Example: /kibana/api/console/proxy?path=%2Findex%2F_search&method=POST
  const urlParts = originalUrl.split('/api/console/proxy');
  if (urlParts.length !== 2) {
    return originalUrl;
  }
  
  // Extract the query parameters
  const queryString = urlParts[1];
  const params = new URLSearchParams(queryString);
  const path = params.get('path');
  const method = params.get('method');
  
  if (!path) {
    return originalUrl;
  }
  
  // Decode the path and construct new proxy URL
  const decodedPath = decodeURIComponent(path);
  
  // Build the new proxy URL
  // From: /kibana/api/console/proxy?path=%2Findex%2F_search&method=POST
  // To: /api/elasticsearch/index/_search
  const newPath = `/api/elasticsearch${decodedPath}`;
  
  // Preserve other query parameters
  const newParams = new URLSearchParams();
  params.forEach((value, key) => {
    if (key !== 'path' && key !== 'method') {
      newParams.append(key, value);
    }
  });
  
  const queryPart = newParams.toString();
  return queryPart ? `${newPath}?${queryPart}` : newPath;
};

/**
 * Get headers for proxy requests
 * @param {Object} originalHeaders - Original headers
 * @param {Object} config - Proxy configuration
 * @returns {Object} Modified headers
 */
export const getProxyHeaders = (originalHeaders, config) => {
  if (!config.useProxy) {
    return originalHeaders;
  }
  
  // Remove kbn-xsrf header as it's not needed for our proxy
  const { 'kbn-xsrf': _, ...headers } = originalHeaders;
  
  return headers;
};