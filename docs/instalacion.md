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

El frontend consume Strapi en `http://localhost:1337` durante desarrollo. Para levantarlo:

```bash
cd cms-strapi

# Postgres en Docker
docker compose up -d

# Variables del CMS
cp .env.example .env
# editar .env con las credenciales locales (ver más abajo)

npm install
npm run develop
```

Admin panel: `http://localhost:1337/admin`. En el primer arranque pide crear el usuario administrador.

### Variables mínimas de `cms-strapi/.env`

| Variable | Para qué |
|---|---|
| `HOST` | Por defecto `0.0.0.0` |
| `PORT` | Por defecto `1337` |
| `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET`, `TRANSFER_TOKEN_SALT` | Strings aleatorios (Strapi falla si están vacíos) |
| `DATABASE_CLIENT` | `postgres` |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` | Coincidir con `docker-compose.yml` |

`.env.example` ya trae la estructura, basta con generar los secretos.

## Variables del frontend Astro

El frontend lee Strapi via `src/utils/strapi-fetchers.ts`. Las variables relevantes viven en `.env` de la raíz:

```env
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=<token-readonly-generado-en-strapi-admin>
```

El token se crea en Strapi admin → Settings → API Tokens → tipo "Read-only".

Sin token, el frontend usa los endpoints públicos de Strapi (cualquier rol Public con permisos `find`/`findOne` funciona — el bootstrap los configura automáticamente para todos los content types).

## Verificación rápida

1. `curl http://localhost:1337/api/agencia-mision-vision` debe responder JSON con datos.
2. `npm run dev` en la raíz debe arrancar sin errores y `http://localhost:4321` cargar el home con datos del CMS.
3. `npm run build` debe terminar sin errores y generar `dist/` con páginas HTML.

## Siguiente paso

- Para subir el sitio al servidor: ver [`despliegue.md`](despliegue.md).
- Para usar el CMS como editor: ver [`manual-operador/`](manual-operador/).
