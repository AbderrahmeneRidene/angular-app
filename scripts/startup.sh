#!/bin/sh

echo "=============================="
echo " Azure App Service - Startup "
echo "=============================="

# Dossier racine Azure
WWWROOT="/home/site/wwwroot"
ASSETS_DIR="$WWWROOT/assets"
CONFIG_FILE="$ASSETS_DIR/config.json"

echo "Creating assets directory if not exists..."
mkdir -p "$ASSETS_DIR"

echo "Generating config.json from Azure environment variables..."

# Assurez-vous que les variables d'environnement existent
: "${CLIENT_ID:?Need to set CLIENT_ID}"
: "${TENANT_ID:?Need to set TENANT_ID}"
: "${REDIRECT_URI:?Need to set REDIRECT_URI}"
: "${SCOPES:?Need to set SCOPES}"

cat <<EOF > "$CONFIG_FILE"
{
  "clientId": "${CLIENT_ID}",
  "tenantId": "${TENANT_ID}",
  "redirectUri": "${REDIRECT_URI}",
  "scopes": ["${SCOPES}"]
}
EOF

echo "config.json content:"
cat "$CONFIG_FILE"

echo "✅ Startup script finished successfully"
