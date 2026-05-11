# CMS Strapi v5 — ITRC

Strapi headless del portal ITRC. Almacena el contenido institucional consumido por el frontend Astro durante el build.

## Stack

- Strapi v5 CE
- Postgres en Docker (orquestado por `docker-compose.yml` de la **raíz del repo**)
- Volumen Docker `itrc-cms-strapi-uploads` para media nativa
- Admin panel en `/admin`, API REST en `/api`

El compose tiene dos modos:

| Modo | Comando (desde raíz) | Qué levanta |
|---|---|---|
| Local dev | `docker compose up -d` | Solo Postgres. Strapi se corre nativo con `npm run develop` desde `cms-strapi/`. |
| Server / producción | `docker compose --profile server up -d --build` | Postgres + Strapi (build desde `cms-strapi/Dockerfile`). |

## Comandos

```bash
# Desde cms-strapi/

# Desarrollo con autoReload (Strapi nativo, contra el Postgres del compose)
npm run develop

# Producción (sin autoReload)
npm run start

# Build del admin panel
npm run build
```

## Scripts del proyecto (`cms-strapi/scripts/`)

### Schemas y fetchers

| Script | Para qué |
|---|---|
| `autogen-schemas.mjs` | Regenera `src/api/<slug>/content-types/<slug>/schema.json` a partir de los JSON fuente en `../src/content/pages/`. |
| `gen-strapi-fetchers.mjs` | Regenera `../src/utils/strapi-fetchers.ts` con un getter por content type. |
| `update-display-names.mjs` | Renombra los displayName del sidebar Strapi para una navegación más limpia. |
| `inject-strapi-slug.mjs` | Inyecta el `strapiSlug` en páginas `.astro` para que el AdminBar enlace al editor. |

### Migración de datos

| Script | Para qué |
|---|---|
| `migrate-all.mjs` | Migra los JSON locales a Strapi via Admin API. Acepta `--only=slug1,slug2` para selectiva. |
| `migrate-eventos.mjs`, `migrate-marco-legal.mjs`, `migrate-notificaciones.mjs`, `migrate-sliders.mjs` | Migraciones específicas por la forma particular de cada fuente. |
| `rewrite-astro.mjs` | Reescribe templates `.astro` para consumir desde Strapi en vez de archivos JSON. |

### Auditoría

| Script | Para qué |
|---|---|
| `audit-coherence.mjs` | Verifica coherencia entre el frontend y los content types Strapi. |
| `audit-hardcoded.mjs` | Detecta contenido hardcodeado en `.astro` que debería estar en Strapi. |
| `audit-junk.mjs` | Detecta código muerto o no usado. |

### Deploy

| Script | Para qué |
|---|---|
| `deploy-strapi-to-server.sh` | Empaqueta la imagen Docker de Strapi y la transfiere al servidor (workaround VPN: `docker save` → rsync → `docker load`). |

### Ciclo típico de cambio de schema

```bash
node scripts/autogen-schemas.mjs       # regenera schemas
node scripts/gen-strapi-fetchers.mjs   # regenera fetchers
npm run develop                        # validar que Strapi cargue
node scripts/migrate-all.mjs --only=<slug>   # migrar datos
```

## Estructura

```
cms-strapi/
├── config/                  # Configuración de Strapi (database, server, admin, api, plugins)
├── database/                # Migrations
├── Dockerfile               # Imagen del modo "server" del compose
├── public/uploads/          # Media nativa (vive en volumen Docker, gitignored)
├── scripts/                 # Schemas, fetchers, migración, audits, deploy
│   └── .autogen-manifest.json   # Manifest leído por el bootstrap
├── src/
│   ├── admin/               # Customizaciones del admin panel
│   ├── api/<slug>/          # Content types (uno por slug, ~148 actualmente)
│   │   └── content-types/<slug>/schema.json
│   ├── components/          # Components reusables
│   │   └── shared/related-link.json
│   ├── extensions/          # Overrides de plugins
│   └── index.ts             # Bootstrap (otorga permisos Public via manifest)
└── WEBHOOK.md               # Detalle del repository_dispatch a GitHub al publicar
```

## Bootstrap

`src/index.ts` lee `scripts/.autogen-manifest.json` y otorga permisos `find`/`findOne` al rol Public para todos los content types declarados. Evita tener que dar permisos manualmente desde el admin después de cada `autogen-schemas`.

## Variables (`cms-strapi/.env`)

| Variable | Para qué |
|---|---|
| `HOST`, `PORT` | Binding (default `0.0.0.0:1337`) |
| `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY` | Secretos. Generar con `openssl rand -base64 16`. Strapi no arranca si están vacíos. |
| `DATABASE_CLIENT` | `postgres` |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` | Conexión al Postgres del compose. |
| `GITHUB_REPO`, `GITHUB_DISPATCH_TOKEN` | Opcionales. Disparan rebuild del frontend al publicar (`repository_dispatch[strapi-publish]`). Detalle en [`WEBHOOK.md`](WEBHOOK.md). |

Ver [`.env.example`](.env.example) y, para el modo "server" del compose, [`../.env.cms.example`](../.env.cms.example) en la raíz del repo.

## Convenciones

- **No editar `schema.json` a mano** salvo en componentes manuales (`src/components/shared/`). Los demás son output del autogen.
- **Componentes reusables manuales**: solo `related-link.json`, usado por todos los `enlacesRelacionados` para mantener consistencia.
- **Slugs**: el autogen los deriva del nombre del JSON fuente. El `singularName` de Strapi puede no coincidir con el plural del display name.

## Documentación general

- Instalación completa (front + CMS): [`../docs/instalacion.md`](../docs/instalacion.md)
- Despliegue al servidor: [`../docs/despliegue.md`](../docs/despliegue.md)
- Manual del editor: [`../docs/manual-operador/`](../docs/manual-operador/)
