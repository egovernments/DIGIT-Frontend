#!/bin/sh
set -e

# Compute the base path
if [ -n "$COUNTRY_PREFIX" ]; then
    BASE_PATH="/$COUNTRY_PREFIX/$BUILD_VARIANT"
else
    BASE_PATH="/$BUILD_VARIANT"
fi

export BASE_PATH

# Inject <base> tag
sed -i "s|<head>|<head><base href=\"${BASE_PATH}/\">|" /var/web/app/index.html

# Generate nginx config
envsubst '${BASE_PATH}' \
    < /tmp/nginx.conf.template \
    > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
