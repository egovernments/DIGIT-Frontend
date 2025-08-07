# Stage 1: Build the React app using Node 20 Alpine
FROM node:20-alpine AS build

# Install dependencies and Git
RUN apk update && apk upgrade && \
    apk add --no-cache git>2.30.0

# Define working directory
ARG WORK_DIR
WORKDIR /app

# Copy micro-ui contents into the container
COPY health/micro-ui .

# Change directory to web, make script executable, run install script and build
WORKDIR /app/web

# Ensure install-deps.sh is executable and run it
RUN chmod +x ./install-deps.sh && \
    ./install-deps.sh && \
    yarn install && \
    yarn build:webpack

# Stage 2: Nginx to serve the built static files
FROM nginx:mainline-alpine
# Optional: custom NGINX image from eGov
# FROM ghcr.io/egovernments/nginx:mainline-alpine

# Define environment variable
ENV WORK_DIR=/var/web/digit-ui

# Create directory for build output
RUN mkdir -p ${WORK_DIR}

# Copy build output and nginx config from build stage
COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf
