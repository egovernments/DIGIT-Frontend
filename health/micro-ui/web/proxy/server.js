// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PROXY_PORT || 3001;

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

// Service-specific loggers
const serverLogger = createLogger('server');
const elasticsearchLogger = createLogger('elasticsearch');
const kibanaLogger = createLogger('kibana');
const healthLogger = createLogger('health');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
const KIBANA_URL = process.env.KIBANA_URL || 'http://localhost:5601';

const createAxiosInstance = (baseURL, headers = {}) => {
  return axios.create({
    baseURL,
    timeout: 60000,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    // Handle SSL certificate issues in development/internal networks
    httpsAgent: baseURL.startsWith('https') ? new (require('https').Agent)({
      rejectUnauthorized: false
    }) : undefined
  });
};

// Validate and log environment configuration
const validateEnvironment = () => {
  serverLogger('info')('Environment Configuration:');
  serverLogger('info')(`ELASTICSEARCH_URL: ${ELASTICSEARCH_URL}`);
  serverLogger('info')(`KIBANA_URL: ${KIBANA_URL}`);
  serverLogger('info')(`PROXY_PORT: ${PORT}`);
  
  // Get credentials from environment or use defaults
  const ES_USERNAME = process.env.ES_USERNAME || 'elastic';
  const ES_PASSWORD = process.env.ES_PASSWORD || 'changeme';
  
  // Test connectivity on startup
  setTimeout(async () => {
    try {
      const esClient = createAxiosInstance(ELASTICSEARCH_URL, {
        'Authorization': `Basic ${Buffer.from(`${ES_USERNAME}:${ES_PASSWORD}`).toString('base64')}`
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
    
    try {
      const kibanaClient = createAxiosInstance(KIBANA_URL, {
        'Authorization': `Basic ${Buffer.from(`${ES_USERNAME}:${ES_PASSWORD}`).toString('base64')}`
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
        // Just log warning, don't throw - Kibana might still work for proxy requests
        kibanaLogger('warn')('Health check did not find a working endpoint');
        kibanaLogger('info')('Proxy may still work for actual Kibana API requests');
      }
    } catch (error) {
      kibanaLogger('error')('Connectivity test failed:', error.message);
      kibanaLogger('error')('Check KIBANA_URL environment variable and network connectivity');
      kibanaLogger('info')('Note: Kibana proxy may still work even if health check fails');
    }
  }, 2000);
};

app.use((req, res, next) => {
  serverLogger('info')(`${req.method} ${req.url}`);
  next();
});

app.post('/elasticsearch/*', async (req, res) => {
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
});

app.get('/elasticsearch/*', async (req, res) => {
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
});

app.post('/kibana/*', async (req, res) => {
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
});

app.get('/health', (req, res) => {
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
});

// Test endpoint using server-side credentials (for debugging)
app.get('/test/elasticsearch/health', async (req, res) => {
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
});

app.use((err, req, res, next) => {
  serverLogger('error')('Unhandled error:', err.message);
  serverLogger('error')('Stack trace:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  serverLogger('info')(`Proxy server started on port ${PORT}`);
  serverLogger('info')(`Proxying to Elasticsearch: ${ELASTICSEARCH_URL}`);
  serverLogger('info')(`Proxying to Kibana: ${KIBANA_URL}`);
  serverLogger('info')(`Health check available at: http://localhost:${PORT}/health`);
  
  // Validate environment configuration
  validateEnvironment();
});

process.on('SIGTERM', () => {
  serverLogger('info')('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    serverLogger('info')('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  serverLogger('info')('SIGINT signal received: closing HTTP server');
  server.close(() => {
    serverLogger('info')('HTTP server closed');
    process.exit(0);
  });
});