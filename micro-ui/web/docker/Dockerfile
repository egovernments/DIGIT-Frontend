FROM node:20-alpine AS build
RUN apk update
RUN apk add --no-cache 'git>2.30.0'
ARG WORK_DIR
ARG GIT_TOKEN
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=8168 --max-http-header-size=81920"
ENV GIT_TOKEN=${GIT_TOKEN}

COPY ${WORK_DIR} .
RUN ls -lah

# Set working directory
WORKDIR /app/web

RUN chmod +x ./install-deps.sh
RUN ./install-deps.sh

# Increase timeout before install (recommended for GitHub Actions)
RUN yarn config set network-timeout 600000

# List files before yarn install for debugging
RUN echo "Files in /app/web directory:" && ls -la

# Install dependencies
RUN yarn install

# Build the project with increased timeout
RUN timeout 18000 yarn build:prod || (echo "Build failed or timed out" && exit 1)

FROM nginx:mainline-alpine
#FROM ghcr.io/egovernments/nginx:mainline-alpine
ENV WORK_DIR=/var/web/digit-studio

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf
