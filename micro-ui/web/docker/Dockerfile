FROM node:20-alpine AS build

RUN apk update
RUN apk add --no-cache 'git>2.30.0'

ARG WORK_DIR
ARG GIT_TOKEN
ARG CACHEBUST

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=8168 --max-http-header-size=81920"
ENV GIT_TOKEN=${GIT_TOKEN}

COPY ${WORK_DIR} .

RUN ls -lah

# Set working directory
WORKDIR /app/web

RUN chmod +x ./install-deps.sh

# Force Docker to invalidate the cache for all layers below this point
ADD https://www.random.org/integers/?num=1&min=1&max=1000000000&col=1&base=10&format=plain&rnd=new /tmp/cachebust

# Debug information
RUN echo "Cache bust: ${CACHEBUST}"
RUN echo "Token length: $(echo -n $GIT_TOKEN | wc -c)"
RUN echo "Files in /app/web directory:" && ls -la

# Clone/update DIGIT-Studio dependencies
RUN ./install-deps.sh

# Increase Yarn timeout
RUN yarn config set network-timeout 600000

# Install dependencies
RUN yarn install

# Build the project
RUN timeout 18000 yarn build:prod || (echo "Build failed or timed out" && exit 1)

# -------------------------
# Production Image
# -------------------------
FROM nginx:mainline-alpine
# FROM ghcr.io/egovernments/nginx:mainline-alpine

ENV WORK_DIR=/var/web/digit-studio

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf
