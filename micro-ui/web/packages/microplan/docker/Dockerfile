# Use Node.js base image with version 16
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock (if exists)
COPY package.json ./

# Install necessary build tools for node-sass
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Clear yarn cache and install dependencies
RUN yarn cache clean && yarn install

# Copy the rest of the application
COPY . .

# Build the React app with Webpack
RUN yarn build

# Use Nginx base image
FROM nginx:mainline-alpine

ENV WORK_DIR=/var/web/microplan-mfe

RUN mkdir -p ${WORK_DIR}

# Copy built files from the build stage
COPY --from=build /app/dist ${WORK_DIR}/
COPY --from=build /app/docker/nginx.conf /etc/nginx/conf.d/default.conf
