# ─── BUILD STAGE ────────────────────────────────────────────────────────────
FROM node:14-alpine AS build

# Install git and essential build tools
RUN apk update && apk upgrade && \
    apk add --no-cache git python3 make g++

# This ARG will be set by the --build-arg flag in your docker build command
ARG WORK_DIR
# Set the working directory for the web app inside the container
WORKDIR /app/web

ENV NODE_OPTIONS="--max-old-space-size=4792"

# --- Docker Caching Optimization ---
# 1. Copy only the dependency definition files from your host machine
#    (e.g., from ./micro-ui/package.json) into the container's WORKDIR (/app/web).
COPY ${WORK_DIR}/package.json ${WORK_DIR}/yarn.lock ./

# 2. Install dependencies. This layer is now cached.
RUN yarn install --ignore-engines --network-timeout 600000

# 3. Now copy the rest of the application source code
#    FIXED: Changed WORK__DIR to WORK_DIR
COPY ${WORK_DIR} .
# ------------------------------------

RUN ls -lah

# Run your build scripts
RUN node -e "const v8 = require('v8'); console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024));" && \
    node -e "console.log('core only');" && \
    cd core && \
    chmod +x ./install-deps.sh && \
    ./install-deps.sh && \
    cd ../ && \
    yarn build:webpack

# ─── RUNTIME STAGE ───────────────────────────────────────────────────────────
FROM nginx:mainline-alpine

ENV WORK_DIR=/var/web/core-ui
RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/core/nginx.conf /etc/nginx/conf.d/default.conf
