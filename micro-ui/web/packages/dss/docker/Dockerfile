# Use Node.js base image with version 16
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock (if exists)
COPY package.json ./

# clear cache
RUN yarn cache clean

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the React app with Webpack
RUN yarn build

FROM nginx:mainline-alpine

ENV WORK_DIR=/var/web/dss-ui

RUN mkdir -p ${WORK_DIR}


COPY --from=build /app/dist ${WORK_DIR}/
COPY --from=build /app/docker/nginx.conf /etc/nginx/conf.d/default.conf
