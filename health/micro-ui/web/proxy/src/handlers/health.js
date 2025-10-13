/**
 * Health Check Handlers
 * Handles health check and status endpoints
 */

const { healthLogger } = require('../utils/logger');

/**
 * Handle health check requests
 */
const handleHealthCheck = (config) => (req, res) => {
  const { ELASTICSEARCH_URL, KIBANA_URL, PORT } = config;
  
  healthLogger('info')('Health check requested');
  
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: {
      elasticsearchUrl: ELASTICSEARCH_URL,
      kibanaUrl: KIBANA_URL,
      port: PORT
    }
  });
};

module.exports = {
  handleHealthCheck
};