/**
 * Route Configuration
 * Sets up all API routes for the proxy server
 */

const { handleElasticsearchGet, handleElasticsearchPost, handleElasticsearchTest } = require('../handlers/elasticsearch');
const { handleKibanaPost } = require('../handlers/kibana');
const { handleHealthCheck } = require('../handlers/health');

/**
 * Setup all routes
 */
const setupRoutes = (app, config) => {
  const { ELASTICSEARCH_URL, KIBANA_URL, PORT } = config;

  // Elasticsearch routes
  app.get('/elasticsearch/*', handleElasticsearchGet(ELASTICSEARCH_URL));
  app.post('/elasticsearch/*', handleElasticsearchPost(ELASTICSEARCH_URL));

  // Kibana routes
  app.post('/kibana/*', handleKibanaPost(KIBANA_URL));

  // Health and test routes
  app.get('/health', handleHealthCheck({ ELASTICSEARCH_URL, KIBANA_URL, PORT }));
  app.get('/test/elasticsearch/health', handleElasticsearchTest(ELASTICSEARCH_URL));
};

module.exports = {
  setupRoutes
};