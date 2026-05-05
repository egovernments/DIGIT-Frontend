# Multi-variant Dockerfile for different builds
FROM node:20-alpine AS build
RUN apk update && apk upgrade
RUN apk add --no-cache git>2.30.0

# Build argument to specify which variant to build
ARG BUILD_VARIANT=core-ui
ARG COUNTRY_PREFIX
ARG PUBLIC_PATH
ARG WORK_DIR

ENV PUBLIC_PATH=${PUBLIC_PATH}

WORKDIR /app

# Copy the entire micro-ui-react19 directory into the container
COPY health/micro-ui-react19 .

# Copy variant-specific files (index.js, package.json) from builds folder
COPY health/micro-ui-react19/web/builds/${BUILD_VARIANT}/index.js ./web/src/index.js
COPY health/micro-ui-react19/web/builds/${BUILD_VARIANT}/package.json ./web/package.json

# If variant has public folder files, copy them too
# Using conditional copy with proper syntax
RUN if [ -d "web/builds/${BUILD_VARIANT}/public" ]; then \
        cp -r web/builds/${BUILD_VARIANT}/public/* web/public/; \
    fi

# Use WORKDIR instead of cd
WORKDIR /app/web
RUN yarn install \
    && yarn build:prod

# Production stage
FROM nginx:mainline-alpine
ARG BUILD_VARIANT=core-ui
ARG COUNTRY_PREFIX
ENV BUILD_VARIANT=${BUILD_VARIANT}
ENV COUNTRY_PREFIX=${COUNTRY_PREFIX}
ENV WORK_DIR=/var/web/${COUNTRY_PREFIX}/${BUILD_VARIANT}

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/

# Copy the nginx template and substitute the BUILD_VARIANT and COUNTRY_PREFIX
COPY health/micro-ui-react19/web/docker/nginx.conf.template /tmp/nginx.conf.template
RUN envsubst '${BUILD_VARIANT} ${COUNTRY_PREFIX}' < /tmp/nginx.conf.template > /etc/nginx/conf.d/default.conf \
    && rm /tmp/nginx.conf.template
