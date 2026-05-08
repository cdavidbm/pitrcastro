#!/usr/bin/env bash
# ops/deploy-binarios.sh — Sync de binarios (public/documentos/) al servidor
#
# El deploy automático (workflow + ops/deploy.sh) excluye `/documentos/`
# del rsync porque la mayoría de binarios no están commiteados al repo
# (gitignored: solo ciprep/ninos/relatorias se commitean). Este script
# es la forma manual de subirlos al servidor cuando hace falta.
#
# Solución transitoria. Cuando exista el endpoint Node de uploads, los
# binarios subirán por ahí desde Sveltia o un panel admin separado.
#
# Uso:  npm run deploy:binarios
#       o: bash ops/deploy-binarios.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.deploy"

if [ ! -f "${ENV_FILE}" ]; then
  echo "ERROR: ${ENV_FILE} no existe. Copia .env.deploy.example a .env.deploy y completa los valores." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

: "${DEPLOY_HOST:?Falta DEPLOY_HOST en .env.deploy}"
: "${DEPLOY_USER:?Falta DEPLOY_USER en .env.deploy}"
: "${DEPLOY_PATH:?Falta DEPLOY_PATH en .env.deploy}"

SSH_BIN="${SSH_BIN:-ssh}"

cd "${ROOT_DIR}"

if [ ! -d "public/documentos" ]; then
  echo "ERROR: public/documentos no existe en local. ¿Estás en la raíz del repo?" >&2
  exit 1
fi

LOCAL_SIZE="$(du -sh public/documentos | cut -f1)"
echo "==> Sincronizando ${LOCAL_SIZE} de binarios"
echo "    public/documentos/ → ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/documentos/"
echo "    (sin --delete: archivos ya en el servidor que no estén local NO se borran)"
echo ""

# SIN --delete por seguridad: si alguien subió algo al servidor que no
# está en el repo, no lo perdemos. Para borrar uses rsync --delete manual.
rsync -avz --no-o --no-g --no-p --no-t --chmod=Dg+rwX,Fg+rw \
  -e "${SSH_BIN}" \
  --exclude=".DS_Store" \
  --exclude="Thumbs.db" \
  public/documentos/ \
  "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/documentos/"

echo ""
echo "==> Sync de binarios completado"
echo "    Verificar tamaño total en servidor:"
echo "    ${SSH_BIN} ${DEPLOY_USER}@${DEPLOY_HOST} 'du -sh ${DEPLOY_PATH}/documentos/'"
