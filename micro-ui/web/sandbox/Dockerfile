FROM node:14-alpine3.14 AS build
RUN apk update && apk add --no-cache git>2.30.0 python2 make g++ && ln -sf /usr/bin/python2 /usr/bin/python

ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=4792"

# Copy source code
COPY ${WORK_DIR} .
RUN ls -lah

# setup the sandbox environment (overwrites package.json etc)
WORKDIR /app/web/sandbox
RUN chmod +x ./install-deps.sh && ./install-deps.sh

# Return to web root to install and build
WORKDIR /app/web

# Increase network timeout
RUN yarn config set network-timeout 600000

# Install dependencies (using the modified package.json from sandbox)
RUN yarn install

# Build the project
RUN yarn build:webpack

FROM nginx:mainline-alpine
#FROM ghcr.io/egovernments/nginx:mainline-alpine
ENV WORK_DIR=/var/web/sandbox-ui

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/sandbox/nginx.conf /etc/nginx/conf.d/default.conf
