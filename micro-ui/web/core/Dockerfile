# ─── BUILD STAGE ────────────────────────────────────────────────────────────
FROM node:14-alpine AS build

# Install git and essential build tools for native modules
# This helps prevent errors if a package needs to be compiled from source
RUN apk update && apk upgrade && \
    apk add --no-cache git python3 make g++

ARG WORK_DIR
# Set the working directory for the entire web app
WORKDIR /app/web

# Use modern ENV syntax
ENV NODE_OPTIONS="--max-old-space-size=4792"

# --- Docker Caching Optimization ---
# 1. Copy only the dependency definition files
COPY ${WORK_DIR}/package.json ${WORK_DIR}/yarn.lock ./

# 2. Install dependencies. This layer will be cached unless package.json/yarn.lock changes.
#    Use a long network timeout to handle slow emulation.
RUN yarn install --ignore-engines --network-timeout 600000

# 3. Now copy the rest of the application source code
COPY ${WORK__DIR} .
# ------------------------------------

RUN ls -lah

# Now, run your scripts. Note that `yarn install` is already done.
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
