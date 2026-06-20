#!/usr/bin/env bash
# server/backup-wp-legacy.sh — snapshot integral del WP legado pre-cutover
#
# Que hace:
#   Genera un snapshot reproducible y verificable del WordPress que vive en el
#   servidor de produccion (`10.5.10.6`, ruta por defecto `/var/www/itrc`)
#   antes de reemplazarlo por el stack Astro+Strapi. Incluye archivos del WP,
#   dump de la base, configuracion del webserver, cron, configs PHP y un
#   inventario del sistema. Cada artefacto lleva su SHA-256 y al final se
#   agrega un `SHA256SUMS` global para verificar restauraciones con
#   `sha256sum -c SHA256SUMS`.
#
# Cuando correrlo:
#   En el servidor nuevo de produccion, como root, ANTES de cualquier accion
#   que toque /var/www/itrc o la base de datos del WordPress legado. Es
#   idempotente por timestamp: no sobreescribe directorios existentes.
#
# Tiempo estimado:
#   Entre 2 y 15 minutos segun tamano de uploads y de la base (la mayor parte
#   se la lleva el tar de wp-content/uploads).
#
# Como restaurar (resumen):
#   wp-files.tar.gz         -> tar -xzpf ... -C /  (preserva el layout absoluto)
#   wp-db.sql.gz            -> zcat ... | mysql -u <user> -p <db>
#   webserver-config.tar.gz -> tar -xzpf ... -C /  y revisar sites-enabled
#   cron.tar.gz             -> tar -xzpf ... -C /  (cuidado con crontabs de users)
#   php-config.tar.gz       -> tar -xzpf ... -C /  (solo si la version PHP coincide)
#   system-info.txt         -> referencia humana; no se restaura
#
# Estricto: NO borra nada fuera del directorio de salida. NO modifica WP ni DB.

set -euo pipefail
export LC_ALL=C

SCRIPT_VERSION="v1.0"

# ----------------------------------------------------------------------------
# Parametros con override por env
# ----------------------------------------------------------------------------
WP_PATH="${WP_PATH:-/var/www/itrc}"
BACKUP_ROOT="${BACKUP_ROOT:-/root/backups}"
TIMESTAMP="${TIMESTAMP:-$(date +%Y%m%d-%H%M%S)}"
OUT_DIR="${BACKUP_ROOT}/itrc-wp-${TIMESTAMP}"

# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------
log() { printf '[%s] %s\n' "$(date +%Y-%m-%dT%H:%M:%S%z)" "$*" >&2; }
die() { log "ERROR: $*"; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }
human_size() {
  if have numfmt; then numfmt --to=iec --suffix=B "$1"
  else printf '%s bytes' "$1"
  fi
}

sha_one() {
  # Calcula sha256 de "$1" en un .sha256 hermano. Sale por die si falla.
  local f="$1"
  [[ -f "${f}" ]] || die "no existe ${f} para hashear"
  ( cd "$(dirname "${f}")" && sha256sum "$(basename "${f}")" > "$(basename "${f}").sha256" )
  log "sha256 -> $(basename "${f}").sha256"
}

# ----------------------------------------------------------------------------
# PRE-FLIGHT
# ----------------------------------------------------------------------------
[[ "$(id -u)" -eq 0 ]] || die "este script debe correr como root"

[[ -d "${WP_PATH}" ]] || die "WP_PATH no existe: ${WP_PATH}"
[[ -f "${WP_PATH}/wp-config.php" ]] || die "no se encontro wp-config.php en ${WP_PATH}"

[[ -e "${OUT_DIR}" ]] && die "el directorio de salida ya existe: ${OUT_DIR} (idempotencia: aborto)"

mkdir -p "${BACKUP_ROOT}"
chmod 0700 "${BACKUP_ROOT}" || true

# Detectar engine de DB
if have mariadb-dump; then DUMP_BIN="mariadb-dump"
elif have mysqldump; then DUMP_BIN="mysqldump"
else die "no se encontro mariadb-dump ni mysqldump"
fi

if have mariadb; then CLI_BIN="mariadb"
elif have mysql; then CLI_BIN="mysql"
else die "no se encontro cliente mariadb/mysql para test de conexion"
fi

log "dump binary: ${DUMP_BIN}"
log "cli binary:  ${CLI_BIN}"

# Espacio en disco: 2x el tamano de WP_PATH
WP_BYTES="$(du -sb "${WP_PATH}" | awk '{print $1}')"
FREE_BYTES="$(df -B1 --output=avail "${BACKUP_ROOT}" | tail -n1 | tr -d ' ')"
NEED_BYTES=$(( WP_BYTES * 2 ))
log "WP_PATH size:   $(human_size "${WP_BYTES}")"
log "free in target: $(human_size "${FREE_BYTES}")"
log "need (>= 2x):   $(human_size "${NEED_BYTES}")"
[[ "${FREE_BYTES}" -ge "${NEED_BYTES}" ]] || die "espacio insuficiente en ${BACKUP_ROOT}"

# Crear directorio de salida con permisos restrictivos
mkdir -p "${OUT_DIR}"
chmod 0700 "${OUT_DIR}"
log "out dir: ${OUT_DIR}"

# ----------------------------------------------------------------------------
# CREDENTIALS — leer wp-config.php sin ejecutar PHP
# ----------------------------------------------------------------------------
extract_define() {
  # extract_define KEY < wp-config.php
  local key="$1"
  grep -E "^\s*define\(\s*['\"]${key}['\"]" "${WP_PATH}/wp-config.php" \
    | head -n1 \
    | sed -E "s/.*define\(\s*['\"]${key}['\"]\s*,\s*['\"]([^'\"]*)['\"].*/\1/"
}

DB_NAME="$(extract_define DB_NAME || true)"
DB_USER="$(extract_define DB_USER || true)"
DB_PASSWORD="$(extract_define DB_PASSWORD || true)"
DB_HOST="$(extract_define DB_HOST || true)"

[[ -n "${DB_NAME}"     ]] || die "no pude extraer DB_NAME de wp-config.php"
[[ -n "${DB_USER}"     ]] || die "no pude extraer DB_USER de wp-config.php"
[[ -n "${DB_PASSWORD}" ]] || die "no pude extraer DB_PASSWORD de wp-config.php"
[[ -n "${DB_HOST}"     ]] || die "no pude extraer DB_HOST de wp-config.php"

# Parsear DB_HOST: puede ser host, host:port, o /ruta/a/socket
DB_HOST_RAW="${DB_HOST}"
DB_SOCKET=""
DB_PORT=""
DB_HOSTNAME=""
case "${DB_HOST_RAW}" in
  /*)
    DB_SOCKET="${DB_HOST_RAW}"
    ;;
  *:*)
    DB_HOSTNAME="${DB_HOST_RAW%%:*}"
    DB_PORT="${DB_HOST_RAW##*:}"
    ;;
  *)
    DB_HOSTNAME="${DB_HOST_RAW}"
    ;;
esac
log "db: name=${DB_NAME} user=${DB_USER} host_raw=${DB_HOST_RAW}"

# Archivo de credenciales temporal (modo 0600) dentro del OUT_DIR
MY_CNF="${OUT_DIR}/.my.cnf"
umask 077
{
  printf '[client]\n'
  printf 'user=%s\n' "${DB_USER}"
  printf 'password=%s\n' "${DB_PASSWORD}"
  if [[ -n "${DB_SOCKET}" ]]; then
    printf 'socket=%s\n' "${DB_SOCKET}"
  else
    printf 'host=%s\n' "${DB_HOSTNAME}"
    [[ -n "${DB_PORT}" ]] && printf 'port=%s\n' "${DB_PORT}"
  fi
} > "${MY_CNF}"
chmod 0600 "${MY_CNF}"
umask 022

# Limpieza del archivo de credenciales pase lo que pase
cleanup() {
  if [[ -f "${MY_CNF}" ]]; then
    if have shred; then shred -u "${MY_CNF}" 2>/dev/null || rm -f "${MY_CNF}"
    else rm -f "${MY_CNF}"
    fi
  fi
}
trap cleanup EXIT

# Test de conexion (sin echo de password)
log "probando conexion a la DB..."
"${CLI_BIN}" --defaults-extra-file="${MY_CNF}" "${DB_NAME}" \
  --execute='SELECT 1;' >/dev/null \
  || die "no pude conectar a la DB ${DB_NAME}"
log "conexion DB OK"

# Tamano aproximado de la DB segun information_schema
DB_BYTES="$(
  "${CLI_BIN}" --defaults-extra-file="${MY_CNF}" -N -B information_schema \
    --execute="SELECT COALESCE(SUM(data_length + index_length),0) FROM TABLES WHERE table_schema='${DB_NAME}';" \
    2>/dev/null | head -n1 | tr -d ' '
)"
DB_BYTES="${DB_BYTES:-0}"
log "DB size estimado: $(human_size "${DB_BYTES}")"

# ----------------------------------------------------------------------------
# DB — dump comprimido sin .sql intermedio
# ----------------------------------------------------------------------------
DB_OUT="${OUT_DIR}/wp-db.sql.gz"
log "dumping DB -> ${DB_OUT}"
"${DUMP_BIN}" --defaults-extra-file="${MY_CNF}" \
  --single-transaction --quick --routines --triggers --events \
  --no-tablespaces --default-character-set=utf8mb4 \
  "${DB_NAME}" | gzip -c > "${DB_OUT}"
sha_one "${DB_OUT}"

# ----------------------------------------------------------------------------
# FILES — tar del WP completo (incluye .htaccess top-level)
# ----------------------------------------------------------------------------
if have pigz; then GZ_BIN="pigz"; else GZ_BIN="gzip"; fi
log "compresor de tar: ${GZ_BIN}"

WP_PARENT="$(dirname "${WP_PATH}")"
WP_BASENAME="$(basename "${WP_PATH}")"

TAR_EXCLUDES=()
[[ -d "${WP_PATH}/wp-content/cache" ]] && \
  TAR_EXCLUDES+=( "--exclude=${WP_BASENAME}/wp-content/cache" )
[[ -d "${WP_PATH}/wp-content/uploads/cache" ]] && \
  TAR_EXCLUDES+=( "--exclude=${WP_BASENAME}/wp-content/uploads/cache" )

FILES_OUT="${OUT_DIR}/wp-files.tar.gz"
log "tar de ${WP_PATH} -> ${FILES_OUT}"
tar -C "${WP_PARENT}" \
    "${TAR_EXCLUDES[@]}" \
    --use-compress-program="${GZ_BIN}" \
    -cf "${FILES_OUT}" \
    "${WP_BASENAME}"
sha_one "${FILES_OUT}"

# ----------------------------------------------------------------------------
# SYSTEM — webserver, cron, php, info de sistema
# ----------------------------------------------------------------------------
NGINX_ACTIVE="no"; APACHE_ACTIVE="no"
systemctl is-active --quiet nginx    2>/dev/null && NGINX_ACTIVE="yes"
systemctl is-active --quiet apache2  2>/dev/null && APACHE_ACTIVE="yes"
log "webserver: nginx=${NGINX_ACTIVE} apache2=${APACHE_ACTIVE}"

WEB_OUT="${OUT_DIR}/webserver-config.tar.gz"
WEB_TARGETS=()
[[ "${NGINX_ACTIVE}"  == "yes" && -d /etc/nginx    ]] && WEB_TARGETS+=( "etc/nginx" )
[[ "${APACHE_ACTIVE}" == "yes" && -d /etc/apache2  ]] && WEB_TARGETS+=( "etc/apache2" )
if [[ "${#WEB_TARGETS[@]}" -gt 0 ]]; then
  log "tar webserver config -> ${WEB_OUT}"
  tar -C / --use-compress-program="${GZ_BIN}" -cf "${WEB_OUT}" "${WEB_TARGETS[@]}"
  sha_one "${WEB_OUT}"
else
  log "WARN: ni nginx ni apache2 activos; omito webserver-config.tar.gz"
fi

# Cron
CRON_OUT="${OUT_DIR}/cron.tar.gz"
CRON_TARGETS=()
[[ -d /etc/cron.d              ]] && CRON_TARGETS+=( "etc/cron.d" )
[[ -f /etc/crontab             ]] && CRON_TARGETS+=( "etc/crontab" )
[[ -d /var/spool/cron/crontabs ]] && CRON_TARGETS+=( "var/spool/cron/crontabs" )
if [[ "${#CRON_TARGETS[@]}" -gt 0 ]]; then
  log "tar cron -> ${CRON_OUT}"
  tar -C / --use-compress-program="${GZ_BIN}" -cf "${CRON_OUT}" "${CRON_TARGETS[@]}"
  sha_one "${CRON_OUT}"
else
  log "WARN: no hay rutas de cron; omito cron.tar.gz"
fi

# PHP config
PHP_OUT="${OUT_DIR}/php-config.tar.gz"
if [[ -d /etc/php ]]; then
  log "tar /etc/php -> ${PHP_OUT}"
  tar -C / --use-compress-program="${GZ_BIN}" -cf "${PHP_OUT}" "etc/php"
  sha_one "${PHP_OUT}"
else
  log "WARN: /etc/php no existe; omito php-config.tar.gz"
fi

# Inventario del sistema
SYSINFO="${OUT_DIR}/system-info.txt"
log "generando ${SYSINFO}"
{
  printf '=== hostname ===\n';        hostname -f 2>/dev/null || hostname
  printf '\n=== uname -a ===\n';      uname -a
  printf '\n=== lsb_release -a ===\n';lsb_release -a 2>/dev/null || cat /etc/os-release 2>/dev/null || true
  printf '\n=== df -h ===\n';         df -h
  printf '\n=== free -h ===\n';       free -h
  printf '\n=== dpkg packages (web/db/php) ===\n'
  dpkg -l 2>/dev/null | grep -E 'nginx|apache|mysql|mariadb|php' || true
  printf '\n=== ss -tlnp ===\n';      ss -tlnp 2>/dev/null || true
  printf '\n=== running services ===\n'
  systemctl list-units --type=service --state=running --no-pager 2>/dev/null || true
} > "${SYSINFO}"
sha_one "${SYSINFO}"

# ----------------------------------------------------------------------------
# MANIFEST
# ----------------------------------------------------------------------------
WP_POST_BYTES="$(du -sb "${WP_PATH}" | awk '{print $1}')"
MANIFEST="${OUT_DIR}/manifest.txt"
{
  printf 'ITRC WordPress legacy backup\n'
  printf 'script_version: %s\n' "${SCRIPT_VERSION}"
  printf 'timestamp:      %s\n' "${TIMESTAMP}"
  printf 'started_at:     %s\n' "$(date -Iseconds)"
  printf 'hostname:       %s\n' "$(hostname -f 2>/dev/null || hostname)"
  printf 'wp_path:        %s\n' "${WP_PATH}"
  printf 'wp_size_pre:    %s (%s bytes)\n' "$(human_size "${WP_BYTES}")"      "${WP_BYTES}"
  printf 'wp_size_post:   %s (%s bytes)\n' "$(human_size "${WP_POST_BYTES}")" "${WP_POST_BYTES}"
  printf 'db_name:        %s\n' "${DB_NAME}"
  printf 'db_size_pre:    %s (%s bytes)\n' "$(human_size "${DB_BYTES}")"      "${DB_BYTES}"
  printf 'dump_binary:    %s\n' "${DUMP_BIN}"
  printf 'gz_binary:      %s\n' "${GZ_BIN}"
  printf 'nginx_active:   %s\n' "${NGINX_ACTIVE}"
  printf 'apache_active:  %s\n' "${APACHE_ACTIVE}"
  printf '\nartifacts:\n'
  ( cd "${OUT_DIR}" && for f in *.gz *.txt; do
      [[ -f "${f}" && "${f}" != "manifest.txt" ]] || continue
      printf '  %-28s %s\n' "${f}" "$(human_size "$(stat -c%s "${f}")")"
    done )
} > "${MANIFEST}"
sha_one "${MANIFEST}"

# ----------------------------------------------------------------------------
# CHECKSUMS — agregado final
# ----------------------------------------------------------------------------
log "consolidando SHA256SUMS"
( cd "${OUT_DIR}" && \
  : > SHA256SUMS && \
  for f in *.gz *.txt; do
    [[ -f "${f}" && "${f}" != "SHA256SUMS" ]] || continue
    sha256sum "${f}" >> SHA256SUMS
  done )

# ----------------------------------------------------------------------------
# FINISH
# ----------------------------------------------------------------------------
TOTAL_BYTES="$(du -sb "${OUT_DIR}" | awk '{print $1}')"
log "verificando SHA256SUMS"
( cd "${OUT_DIR}" && sha256sum -c SHA256SUMS >/dev/null ) \
  || die "verificacion final de SHA256SUMS fallida"

printf '\n'
printf 'backup dir:  %s\n' "${OUT_DIR}"
printf 'total size:  %s (%s bytes)\n' "$(human_size "${TOTAL_BYTES}")" "${TOTAL_BYTES}"
printf 'OK\n'
