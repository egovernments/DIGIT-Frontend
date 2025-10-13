/**
 * Elasticsearch Proxy Handlers
 * Handles all Elasticsearch-related requests
 */

const { createAxiosInstance } = require('../utils/axiosClient');
const { elasticsearchLogger } = require('../utils/logger');

/**
 * Handle Elasticsearch GET requests
 */
const handleElasticsearchGet = (ELASTICSEARCH_URL) => async (req, res) => {
  try {
    const path = req.params[0];
    
    // Use server-side credentials from environment variables
    const ES_USERNAME = process.env.ES_USERNAME || 'elastic';
    const ES_PASSWORD = process.env.ES_PASSWORD || 'changeme';
    const authHeader = `Basic ${Buffer.from(`${ES_USERNAME}:${ES_PASSWORD}`).toString('base64')}`;

    const elasticsearchClient = createAxiosInstance(ELASTICSEARCH_URL, {
      'Authorization': authHeader
    });

    const response = await elasticsearchClient.get(`/${path}`, {
      params: req.query
    });

    elasticsearchLogger('info')(`GET /${path} - Status: ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    elasticsearchLogger('error')(`GET /${req.params[0]} failed:`, error.message);
    
    if (error.response) {
      elasticsearchLogger('error')(`Response status: ${error.response.status}`);
      res.status(error.response.status).json({
        error: error.response.data || error.message,
        status: error.response.status
      });
    } else {
      elasticsearchLogger('error')('Service unavailable - no response received');
      res.status(503).json({
        error: 'Elasticsearch service unavailable',
        details: error.message
      });
    }
  }
};

/**
 * Handle Elasticsearch POST requests
 */
const handleElasticsearchPost = (ELASTICSEARCH_URL) => async (req, res) => {
  try {
    const path = req.params[0];
    
    // Use server-side credentials from environment variables
    const ES_USERNAME = process.env.ES_USERNAME || 'elastic';
    const ES_PASSWORD = process.env.ES_PASSWORD || 'changeme';
    const authHeader = `Basic ${Buffer.from(`${ES_USERNAME}:${ES_PASSWORD}`).toString('base64')}`;

    const elasticsearchClient = createAxiosInstance(ELASTICSEARCH_URL, {
      'Authorization': authHeader
    });

    const response = await elasticsearchClient.post(`/${path}`, req.body, {
      params: req.query
    });

    elasticsearchLogger('info')(`POST /${path} - Status: ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    elasticsearchLogger('error')(`POST /${req.params[0]} failed:`, error.message);
    
    if (error.response) {
      elasticsearchLogger('error')(`Response status: ${error.response.status}`);
      res.status(error.response.status).json({
        error: error.response.data || error.message,
        status: error.response.status
      });
    } else if (error.request) {
      elasticsearchLogger('error')('Service unavailable - no response received');
      res.status(503).json({
        error: 'Elasticsearch service unavailable',
        details: error.message
      });
    } else {
      elasticsearchLogger('error')('Internal error:', error.message);
      res.status(500).json({
        error: 'Internal proxy server error',
        details: error.message
      });
    }
  }
};

/**
 * Handle Elasticsearch test endpoint
 */
const handleElasticsearchTest = (ELASTICSEARCH_URL) => async (req, res) => {
  try {
    elasticsearchLogger('info')('Test endpoint requested');
    const ES_USERNAME = process.env.ES_USERNAME || 'elastic';
    const ES_PASSWORD = process.env.ES_PASSWORD || 'changeme';
    const authHeader = `Basic ${Buffer.from(`${ES_USERNAME}:${ES_PASSWORD}`).toString('base64')}`;
    
    const elasticsearchClient = createAxiosInstance(ELASTICSEARCH_URL, {
      'Authorization': authHeader
    });

    const response = await elasticsearchClient.get('/_cluster/health');
    
    elasticsearchLogger('info')('Test endpoint successful');
    res.status(200).json({
      message: 'Test endpoint using server credentials',
      elasticsearch: {
        status: response.status,
        data: response.data,
        url: ELASTICSEARCH_URL,
        credentials: 'Using ES_USERNAME/ES_PASSWORD from environment'
      }
    });
  } catch (error) {
    elasticsearchLogger('error')('Test endpoint failed:', error.message);
    
    res.status(500).json({
      error: 'Test endpoint failed',
      details: error.message,
      elasticsearch: {
        url: ELASTICSEARCH_URL,
        credentials: 'Using ES_USERNAME/ES_PASSWORD from environment'
      },
      troubleshooting: {
        checkEnvVars: 'Verify ES_USERNAME and ES_PASSWORD are set correctly',
        checkConnectivity: 'Verify ELASTICSEARCH_URL is reachable from container',
        authError: error.response?.status === 401 ? 'Invalid credentials' : 'Connection or other error'
      }
    });
  }
};

module.exports = {
  handleElasticsearchGet,
  handleElasticsearchPost,
  handleElasticsearchTest
};