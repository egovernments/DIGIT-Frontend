# Stage 1: Fetch locales and build the app
FROM node:20 AS build

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

# Clean up node_modules and yarn.lock
RUN rm -rf node_modules/
RUN rm -rf yarn.lock

# Clear yarn cache
RUN yarn cache clean

# Install dependencies
RUN yarn install

# Optionally, you can add a label with the commit ID
LABEL commit_id=$COMMIT_ID

# Copy the rest of the application
COPY . .

# # Fetch locales before building the app
# COPY fetch-locales.js .
# RUN node fetch-locales.js

# Build the React app with Vite
RUN yarn build

# Stage 2: Serve the built app using nginx
FROM nginx:mainline-alpine

# Define the work directory for nginx
ENV WORK_DIR=/var/web/sample-ui

# Create the work directory
RUN mkdir -p ${WORK_DIR}

# Copy the build files from the previous stage
COPY --from=build /app/dist ${WORK_DIR}/

# Copy the nginx configuration file
COPY --from=build /app/docker/nginx.conf /etc/nginx/conf.d/default.conf
