# ─── BUILD STAGE ──────────────────────────────────────────────────────────────
FROM node:14-alpine AS build

# update & install git
RUN apk update && apk upgrade && \
    apk add --no-cache git

ARG WORK_DIR
WORKDIR /app

# use modern ENV syntax
ENV NODE_OPTIONS="--max-old-space-size=4792"

COPY ${WORK_DIR} .

RUN ls -lah

# require v8 properly and fix continuation lines
RUN cd web && \
    node -e "const v8 = require('v8'); console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024));" && \
    node -e "console.log('core only');" && \
    cd core && \
    chmod +x ./install-deps.sh && \
    ./install-deps.sh && \
    cd ../ && \
    yarn install --ignore-engines && \
    yarn build:webpack

# ─── RUNTIME STAGE ───────────────────────────────────────────────────────────
FROM nginx:mainline-alpine

ENV WORK_DIR=/var/web/core-ui
RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/core/nginx.conf /etc/nginx/conf.d/default.conf
