# Use amd64 platform to avoid exec format error
FROM --platform=linux/amd64 ghcr.io/egovernments/alpine-node-builder-14:yarn AS build

RUN apk update && apk upgrade
RUN apk add --no-cache git>2.30.0

ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS "--max-old-space-size=8168"

COPY ${WORK_DIR} .
RUN ls -lah

RUN cd web/ \
    && chmod +x install-deps.sh \
    && yarn install \
    && yarn build:webpack 

# Final stage
FROM --platform=linux/amd64 nginx:mainline-alpine
ENV WORK_DIR=/var/web/digit-ui

RUN mkdir -p ${WORK_DIR}
COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf
