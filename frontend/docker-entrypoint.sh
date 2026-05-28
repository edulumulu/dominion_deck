#!/bin/sh
set -e
envsubst '${BACKEND_URL} ${DNS_RESOLVER}' \
  < /etc/nginx/nginx.conf.template \
  > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
