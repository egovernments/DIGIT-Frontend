# ─── BUILD STAGE ──────────────────────────────────────────────────────────────
FROM node:14-alpine AS build

# install system deps
RUN apk update && apk add --no-cache git

ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=4792"

COPY ${WORK_DIR} .
RUN ls -lah

RUN cd web/ \
    && node -e 'console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024))' \
    && node -e 'console.log("health-core only")' \
    && cd core/ \
       && chmod +x ./install-deps.sh \
       && ./install-deps.sh \
    && cd ../ \
    && yarn install \
    && yarn build:webpack

# ─── RUNTIME STAGE ───────────────────────────────────────────────────────────
FROM nginx:stable-alpine

ENV WORK_DIR=/var/web/core-ui
RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/core/nginx.conf /etc/nginx/conf.d/default.conf