# FROM egovio/alpine-node-builder-14:yarn AS build
FROM ghcr.io/egovernments/alpine-node-builder-14:yarn AS build
RUN apk update && apk upgrade
RUN apk add --no-cache git>2.30.0
ARG WORK_DIR
WORKDIR /app

# Copy the entire micro-ui directory into the container.
COPY ${WORK_DIR}/micro-ui .

# Navigate to the web directory to install dependencies and build.
RUN cd web \
    && ./install-deps.sh \
    && yarn install \
    && yarn build:webpack

FROM nginx:mainline-alpine
#FROM ghcr.io/egovernments/nginx:mainline-alpine
ENV WORK_DIR=/var/web/digit-ui

RUN mkdir -p ${WORK_DIR}

# Copy the built files from the build stage to the nginx directory.
COPY --from=build /app/web/build ${WORK_DIR}/

# Copy the nginx configuration file.
COPY ${WORK_DIR}/micro-ui/web/docker/docker/nginx.conf /etc/nginx/conf.d/default.conf