# Proxy Server Refactoring

The proxy server has been refactored into smaller, reusable modules for better maintainability and testability.

## File Structure

```
proxy/
├── server.js (original monolithic file)
├── server-refactored.js (new modular entry point)
├── utils/
│   ├── logger.js (logging utilities)
│   ├── axiosClient.js (HTTP client configuration)
│   └── validator.js (environment validation)
├── handlers/
│   ├── elasticsearch.js (Elasticsearch request handlers)
│   ├── kibana.js (Kibana request handlers)
│   └── health.js (Health check handlers)
├── middleware/
│   └── index.js (Express middleware setup)
├── routes/
│   └── index.js (Route configuration)
└── package.json
```

## Modules Overview

### **utils/logger.js**
- Curried logger factory with structured formatting
- Service-specific loggers (server, elasticsearch, kibana, health)
- Timestamp, service context, and log level support

### **utils/axiosClient.js**
- Reusable axios instance creation
- SSL certificate handling for HTTPS
- Common configuration for all HTTP clients

### **utils/validator.js**
- Environment validation and connectivity testing
- Elasticsearch and Kibana health checks
- Detailed error reporting and troubleshooting

### **handlers/elasticsearch.js**
- GET and POST request handlers for Elasticsearch
- Server-side authentication handling
- Test endpoint for debugging

### **handlers/kibana.js**
- POST request handlers for Kibana
- kbn-xsrf header handling
- DNS resolution error handling

### **handlers/health.js**
- Health check endpoint
- System status and configuration info

### **middleware/index.js**
- CORS and body parsing setup
- Request logging middleware
- Error handling middleware

### **routes/index.js**
- Route configuration and setup
- Handler binding with configuration

### **server-refactored.js**
- Main entry point using modular components
- Configuration management
- Graceful shutdown handling

## Benefits

1. **Modularity**: Each module has a single responsibility
2. **Testability**: Easy to unit test individual components
3. **Maintainability**: Changes isolated to specific modules
4. **Reusability**: Utils can be reused across different handlers
5. **Readability**: Clear separation of concerns

## Usage

### Using the refactored server:
```bash
node server-refactored.js
```

### Using original server:
```bash
node server.js
```

Both servers provide identical functionality, but the refactored version is more maintainable and extensible.

## Migration

To use the refactored version:

1. Update package.json scripts:
```json
{
  "scripts": {
    "start": "node server-refactored.js",
    "start:original": "node server.js"
  }
}
```

2. Update Docker CMD if applicable:
```dockerfile
CMD ["node", "server-refactored.js"]
```

The original `server.js` is kept for backward compatibility and can be removed once the refactored version is verified to work correctly.