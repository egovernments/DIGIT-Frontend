#!/bin/sh
set -e

# Inject <base> tag into index.html so relative asset paths resolve correctly on any route
sed -i "s|<head>|<head><base href=\"/${COUNTRY_PREFIX}/${BUILD_VARIANT}/\">|" /var/web/app/index.html

# Substitute environment variables in nginx config template at runtime
envsubst '${BUILD_VARIANT} ${COUNTRY_PREFIX}' < /tmp/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
