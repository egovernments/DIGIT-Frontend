# # FROM egovio/alpine-node-builder-14:yarn AS build
# FROM ghcr.io/egovernments/alpine-node-builder-14:yarn AS build
# RUN apk update && apk upgrade
# RUN apk add --no-cache git>2.30.0
# ARG WORK_DIR
# WORKDIR /app
# ENV NODE_OPTIONS "--max-old-space-size=8168"

# COPY ${WORK_DIR} .
# RUN ls -lah

# #RUN node web/envs.js

# RUN cd . \
#     &&  ./install-deps.sh \
#     && yarn install \
#     && yarn build:webpack 

# FROM nginx:mainline-alpine
# #FROM ghcr.io/egovernments/nginx:mainline-alpine
# ENV WORK_DIR=/var/web/digit-ui

# RUN mkdir -p ${WORK_DIR}

# COPY --from=build /app/web/build ${WORK_DIR}/
# COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf


# Use the base image for Node.js with Yarn
FROM ghcr.io/egovernments/alpine-node-builder-14:yarn AS build
RUN apk update && apk upgrade
RUN apk add --no-cache git>2.30.0

# Define a build argument for the working directory
ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS "--max-old-space-size=8168"

# Copy the micro-ui/web directory (one level up) into /app
COPY ../../web /app/

# Verify the copied files
RUN ls -lah /app

# Run the dependency installation and build process
WORKDIR /app  # Ensure we are inside the correct directory
RUN chmod +x install-deps.sh && \
    ./install-deps.sh && \
    yarn install && \
    yarn build:webpack 

# Use Nginx as the final image
FROM nginx:mainline-alpine
# FROM ghcr.io/egovernments/nginx:mainline-alpine

ENV WORK_DIR=/var/web/digit-ui
RUN mkdir -p ${WORK_DIR}

# Copy the built application files from the first stage
COPY --from=build /app/build ${WORK_DIR}/
COPY --from=build /app/docker/nginx.conf /etc/nginx/conf.d/default.conf
