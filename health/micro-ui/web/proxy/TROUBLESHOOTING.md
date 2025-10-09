# Proxy Server Troubleshooting Guide

## Common Issues and Solutions

### 1. `ENOTFOUND kibana` Error

**Error Message:**
```
Kibana proxy error: getaddrinfo ENOTFOUND kibana
```

**Root Cause:** The proxy server cannot resolve the hostname `kibana`.

#### **Solutions:**

#### Option A: Update Environment Variables
```bash
# Instead of using hostname, use IP address or fully qualified domain name
export KIBANA_URL=http://192.168.1.100:5601
# or
export KIBANA_URL=http://kibana.example.com:5601
```

#### Option B: Add to /etc/hosts (if using Docker)
```bash
# Add to the container's /etc/hosts file
echo "192.168.1.100 kibana" >> /etc/hosts
```

#### Option C: Use Docker Network (Recommended)
```yaml
# In docker-compose.yml, ensure all services are on same network
version: '3.8'
services:
  console-app:
    networks:
      - elastic-network
  kibana:
    networks:
      - elastic-network
  elasticsearch:
    networks:
      - elastic-network
networks:
  elastic-network:
    driver: bridge
```

#### Option D: Use External Service URLs
```bash
# If Kibana is running externally
export KIBANA_URL=http://external-kibana-server.com:5601
export ELASTICSEARCH_URL=http://external-es-server.com:9200
```

### 2. `ECONNREFUSED` Error

**Error Message:**
```
Kibana proxy error: connect ECONNREFUSED 127.0.0.1:5601
```

**Solutions:**
1. Check if Kibana service is running
2. Verify the port number (default: 5601)
3. Check firewall settings

### 3. Authentication Errors

**Error Message:**
```
Authentication failed: 401
```

**Solutions:**
1. Verify credentials are correctly set
2. Check if Elasticsearch security is enabled
3. Ensure proper Authorization headers

## Debugging Steps

### 1. Check Environment Variables
```bash
# In the container, check what URLs are being used
echo $ELASTICSEARCH_URL
echo $KIBANA_URL
```

### 2. Test Network Connectivity
```bash
# From inside the proxy container
ping kibana
curl http://kibana:5601/api/status
```

### 3. Test Direct Connection
```bash
# Test if Elasticsearch is reachable
curl -u elastic:password http://elasticsearch:9200/_cluster/health

# Test if Kibana is reachable
curl http://kibana:5601/api/status
```

### 4. Check DNS Resolution
```bash
# Check if hostname resolves
nslookup kibana
dig kibana
```

### 5. Check Container Logs
```bash
# Check proxy logs
docker logs <proxy-container-id>

# Check Kibana logs
docker logs <kibana-container-id>
```

## Quick Fixes

### For Development (Local Docker)
```bash
# Use localhost URLs when running locally
export ELASTICSEARCH_URL=http://localhost:9200
export KIBANA_URL=http://localhost:5601
```

### For Docker Compose
```yaml
environment:
  - ELASTICSEARCH_URL=http://elasticsearch:9200
  - KIBANA_URL=http://kibana:5601
```

### For Kubernetes
```yaml
env:
  - name: ELASTICSEARCH_URL
    value: "http://elasticsearch-service:9200"
  - name: KIBANA_URL
    value: "http://kibana-service:5601"
```

### For External Services
```bash
# Use actual IP addresses or FQDNs
export ELASTICSEARCH_URL=http://10.0.1.50:9200
export KIBANA_URL=http://10.0.1.51:5601
```

## Enhanced Logging

The proxy server now provides detailed error information:

```json
{
  "error": "Kibana service unavailable",
  "details": "getaddrinfo ENOTFOUND kibana",
  "code": "ENOTFOUND",
  "kibanaUrl": "http://kibana:5601",
  "suggestion": "Check KIBANA_URL environment variable and network connectivity"
}
```

## Health Check

Use the health endpoint to verify connectivity:

```bash
curl http://localhost:3001/health
```

This will test connections to both Elasticsearch and Kibana and report any issues.

## Common Docker Networking Issues

1. **Services not in same network**: Ensure all containers are in the same Docker network
2. **Port not exposed**: Make sure the target ports are exposed in Dockerfile
3. **Service discovery**: Use service names as hostnames in Docker Compose
4. **Network policies**: Check if any network policies are blocking connections

## Production Recommendations

1. Use fully qualified domain names (FQDNs)
2. Implement proper service discovery
3. Use load balancers for high availability
4. Monitor network connectivity
5. Implement retry logic with exponential backoff