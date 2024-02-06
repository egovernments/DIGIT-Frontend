# Use the official Node 16 base image
FROM node:16

# Set the Yarn version
ARG YARN_VERSION=1.22.19
ENV NODE_OPTIONS "--max-old-space-size=8168"

# Install the specified Yarn version globally
RUN npm install -g yarn@${YARN_VERSION}

# Set the working directory in the container
ENV WORK_DIR=/var/web/core

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the entire application to the working directory
COPY . .

# Build the React app
RUN yarn build

# Expose the port on which the app will run (if applicable)
# EXPOSE 3000

# Command to run the application (replace with your specific command)
# CMD ["yarn", "start"]
