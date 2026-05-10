#!/usr/bin/env bash
# Despliegue del stack CMS al servidor de pruebas (192.168.82.13).
#
# 1. Compila la imagen Strapi en local (FortiGate corta downloads
#    de Docker Hub en el server).
# 2. Exporta a tar comprimido y rsync al server.
# 3. SSH ejecuta: load, retag, compose down strapi, compose up.
#
# Uso desde la raíz del repo:
#   bash cms-strapi/scripts/deploy-strapi-to-server.sh
#
# Variables opcionales:
#   SERVER       (default admweb@192.168.82.13)
#   REMOTE_PATH  (default /home/admweb/itrc-cms)
#   IMAGE_NAME   (default itrc-cms-strapi:latest)

set -euo pipefail

SERVER="${SERVER:-admweb@192.168.82.13}"
REMOTE_PATH="${REMOTE_PATH:-/home/admweb/itrc-cms}"
IMAGE_NAME="${IMAGE_NAME:-itrc-cms-strapi:latest}"
LOCAL_TAG="implementacionp-strapi:latest"  # Tag que produce docker compose por nombre del proyecto.
TAR_FILE="/tmp/itrc-cms-strapi.tar.gz"

echo "[deploy] 1/6 — verificando imagen local..."
if ! docker image inspect "$LOCAL_TAG" >/dev/null 2>&1; then
  echo "[deploy] imagen $LOCAL_TAG no existe; construyendo..."
  docker compose --profile server build strapi
fi

echo "[deploy] 2/6 — exportando imagen a $TAR_FILE..."
docker save "$LOCAL_TAG" | gzip -1 > "$TAR_FILE"
ls -lh "$TAR_FILE"

echo "[deploy] 3/6 — sincronizando al servidor..."
rsync -av --progress "$TAR_FILE" "${SERVER}:/tmp/"

echo "[deploy] 4/6 — sincronizando código del repo (cms-strapi/) al server..."
# El compose en server usa profile server con build local; pero tener el
# código actualizado permite ejecutar scripts (autogen, migrate) desde el host.
rsync -av --delete \
  --exclude='node_modules/' \
  --exclude='.cache/' \
  --exclude='.tmp/' \
  --exclude='dist/' \
  --exclude='.env' \
  cms-strapi/ "${SERVER}:${REMOTE_PATH}/cms-strapi/"

echo "[deploy] 5/6 — load + retag + restart en server..."
ssh "$SERVER" bash <<EOF
set -e
cd "$REMOTE_PATH"
echo "  cargando imagen..."
docker load < /tmp/itrc-cms-strapi.tar.gz
echo "  retag..."
docker tag $LOCAL_TAG $IMAGE_NAME
echo "  bajando strapi..."
docker compose --env-file .env.cms --profile server stop strapi || true
docker compose --env-file .env.cms --profile server rm -f strapi || true
echo "  arrancando strapi (--no-build, usa imagen preloaded)..."
docker compose --env-file .env.cms --profile server up -d --no-build strapi
echo "  esperando a que strapi responda..."
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
  sleep 5
  if curl -sf http://127.0.0.1:1337/admin/init -o /dev/null; then
    echo "  strapi UP tras \${i}*5s"
    break
  fi
done
docker ps --format "table {{.Names}}\t{{.Status}}" | grep itrc
rm -f /tmp/itrc-cms-strapi.tar.gz
EOF

echo "[deploy] 6/6 — limpiando tar local..."
rm -f "$TAR_FILE"

echo "[deploy] OK. Strapi está corriendo en server con la nueva imagen."
echo "[deploy] Próximos pasos:"
echo "  1. Migrar datos: STRAPI_URL=http://127.0.0.1:1337 ssh $SERVER \\"
echo "       'cd $REMOTE_PATH/cms-strapi && node scripts/migrate-all.mjs'"
echo "     o desde local apuntando al server:"
echo "       STRAPI_URL=http://192.168.82.13 node cms-strapi/scripts/migrate-all.mjs"
echo "  2. Disparar el workflow de deploy de Astro (push a main o repo dispatch)."
