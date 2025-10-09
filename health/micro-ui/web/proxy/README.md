# DIGIT Elasticsearch Proxy

A secure proxy server for Elasticsearch and Kibana requests in DIGIT UI applications.

## Overview

This proxy server acts as an intermediary between your React applications and Elasticsearch/Kibana, solving CORS issues and providing a centralized point for authentication and request handling.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │────│  Proxy Server   │────│  Elasticsearch  │
│  (Browser)      │    │   (Node.js)     │    │    Cluster      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Features

- **CORS Handling**: Eliminates browser CORS restrictions
- **Authentication Forwarding**: Passes through authentication headers
- **Request Logging**: Comprehensive logging for debugging
- **Health Monitoring**: Built-in health check endpoint
- **Error Handling**: Robust error handling and reporting
- **Security**: Input validation and sanitization

## Quick Start

### 1. Standalone Proxy Server

```bash
# Install dependencies
npm install

# Set environment variables
export ELASTICSEARCH_URL=http://your-elasticsearch:9200
export KIBANA_URL=http://your-kibana:5601
export PROXY_PORT=3001

# Start the server
npm start
```

### 2. Using Docker

```bash
# Build the image
docker build -t digit-elasticsearch-proxy .

# Run the container
docker run -d \
  -p 3001:3001 \
  -e ELASTICSEARCH_URL=http://elasticsearch:9200 \
  -e KIBANA_URL=http://kibana:5601 \
  digit-elasticsearch-proxy
```

### 3. Using Docker Compose

```bash
# Start all services (Elasticsearch, Kibana, and Proxy)
docker-compose up -d

# View logs
docker-compose logs -f elasticsearch-proxy
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PROXY_PORT` | `3001` | Port for the proxy server |
| `ELASTICSEARCH_URL` | `http://localhost:9200` | Elasticsearch endpoint |
| `KIBANA_URL` | `http://localhost:5601` | Kibana endpoint |

### Client Configuration

Update your React applications to use the proxy:

```javascript
// Enable proxy mode globally
window.ELASTIC_USE_PROXY = true;

// Or via environment variable
REACT_APP_ELASTIC_USE_PROXY=true
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /elasticsearch/*` | Proxy to Elasticsearch |
| `GET /elasticsearch/*` | Proxy to Elasticsearch |
| `POST /kibana/*` | Proxy to Kibana |
| `GET /health` | Health check |

### Example Usage

```bash
# Health check
curl http://localhost:3001/health

# Elasticsearch query through proxy
curl -X POST http://localhost:3001/elasticsearch/your-index/_search \
  -H "Authorization: Basic <base64-credentials>" \
  -H "Content-Type: application/json" \
  -d '{"query": {"match_all": {}}}'
```

## Integration with DIGIT Apps

### 1. Update Nginx Configuration

Include the proxy locations in your app's nginx config:

```nginx
# Include proxy locations
include /path/to/proxy/nginx.conf;
```

### 2. Update Dockerfile

For integrated deployment, update your app's Dockerfile:

```dockerfile
# Build proxy server stage
FROM node:14-alpine3.16 AS proxy
WORKDIR /proxy
COPY ./proxy/package.json ./proxy/server.js ./
RUN npm install --production

# Final stage
FROM nginx:mainline-alpine
# ... your app setup ...

# Copy proxy server
COPY --from=proxy /proxy /proxy

# Install Node.js and supervisor
RUN apk add --no-cache nodejs npm supervisor

# Configure supervisor to run both nginx and proxy
# ... supervisor configuration ...
```

## Development

### Running in Development Mode

```bash
# Install dependencies including dev dependencies
npm install

# Start with nodemon for auto-restart
npm run dev
```

### Testing

```bash
# Basic health check test
npm test

# Manual testing
curl http://localhost:3001/health
```

## Production Deployment

### Security Considerations

1. **Authentication**: Ensure proper authentication headers are passed
2. **Network Security**: Use private networks for Elasticsearch communication
3. **Rate Limiting**: Consider adding rate limiting for production use
4. **Monitoring**: Set up proper logging and monitoring
5. **SSL/TLS**: Use HTTPS in production environments

### Performance Tuning

- Adjust Node.js memory limits if needed
- Configure appropriate timeouts for your use case
- Monitor proxy performance and scale horizontally if needed

### Monitoring

The proxy provides detailed logging and a health endpoint:

```bash
# Check health
curl http://localhost:3001/health

# View logs
docker logs <container-id>
```

## Troubleshooting

### Common Issues

1. **Connection Refused**: Check if Elasticsearch/Kibana URLs are correct
2. **Authentication Errors**: Verify authorization headers are properly formatted
3. **Timeout Errors**: Increase timeout values in the configuration
4. **CORS Issues**: Ensure proxy is properly configured in your app

### Debug Logging

Enable debug logging by setting:

```bash
export DEBUG=proxy:*
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details