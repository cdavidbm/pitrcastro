# Despliegue

Guía para desplegar el portal ITRC al servidor de pruebas (`192.168.82.13`, accesible por VPN FortiClient).

## Flujos disponibles

| Cuándo se usa | Qué hace |
|---|---|
| `git push origin main` | El workflow `.github/workflows/deploy.yml` corre en runner self-hosted instalado en el servidor: build + rsync + reload nginx + smoke test. Es el camino normal. |
| `pnpm deploy` | Igual, pero ejecutado localmente desde la máquina del operador. Sirve de fallback si el runner está caído. |
| `pnpm deploy:binarios` | Sube `public/documentos/` al servidor sin `--delete`. Los binarios no viajan en el repo (gitignored) y deben subirse aparte. |

Cambios solo en `docs/`, `README.md`, `LICENSE`, `.gitignore`, `CLAUDE.md` o `GEMINI.md` no disparan el deploy (`paths-ignore` en el workflow).

## TL;DR

```bash
# Setup local (una vez)
cp .env.deploy.example .env.deploy
# editar .env.deploy con los valores del servidor

# Push normal → auto-deploy en el runner del servidor
git push origin main

# Fallback manual si el runner no está disponible
pnpm deploy

# Subir binarios al servidor
pnpm deploy:binarios
```

Tanto el workflow como `pnpm deploy` excluyen `/documentos/` del rsync, para que un deploy del sitio no borre los binarios que ya viven en el servidor.

## Prerrequisitos

| Requisito | Cómo obtenerlo |
|---|---|
| Node.js 20 LTS + pnpm 10 | `nvm install 20` + `corepack enable && corepack prepare pnpm@10.34.1 --activate`. Detalle: [`instalacion.md`](instalacion.md#instalar-pnpm) |
| `rsync` | Linux/WSL: `sudo apt install rsync`. macOS: `brew install rsync` |
| `ssh` con llave pública en el servidor | Llave ED25519 agregada a `~/.ssh/authorized_keys` del usuario remoto |
| Acceso a la VPN institucional | FortiClient configurado y con ruta a `192.168.82.13` |
| `.env.deploy` | Copia de `.env.deploy.example` con valores reales |

## Variables del `.env.deploy`

| Variable | Ejemplo | Para qué |
|---|---|---|
| `SITE_URL` | `http://192.168.82.13` | URL canónica usada en sitemap, og:url, etc. |
| `BASE_PATH` | `/` | Base del routing. Usar `/sub/` solo si el sitio se monta bajo subdirectorio. |
| `DEPLOY_HOST` | `192.168.82.13` | Host SSH del servidor. |
| `DEPLOY_USER` | `admweb` | Usuario SSH (debe poder escribir en `DEPLOY_PATH`). |
| `DEPLOY_PATH` | `/var/www/itrc-web` | Carpeta servida por nginx. |
| `SSH_BIN` *(opcional)* | `ssh` | Forzar un binario SSH específico. Por defecto usa el del PATH. |

## VPN desde WSL

La VPN se mantiene en Windows; WSL la "ve" gracias a `networkingMode=mirrored` en `%UserProfile%\.wslconfig`:

```ini
[wsl2]
networkingMode=mirrored
dnsTunneling=true
autoProxy=true
```

Con eso (Windows 11 + WSL 2.x), `ssh`, `rsync`, `curl` nativos de Linux funcionan contra la VPN sin modificación.

Para aplicar cambios en `.wslconfig`: `wsl --shutdown` desde PowerShell y reabrir WSL.

## Qué viaja al servidor

Astro copia todo `public/` a `dist/` durante el build. El rsync envía `dist/` al servidor con `--delete`, lo que significa que archivos que ya no existen localmente se borran del servidor. Los uploads administrados por Strapi viven en el volumen Docker `itrc-cms-strapi-uploads` y no son tocados por rsync.

## Diagnóstico

| Síntoma | Causa probable | Solución |
|---|---|---|
| `rsync: command not found` | Falta rsync local | `sudo apt install rsync` o `brew install rsync` |
| `Connection timed out` al servidor | VPN sin ruta a la IP | Verificar perfil VPN y que `192.168.82.13` sea alcanzable |
| `Permission denied (publickey)` | Llave SSH no instalada en el servidor | `ssh-copy-id user@host` o agregar manualmente la pública |
| Build falla con error de URL | `SITE_URL` mal formada | Debe incluir protocolo (`http://` o `https://`) y sin `/` final |
| Páginas con assets rotos | `BASE_PATH` mal configurado | Para sitio en raíz usar `BASE_PATH=/`. Subdirectorio: `BASE_PATH=/subpath/` |
| Build OK pero sitio no aparece | `dist/` no llegó al servidor | Verificar permisos de escritura en `DEPLOY_PATH` |

Para detalles del servidor (nginx, runner, systemd, ufw), ver [`manual-operador/09-despliegue-datacenter.md`](manual-operador/09-despliegue-datacenter.md).
