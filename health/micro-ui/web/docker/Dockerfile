FROM node:20-alpine AS build
RUN apk update && apk upgrade
RUN apk add --no-cache git>2.30.0
ARG WORK_DIR
WORKDIR /app

# Copy the entire micro-ui directory into the container.
COPY health/micro-ui/web/micro-ui-internals .

# Navigate to the web directory to install dependencies and build.
RUN cd web \
    && ./install-deps.sh \
    && yarn install \
    && yarn build

FROM nginx:mainline-alpine
#FROM ghcr.io/egovernments/nginx:mainline-alpine
ENV WORK_DIR=/var/web/workbench-ui

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf 