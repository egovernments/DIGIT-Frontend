FROM node:14-alpine3.16 AS build
RUN apk update
RUN apk add --no-cache 'git>2.30.0'
ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=8168"

COPY ${WORK_DIR} .
RUN ls -lah

# Set working directory
WORKDIR /app/web

RUN chmod +x ./install-deps.sh
RUN ./install-deps.sh

# Increase timeout before install (recommended for GitHub Actions)
RUN yarn config set network-timeout 600000

# Install dependencies
RUN yarn install

# Build the project
RUN yarn build:webpack

# Build proxy server stage
FROM node:14-alpine3.16 AS proxy
WORKDIR /proxy
COPY ./docker/package.json ./docker/proxy-server.js ./
RUN npm install --production

# Final stage with nginx and proxy server
FROM nginx:mainline-alpine
#FROM ghcr.io/egovernments/nginx:mainline-alpine

# Install Node.js and supervisor
RUN apk add --no-cache nodejs npm supervisor

ENV WORK_DIR=/var/web/digit-ui
ENV PROXY_PORT=3001
ENV ELASTICSEARCH_URL=http://elasticsearch:9200
ENV KIBANA_URL=http://kibana:5601

RUN mkdir -p ${WORK_DIR}
RUN mkdir -p /proxy

# Copy built web app
COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf

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
    echo "stderr_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    echo "" >> /etc/supervisord.conf && \
    echo "[program:proxy]" >> /etc/supervisord.conf && \
    echo "command=node /proxy/proxy-server.js" >> /etc/supervisord.conf && \
    echo "directory=/proxy" >> /etc/supervisord.conf && \
    echo "autostart=true" >> /etc/supervisord.conf && \
    echo "autorestart=true" >> /etc/supervisord.conf && \
    echo "stdout_logfile=/dev/stdout" >> /etc/supervisord.conf && \
    echo "stdout_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    echo "stderr_logfile=/dev/stderr" >> /etc/supervisord.conf && \
    echo "stderr_logfile_maxbytes=0" >> /etc/supervisord.conf

EXPOSE 80 3001

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]