# Instalación

Pasos para clonar y correr el portal ITRC en una máquina nueva.

## Requisitos

| Herramienta | Versión | Para qué |
|---|---|---|
| Node.js | 20 LTS | Astro y Strapi |
| npm | 10+ | Gestión de dependencias |
| Docker + Docker Compose | reciente | Postgres del CMS |
| Git | 2.30+ | Clonar el repo |
| rsync | cualquiera | Deploy al servidor (solo si se va a desplegar) |

## Clonar el repositorio

```bash
git clone https://github.com/cdavidbm/pitrcastro.git
cd pitrcastro
```

## Frontend Astro

```bash
npm install
npm run dev
```

El sitio queda en `http://localhost:4321`.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build estático a `dist/` |
| `npm run preview` | Sirve el build local para inspección |

## CMS Strapi

El frontend consume Strapi en `http://localhost:1337` durante desarrollo. El stack se orquesta con un `docker-compose.yml` que vive en la **raíz del repo**, con dos modos:

| Modo | Comando | Qué levanta |
|---|---|---|
| **Local dev** (default) | `docker compose up -d` | Solo Postgres. Strapi corre nativo con `npm run develop`. |
| **Server / producción** | `docker compose --profile server up -d --build` | Postgres + Strapi (build de `cms-strapi/Dockerfile`). |

### Setup local

```bash
# Desde la raíz del repo
cp .env.cms.example .env.cms          # credenciales y secretos del stack
docker compose up -d                  # solo Postgres

# CMS Strapi nativo
cd cms-strapi
cp .env.example .env                  # variables del proceso Strapi
npm install
npm run develop
```

Admin panel: `http://localhost:1337/admin`. En el primer arranque pide crear el usuario administrador.

### Dos archivos de env del CMS

- **`.env.cms`** (raíz) — usado por `docker-compose.yml`. Define `CMS_DB_*` y los `STRAPI_*` cuando Strapi se levanta dentro de Docker (modo server).
- **`cms-strapi/.env`** — usado por Strapi cuando se corre nativo con `npm run develop`. Define `DATABASE_*`, `APP_KEYS`, etc. con los mismos valores apuntando al Postgres del compose.

### Variables mínimas de `cms-strapi/.env`

| Variable | Para qué |
|---|---|
| `HOST`, `PORT` | Binding (default `0.0.0.0:1337`) |
| `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY` | Secretos. Generar con `openssl rand -base64 16`. Strapi no arranca si están vacíos. |
| `DATABASE_CLIENT` | `postgres` |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` | Conexión a Postgres (default `127.0.0.1:5432`, db `strapi`) |
| `GITHUB_REPO`, `GITHUB_DISPATCH_TOKEN` | Opcionales. Disparan rebuild del frontend al publicar contenido (vía `repository_dispatch`). |

Ver [`cms-strapi/.env.example`](../cms-strapi/.env.example) y [`.env.cms.example`](../.env.cms.example) en raíz.

## Variables del frontend Astro

El frontend lee Strapi via `src/utils/strapi.ts`. Las variables se leen con `import.meta.env`:

```env
# .env en la raíz del repo
STRAPI_URL=http://127.0.0.1:1337
STRAPI_TOKEN=<opcional — token readonly>
```

Sin `STRAPI_URL`, el código cae a `http://127.0.0.1:1337` por defecto. Sin `STRAPI_TOKEN`, usa los endpoints públicos: el bootstrap de Strapi (`cms-strapi/src/index.ts`) configura `find`/`findOne` para el rol Public en todos los content types declarados en el manifest.

El token (si se usa) se crea en Strapi admin → Settings → API Tokens → tipo "Read-only".

## Verificación rápida

1. `curl http://localhost:1337/api/agencia-mision-vision` debe responder JSON con datos.
2. `npm run dev` en la raíz debe arrancar sin errores y `http://localhost:4321` cargar el home con datos del CMS.
3. `npm run build` debe terminar sin errores y generar `dist/` con páginas HTML.

## Siguiente paso

- Para subir el sitio al servidor: ver [`despliegue.md`](despliegue.md).
- Para usar el CMS como editor: ver [`manual-operador/`](manual-operador/).
