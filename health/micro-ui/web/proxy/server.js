// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const { serverLogger } = require('./utils/logger');
const { validateEnvironment } = require('./utils/validator');
const { setupMiddleware, setupErrorHandling } = require('./middleware');
const { setupRoutes } = require('./routes');

// Initialize Express app
const app = express();

// Configuration from environment variables
const config = {
  PORT: process.env.PROXY_PORT || 3001,
  ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  KIBANA_URL: process.env.KIBANA_URL || 'http://localhost:5601',
  ES_USERNAME: process.env.ES_USERNAME || 'elastic',
  ES_PASSWORD: process.env.ES_PASSWORD || 'changeme'
};

// Setup middleware
setupMiddleware(app);

// Setup routes
setupRoutes(app, config);

// Setup error handling
setupErrorHandling(app);

// Start server
const server = app.listen(config.PORT, '0.0.0.0', () => {
  serverLogger('info')(`Proxy server started on port ${config.PORT}`);
  serverLogger('info')(`Proxying to Elasticsearch: ${config.ELASTICSEARCH_URL}`);
  serverLogger('info')(`Proxying to Kibana: ${config.KIBANA_URL}`);
  serverLogger('info')(`Health check available at: http://localhost:${config.PORT}/health`);
  
  // Log environment configuration and validate connectivity
  serverLogger('info')('Environment Configuration:');
  serverLogger('info')(`ELASTICSEARCH_URL: ${config.ELASTICSEARCH_URL}`);
  serverLogger('info')(`KIBANA_URL: ${config.KIBANA_URL}`);
  serverLogger('info')(`PROXY_PORT: ${config.PORT}`);
  
  // Validate environment and test connectivity
  validateEnvironment(config);
});

// Graceful shutdown handlers
const gracefulShutdown = (signal) => {
  serverLogger('info')(`${signal} signal received: closing HTTP server`);
  server.close(() => {
    serverLogger('info')('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = { app, server };