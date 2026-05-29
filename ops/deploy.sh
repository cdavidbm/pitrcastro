#!/usr/bin/env bash
# ops/deploy.sh — Build local + sync al servidor configurado en .env.deploy
# Uso: pnpm deploy

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.deploy"

if [ ! -f "${ENV_FILE}" ]; then
  echo "ERROR: ${ENV_FILE} no existe." >&2
  echo "       Copia .env.deploy.example a .env.deploy y completa los valores." >&2
  exit 1
fi

# Cargar variables del .env.deploy de forma robusta (ignora comentarios y vacías).
set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

: "${SITE_URL:?Falta SITE_URL en .env.deploy}"
: "${BASE_PATH:?Falta BASE_PATH en .env.deploy}"
: "${DEPLOY_HOST:?Falta DEPLOY_HOST en .env.deploy}"
: "${DEPLOY_USER:?Falta DEPLOY_USER en .env.deploy}"
: "${DEPLOY_PATH:?Falta DEPLOY_PATH en .env.deploy}"

SSH_BIN="${SSH_BIN:-ssh}"

cd "${ROOT_DIR}"

echo "==> Build con SITE_URL=${SITE_URL} BASE_PATH=${BASE_PATH}"
SITE_URL="${SITE_URL}" BASE_PATH="${BASE_PATH}" pnpm build

echo "==> Sincronizando dist/ → ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"
# Defensive flags para que el rsync funcione aunque DEPLOY_USER no sea owner
# de los archivos existentes (caso típico: archivos creados por el runner
# self-hosted, mientras admweb hace deploy manual de fallback).
# --no-o --no-g: no chgrp/chown (solo el owner puede; group se hereda del setgid)
# --no-p:        no chmod (solo el owner puede)
# --no-t:        no set-times (solo el owner puede). Trade-off: rsync se basa
#                en size para detectar cambios; suficiente para sitios estáticos
#                regenerables (un re-build da contenido idéntico).
# --exclude=/documentos/: ver comentario equivalente en .github/workflows/deploy.yml.
#                Resumen: los binarios viven SOLO en el filesystem del servidor;
#                sin esta exclusión, --delete borraría 3.5 GB en cada deploy.
#                Para subir binarios usar `pnpm deploy:binarios` (script
#                separado, ver ops/deploy-binarios.sh).
rsync -avz --no-o --no-g --no-p --no-t --chmod=Dg+rwX,Fg+rw --delete \
  -e "${SSH_BIN}" \
  --exclude=".DS_Store" \
  --exclude="Thumbs.db" \
  --exclude="/documentos/" \
  dist/ \
  "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo ""
echo "==> Despliegue completado"
echo "    Sitio servido en: ${SITE_URL}"
