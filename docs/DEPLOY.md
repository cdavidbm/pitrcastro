# Deploy — guía rápida

Esta guía cubre el flujo de despliegue **actual** del portal ITRC al servidor de pruebas. Para el plan completo de la arquitectura (auto-deploy, dominio público, TLS), ver [`docs/manual-operador/09-despliegue-datacenter.md`](manual-operador/09-despliegue-datacenter.md).

> **Auto-deploy operativo desde 2026-05-08.** Cada `push` a `main` dispara el workflow `.github/workflows/deploy.yml` que corre en runner self-hosted. Cambios solo en `docs/`, `README.md`, `LICENSE`, `.gitignore`, `CLAUDE.md` o `GEMINI.md` **no disparan deploy** (paths-ignore configurado).

## TL;DR

```bash
# Una vez (setup local)
cp .env.deploy.example .env.deploy
# editar .env.deploy con valores del servidor

# Caso normal: push a main → auto-deploy via runner self-hosted
git push origin main

# Caso fallback: deploy manual de fallback (si el runner está caído)
npm run deploy

# Subir binarios (PDFs, imágenes, etc.) desde local al servidor
npm run deploy:binarios
```

### Tres flujos distintos

| Cuándo usarlo | Qué hace |
|---|---|
| `git push` a `main` | Workflow `.github/workflows/deploy.yml` corre en runner self-hosted: build + rsync + reload nginx + smoke test. Es el camino normal. |
| `npm run deploy` | Igual, pero ejecutado localmente desde tu máquina. Fallback si el runner está caído. |
| `npm run deploy:binarios` | **Solo binarios**. Sube `public/documentos/` local al servidor sin `--delete`. Necesario porque los ~3.5 GB de binarios NO están commiteados al repo (gitignored), entonces ni el runner ni el deploy manual del sitio los conocen. |

**Importante**: tanto el workflow como `npm run deploy` excluyen `/documentos/` del rsync. Eso evita que un deploy del sitio borre los binarios del servidor. El precio es que **los binarios viven solo en el filesystem del servidor + en el local del operador**. No hay backup automático todavía. Cuando exista el endpoint Node de uploads, este flujo se reemplaza.

## Prerrequisitos

| Requisito | Cómo obtenerlo |
|---|---|
| Node.js + npm | `nvm install 20` o instalar Node 20 LTS desde nodejs.org |
| `rsync` | Linux/WSL: `sudo apt install rsync`. macOS: `brew install rsync` |
| `ssh` con llave configurada en el servidor | Llave ED25519 + agregada a `~/.ssh/authorized_keys` del usuario remoto |
| Acceso de red al servidor | VPN institucional habilitada para la IP del servidor |
| `.env.deploy` configurado | Copiado desde `.env.deploy.example` con valores reales |

## Variables del `.env.deploy`

| Variable | Ejemplo | Para qué |
|---|---|---|
| `SITE_URL` | `http://192.168.82.13` | URL canónica que aparece en sitemap, og:url, etc. |
| `BASE_PATH` | `/` | Base del routing. Usar `/sub/` solo si el sitio se monta bajo subdirectorio. |
| `DEPLOY_HOST` | `192.168.82.13` | Host SSH del servidor. |
| `DEPLOY_USER` | `admweb` | Usuario SSH (debe poder escribir en `DEPLOY_PATH`). |
| `DEPLOY_PATH` | `/var/www/itrc-web` | Carpeta servida por nginx. |
| `SSH_BIN` *(opcional)* | `/mnt/c/Windows/System32/OpenSSH/ssh.exe` | Forzar binario SSH específico. Necesario en WSL si la VPN corre en Windows. |

## Notas importantes

### El binario SSH desde WSL

Si trabajas en WSL y la VPN está en Windows (caso típico con FortiClient), WSL **no ve** las rutas de la VPN. Hay que usar el `ssh.exe` de Windows que sí las ve:

```
SSH_BIN=/mnt/c/Windows/System32/OpenSSH/ssh.exe
```

`rsync` usa este binario para conectar al servidor sin tocar configuración de WSL.

### Lo que viaja al servidor

Astro copia todo el contenido de `public/` a `dist/` durante el build. Esto significa que **los binarios en `public/documentos/`** (gitignored o no) viajan al servidor en cada deploy. Para volúmenes grandes (~3.5 GB en ITRC) eso es lento y consume ancho de banda. La fase futura introduce un endpoint de upload separado que evita esto (ver `docs/manual-operador/09`, sección sobre arquitectura objetivo).

### `--delete` en rsync

El script usa `rsync --delete`, lo que significa que **archivos que ya no existen en `dist/` se borran del servidor**. Esto mantiene el servidor sincronizado con tu build local. Si hay archivos que no deberían borrarse (uploads de Sveltia hechos en el servidor, cuando exista esa fase), van en una carpeta separada (`/var/www/uploads/` o similar) que rsync no toca.

## Diagnóstico de problemas comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| `rsync: command not found` | Falta rsync local | `sudo apt install rsync` (Linux/WSL) o `brew install rsync` (macOS) |
| `Connection timed out` al servidor | VPN sin ruta a la IP del servidor | Pedir al admin de red que agregue la IP a tu perfil VPN |
| `Permission denied (publickey)` | Llave SSH no instalada en el servidor | `ssh-copy-id user@host` o agregar manualmente la pública a `~/.ssh/authorized_keys` |
| Build falla con error de URL | `SITE_URL` mal formada | Debe incluir protocolo (`http://` o `https://`) y sin `/` final |
| Páginas con assets rotos | `BASE_PATH` mal configurado | Para sitio en raíz usar `BASE_PATH=/`. Para subdirectorio: `BASE_PATH=/subpath/` (con slashes en ambos lados) |
| Build OK pero sitio sin aparecer | `dist/` no llegó al servidor | Verificar permisos en `DEPLOY_PATH`, que el usuario remoto pueda escribir |

## Siguiente paso planeado

Auto-deploy via self-hosted GitHub Actions runner en el servidor: cada `git push` a `main` dispara build + deploy automáticos. Ver `docs/manual-operador/09-despliegue-datacenter.md` sección D para el plan.
