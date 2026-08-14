#!/usr/bin/env bash
# ops/strapi-tunnel.sh — Abre/cierra un túnel SSH al Strapi de producción.
#
# Permite trabajar en el panel admin del servidor sin levantar `pnpm develop`
# localmente (que tarda 5-8 min en arrancar y debe reiniciarse cada vez que
# cambian los schemas).
#
# Una vez abierto, el panel admin del servidor está accesible en:
#   http://localhost:11337/admin
#
# El túnel entra directamente al Strapi del servidor, sin pasar por el
# intermediario del proveedor, cuya política de seguridad impide que el panel
# cargue por la dirección pública.
#
# Subcomandos:
#   open    — abre el túnel en background y guarda el PID
#   close   — mata el túnel
#   status  — muestra si está abierto y el PID
#
# Uso desde la raíz del repo (vía pnpm script):
#   pnpm strapi:tunnel          # alias de "open"
#   pnpm strapi:tunnel:close
#   pnpm strapi:tunnel:status
#
# Requisitos:
#   - Acceso SSH al servidor (alias `itrc-prod` en ~/.ssh/config, con llave)
#   - Si la ruta directa no está disponible: VPN arriba (~/itrc-vpn-up.sh bg)

set -euo pipefail

PID_FILE="/tmp/itrc-strapi-tunnel.pid"

LOCAL_PORT="${STRAPI_TUNNEL_LOCAL_PORT:-11337}"
REMOTE_PORT="${STRAPI_TUNNEL_REMOTE_PORT:-1337}"

# Destino SSH. Por defecto el alias de producción definido en ~/.ssh/config.
SSH_TARGET="${STRAPI_TUNNEL_SSH_TARGET:-itrc-prod}"

cmd_status() {
  if [ -f "${PID_FILE}" ] && kill -0 "$(cat "${PID_FILE}")" 2>/dev/null; then
    PID="$(cat "${PID_FILE}")"
    echo "✓ Túnel ACTIVO (PID ${PID})"
    echo "  localhost:${LOCAL_PORT} → ${SSH_TARGET}:${REMOTE_PORT}"
    echo "  Panel admin:   http://localhost:${LOCAL_PORT}/admin"
    echo "  API:           http://localhost:${LOCAL_PORT}/api"
    return 0
  fi
  echo "✗ Túnel NO está activo"
  return 1
}

cmd_open() {
  # ¿ya está abierto?
  if cmd_status >/dev/null 2>&1; then
    echo "El túnel ya está activo. Ejecuta 'pnpm strapi:tunnel:status' para detalles."
    cmd_status
    return 0
  fi

  # Limpiar PID file huérfano si quedó
  rm -f "${PID_FILE}"

  # Verificar que el servidor responde por SSH antes de intentar
  echo "==> Verificando acceso SSH a ${SSH_TARGET}..."
  if ! ssh -o ConnectTimeout=10 -o BatchMode=yes "${SSH_TARGET}" true 2>/dev/null; then
    echo "ERROR: no se puede conectar por SSH a ${SSH_TARGET}." >&2
    echo "       Si la ruta directa no está disponible, levanta la VPN:" >&2
    echo "         ~/itrc-vpn-up.sh bg" >&2
    exit 1
  fi
  echo "  SSH OK"

  # Verificar puerto local libre
  if timeout 2 bash -c "cat < /dev/null > /dev/tcp/127.0.0.1/${LOCAL_PORT}" 2>/dev/null; then
    echo "ERROR: el puerto local ${LOCAL_PORT} ya está ocupado." >&2
    echo "       ¿Tienes Strapi local corriendo, u otro túnel? Cierra antes de abrir uno nuevo." >&2
    exit 1
  fi

  echo "==> Abriendo túnel localhost:${LOCAL_PORT} → ${SSH_TARGET}:${REMOTE_PORT}..."
  # -N: no ejecutar comando remoto
  # -f: NO usar -f acá porque pierde el PID; lanzamos en background con setsid
  # ServerAliveInterval: mantener vivo el túnel si la red corporativa corta idle
  # ExitOnForwardFailure: si el forward no se establece, salir en vez de quedar zombie
  # ControlPath=none: el túnel abre su propia conexión en vez de reutilizar la
  # compartida, para que cerrarlo sea predecible y no arrastre otras sesiones.
  setsid ssh -N \
    -o ServerAliveInterval=30 \
    -o ServerAliveCountMax=3 \
    -o ExitOnForwardFailure=yes \
    -o StrictHostKeyChecking=accept-new \
    -o ControlPath=none \
    -L "${LOCAL_PORT}:127.0.0.1:${REMOTE_PORT}" \
    "${SSH_TARGET}" \
    >/tmp/itrc-strapi-tunnel.log 2>&1 &
  TUNNEL_PID=$!
  echo "${TUNNEL_PID}" > "${PID_FILE}"

  # Esperar a que el túnel esté listo (max 10s)
  for i in $(seq 1 20); do
    if timeout 1 bash -c "cat < /dev/null > /dev/tcp/127.0.0.1/${LOCAL_PORT}" 2>/dev/null; then
      echo
      echo "✓ Túnel abierto (PID ${TUNNEL_PID})"
      echo
      echo "  Panel admin del CMS:   http://localhost:${LOCAL_PORT}/admin"
      echo "  API REST del CMS:      http://localhost:${LOCAL_PORT}/api"
      echo
      echo "  Para cerrar:           pnpm strapi:tunnel:close"
      echo "  Para verificar estado: pnpm strapi:tunnel:status"
      return 0
    fi
    sleep 0.5
  done

  echo "ERROR: el túnel no quedó listo en 10s. Revisa /tmp/itrc-strapi-tunnel.log" >&2
  cat /tmp/itrc-strapi-tunnel.log >&2 || true
  cmd_close >/dev/null 2>&1 || true
  exit 1
}

cmd_close() {
  if [ ! -f "${PID_FILE}" ]; then
    echo "No hay PID file. ¿El túnel no estaba abierto desde este script?"
    # Intentar matar cualquier ssh con nuestro forward por si quedó huérfano
    if pgrep -af "ssh -N.*L ${LOCAL_PORT}:127.0.0.1:${REMOTE_PORT}" >/dev/null 2>&1; then
      echo "  Encontré un ssh con el mismo forward. Lo cierro..."
      pkill -f "ssh -N.*L ${LOCAL_PORT}:127.0.0.1:${REMOTE_PORT}" || true
      echo "✓ Cerrado"
    fi
    return 0
  fi
  PID="$(cat "${PID_FILE}")"
  if kill "${PID}" 2>/dev/null; then
    echo "✓ Túnel cerrado (PID ${PID})"
  else
    echo "El proceso ${PID} ya no estaba vivo."
  fi
  rm -f "${PID_FILE}"
}

case "${1:-open}" in
  open)   cmd_open ;;
  close)  cmd_close ;;
  status) cmd_status ;;
  *)
    echo "Uso: $0 {open|close|status}" >&2
    exit 1
    ;;
esac
