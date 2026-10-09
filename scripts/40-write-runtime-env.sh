#!/bin/sh
set -eu

API_BASE="${API_URL:-https://localhost:44389}"
APP_BASE="${APP_URL:-http://localhost:4200}"
API_BASE="${API_BASE%/}"
APP_BASE="${APP_BASE%/}"

cat > /usr/share/nginx/html/dynamic-env.json <<EOF
{
  "application": { "baseUrl": "${APP_BASE}" },
  "oAuthConfig": {
    "issuer": "${API_BASE}/",
    "redirectUri": "${APP_BASE}"
  },
  "apis": {
    "default": { "url": "${API_BASE}", "rootNamespace": "Ieh.OwneyBeauty" },
    "AbpAccountPublic": { "url": "${API_BASE}/", "rootNamespace": "AbpAccountPublic" }
  }
}
EOF
