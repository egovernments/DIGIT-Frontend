 # syntax=docker/dockerfile:1.4
 FROM node:14-alpine AS deps
 WORKDIR /app
 ARG WORK_DIR

-# Copy only package manifest from web/
-COPY ${WORK_DIR}/web/package.json ${WORK_DIR}/web/yarn.lock ./web/
+## Copy the files we actually have:
+COPY ${WORK_DIR}/web/package.json     ./web/package.json
+COPY ${WORK_DIR}/yarn.lock            ./yarn.lock

 ENV YARN_CACHE_FOLDER=/app/.yarncache
 RUN --mount=type=cache,target=/app/.yarncache \
     apk update && apk add --no-cache git \
   && yarn config set network-timeout 600000 \
-  && cd web \
-  && yarn install --frozen-lockfile --prefer-offline
+  && yarn install --frozen-lockfile --prefer-offline --cwd web

 FROM node:14-alpine AS build
 WORKDIR /app
 ARG WORK_DIR
 ENV NODE_OPTIONS="--max-old-space-size=4792"

-# bring in cached node_modules
-COPY --from=deps /app/web/node_modules ./web/node_modules
+# bring in cached node_modules
+COPY --from=deps /app/web/node_modules ./web/node_modules

 # now copy the rest of your source
 COPY ${WORK_DIR} .

 RUN cd web && \
     node -e 'console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024))' && \
     node -e 'console.log("core only")' && \
     cd microplan && chmod +x ./install-deps.sh && ./install-deps.sh && cd .. && \
     yarn build:webpack

 FROM nginx:mainline-alpine AS runtime
 ENV WORK_DIR=/var/web/microplan-ui
 RUN mkdir -p ${WORK_DIR}

 COPY --from=build /app/web/build ${WORK_DIR}/
 COPY --from=build /app/web/microplan/nginx.conf /etc/nginx/conf.d/default.conf
