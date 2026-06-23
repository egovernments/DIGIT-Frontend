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
# Cache-bust: this URL returns a fresh value every build, so every layer
# below it (clone -> yarn install -> build) is forced to re-run.
ADD https://www.random.org/integers/?num=1&min=1&max=1000000000&col=1&base=10&format=plain&rnd=new /tmp/cachebust
# Force refresh of DIGIT-Studio clone
RUN ./install-deps.sh
# Increase timeout before install
RUN yarn config set network-timeout 600000
# Debug logs
RUN echo "Files in /app/web directory:" && ls -la
# Install dependencies
RUN yarn install
# Build app
RUN timeout 18000 yarn build:prod || (echo "Build failed or timed out" && exit 1)
# -------------------------
# Production Image
# -------------------------
FROM nginx:mainline-alpine
ENV WORK_DIR=/var/web/digit-studio
RUN mkdir -p ${WORK_DIR}
COPY --from=build /app/web/build ${WORK_DIR}/
COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf
