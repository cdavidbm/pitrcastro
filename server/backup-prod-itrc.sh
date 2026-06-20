#!/usr/bin/env bash
# Backup integral del server productivo de HostDime (santorini, 10.5.10.6)
# que sirve www.itrc.gov.co antes del cutover a Astro+Strapi.
#
# Cubre: WP principal (Itrc) + ciprep + observatorio + relatorias (Joomla) +
# denuncias (PHP custom), las 5 DBs, config nginx, PHP-FPM, cron y system-info.
#
# Uso (como root en el server):
#   ./backup-prod-itrc.sh
#
# Salida: /root/backups/itrc-prod-YYYYMMDD-HHMMSS/  (con SHA256SUMS)

set -euo pipefail
export LC_ALL=C

# === Configuracion =========================================================
WWW_ROOT="/var/www/portal_principal"
NGINX_DIR="/etc/nginx"
PHP_DIR="/etc/php"
BACKUP_ROOT="${BACKUP_ROOT:-/root/backups}"
TIMESTAMP="${TIMESTAMP:-$(date +%Y%m%d-%H%M%S)}"
OUT_DIR="${BACKUP_ROOT}/itrc-prod-${TIMESTAMP}"
DBS=(ltrc_db ciprep_db observatorio_db itrcgovc_relatoria denuncias_db)

# === Helpers ===============================================================
log()  { echo "[$(date +%H:%M:%S)] $*"; }
die()  { echo "[$(date +%H:%M:%S)] ERROR: $*" >&2; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }
hsz()  { numfmt --to=iec --suffix=B "$1" 2>/dev/null || echo "${1}B"; }

# === Pre-flight ============================================================
[ "$(id -u)" -eq 0 ] || die "Hay que correrlo como root."
[ -d "$WWW_ROOT" ]   || die "No existe ${WWW_ROOT}."
[ -d "$OUT_DIR"   ]  && die "Ya existe ${OUT_DIR}. No sobrescribo."

DUMP_BIN=""
if   have mariadb-dump; then DUMP_BIN="mariadb-dump"
elif have mysqldump;    then DUMP_BIN="mysqldump"
else die "Falta mariadb-dump / mysqldump."
fi

GZIP_BIN="gzip"
have pigz && GZIP_BIN="pigz"

mkdir -p "$OUT_DIR"
chmod 700 "$OUT_DIR"

log "Backup -> ${OUT_DIR}"
log "Compresor: ${GZIP_BIN} | Dump: ${DUMP_BIN}"

# Estimacion de tamano: WWW + DBs. Refuse si no entra (factor 1.5x).
SRC_BYTES=$(du -sb "$WWW_ROOT" | awk '{print $1}')
FREE_BYTES=$(df -B1 --output=avail "$BACKUP_ROOT" | tail -1)
if [ "$FREE_BYTES" -lt $((SRC_BYTES * 3 / 2)) ]; then
  die "Espacio insuficiente. Libre: $(hsz $FREE_BYTES) | Fuente: $(hsz $SRC_BYTES)"
fi
log "Fuente $(hsz $SRC_BYTES) / libre $(hsz $FREE_BYTES) -> OK"

# === DB ====================================================================
log "Dumpeando ${#DBS[@]} DBs (auth via socket, root sin password)..."
for db in "${DBS[@]}"; do
  out="${OUT_DIR}/db-${db}.sql.gz"
  log "  - ${db}"
  "$DUMP_BIN" -u root --single-transaction --quick --routines --triggers --events \
              --no-tablespaces --default-character-set=utf8mb4 "$db" \
    | "$GZIP_BIN" -c > "$out"
  sha256sum "$out" > "${out}.sha256"
done

# === Archivos web ==========================================================
log "Empaquetando ${WWW_ROOT} (esto tarda)..."
TAR_OUT="${OUT_DIR}/portal_principal.tar.gz"
# Tarea desde el padre para preservar la ruta absoluta en el restore.
# Excluyo caches de WP que son regenerables.
tar -C "$(dirname "$WWW_ROOT")" \
    --exclude="$(basename "$WWW_ROOT")/Itrc/wp-content/cache" \
    --exclude="$(basename "$WWW_ROOT")/Itrc/wp-content/uploads/cache" \
    --exclude="$(basename "$WWW_ROOT")/ciprep/wp-content/cache" \
    --exclude="$(basename "$WWW_ROOT")/observatorio/wp-content/cache" \
    --exclude="$(basename "$WWW_ROOT")/relatorias/cache" \
    --exclude="$(basename "$WWW_ROOT")/relatorias/tmp" \
    -cf - "$(basename "$WWW_ROOT")" \
  | "$GZIP_BIN" -c > "$TAR_OUT"
sha256sum "$TAR_OUT" > "${TAR_OUT}.sha256"

# === Configuraciones del sistema ===========================================
log "Snapshot de configuracion (nginx, php, cron)..."
tar -C / -czf "${OUT_DIR}/nginx-config.tar.gz" "${NGINX_DIR#/}"
sha256sum "${OUT_DIR}/nginx-config.tar.gz" > "${OUT_DIR}/nginx-config.tar.gz.sha256"

if [ -d "$PHP_DIR" ]; then
  tar -C / -czf "${OUT_DIR}/php-config.tar.gz" "${PHP_DIR#/}"
  sha256sum "${OUT_DIR}/php-config.tar.gz" > "${OUT_DIR}/php-config.tar.gz.sha256"
fi

CRON_PATHS=()
[ -d /etc/cron.d ]               && CRON_PATHS+=(etc/cron.d)
[ -f /etc/crontab ]              && CRON_PATHS+=(etc/crontab)
[ -d /var/spool/cron/crontabs ]  && CRON_PATHS+=(var/spool/cron/crontabs)
if [ "${#CRON_PATHS[@]}" -gt 0 ]; then
  tar -C / -czf "${OUT_DIR}/cron.tar.gz" "${CRON_PATHS[@]}"
  sha256sum "${OUT_DIR}/cron.tar.gz" > "${OUT_DIR}/cron.tar.gz.sha256"
fi

# === Info del sistema ======================================================
log "Capturando system-info..."
{
  echo "=== hostname ==="; hostname
  echo "=== date     ==="; date -u
  echo "=== uname    ==="; uname -a
  echo "=== os       ==="; cat /etc/os-release 2>/dev/null
  echo "=== uptime   ==="; uptime
  echo "=== df -h    ==="; df -h
  echo "=== free -h  ==="; free -h
  echo "=== packages ==="; dpkg -l | grep -E "nginx|php|mariadb|mysql|fail2ban|certbot" | awk '{print $1, $2, $3}'
  echo "=== systemctl running ==="; systemctl list-units --type=service --state=running --no-pager
  echo "=== ss -tlnp ==="; ss -tlnp 2>/dev/null
  echo "=== ufw / iptables (si hay) ==="; ufw status 2>/dev/null; iptables -L -n 2>/dev/null | head -50
} > "${OUT_DIR}/system-info.txt"

# === Manifest + checksum global ============================================
log "Generando manifest y SHA256SUMS..."
{
  echo "# Backup itrc-prod (${TIMESTAMP})"
  echo "# host: $(hostname)  |  uname: $(uname -r)"
  echo
  echo "## Artefactos:"
  ls -lh "$OUT_DIR" | awk '{print $5, $9}' | grep -v sha256
  echo
  echo "## DBs incluidas:"
  printf '  - %s\n' "${DBS[@]}"
  echo
  echo "## Restauracion sugerida:"
  echo "  - Archivos: tar -C / -xzf portal_principal.tar.gz"
  echo "  - Cada DB : zcat db-<nombre>.sql.gz | mysql -u root <nombre>"
  echo "  - Config  : tar -C / -xzf nginx-config.tar.gz (cuidado de no pisar config viva)"
} > "${OUT_DIR}/manifest.txt"

( cd "$OUT_DIR" && find . -maxdepth 1 -type f ! -name 'SHA256SUMS' ! -name '*.sha256' -print0 \
   | xargs -0 sha256sum > SHA256SUMS )

# Verifico self-consistency
( cd "$OUT_DIR" && sha256sum -c SHA256SUMS --quiet ) \
  && log "SHA256SUMS verificado: OK" \
  || die "SHA256SUMS no verifica."

TOTAL=$(du -sb "$OUT_DIR" | awk '{print $1}')
log "DONE. Backup en ${OUT_DIR} | total $(hsz $TOTAL)"
echo "OK"
