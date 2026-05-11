# CMS Strapi v5 — ITRC

Strapi headless del portal ITRC. Almacena el contenido institucional consumido por el frontend Astro durante el build.

## Stack

- Strapi v5 CE
- Postgres en Docker (`docker-compose.yml` en esta carpeta)
- Volumen Docker `itrc-cms-strapi-uploads` para media nativa
- Admin panel en `/admin`, API REST en `/api`

## Comandos

```bash
# Desarrollo con autoReload
npm run develop

# Producción (sin autoReload)
npm run start

# Build del admin panel
npm run build
```

### Scripts del proyecto (carpeta `scripts/`)

| Script | Para qué |
|---|---|
| `autogen-schemas.mjs` | Regenera `src/api/<slug>/content-types/<slug>/schema.json` a partir de los JSON fuente en `../src/content/pages/`. |
| `gen-strapi-fetchers.mjs` | Regenera `../src/utils/strapi-fetchers.ts` con un getter tipado por cada content type. |
| `migrate-all.mjs` | Migra los JSON locales a Strapi via Admin API. Acepta `--only=slug1,slug2` para migración selectiva. |
| `migrate-notificaciones.mjs` | Migración específica de notificaciones (mantenida por la forma distinta de su fuente). |

Cualquier cambio de schema en los JSON fuente debe seguir el ciclo:

```bash
node scripts/autogen-schemas.mjs       # regenera schemas
node scripts/gen-strapi-fetchers.mjs   # regenera fetchers tipados
# levantar Strapi para validar que cargue
npm run develop
# migrar datos
node scripts/migrate-all.mjs
```

## Estructura

```
cms-strapi/
├── config/                  # Configuración de Strapi (database, server, admin, api, plugins)
├── database/                # Migrations (vacías por default en proyectos nuevos)
├── public/uploads/          # Media nativa (gitignored, vive en volumen Docker)
├── scripts/                 # Scripts de generación y migración
│   ├── autogen-schemas.mjs
│   ├── gen-strapi-fetchers.mjs
│   ├── migrate-all.mjs
│   └── .autogen-manifest.json   # Manifest de content types autogenerados
├── src/
│   ├── admin/               # Customizaciones del admin panel
│   ├── api/<slug>/          # Content types (uno por slug)
│   │   └── content-types/<slug>/schema.json
│   ├── components/          # Components reusables
│   │   └── shared/related-link.json
│   ├── extensions/          # Overrides de plugins
│   └── index.ts             # Bootstrap (otorga permisos Public via manifest)
└── docker-compose.yml       # Postgres
```

## Bootstrap

`src/index.ts` lee `scripts/.autogen-manifest.json` y otorga permisos `find`/`findOne` al rol Public para todos los content types declarados. Eso evita tener que dar permisos manualmente desde el admin después de cada `autogen-schemas`.

## Variables (`.env`)

| Variable | Para qué |
|---|---|
| `HOST`, `PORT` | Binding del servidor (default `0.0.0.0:1337`) |
| `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET`, `TRANSFER_TOKEN_SALT` | Secretos requeridos por Strapi |
| `DATABASE_CLIENT` | `postgres` |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` | Conexión a Postgres |

Ver [`.env.example`](.env.example).

## Convenciones

- **No editar `schema.json` a mano** salvo en componentes manuales (`src/components/shared/`). Los demás son output del autogen.
- **Componentes reusables manuales**: solo `related-link.json`, usado por todos los `enlacesRelacionados` para mantener consistencia.
- **Slugs**: el autogen los deriva del nombre del JSON fuente. El `singularName` de Strapi puede no coincidir con el plural del display name.

## Documentación general

- Instalación completa (front + CMS): [`../docs/instalacion.md`](../docs/instalacion.md)
- Despliegue al servidor: [`../docs/despliegue.md`](../docs/despliegue.md)
- Manual del editor: [`../docs/manual-operador/`](../docs/manual-operador/)
