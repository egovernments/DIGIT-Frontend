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
RUN node -e "console.log('core only')"

# Move into microplan and run install script
WORKDIR /app/web/core
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

FROM nginx:mainline-alpine
#FROM ghcr.io/egovernments/nginx:mainline-alpine
ENV WORK_DIR=/var/web/core-ui

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/core/nginx.conf /etc/nginx/conf.d/default.conf
