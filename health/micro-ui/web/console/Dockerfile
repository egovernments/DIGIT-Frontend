FROM node:14-alpine3.16 AS build
RUN apk update
RUN apk add --no-cache 'git>2.30.0'
ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=4792"

COPY ${WORK_DIR} .
RUN ls -lah

# Set working directory
WORKDIR /app/web

# Show heap size limit
RUN node -e "console.log('Heap limit (MB):', v8.getHeapStatistics().heap_size_limit / (1024 * 1024))"

# Print a marker log (optional debug message)
RUN node -e "console.log('health-console only')"

# Move into microplan and run install script
WORKDIR /app/web/console
RUN chmod +x ./install-deps.sh
RUN ./install-deps.sh

# Return to main directory for install/build
WORKDIR /app/web

# Increase timeout before install (recommended for GitHub Actions)
RUN yarn config set network-timeout 600000

# Install dependencies
RUN yarn install

# Build the project
RUN yarn build:webpack

# Build proxy server stage
FROM node:14-alpine3.16 AS proxy
WORKDIR /proxy

# Copy the entire context to find proxy files
COPY . /build-context

# Create a script to find and copy proxy files from different possible locations
RUN echo '#!/bin/sh' > /copy-proxy.sh && \
    echo 'if [ -f "/build-context/proxy/package.json" ]; then' >> /copy-proxy.sh && \
    echo '  echo "Found proxy in ./proxy/"' >> /copy-proxy.sh && \
    echo '  cp /build-context/proxy/package.json ./package.json' >> /copy-proxy.sh && \
    echo '  cp /build-context/proxy/server.js ./server.js' >> /copy-proxy.sh && \
    echo 'elif [ -f "/build-context/web/proxy/package.json" ]; then' >> /copy-proxy.sh && \
    echo '  echo "Found proxy in ./web/proxy/"' >> /copy-proxy.sh && \
    echo '  cp /build-context/web/proxy/package.json ./package.json' >> /copy-proxy.sh && \
    echo '  cp /build-context/web/proxy/server.js ./server.js' >> /copy-proxy.sh && \
    echo 'else' >> /copy-proxy.sh && \
    echo '  echo "Proxy files not found - creating placeholder"' >> /copy-proxy.sh && \
    echo '  echo '"'"'{"name":"proxy-placeholder","version":"1.0.0","main":"server.js","dependencies":{}}'"'"' > ./package.json' >> /copy-proxy.sh && \
    echo '  echo "console.log(\"Proxy server not configured\");" > ./server.js' >> /copy-proxy.sh && \
    echo 'fi' >> /copy-proxy.sh && \
    chmod +x /copy-proxy.sh && \
    /copy-proxy.sh

# Install dependencies if package.json exists
RUN if [ -f ./package.json ] && grep -q "express" ./package.json 2>/dev/null; then \
      echo "Installing proxy dependencies..." && \
      npm install --production; \
    else \
      echo "No express dependency found - proxy not fully configured"; \
    fi

# Final stage with nginx and proxy server
FROM nginx:mainline-alpine
#FROM ghcr.io/egovernments/nginx:mainline-alpine

# Install Node.js and supervisor
RUN apk add --no-cache nodejs npm supervisor

ENV WORK_DIR=/var/web/console
ENV PROXY_PORT=3001
ENV ELASTICSEARCH_URL=http://elasticsearch:9200
ENV KIBANA_URL=http://kibana:5601

RUN mkdir -p ${WORK_DIR}
RUN mkdir -p /proxy

# Copy built web app
COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/console/nginx.conf /etc/nginx/conf.d/default.conf

# Copy proxy server
COPY --from=proxy /proxy /proxy

# Create supervisor configuration
RUN echo "[supervisord]" > /etc/supervisord.conf && \
    echo "nodaemon=true" >> /etc/supervisord.conf && \
    echo "user=root" >> /etc/supervisord.conf && \
    echo "" >> /etc/supervisord.conf && \
    echo "[program:nginx]" >> /etc/supervisord.conf && \
    echo "command=/usr/sbin/nginx -g 'daemon off;'" >> /etc/supervisord.conf && \
    echo "autostart=true" >> /etc/supervisord.conf && \
    echo "autorestart=true" >> /etc/supervisord.conf && \
    echo "stdout_logfile=/dev/stdout" >> /etc/supervisord.conf && \
    echo "stdout_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    echo "stderr_logfile=/dev/stderr" >> /etc/supervisord.conf && \
    echo "stderr_logfile_maxbytes=0" >> /etc/supervisord.conf

# Add proxy configuration only if proxy is properly configured
RUN if [ -f /proxy/package.json ] && grep -q "express" /proxy/package.json 2>/dev/null; then \
      echo "" >> /etc/supervisord.conf && \
      echo "[program:proxy]" >> /etc/supervisord.conf && \
      echo "command=node /proxy/server.js" >> /etc/supervisord.conf && \
      echo "directory=/proxy" >> /etc/supervisord.conf && \
      echo "autostart=true" >> /etc/supervisord.conf && \
      echo "autorestart=true" >> /etc/supervisord.conf && \
      echo "stdout_logfile=/dev/stdout" >> /etc/supervisord.conf && \
      echo "stdout_logfile_maxbytes=0" >> /etc/supervisord.conf && \
      echo "stderr_logfile=/dev/stderr" >> /etc/supervisord.conf && \
      echo "stderr_logfile_maxbytes=0" >> /etc/supervisord.conf && \
      echo "Proxy server configured in supervisor"; \
    else \
      echo "Proxy server not available - nginx only mode"; \
    fi

EXPOSE 80 3001

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]