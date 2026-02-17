FROM node:14-alpine3.14 AS build
RUN apk update && apk add --no-cache git>2.30.0 python2 make g++ && ln -sf /usr/bin/python2 /usr/bin/python

ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=4792"

# Copy source code relative to the build context
COPY ${WORK_DIR} .
RUN ls -lah

# Increase network timeout for slow connections
RUN yarn config set network-timeout 600000

# Install dependencies (workspaces support)
RUN yarn install

# Build all packages in the monorepo
RUN yarn build

# Build the example application
RUN yarn workspace @egovernments/digit-ui-example run build

FROM nginx:mainline-alpine
ENV WORK_DIR=/var/web/micro-ui-internals

RUN mkdir -p ${WORK_DIR}

# Copy the build output from the example workspace
COPY --from=build /app/example/build ${WORK_DIR}/

# Copy nginx configuration
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
