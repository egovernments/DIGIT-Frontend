const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PROXY_PORT || 3001;

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
    }
  });
};

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.post('/elasticsearch/*', async (req, res) => {
  try {
    const path = req.params[0];
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const elasticsearchClient = createAxiosInstance(ELASTICSEARCH_URL, {
      'Authorization': authHeader
    });

    const response = await elasticsearchClient.post(`/${path}`, req.body, {
      params: req.query
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Elasticsearch proxy error:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data || error.message,
        status: error.response.status
      });
    } else if (error.request) {
      res.status(503).json({
        error: 'Elasticsearch service unavailable',
        details: error.message
      });
    } else {
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
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const elasticsearchClient = createAxiosInstance(ELASTICSEARCH_URL, {
      'Authorization': authHeader
    });

    const response = await elasticsearchClient.get(`/${path}`, {
      params: req.query
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Elasticsearch proxy error:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data || error.message,
        status: error.response.status
      });
    } else {
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
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const kibanaClient = createAxiosInstance(KIBANA_URL, {
      'Authorization': authHeader,
      'kbn-xsrf': 'true'
    });

    const response = await kibanaClient.post(`/${path}`, req.body, {
      params: req.query
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Kibana proxy error:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data || error.message,
        status: error.response.status
      });
    } else {
      res.status(503).json({
        error: 'Kibana service unavailable',
        details: error.message
      });
    }
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Elasticsearch proxy server running on port ${PORT}`);
  console.log(`Proxying to Elasticsearch: ${ELASTICSEARCH_URL}`);
  console.log(`Proxying to Kibana: ${KIBANA_URL}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});