# DIGIT Elasticsearch & Kibana Proxy

A secure proxy server for Elasticsearch and Kibana connections within DIGIT UI applications. This proxy handles authentication server-side and provides CORS protection for web applications.

## Features

- 🔒 **Server-side Authentication** - Handles Elasticsearch/Kibana credentials securely
- 🛡️ **CORS Security** - Restrictive cross-origin controls with server and context path validation
- 📦 **Docker Ready** - Optimized for containerized deployments
- 🔧 **Environment Flexible** - Works in both development and production environments
- 🚀 **Auto-fallback** - Uses modular components in dev, inline implementation in Docker
- 📊 **Health Checks** - Built-in health monitoring and connectivity testing
- 📝 **Structured Logging** - Service-specific logging with timestamps

## Project Structure

```
proxy/
├── src/
│   ├── server.js                 # Main server with smart fallback
│   ├── utils/
│   │   ├── logger.js            # Logging utilities
│   │   ├── axiosClient.js       # HTTP client configuration
│   │   └── validator.js         # Environment validation
│   ├── handlers/
│   │   ├── elasticsearch.js     # Elasticsearch request handlers
│   │   ├── kibana.js           # Kibana request handlers
│   │   └── health.js           # Health check handlers
│   ├── middleware/
│   │   └── index.js            # Express middleware setup with CORS
│   └── routes/
│       └── index.js            # Route configuration
├── Dockerfile                   # Container build configuration
├── docker-compose.yml          # Local development setup
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm start
# or with auto-reload
npm run dev

# Server runs on http://localhost:3001
```

### Docker

```bash
# Build container
docker build -t digit-proxy .

# Run container
docker run -p 3001:3001 \
  -e ELASTICSEARCH_URL=https://your-es-cluster:9200 \
  -e KIBANA_URL=https://your-kibana:5601 \
  -e ES_USERNAME=elastic \
  -e ES_PASSWORD=your-password \
  digit-proxy
```

### Docker Compose

```bash
# Start with docker-compose
docker-compose up -d
```

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PROXY_PORT` | Port for proxy server | `3001` | No |
| `ELASTICSEARCH_URL` | Elasticsearch cluster URL | `http://localhost:9200` | Yes |
| `KIBANA_URL` | Kibana instance URL | `http://localhost:5601` | Yes |
| `ES_USERNAME` | Elasticsearch username | `elastic` | Yes |
| `ES_PASSWORD` | Elasticsearch password | `changeme` | Yes |
| `NODE_ENV` | Environment mode | `development` | No |

### CORS Security Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `ALLOWED_SERVER_URL` | Server hostname and port allowed to access proxy | `https://yourdomain.com:8080` | Optional |
| `ALLOWED_CONTEXT_PATHS` | Comma-separated app context paths | `console,workbench,admin` | Optional |

#### CORS Examples

**Allow specific server and contexts:**
```bash
ALLOWED_SERVER_URL=https://yourdomain.com:8080
ALLOWED_CONTEXT_PATHS=console,workbench
```

**Allow all paths on specific server:**
```bash
ALLOWED_SERVER_URL=https://yourdomain.com:8080
# ALLOWED_CONTEXT_PATHS not set = allow all paths
```

**Development (localhost always allowed):**
```bash
# No CORS config needed for localhost/127.0.0.1
```

## API Endpoints

### Elasticsearch Proxy

- **GET/POST** `/elasticsearch/*` - Proxy requests to Elasticsearch
- **GET** `/test/elasticsearch/health` - Test Elasticsearch connectivity

### Kibana Proxy

- **POST** `/kibana/*` - Proxy requests to Kibana

### Health & Monitoring

- **GET** `/health` - Server health check and configuration info

### Example Usage

```javascript
// From your React app
const response = await fetch('/console/proxy/elasticsearch/_search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: { match_all: {} }
  })
});
```

## Integration with DIGIT Applications

### Nginx Configuration

Update your nginx configuration to route proxy requests:

```nginx
location /console/proxy/elasticsearch/ {
    proxy_pass http://127.0.0.1:3001/elasticsearch/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location /console/proxy/kibana/ {
    proxy_pass http://127.0.0.1:3001/kibana/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### React Hook Integration

```javascript
import { useSimpleElasticsearchWithProxy } from './hooks/useElasticsearch';

const MyComponent = () => {
  const { data, loading, error } = useSimpleElasticsearchWithProxy({
    index: 'your-index',
    query: { match_all: {} }
  });
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
```

## Kubernetes Deployment

### Environment Variables in Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: proxy-server
spec:
  template:
    spec:
      containers:
      - name: proxy
        image: digit-proxy:latest
        env:
        - name: ELASTICSEARCH_URL
          value: "https://elasticsearch-master.es-cluster:9200"
        - name: KIBANA_URL
          value: "https://kibana.es-cluster:5601"
        - name: ES_USERNAME
          valueFrom:
            secretKeyRef:
              name: elasticsearch-credentials
              key: username
        - name: ES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: elasticsearch-credentials
              key: password
        - name: ALLOWED_SERVER_URL
          value: "https://yourdomain.com:8080"
        - name: ALLOWED_CONTEXT_PATHS
          value: "console,workbench"
        ports:
        - containerPort: 3001
```

## Development

### Architecture

The server uses a smart fallback architecture:

- **Development Mode**: Loads modular components from separate files
- **Docker Mode**: Falls back to inline implementation when modules aren't available
- **Single Codebase**: Same `server.js` works in both environments

### Adding New Features

1. **Add to modular components** in `src/handlers/`, `src/utils/`, etc.
2. **Update inline fallback** in `src/server.js`
3. **Test in both environments**

### Logging

The server provides structured logging with service-specific loggers:

```javascript
serverLogger('info')('Server started');
elasticsearchLogger('error')('Connection failed');
kibanaLogger('warn')('Slow response');
healthLogger('info')('Health check requested');
```

## Security Considerations

1. **Server-side Authentication**: Elasticsearch credentials never exposed to browser
2. **CORS Restrictions**: Only authorized origins and contexts allowed
3. **Environment Variables**: Secrets managed via container orchestration
4. **SSL/TLS**: Supports HTTPS connections with certificate handling
5. **Non-root User**: Docker container runs as non-privileged user

## Troubleshooting

### Common Issues

**Connection Errors:**
- Verify `ELASTICSEARCH_URL` and `KIBANA_URL` are reachable
- Check credentials with `/test/elasticsearch/health` endpoint
- Ensure proper network connectivity in containerized environments

**CORS Errors:**
- Check browser console for blocked origins
- Verify `ALLOWED_SERVER_URL` matches your application domain
- Ensure context paths in `ALLOWED_CONTEXT_PATHS` match your app routes

**Authentication Issues:**
- Verify `ES_USERNAME` and `ES_PASSWORD` environment variables
- Test credentials directly against Elasticsearch cluster
- Check if Elasticsearch requires specific authentication method

### Debug Mode

Enable detailed logging:

```bash
NODE_ENV=development npm start
```

### Health Checks

Monitor server health:

```bash
curl http://localhost:3001/health
curl http://localhost:3001/test/elasticsearch/health
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**DIGIT Team** - Digital Infrastructure for Governance, Impact & Transformation