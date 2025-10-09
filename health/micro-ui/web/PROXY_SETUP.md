# DIGIT Elasticsearch Proxy Setup

This document describes the centralized Elasticsearch proxy setup for DIGIT UI applications.

## 📁 New Directory Structure

```
web/
├── proxy/                          # 🆕 Centralized proxy server
│   ├── server.js                   # Proxy server implementation
│   ├── package.json                # Proxy dependencies
│   ├── Dockerfile                  # Standalone proxy container
│   ├── docker-compose.yml          # Complete stack with ES & Kibana
│   ├── nginx.conf                  # Nginx proxy configurations
│   ├── build.sh                    # Build script for proxy
│   └── README.md                   # Detailed proxy documentation
├── docker/
│   ├── Dockerfile                  # 🔄 Updated to use web/proxy
│   ├── nginx.conf                  # 🔄 Updated with proxy locations
│   └── docker-compose.yml          # 🔄 Updated to use centralized proxy
├── console/
│   ├── Dockerfile                  # 🔄 Updated to use web/proxy
│   ├── nginx.conf                  # 🔄 Includes proxy locations
│   └── install-deps.sh             # 🔄 No longer copies proxy files
└── micro-ui-internals/
    └── packages/modules/workbench-hcm/src/
        ├── hooks/
        │   ├── useSimpleElasticsearch.js           # Original hook
        │   └── useSimpleElasticsearchWithProxy.js  # 🆕 Proxy-aware hook
        ├── utils/
        │   └── elasticProxyConfig.js               # 🆕 Proxy configuration utility
        └── components/
            └── DeliveryComponent.js                 # 🔄 Updated to use proxy hook
```

## 🔥 Key Changes

### ✅ Centralized Proxy Server
- All proxy-related files moved to `web/proxy/`
- Single source of truth for proxy configuration
- Standalone Docker container available
- Comprehensive documentation and build scripts

### ✅ Updated Dockerfiles
- Both `docker/Dockerfile` and `console/Dockerfile` now reference `web/proxy/`
- Simplified build process
- No more scattered proxy files

### ✅ Enhanced React Integration
- New `useSimpleElasticsearchWithProxy` hook with auto-detection
- Utility functions for proxy configuration
- Backwards compatible with existing components

### ✅ Improved Configuration
- Environment-based proxy detection
- Flexible deployment options
- Health check endpoints

## 🚀 Usage Options

### 1. Standalone Proxy Server

```bash
cd web/proxy
./build.sh
docker-compose up -d
```

### 2. Integrated with Main App

```bash
cd web
docker build -f docker/Dockerfile -t health-ui --build-arg WORK_DIR=./ .
```

### 3. Integrated with Console App

```bash
cd web
docker build -f console/Dockerfile -t health-console --build-arg WORK_DIR=./ .
```

## ⚙️ Configuration

### Environment Variables
- `ELASTICSEARCH_URL`: Elasticsearch endpoint
- `KIBANA_URL`: Kibana endpoint  
- `PROXY_PORT`: Proxy server port (default: 3001)

### Enable Proxy in React Components

```javascript
// Method 1: Global flag
window.ELASTIC_USE_PROXY = true;

// Method 2: Environment variable
REACT_APP_ELASTIC_USE_PROXY=true

// Method 3: Component prop
<DeliveryComponent useProxy={true} />
```

## 🔍 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/elasticsearch/*` | Elasticsearch proxy |
| `/api/kibana/*` | Kibana proxy |
| `/api/health` | Health check |

## 🧪 Testing

### Test Standalone Proxy
```bash
cd web/proxy
docker-compose up -d
curl http://localhost:3001/health
```

### Test Integrated Apps
```bash
# Test main app
cd web/docker
docker-compose up -d
curl http://localhost:8080/api/health

# Test console app  
cd web/console
docker-compose up -d
curl http://localhost:8081/api/health
```

## 🛠️ Development

### Adding New Proxy Features
1. Update `web/proxy/server.js`
2. Update `web/proxy/package.json` if new dependencies needed
3. Test with `web/proxy/docker-compose.yml`
4. Update both app Dockerfiles if integration changes needed

### Updating React Components
1. Import `useSimpleElasticsearchWithProxy` instead of original hook
2. Set proxy configuration as needed
3. Test with both proxy and direct connection modes

## 🔧 Migration Guide

### From Old Setup
1. ✅ Proxy files moved to `web/proxy/`
2. ✅ Dockerfiles updated to use centralized proxy
3. ✅ Components can use new proxy-aware hook
4. ✅ Old proxy files cleaned up

### Component Updates
```diff
- import useSimpleElasticsearch from '../hooks/useSimpleElasticsearch';
+ import useSimpleElasticsearchWithProxy from '../hooks/useSimpleElasticsearchWithProxy';

- const { data, loading, error } = useSimpleElasticsearch({
+ const { data, loading, error, usingProxy } = useSimpleElasticsearchWithProxy({
    indexName: 'my-index',
    query: { match_all: {} },
    sourceFields: ['field1', 'field2'],
+   useProxy: window.ELASTIC_USE_PROXY || false
  });
```

## 📦 Deployment Options

### Option 1: Microservices Architecture
Deploy proxy as separate service and configure apps to use it

### Option 2: Integrated Deployment  
Use updated Dockerfiles that include proxy in same container

### Option 3: Hybrid Approach
Mix of standalone proxy for some services and integrated for others

## 🚨 Breaking Changes

- None! All changes are backwards compatible
- Existing hooks and components continue to work
- New proxy features are opt-in

## 📚 Additional Resources

- [Proxy Server Documentation](./proxy/README.md)
- [Docker Setup Guide](./docker/ELASTIC_PROXY_README.md)
- [Console App Setup Guide](./console/PROXY_README.md)

## 🆘 Troubleshooting

### Common Issues
1. **Proxy not found**: Check that `web/proxy/` files exist in build context
2. **Connection refused**: Verify Elasticsearch/Kibana URLs are correct
3. **Authentication errors**: Ensure auth headers are properly forwarded
4. **Build failures**: Check Docker build logs for missing files

### Debug Commands
```bash
# Check proxy health
curl http://localhost:3001/health

# View proxy logs
docker logs <proxy-container-id>

# Test Elasticsearch through proxy
curl -H "Authorization: Basic <credentials>" \
  http://localhost:3001/elasticsearch/_cluster/health
```