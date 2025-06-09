# ─── BUILD STAGE ────────────────────────────────────────────────────────────
FROM node:14-alpine AS build

# Install git and essential build tools
RUN apk update && apk upgrade && \
    apk add --no-cache git python3 make g++

# Set the WORKDIR to the application root inside the container
WORKDIR /app

# This ARG is set by the --build-arg flag in your docker build command
ARG WORK_DIR
ENV NODE_OPTIONS="--max-old-space-size=4792"

# --- THE FIX: Correct ENV syntax for PATH ---
# The key=value format is required for variable expansion like $PATH to work.
ENV PATH="/app/node_modules/.bin:$PATH"

# --- Monorepo Caching Optimization ---

# 1. Copy the root yarn.lock
COPY yarn.lock ./

# 2. Copy the package.json files for the relevant workspaces.
COPY ${WORK_DIR}package.json ./${WORK_DIR}
COPY ${WORK_DIR}web/package.json ./${WORK_DIR}web/
COPY ${WORK_DIR}web/core/package.json ./${WORK_DIR}web/core/

# 3. Install ALL dependencies from the root.
RUN yarn install --ignore-engines --network-timeout 600000

# 4. Now that dependencies are installed, copy the entire project source code.
COPY . .

# 5. Change the working directory to the specific app we want to build.
WORKDIR /app/${WORK_DIR}web

# --- End Optimization ---

# Run your build scripts. Because of the corrected ENV PATH, 'run-p' will now be found.
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

# Copy build artifacts from the correct location inside the build stage
COPY --from=build /app/micro-ui/web/build ${WORK_DIR}/
COPY --from=build /app/micro-ui/web/core/nginx.conf /etc/nginx/conf.d/default.conf
