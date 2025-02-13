#!/bin/bash
set -euxo pipefail

find /app -name '*.js' -type f -exec sed -i -e "s/BACKEND_HOST/$BACKEND_HOST/g" {} \;
nginx -c /usr/share/nginx/nginx.conf -g "daemon off;"