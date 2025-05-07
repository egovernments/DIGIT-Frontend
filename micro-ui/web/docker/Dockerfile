# # FROM egovio/alpine-node-builder-14:yarn AS build
# FROM node:20-alpine AS build
# RUN apk update && apk upgrade
# RUN apk add --no-cache git>2.30.0
# ARG WORK_DIR
# WORKDIR /app

# # Copy the entire micro-ui directory into the container.
# COPY micro-ui .

# # Navigate to the web directory to install dependencies and build.
# RUN cd web \
#     && ./install-deps.sh \
#     && yarn install \
#     && yarn build:webpack

# FROM nginx:mainline-alpine
# #FROM ghcr.io/egovernments/nginx:mainline-alpine
# ENV WORK_DIR=/var/web/digit-ui

# RUN mkdir -p ${WORK_DIR}

# COPY --from=build /app/web/build ${WORK_DIR}/
# COPY --from=build /app/web/docker/nginx.conf /etc/nginx/conf.d/default.conf

FROM node:20-alpine AS build
WORKDIR /app

# Copy only the necessary files for the web application.
COPY micro-ui/web ./

# Install web application dependencies
RUN yarn install --frozen-lockfile

# Create the @egovernments directory in node_modules
RUN mkdir -p node_modules/@egovernments

# Copy the contents of digit-ui-module-core
RUN cp -r ../../micro-ui-internals/packages/modules/core/* node_modules/@egovernments/digit-ui-module-core/

# Copy the contents of digit-ui-module-workbench
RUN cp -r ../../micro-ui-internals/packages/modules/workbench/* node_modules/@egovernments/digit-ui-module-workbench/

# Copy other modules as needed
# RUN cp -r ../../micro-ui-internals/packages/modules/your-module/* node_modules/@egovernments/digit-ui-module-your-module/

# Build the web application
RUN yarn build:webpack

# --- Production Stage ---
FROM nginx:mainline-alpine
WORKDIR /usr/share/nginx/html
# Remove default nginx static files
RUN rm -rf ./*
# Copy the built web application
COPY --from=build /app/build .
# Copy custom nginx configuration if you have one
COPY micro-ui/web/docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]