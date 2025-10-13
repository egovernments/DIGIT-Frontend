/**
 * Kibana Proxy Handlers
 * Handles all Kibana-related requests
 */

const { createAxiosInstance } = require('../utils/axiosClient');
const { kibanaLogger } = require('../utils/logger');

/**
 * Handle Kibana POST requests
 */
const handleKibanaPost = (KIBANA_URL) => async (req, res) => {
  try {
    const path = req.params[0];
    
    // Use server-side credentials from environment variables
    const ES_USERNAME = process.env.ES_USERNAME || 'elastic';
    const ES_PASSWORD = process.env.ES_PASSWORD || 'changeme';
    const authHeader = `Basic ${Buffer.from(`${ES_USERNAME}:${ES_PASSWORD}`).toString('base64')}`;

    const kibanaClient = createAxiosInstance(KIBANA_URL, {
      'Authorization': authHeader,
      'kbn-xsrf': 'true'
    });

    const response = await kibanaClient.post(`/${path}`, req.body, {
      params: req.query
    });

    kibanaLogger('info')(`POST /${path} - Status: ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    kibanaLogger('error')(`POST /${req.params[0]} failed:`, error.message);
    kibanaLogger('error')(`Request path: /${req.params[0]}`);
    kibanaLogger('error')(`Kibana URL: ${KIBANA_URL}`);
    
    if (error.code === 'ENOTFOUND') {
      kibanaLogger('error')('DNS resolution failed - check if Kibana hostname is resolvable');
      kibanaLogger('warn')('Suggestion: Update KIBANA_URL environment variable to use IP address or correct hostname');
    }
    
    if (error.response) {
      kibanaLogger('error')(`Response status: ${error.response.status}`);
      res.status(error.response.status).json({
        error: error.response.data || error.message,
        status: error.response.status,
        kibanaUrl: KIBANA_URL
      });
    } else if (error.request) {
      kibanaLogger('error')('Service unavailable - no response received');
      res.status(503).json({
        error: 'Kibana service unavailable',
        details: error.message,
        code: error.code,
        kibanaUrl: KIBANA_URL,
        suggestion: error.code === 'ENOTFOUND' ? 'Check KIBANA_URL environment variable and network connectivity' : 'Check if Kibana service is running'
      });
    } else {
      kibanaLogger('error')('Internal error:', error.message);
      res.status(500).json({
        error: 'Internal proxy server error',
        details: error.message
      });
    }
  }
};

module.exports = {
  handleKibanaPost
};