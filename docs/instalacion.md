# Instalación

Pasos para clonar y correr el portal ITRC en una máquina nueva.

## Requisitos

| Herramienta | Versión | Para qué |
|---|---|---|
| Node.js | **22 LTS** | Astro y Strapi. El CMS no instala con Node 20 |
| pnpm | 10 | Gestor de paquetes — **único permitido en este repo** ([por qué](#por-qué-pnpm)) |
| Docker + Docker Compose | reciente | Postgres del CMS |
| Git | 2.30+ | Clonar el repo |
| rsync | cualquiera | Deploy al servidor (solo si se va a desplegar) |

> **Importante:** el repo bloquea `npm install` y `yarn install` por diseño. Si intentas usar otro gestor verás `Use "pnpm install" for installation in this project`. Ver [Por qué pnpm](#por-qué-pnpm) abajo.

## Instalar pnpm

La forma recomendada es **corepack** (viene con Node 16+):

```bash
corepack enable
corepack prepare pnpm@10.34.1 --activate
pnpm --version    # → 10.34.1
```

Si `corepack` falla (versión antigua), instalación alternativa via npm global:

```bash
mkdir -p "$HOME/.npm-global"
npm install -g pnpm@10.34.1 --prefix "$HOME/.npm-global"
export PATH="$HOME/.npm-global/bin:$PATH"   # añadir a ~/.bashrc para persistir
```

### Alias recomendado (opcional, seguridad)

Para evitar invocar `npm install` por costumbre y dispararte el bloqueo, agregar a `~/.bashrc` o `~/.zshrc`:

```bash
alias npm='pnpm'
```

Así el muscle-memory de teclear `npm install` invoca `pnpm install`. Para casos donde sí necesites el binario original (raro), usar `\npm` o `/usr/bin/npm`.

## Clonar el repositorio

```bash
git clone https://github.com/comunicaciones-itrc/web.git
cd web
```

## Frontend Astro

```bash
pnpm install
pnpm dev
```

El sitio queda en `http://localhost:4321`.

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo con hot reload |
| `pnpm build` | Build estático a `dist/` |
| `pnpm preview` | Sirve el build local para inspección |

## CMS Strapi

El frontend consume Strapi en `http://localhost:1337` durante desarrollo. El stack se orquesta con un `docker-compose.yml` que vive en la **raíz del repo**, con dos modos:

| Modo | Comando | Qué levanta |
|---|---|---|
| **Local dev** (default) | `docker compose up -d` | Solo Postgres. Strapi corre nativo con `pnpm develop`. |
| **Server / producción** | `docker compose --profile server up -d --build` | Postgres + Strapi (build de `cms-strapi/Dockerfile`). |

### Setup local

```bash
# Desde la raíz del repo
cp .env.cms.example .env.cms          # credenciales y secretos del stack
docker compose up -d                  # solo Postgres

# CMS Strapi nativo
cd cms-strapi
cp .env.example .env                  # variables del proceso Strapi
pnpm install
pnpm develop
```

Admin panel: `http://localhost:1337/admin`. En el primer arranque pide crear el usuario administrador.

### Dos archivos de env del CMS

- **`.env.cms`** (raíz) — usado por `docker-compose.yml`. Define `CMS_DB_*` y los `STRAPI_*` cuando Strapi se levanta dentro de Docker (modo server).
- **`cms-strapi/.env`** — usado por Strapi cuando se corre nativo con `pnpm develop`. Define `DATABASE_*`, `APP_KEYS`, etc. con los mismos valores apuntando al Postgres del compose.

### Variables mínimas de `cms-strapi/.env`

| Variable | Para qué |
|---|---|
| `HOST`, `PORT` | Binding (default `0.0.0.0:1337`) |
| `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY` | Secretos. Generar con `openssl rand -base64 16`. Strapi no arranca si están vacíos. |
| `DATABASE_CLIENT` | `postgres` |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` | Conexión a Postgres (default `127.0.0.1:5432`, db `strapi`) |

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

## Cargar el contenido

**Este paso es imprescindible y no es opcional.** El repositorio trae el código,
no el contenido: los textos, las noticias y los documentos viven en la base de
datos del servidor. Un CMS recién levantado está **vacío**, y el sitio compila
igual sin avisar de nada — con todas las páginas en blanco.

Para trabajar con el contenido real hay que traer una copia de la base:

```bash
# 1. Volcar la base del servidor (requiere la VPN conectada)
ssh itrc-prod 'docker exec itrc-cms-postgres pg_dump -U strapi -Fc strapi' > strapi.pgcustom

# 2. Restaurarla en el Postgres local
docker exec -i itrc-cms-postgres pg_restore -U strapi -d strapi -c --if-exists < strapi.pgcustom
```

Los archivos subidos (PDF e imágenes del panel) viajan aparte:

```bash
rsync -az itrc-prod:/var/www/portal_nuevo/uploads/ ./public/uploads/
```

Es una copia de trabajo. Los cambios que se hagan en el CMS local **no llegan
al portal**: publicar es otro camino, descrito en [`despliegue.md`](despliegue.md).

## Verificación rápida

1. `curl http://localhost:1337/api/agencia-mision-vision` debe responder JSON
   con datos. Si responde vacío, falta cargar el contenido.
2. `pnpm dev` en la raíz debe arrancar y `http://localhost:4321` mostrar el
   inicio **con textos**. Si las páginas salen vacías, falta el paso anterior.
3. `pnpm build` debe terminar y generar `dist/`. Ojo: **termina bien aunque no
   haya contenido**; revisar los avisos `[strapi]` del registro.

## Por qué pnpm

El proyecto usa **pnpm 10** como único gestor de paquetes permitido (bloqueado por el script `preinstall: "npx only-allow pnpm"` en el `package.json` raíz y de `cms-strapi/`). La razón es seguridad de supply chain:

| Capacidad | npm | pnpm 10 |
|---|---|---|
| Postinstall scripts de dependencias | ✅ se ejecutan automáticos | ❌ bloqueados por defecto |
| Aprobación explícita por paquete | — | ✅ vía `pnpm.onlyBuiltDependencies` en `package.json` |
| Phantom dependencies (accesibles sin declarar) | ✅ permitidas | ❌ aisladas (cada paquete solo ve lo que declara) |
| Integridad SHA-512 verificada en cada install | parcial | ✅ por archivo |
| Velocidad en CI con cache caliente | ~45 s | ~5 s |
| Tamaño del lockfile | ~7.800 líneas | ~3.000 líneas |

El vector común en los incidentes recientes de npm (paquetes legítimos comprometidos publican una versión maliciosa, el postinstall roba secrets/propaga) queda mitigado: pnpm no corre esos scripts salvo aprobación explícita por paquete.

En este proyecto, los paquetes que sí necesitan correr sus build scripts (`esbuild`, `sharp`, `@swc/core`) están declarados en `pnpm.onlyBuiltDependencies` de cada `package.json`. Si llega una dependencia nueva pidiendo correr scripts, `pnpm install` lo advierte y queda fuera hasta que se apruebe deliberadamente.

### Notas de entorno

- **WSL + NTFS (`/mnt/c/*`):** pnpm install falla con `ERR_PNPM_EACCES` en renames porque DrvFs + Windows no soporta los miles de operaciones concurrentes. **Solución obligatoria:** mantener el repo en un filesystem ext4 nativo de WSL (`/home/<user>/...`), no en `/mnt/c/`. Editar desde Windows va por `\\wsl.localhost\Ubuntu\home\<user>\...` (VS Code lo abre con la extensión Remote-WSL sin fricción).
- **Linux / macOS / WSL ext4:** funciona sin configuración adicional.

## Siguiente paso

- Para publicar en el portal: ver [`despliegue.md`](despliegue.md).
- Para usar el CMS como editor: ver [`manual-operador/`](manual-operador/).

## Lo que no está en el repositorio

Clonar y seguir esta guía deja el proyecto corriendo en local, pero para
**administrar el portal** hacen falta además tres cosas que se entregan por
separado, nunca por el repositorio:

| | Para qué |
|---|---|
| Acceso a la VPN del proveedor | Es la única vía hasta el servidor |
| Llave SSH autorizada en el servidor | Publicar, respaldar, diagnosticar |
| Cuenta en el panel de contenidos | Publicar contenido |

Sin ellas se puede desarrollar y compilar, pero no publicar ni traer el
contenido real.
