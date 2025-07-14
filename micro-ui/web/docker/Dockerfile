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

FROM nginx:mainline-alpine
#FROM ghcr.io/egovernments/nginx:mainline-alpine
ENV WORK_DIR=/var/web/digit-ui

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf
