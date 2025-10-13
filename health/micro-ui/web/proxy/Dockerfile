FROM node:14-alpine3.16

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY src/ ./src/

# Copy .env file if it exists (optional - environment variables are typically handled by container orchestration)
# COPY .env ./src/

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S proxy -u 1001 -G nodejs

# Change to non-root user
USER proxy

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
    http.get('http://localhost:3001/health', (res) => { \
      if (res.statusCode === 200) process.exit(0); \
      else process.exit(1); \
    }).on('error', () => process.exit(1));"

EXPOSE 3001

CMD ["node", "src/server.js"]