# Console App Elasticsearch Proxy Setup

The console app now includes an integrated Elasticsearch proxy server that runs alongside the main application in the same Docker container.

## Architecture

```
┌─────────────────────────────────────┐
│      Console App Container          │
│                                     │
│  ┌──────────────┐  ┌─────────────┐ │
│  │   Nginx      │  │ Node Proxy  │ │
│  │   (Port 80)  │  │ (Port 3001) │ │
│  └──────┬───────┘  └──────┬──────┘ │
│         │                  │        │
│   Console App        Elasticsearch │
│   Static Files         Requests    │
└─────────────────────────────────────┘
              │                │
              ▼                ▼
         External          Elasticsearch
         Users              Cluster
```

## Features

- **Integrated Proxy**: Proxy server runs in the same container as the console app
- **Supervisor Management**: Both Nginx and Node.js proxy are managed by Supervisor
- **Secure Communication**: All Elasticsearch requests go through the proxy
- **Easy Configuration**: Configure via environment variables

## Configuration

### Environment Variables

Set these environment variables when running the Docker container:

- `PROXY_PORT`: Port for the proxy server (default: 3001)
- `ELASTICSEARCH_URL`: Elasticsearch endpoint (default: http://elasticsearch:9200)
- `KIBANA_URL`: Kibana endpoint (default: http://kibana:5601)

### Enable Proxy Mode in Your App

To enable proxy mode in the console app's React components:

1. **Set global flag** in your app initialization:
```javascript
window.ELASTIC_USE_PROXY = true;
```

2. **Or use environment variable**:
```bash
REACT_APP_ELASTIC_USE_PROXY=true
```

## Building and Running

### Build the Docker Image

```bash
# From the health/micro-ui/web directory
docker build -f console/Dockerfile -t health-console --build-arg WORK_DIR=./ .
```

### Run with Docker Compose (includes Elasticsearch)

```bash
cd console
docker-compose up
```

### Run Standalone with Custom Elasticsearch

```bash
docker run -d \
  -p 8081:80 \
  -p 3002:3001 \
  -e ELASTICSEARCH_URL=http://your-elasticsearch:9200 \
  -e KIBANA_URL=http://your-kibana:5601 \
  health-console
```

## API Endpoints

The proxy exposes the following endpoints:

- `/api/elasticsearch/*` - Proxies to Elasticsearch
- `/api/kibana/*` - Proxies to Kibana  
- `/api/health` - Health check endpoint

## Using with React Components

Update your components to use the proxy-aware hook:

```javascript
import useSimpleElasticsearchWithProxy from '../hooks/useSimpleElasticsearchWithProxy';

const MyComponent = () => {
  const { data, loading, error } = useSimpleElasticsearchWithProxy({
    indexName: 'my-index',
    query: { match_all: {} },
    sourceFields: ['field1', 'field2'],
    useProxy: true  // Enable proxy mode
  });
  
  // Component logic
};
```

## Monitoring

View logs from both Nginx and the proxy server:

```bash
docker logs <container-id>
```

## Troubleshooting

1. **Proxy not responding**: Check if port 3001 is exposed
2. **Authentication errors**: Verify credentials in Authorization header
3. **Connection issues**: Check ELASTICSEARCH_URL and KIBANA_URL
4. **CORS errors**: The proxy includes CORS headers by default

## Testing the Proxy

Test the proxy health endpoint:

```bash
curl http://localhost:3002/health
```

Test Elasticsearch through proxy:

```bash
curl -H "Authorization: Basic <base64-encoded-credentials>" \
  http://localhost:8081/api/elasticsearch/_cluster/health
```

## Production Deployment

For production:

1. Update environment variables to point to your production Elasticsearch
2. Consider adding rate limiting and additional security headers
3. Configure TLS/SSL for secure communication
4. Monitor proxy performance and logs