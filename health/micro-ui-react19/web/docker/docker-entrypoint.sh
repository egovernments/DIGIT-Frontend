#!/bin/sh
set -e

# Substitute environment variables in nginx config template at runtime
envsubst '${BUILD_VARIANT} ${COUNTRY_PREFIX}' < /tmp/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
