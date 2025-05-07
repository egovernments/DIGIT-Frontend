# # FROM egovio/alpine-node-builder-14:yarn AS build
# FROM node:20-alpine AS build
# RUN apk update && apk upgrade
# RUN apk add --no-cache git>2.30.0
# ARG WORK_DIR
# WORKDIR /app

# # Copy the entire micro-ui directory into the container.
# COPY micro-ui .

# # Navigate to the web directory to install dependencies and build.
# RUN cd web \
#     && ./install-deps.sh \
#     && yarn install \
#     && yarn build:webpack

FROM node:20-alpine AS build
RUN apk update && apk upgrade
RUN apk add --no-cache git>2.30.0
ARG WORK_DIR
WORKDIR /app

# Copy the entire micro-ui directory into the container.
COPY micro-ui .

# Navigate to the web directory to install dependencies and build.
RUN cd web \
    && ./install-deps.sh \
    && yarn install

# Explicitly list the directory with exact casing
RUN cd web && echo "Checking the exact casing of the module directory..."
RUN cd web && ls -al node_modules/@egovernments/digit-ui-module-core

RUN cd web && echo "Starting webpack build..."
RUN cd web && yarn build:webpack

FROM nginx:mainline-alpine
#FROM ghcr.io/egovernments/nginx:mainline-alpine
ENV WORK_DIR=/var/web/digit-ui

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf