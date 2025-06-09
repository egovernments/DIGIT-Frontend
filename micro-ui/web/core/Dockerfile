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

# --- Monorepo Caching Optimization & Setup ---

# 1. Copy only the files needed to install dependencies.
COPY yarn.lock ./
COPY ${WORK_DIR}package.json ./${WORK_DIR}
COPY ${WORK_DIR}web/package.json ./${WORK_DIR}web/
# Add copies for any other package.json files within your workspaces if needed
COPY ${WORK_DIR}micro-ui-internals/packages/libraries/package.json ./${WORK_DIR}micro-ui-internals/packages/libraries/
COPY ${WORK_DIR}micro-ui-internals/packages/react-components/package.json ./${WORK_DIR}micro-ui-internals/packages/react-components/
COPY ${WORK_DIR}micro-ui-internals/packages/modules/workbench/package.json ./${WORK_DIR}micro-ui-internals/packages/modules/workbench/

# 2. Change to the monorepo root directory. The package.json with the "workspaces"
#    key defines this root.
WORKDIR /app/${WORK_DIR}

# 3. CRITICAL: Set the PATH to include the node_modules binaries for this monorepo.
ENV PATH="/app/micro-ui/node_modules/.bin:$PATH"

# 4. Install ALL dependencies from the monorepo root.
RUN yarn install --ignore-engines --network-timeout 600000

# 5. Now, copy the rest of your project's source code.
WORKDIR /app
COPY . .

# --- THE FINAL BUILD STRATEGY: Deconstruct the 'build:webpack' script ---

# Change back to the monorepo root to run workspace commands.
WORKDIR /app/${WORK_DIR}

# Step 1: Build the dependent libraries first, as intended by `build:libraries`.
RUN yarn build:libraries

# Step 2: Move to the web application's directory.
WORKDIR /app/${WORK_DIR}web

# Step 3: Run the final application build, as intended by `build:prod`.
# Because of the ENV PATH, webpack and its dependencies will be found.
RUN yarn build:prod

# ─── RUNTIME STAGE ───────────────────────────────────────────────────────────
FROM nginx:mainline-alpine

ENV WORK_DIR=/var/web/core-ui
RUN mkdir -p ${WORK_DIR}

# Copy build artifacts from the correct location inside the build stage
COPY --from=build /app/micro-ui/web/build ${WORK_DIR}/
COPY --from=build /app/micro-ui/web/core/nginx.conf /etc/nginx/conf.d/default.conf
