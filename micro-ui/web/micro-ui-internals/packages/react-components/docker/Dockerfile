FROM node:14-alpine3.16 AS build
RUN apk update
RUN apk add --no-cache 'git>2.30.0'
ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=1792"

COPY ${WORK_DIR} .

#RUN node web/envs.js
RUN node envs.js
RUN yarn config set network-timeout 600000
RUN yarn install
RUN yarn build-storybook

FROM nginx:mainline-alpine
ENV WORK_DIR=/var/web/storybook

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/build ${WORK_DIR}/
COPY --from=build /app/docker/nginx.conf /etc/nginx/conf.d/default.conf