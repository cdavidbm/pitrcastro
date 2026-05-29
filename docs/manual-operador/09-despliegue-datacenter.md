# Capítulo 9 — Despliegue en datacenter (Ubuntu + nginx + Strapi)

Este capítulo describe la arquitectura del despliegue del portal en el servidor del datacenter ITRC, el flujo de auto-deploy y los procedimientos operativos para mantenerlo sano.

---

## A. Arquitectura

El portal corre en una sola VM Ubuntu del datacenter ITRC. Los servicios involucrados son:

```
                  ┌─────────────────────────────┐
                  │     Visitante / editor      │
                  └────────────┬────────────────┘
                               │ HTTP (red privada / VPN)
                               ▼
                  ┌─────────────────────────────┐
                  │           nginx             │
                  │  /              → estático  │
                  │  /admin/        → :1337     │
                  │  /api/          → :1337     │
                  └─────┬─────────────┬─────────┘
                        │             │
              archivos  │             │ proxy_pass
                        ▼             ▼
        /var/www/itrc-web/    ┌─────────────────────┐
        (HTML estático        │ itrc-cms-strapi     │
         generado por Astro)  │ (Docker, port 1337) │
                              └──────────┬──────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │ itrc-cms-postgres   │
                              │ (Docker, volumen    │
                              │  persistente)       │
                              └─────────────────────┘
```

Componentes:

| Componente | Servicio | Detalle |
|------------|----------|---------|
| Sitio público | nginx + filesystem | HTML pre-compilado en `/var/www/itrc-web/`. |
| CMS | Strapi v5 CE en Docker | Contenedor `itrc-cms-strapi`, puerto interno 1337. |
| Base de datos del CMS | PostgreSQL en Docker | Contenedor `itrc-cms-postgres`, volumen `itrc-cms-postgres-data`. |
| Reverse proxy | nginx | Enruta `/admin/` y `/api/` al contenedor Strapi. |
| Auto-deploy | GitHub Actions runner self-hosted | Servicio `actions.runner.<owner>-<repo>.itrc-server.service`. |

El sitio público es completamente estático: nginx sirve los archivos sin intermediarios. Strapi solo se consulta:

1. Cuando el editor entra al panel (`/admin/`).
2. Cuando Astro compila el sitio (lee la API de Strapi por `/api/`).

---

## B. Datos del servidor

| Campo | Valor |
|-------|-------|
| Hostname | `ubu24bolivia` |
| IP privada | `192.168.82.13` |
| Acceso | Sólo por VPN institucional (FortiClient) |
| OS | Ubuntu 24.04 LTS |
| Webroot del sitio público | `/var/www/itrc-web/` |
| Compose del CMS | `/home/admweb/itrc-cms/docker-compose.yml` |
| Variables del CMS | `/home/admweb/itrc-cms/.env.cms` |
| Logs nginx | `/var/log/nginx/itrc-web.{access,error}.log` |

Los detalles de credenciales y rutas internas viven en `.local-docs/SERVER.md` (no commiteado).

---

## C. Configuración nginx

El server block está en `/etc/nginx/sites-available/itrc-web` con el siguiente patrón:

```nginx
server {
    listen 80;
    server_name 192.168.82.13;

    # Logs
    access_log /var/log/nginx/itrc-web.access.log;
    error_log  /var/log/nginx/itrc-web.error.log;

    # Headers de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=()" always;

    # CMS Strapi: panel admin y API
    location /admin/ {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Sitio estático Astro
    root  /var/www/itrc-web;
    index index.html;

    location /assets/ {
        expires max;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /documentos/ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    location / {
        try_files $uri $uri/index.html $uri.html =404;
    }
}
```

Pruebas y recarga:

```bash
sudo nginx -t                       # validar sintaxis
sudo systemctl reload nginx         # recargar sin downtime
```

---

## D. CMS en Docker (Strapi + Postgres)

El CMS corre con Docker Compose en `/home/admweb/itrc-cms/`. Los contenedores son:

| Contenedor | Imagen | Función |
|------------|--------|---------|
| `itrc-cms-strapi` | imagen local del repo | Strapi v5 CE, expone 1337 al host. |
| `itrc-cms-postgres` | `postgres:16-alpine` | Base de datos. Volumen: `itrc-cms-postgres-data`. |

Comandos comunes:

```bash
cd /home/admweb/itrc-cms

# Estado
docker compose --env-file .env.cms --profile server ps

# Logs en vivo
docker compose --env-file .env.cms --profile server logs -f strapi

# Reiniciar Strapi (sin tocar Postgres)
docker compose --env-file .env.cms --profile server restart strapi

# Detener todo
docker compose --env-file .env.cms --profile server stop

# Levantar todo
docker compose --env-file .env.cms --profile server up -d
```

> **Importante:** nunca borre el volumen `itrc-cms-postgres-data`. Contiene todo el contenido del portal. Backups en `/var/backups/itrc-cms/` (ver sección G).

### Actualizar la imagen Strapi

Cuando se cambia el código de `cms-strapi/` (schemas, plugins, código TS) hay que rebuildear la imagen y redeployarla. El procedimiento exacto está en `docs/CMS-DEPLOY.md` (resumen: `docker save` desde el local del operador → `rsync` al servidor → `docker load` en el servidor → `docker compose up -d --no-build strapi`).

---

## E. Auto-deploy

El sitio público se redespliega automáticamente cuando ocurre cualquiera de estos eventos:

1. **Push a `main`** del repo del portal.
2. **Publicación / despublicación / borrado** de cualquier entrada en el CMS Strapi (Strapi notifica a GitHub vía `repository_dispatch`).

El workflow `.github/workflows/deploy.yml` corre en el runner self-hosted (`runs-on: [self-hosted, itrc-server]`) instalado en el mismo servidor. Pasos:

```
1. checkout                            actions/checkout@v4
2. setup pnpm                          pnpm/action-setup@v4 (lee packageManager pin)
3. pnpm install --frozen-lockfile      instala dependencias
4. pnpm build                          Astro compila el sitio leyendo Strapi vía /api/
5. rsync dist/ →                       /var/www/itrc-web/  (con --delete y --exclude=/documentos/)
6. systemctl reload nginx              (NOPASSWD configurado para el usuario github-runner)
7. smoke test                          curl localhost para verificar 200
```

Variables del workflow (configuradas en GitHub → Settings → Actions → Variables):

| Variable | Valor actual |
|----------|--------------|
| `SITE_URL` | `http://192.168.82.13` |
| `BASE_PATH` | `/` |
| `DEPLOY_PATH` | `/var/www/itrc-web` |
| `STRAPI_URL` | `http://127.0.0.1:1337` |

Para mover a producción solo hay que actualizar las variables — el código no cambia.

### Webhook desde Strapi

`cms-strapi/src/index.ts` registra un middleware que escucha eventos `documents.publish`, `documents.unpublish` y `documents.delete`. Cuando ocurre uno, hace `POST` a `https://api.github.com/repos/<owner>/<repo>/dispatches` con `event_type: "strapi-publish"`. Variables requeridas en `.env.cms`:

```
GITHUB_REPO=<owner>/<repo>
GITHUB_DISPATCH_TOKEN=<PAT con scope Actions:write>
```

Si esas variables no están definidas, el webhook es no-op (útil en dev).

### Deploy manual (fallback)

Si el runner está caído o se necesita deploy desde otra rama:

```bash
# Desde la máquina del operador (con VPN + repo clonado + Node + pnpm)
pnpm deploy              # invoca ops/deploy.sh
```

`ops/deploy.sh` lee `.env.deploy` (gitignored), corre `pnpm build` local y rsync hacia `admweb@192.168.82.13`. Es más lento que el runner porque transfiere por red.

---

## F. Manejo de binarios (PDFs, imágenes, etc.)

Los binarios subidos por los editores se gestionan con el **Media Library de Strapi**. Cuando un editor sube un archivo desde el panel:

1. Strapi guarda el archivo en `/srv/app/public/uploads/` dentro del contenedor (mapeado al volumen `itrc-cms-strapi-uploads` del host).
2. El archivo queda accesible públicamente en `http://192.168.82.13/api/uploads/<nombre>`.
3. La referencia (URL del archivo) queda en la entrada Strapi correspondiente.
4. Cuando Astro compila, lee la URL y la incrusta en el HTML estático.

Los binarios **no viven en el repo**. Esto mantiene el repo pequeño y permite que la edición de contenido en el CMS no requiera permisos de git.

> **Nota:** la carpeta `public/documentos/` del repo contiene únicamente los binarios históricos migrados desde el portal anterior. El workflow de deploy excluye explícitamente esa carpeta del rsync (`--exclude=/documentos/`) para no borrarla del servidor en cada deploy. Las nuevas subidas siempre van al Media Library de Strapi.

### `DOCS_BASE_URL` y rutas

`src/config/docs.ts` declara `DOCS_BASE_URL=/documentos` por defecto, que es la ruta donde nginx expone los binarios históricos. Las URLs de archivos nuevos suben con prefijo `/api/uploads/` (gestionados por Strapi). Astro maneja ambas formas transparentemente.

---

## G. Operación

### Logs

```bash
# nginx
sudo tail -f /var/log/nginx/itrc-web.access.log
sudo tail -f /var/log/nginx/itrc-web.error.log

# Strapi
docker compose --env-file /home/admweb/itrc-cms/.env.cms --profile server logs -f strapi

# Workflow runner
sudo journalctl -u 'actions.runner.*.service' -f
```

### Backups

| Qué | Dónde | Frecuencia |
|-----|-------|------------|
| Sitio estático + binarios históricos | `/var/backups/itrc-web/` (snapshots Time-Machine-style con hardlinks) | Diario 02:00 UTC, retención 7 daily + 4 weekly + 6 monthly |
| Volumen Postgres del CMS | `/var/backups/itrc-cms/postgres-*.sql.gz` | Diario, retención 30 días |
| Configs (nginx, sudoers, runner) | `/var/backups/itrc-configs/` | Diario, retención 30 días |

Detalles del sistema de backup en `docs/BACKUP.md`.

> **Limitación actual:** el backup vive en el mismo servidor. Hasta que se asigne otra máquina institucional para off-site, una falla geográfica de la VM no está cubierta. Documentado como deuda técnica.

### Rollback de un deploy

Si después de un deploy el sitio queda mal:

```bash
# Opción 1 — revertir el último commit y dejar que el runner redeploye
git revert HEAD --no-edit
git push origin main

# Opción 2 — restaurar la última snapshot de webroot
sudo rsync -a --delete /var/backups/itrc-web/last/ /var/www/itrc-web/
sudo systemctl reload nginx
```

> **Nunca use `git push --force` en `main`.** Ese comando elimina el historial y puede causar pérdida de trabajo de otros editores.

### Smoke tests rápidos

```bash
# Sitio público
curl -I http://192.168.82.13/                       # debe ser 200
curl -I http://192.168.82.13/agencia/mision-vision  # debe ser 200

# CMS
curl -I http://192.168.82.13/admin/                 # debe ser 200
curl -I http://192.168.82.13/api/                   # 200/401 según permisos

# Disco
df -h /var
du -sh /var/www/itrc-web /var/backups
```

---

## H. Multi-editor

Cada editor tiene una cuenta personal en Strapi (no se comparten credenciales). El alta y baja de usuarios se hace en el panel `/admin/` mismo (ver [Capítulo 10](10-autenticacion-strapi.md)).

El historial de cada entrada queda en Strapi: timestamp `Updated at`, autor `Updated by`. Esto reemplaza al historial git como auditoría editorial — git sigue siendo la auditoría de cambios de **código** (templates, schemas, infraestructura).

Los desarrolladores que toquen código siguen trabajando con cuentas de GitHub y push a `main` (o pull requests para cambios riesgosos). El runner self-hosted los ejecuta automáticamente.

---

## I. Solución de problemas frecuentes

| Síntoma | Causa probable | Verificación / fix |
|---------|----------------|-------------------|
| `/admin/` devuelve 502 Bad Gateway | Contenedor `itrc-cms-strapi` caído | `docker compose --env-file .env.cms --profile server ps` → si está down, `restart strapi` |
| `/admin/` devuelve 504 Gateway Timeout | Strapi arrancando (puede tomar 30-60s) | Esperar y reintentar; ver logs con `logs -f strapi` |
| Editor publica pero el sitio no se actualiza | Falló el webhook a GitHub o el workflow | GitHub → Actions → última corrida del workflow `Deploy to test server`; revisar el job |
| Workflow falla con error de ownership en rsync | Permisos del webroot rotos | `sudo chown -R github-runner:deploy /var/www/itrc-web && sudo chmod -R g+rw /var/www/itrc-web` |
| Disco lleno | Logs nginx + imágenes Docker viejas | `sudo du -sh /var/log/nginx /var/lib/docker`; `docker system prune -a` para liberar espacio |
| Postgres no arranca | Volumen corrupto o disco lleno | Logs: `docker compose ... logs postgres`. Restaurar backup desde `/var/backups/itrc-cms/` si se confirma corrupción. |
| Workflow no se dispara al publicar en CMS | `GITHUB_DISPATCH_TOKEN` expirado o `GITHUB_REPO` mal escrito | Revisar `.env.cms` y logs de Strapi (`[github-dispatch]`); regenerar PAT en GitHub si expiró |
