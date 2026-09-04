#!/bin/sh
set -e

# Placeholder baked into the bundle at build time by webpack.config.js
PLACEHOLDER="/__BASE_PATH__/"

# Compute the path prefix this container is served from:
#   COUNTRY_PREFIX=chaduat, BUILD_VARIANT=dashboard-ui -> /chaduat/dashboard-ui
#   COUNTRY_PREFIX unset                               -> /dashboard-ui
if [ -n "$COUNTRY_PREFIX" ]; then
    BASE_PATH="/$COUNTRY_PREFIX/$BUILD_VARIANT"
else
    BASE_PATH="/$BUILD_VARIANT"
fi

export BASE_PATH

echo "dashboard-ui: serving from ${BASE_PATH}"

# Rewrite the placeholder public path to the real one, so index.html, the webpack
# runtime and every file-loader asset URL all point at ${BASE_PATH}/. webpack 4
# has no publicPath: "auto", so this is done at start-up instead of at build time.
find /var/web/dashboard-ui -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' \) \
    -exec sed -i "s|${PLACEHOLDER}|${BASE_PATH}/|g" {} +

# Generate nginx config
envsubst '${BASE_PATH}' \
    < /tmp/nginx.conf.template \
    > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
