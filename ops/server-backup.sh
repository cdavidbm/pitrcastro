#!/usr/bin/env bash
# ops/server-backup.sh — Backup nocturno del servidor ITRC
#
# Estrategia "Time Machine" con rsync --link-dest: cada snapshot es un árbol
# completo navegable, pero archivos sin cambios son hardlinks al snapshot
# anterior. Disco usado ≈ tamaño actual + suma de deltas diarios.
#
# Política de retención:
#   - daily.0..6   (7 días, rotación FIFO)
#   - weekly.0..3  (4 semanas, snapshot cada domingo)
#   - monthly.0..5 (6 meses, snapshot cada día 1)
#
# Instalación (como root en el servidor):
#   sudo cp ops/server-backup.sh /usr/local/bin/itrc-backup.sh
#   sudo chmod +x /usr/local/bin/itrc-backup.sh
#   sudo mkdir -p /var/backups/itrc-web /var/log
#   sudo tee /etc/cron.d/itrc-backup > /dev/null <<EOF
#   MAILTO=daniel@digitalia.gov.co
#   0 2 * * * root /usr/local/bin/itrc-backup.sh >> /var/log/itrc-backup.log 2>&1
#   EOF
#
# Test manual:
#   sudo /usr/local/bin/itrc-backup.sh
#
# Restaurar un snapshot a producción:
#   sudo rsync -a /var/backups/itrc-web/daily/daily.3/ /var/www/itrc-web/

set -euo pipefail

# ---- Configuración ----
WEBROOT="${WEBROOT:-/var/www/itrc-web}"
BACKUP_BASE="${BACKUP_BASE:-/var/backups/itrc-web}"
LOG_FILE="${LOG_FILE:-/var/log/itrc-backup.log}"

DAILY_DIR="$BACKUP_BASE/daily"
WEEKLY_DIR="$BACKUP_BASE/weekly"
MONTHLY_DIR="$BACKUP_BASE/monthly"
CONFIGS_DIR="$BACKUP_BASE/configs"

DAILY_KEEP=7
WEEKLY_KEEP=4
MONTHLY_KEEP=6
CONFIGS_KEEP=30  # tarballs de config (uno por día)

# ---- Funciones ----
TS="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"

log() {
  echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] $*" | tee -a "$LOG_FILE"
}

fail() {
  log "ERROR: $*"
  exit 1
}

# Trap: si algo falla, log y salir (con trap, cron mandará email)
trap 'fail "script falló en línea $LINENO"' ERR

# Verificación temprana
[ -d "$WEBROOT" ] || fail "WEBROOT no existe: $WEBROOT"
mkdir -p "$DAILY_DIR" "$WEEKLY_DIR" "$MONTHLY_DIR" "$CONFIGS_DIR"

log "=== INICIO BACKUP $TS ==="
log "WEBROOT: $WEBROOT"
log "BACKUP_BASE: $BACKUP_BASE"

# ---- 1. Snapshot diario (FIFO N=7) ----
log "Rotando snapshots diarios..."

# Si existe daily.6, eliminarlo (es el más antiguo)
if [ -d "$DAILY_DIR/daily.$((DAILY_KEEP - 1))" ]; then
  rm -rf "$DAILY_DIR/daily.$((DAILY_KEEP - 1))"
fi

# Mover daily.5 → daily.6, ..., daily.0 → daily.1
for i in $(seq $((DAILY_KEEP - 2)) -1 0); do
  if [ -d "$DAILY_DIR/daily.$i" ]; then
    mv "$DAILY_DIR/daily.$i" "$DAILY_DIR/daily.$((i + 1))"
  fi
done

# Crear nuevo daily.0
if [ -d "$DAILY_DIR/daily.1" ]; then
  log "rsync incremental contra daily.1 (hardlinks para no duplicar)"
  rsync -a --delete --link-dest="$DAILY_DIR/daily.1" \
    "$WEBROOT/" "$DAILY_DIR/daily.0/"
else
  log "primera ejecución: copia completa"
  rsync -a --delete "$WEBROOT/" "$DAILY_DIR/daily.0/"
fi

# ---- 2. Weekly (domingos) ----
if [ "$(date -u +%u)" = "7" ]; then
  log "Domingo: rotando snapshots semanales..."
  if [ -d "$WEEKLY_DIR/weekly.$((WEEKLY_KEEP - 1))" ]; then
    rm -rf "$WEEKLY_DIR/weekly.$((WEEKLY_KEEP - 1))"
  fi
  for i in $(seq $((WEEKLY_KEEP - 2)) -1 0); do
    if [ -d "$WEEKLY_DIR/weekly.$i" ]; then
      mv "$WEEKLY_DIR/weekly.$i" "$WEEKLY_DIR/weekly.$((i + 1))"
    fi
  done
  # cp -al = recursive copy preserving hardlinks (no duplica disco)
  cp -al "$DAILY_DIR/daily.0" "$WEEKLY_DIR/weekly.0"
  log "weekly.0 creado"
fi

# ---- 3. Monthly (día 1) ----
if [ "$(date -u +%d)" = "01" ]; then
  log "Día 1 del mes: rotando snapshots mensuales..."
  if [ -d "$MONTHLY_DIR/monthly.$((MONTHLY_KEEP - 1))" ]; then
    rm -rf "$MONTHLY_DIR/monthly.$((MONTHLY_KEEP - 1))"
  fi
  for i in $(seq $((MONTHLY_KEEP - 2)) -1 0); do
    if [ -d "$MONTHLY_DIR/monthly.$i" ]; then
      mv "$MONTHLY_DIR/monthly.$i" "$MONTHLY_DIR/monthly.$((i + 1))"
    fi
  done
  cp -al "$DAILY_DIR/daily.0" "$MONTHLY_DIR/monthly.0"
  log "monthly.0 creado"
fi

# ---- 4. Configs del servidor ----
log "Backup de configs del servidor..."
TARBALL="$CONFIGS_DIR/configs-$(date -u +%Y-%m-%d).tar.gz"

# Lista de paths a backupear. Cada uno se intenta; si no existe, se loguea
# pero el script continúa.
CONFIG_PATHS=(
  /etc/nginx/sites-available
  /etc/nginx/sites-enabled
  /etc/sudoers.d
  /etc/systemd/system/actions.runner.cdavidbm-pitrcastro.itrc-server.service
  /etc/ufw/user.rules
  /etc/ufw/user6.rules
  /etc/letsencrypt
)

# Construir lista de paths existentes
EXISTING_PATHS=()
for p in "${CONFIG_PATHS[@]}"; do
  if [ -e "$p" ]; then
    EXISTING_PATHS+=("$p")
  else
    log "  (skip, no existe: $p)"
  fi
done

# Tar con metadatos del sistema
{
  tar czf "$TARBALL" \
    "${EXISTING_PATHS[@]}" \
    --warning=no-file-changed \
    2>&1 || log "warning: tar reportó algún archivo cambiado durante el backup"
} || true

# Lista de paquetes instalados
dpkg --get-selections > "$CONFIGS_DIR/packages-$(date -u +%Y-%m-%d).txt" 2>/dev/null || true

# Versión del kernel + OS
{
  echo "kernel: $(uname -r)"
  echo "os:     $(lsb_release -ds 2>/dev/null || cat /etc/os-release | head -2)"
  echo "uptime: $(uptime)"
} > "$CONFIGS_DIR/system-$(date -u +%Y-%m-%d).txt"

# Limpiar configs viejos (mantener solo CONFIGS_KEEP más recientes)
# Usa find (no ls + glob brace) porque con pipefail + set -e los globs vacíos
# matan el script. find con -name retorna 0 aunque no haya matches.
for prefix in configs packages system; do
  find "$CONFIGS_DIR" -maxdepth 1 -type f -name "${prefix}-*" \
    -printf '%T@\t%p\n' 2>/dev/null \
    | sort -rn \
    | awk -F'\t' -v keep="$CONFIGS_KEEP" 'NR > keep {print $2}' \
    | xargs -r rm -f
done

# ---- 5. Reporte ----
USAGE_BACKUPS=$(du -sh "$BACKUP_BASE" 2>/dev/null | cut -f1)
USAGE_DAILY=$(du -sh "$DAILY_DIR" 2>/dev/null | cut -f1)
DISK_AVAIL=$(df -h / | awk 'NR==2 {print $4}')
DISK_USE_PCT=$(df -h / | awk 'NR==2 {print $5}')

log "Espacio: backups=$USAGE_BACKUPS (daily: $USAGE_DAILY), disco libre=$DISK_AVAIL ($DISK_USE_PCT usado)"

# Alerta temprana de disco lleno
DISK_USE_NUM=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
if [ "$DISK_USE_NUM" -ge 85 ]; then
  log "WARN: disco al $DISK_USE_PCT — considerar reducir retención o expandir LVM"
fi

log "=== FIN BACKUP $TS (success) ==="
