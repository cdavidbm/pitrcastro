#!/usr/bin/env bash
# ops/deploy.sh — Build local + sync al servidor configurado en .env.deploy
# Uso: npm run deploy

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
SITE_URL="${SITE_URL}" BASE_PATH="${BASE_PATH}" npm run build

echo "==> Sincronizando dist/ → ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"
# --no-o --no-g: no preservar owner/group para evitar conflictos con archivos
# previamente creados por otro usuario (ej. el runner self-hosted). El grupo
# se hereda del setgid del directorio destino (configurado en el server).
rsync -avz --no-o --no-g --delete \
  -e "${SSH_BIN}" \
  --exclude=".DS_Store" \
  --exclude="Thumbs.db" \
  dist/ \
  "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo ""
echo "==> Despliegue completado"
echo "    Sitio servido en: ${SITE_URL}"
