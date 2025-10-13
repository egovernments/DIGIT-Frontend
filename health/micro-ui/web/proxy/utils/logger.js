/**
 * Curried Logger Utility
 * Provides structured logging with service context, log levels, and timestamps
 */

// Curried logger factory
const createLogger = (service) => (level) => (message, ...args) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [PROXY-SERVER] [${service.toUpperCase()}] [${level.toUpperCase()}]`;
  
  switch (level.toLowerCase()) {
    case 'error':
      console.error(prefix, message, ...args);
      break;
    case 'warn':
      console.warn(prefix, message, ...args);
      break;
    case 'info':
      console.info(prefix, message, ...args);
      break;
    case 'debug':
      console.log(prefix, message, ...args);
      break;
    default:
      console.log(prefix, message, ...args);
  }
};

// Pre-configured service loggers
const serverLogger = createLogger('server');
const elasticsearchLogger = createLogger('elasticsearch');
const kibanaLogger = createLogger('kibana');
const healthLogger = createLogger('health');

module.exports = {
  createLogger,
  serverLogger,
  elasticsearchLogger,
  kibanaLogger,
  healthLogger
};