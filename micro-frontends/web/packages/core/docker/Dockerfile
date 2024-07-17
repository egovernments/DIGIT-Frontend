# Use Node.js base image with version 16
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Set build arguments
ARG BRANCH_NAME
ARG ACTION_NUMBER
ARG COMMIT_ID

# Set environment variables based on build arguments
ENV BRANCH_NAME=$BRANCH_NAME
ENV ACTION_NUMBER=$ACTION_NUMBER
ENV COMMIT_ID=$COMMIT_ID

# Copy package.json and yarn.lock (if exists)
COPY package.json ./

RUN rm -rf node_modules/

RUN rm -rf yarn.lock

# clear cache
RUN yarn cache clean

# Install dependencies
RUN yarn install

# Optionally, you can add a label with the commit ID
LABEL commit_id=$COMMIT_ID

# Copy the rest of the application
COPY . .

# Build the React app with Webpack
RUN yarn build

FROM nginx:mainline-alpine

ENV WORK_DIR=/var/web/core-digit-ui

RUN mkdir -p ${WORK_DIR}


COPY --from=build /app/dist ${WORK_DIR}/
COPY --from=build /app/docker/nginx.conf /etc/nginx/conf.d/default.conf
