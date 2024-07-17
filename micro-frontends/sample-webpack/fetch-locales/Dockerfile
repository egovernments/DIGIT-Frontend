# Use Node.js base image
FROM node:20 AS fetch-locales

# Set working directory
WORKDIR /fetcher

# Copy package.json 
COPY package.json ./

# Install dependencies
RUN npm install

# Copy fetch-locales script
COPY fetch-locales.js .

# Set command to run the fetch-locales script
CMD ["node", "fetch-locales.js"]
