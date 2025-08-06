# Stage 1: Build the project using Node 20
FROM node:20-alpine3.19 AS build

# Install git (optional: use exact version if needed)
RUN apk update && apk add --no-cache git

# Define working directory from build args
ARG WORK_DIR
WORKDIR /app

# Set memory options for Node.js
ENV NODE_OPTIONS="--max-old-space-size=4792"
ENV YARN_DEBUG=true

# Copy files from host into image
COPY ${WORK_DIR} .
RUN ls -lah

# Set correct working directory
WORKDIR /app/web

# Show heap size limit
RUN node -e "console.log('Heap limit (MB):', v8.getHeapStatistics().heap_size_limit / (1024 * 1024))"

# Optional health check log
RUN node -e "console.log('health-workbench only')"

# Move into microplan and run install-deps script
WORKDIR /app/web/workbench
RUN chmod +x ./install-deps.sh
RUN ./install-deps.sh

# Back to root for install/build
WORKDIR /app/web

# Set timeout (optional)
RUN yarn config set network-timeout 600000

# Install dependencies
RUN yarn install

# Build the project
RUN yarn build:webpack

# Stage 2: Nginx image to serve built frontend
FROM nginx:mainline-alpine

# Set env
ENV WORK_DIR=/var/web/workbench-ui

# Create target dir
RUN mkdir -p ${WORK_DIR}

# Copy build output and config
COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/workbench/nginx.conf /etc/nginx/conf.d/default.conf
