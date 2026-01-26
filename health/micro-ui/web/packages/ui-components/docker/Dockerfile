FROM node:14-alpine3.14 AS build
RUN apk update
RUN apk add --no-cache 'git>2.30.0'
# Install dependencies required for node-gyp (Python, make, g++, etc.)
RUN apk add --no-cache python2 make g++ \
    && ln -sf /usr/bin/python2 /usr/bin/python

ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=1792"

COPY ${WORK_DIR} .

RUN yarn install
RUN yarn build-storybook

FROM nginx:mainline-alpine
ENV WORK_DIR=/var/storybook

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/dist-storybook ${WORK_DIR}/
COPY --from=build /app/docker/nginx.conf /etc/nginx/conf.d/default.conf