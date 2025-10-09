# Elasticsearch Proxy Server Setup

This setup provides a proxy server that runs alongside your React application in the same Docker container, handling Elasticsearch and Kibana requests securely.

## Architecture

```
┌─────────────────────────────────────┐
│         Docker Container            │
│                                     │
│  ┌──────────────┐  ┌─────────────┐ │
│  │   Nginx      │  │ Node Proxy  │ │
│  │   (Port 80)  │  │ (Port 3001) │ │
│  └──────┬───────┘  └──────┬──────┘ │
│         │                  │        │
│   React App          Elasticsearch │
│   Static Files         Requests    │
└─────────────────────────────────────┘
              │                │
              ▼                ▼
         External          Elasticsearch
         Users              Cluster
```

## Features

- **Single Container**: Both the React app and proxy server run in the same container
- **Supervisor Process Manager**: Manages both Nginx and Node.js proxy processes
- **Secure**: Handles authentication and forwards requests to Elasticsearch/Kibana
- **CORS Support**: Built-in CORS handling for cross-origin requests
- **Error Handling**: Comprehensive error handling and logging

## Configuration

### Environment Variables

- `PROXY_PORT`: Port for the proxy server (default: 3001)
- `ELASTICSEARCH_URL`: Elasticsearch endpoint (default: http://elasticsearch:9200)
- `KIBANA_URL`: Kibana endpoint (default: http://kibana:5601)

### Using the Proxy in Your React App

1. **With the new proxy-aware hook**:
```javascript
import useSimpleElasticsearchWithProxy from './hooks/useSimpleElasticsearchWithProxy';

const MyComponent = () => {
  const { data, loading, error } = useSimpleElasticsearchWithProxy({
    indexName: 'my-index',
    query: { match_all: {} },
    sourceFields: ['field1', 'field2'],
    useProxy: true  // Enable proxy mode
  });
  
  // ... rest of your component
};
```

2. **Enable proxy mode globally**:
```javascript
// In your app configuration or environment variables
window.ELASTIC_USE_PROXY = true;
// or
REACT_APP_ELASTIC_USE_PROXY=true
```

## Proxy Endpoints

The proxy server exposes the following endpoints:

- `/api/elasticsearch/*` - Forwards to Elasticsearch
- `/api/kibana/*` - Forwards to Kibana
- `/health` - Health check endpoint

## Building and Running

### Local Development

```bash
# Build the Docker image
docker build -f docker/Dockerfile -t health-ui --build-arg WORK_DIR=./ .

# Run with docker-compose (includes Elasticsearch and Kibana)
cd docker
docker-compose up
```

### Production Deployment

```bash
# Build production image
docker build -f docker/Dockerfile -t health-ui:prod --build-arg WORK_DIR=./ .

# Run with environment variables
docker run -d \
  -p 80:80 \
  -p 3001:3001 \
  -e ELASTICSEARCH_URL=http://your-elasticsearch:9200 \
  -e KIBANA_URL=http://your-kibana:5601 \
  health-ui:prod
```

## Security Considerations

1. **Authentication**: The proxy forwards authentication headers but doesn't store credentials
2. **Network Isolation**: In production, ensure proper network segmentation
3. **TLS/SSL**: Configure HTTPS for production deployments
4. **Rate Limiting**: Consider adding rate limiting for production use

## Monitoring

The supervisor logs both Nginx and proxy server outputs to stdout/stderr, making them available through Docker logs:

```bash
docker logs <container-id>
```

## Troubleshooting

1. **Proxy not responding**: Check if port 3001 is exposed and not blocked
2. **Authentication errors**: Verify credentials are properly passed in headers
3. **Connection refused**: Ensure Elasticsearch/Kibana URLs are correct
4. **CORS issues**: The proxy includes CORS headers by default

## Migration from Direct Connection

To migrate existing code:

1. Update your hooks to use `useSimpleElasticsearchWithProxy`
2. Set `useProxy: true` in your configuration
3. Deploy the new Docker image with proxy support
4. Update environment variables for Elasticsearch/Kibana endpoints