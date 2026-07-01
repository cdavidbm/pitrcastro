# Despliegue

Guía para desarrolladores del equipo web. Explica cómo llegan los cambios al portal público `www.itrc.gov.co` y qué rol cumple el sandbox interno.

## Topología

El proyecto opera contra dos servidores. Cada uno tiene su propio mecanismo de deploy y su propio propósito.

| Servidor | IP | Rol | Acceso | Mecanismo de deploy |
|---|---|---|---|---|
| `santorini` | `10.5.10.6` | Producción `www.itrc.gov.co` | VPN openfortivpn (FortiGate HostDime) + SSH key (`ssh itrc-prod`) | Webhook local `:9001` invocado a mano tras copiar los archivos |
| `ubu_24_bolivia` | `192.168.82.13` | Sandbox interno del equipo web | FortiClient VPN institucional + SSH | Runner self-hosted de GitHub Actions gatillado por push a `main` |

El sitio en producción y el sitio en el sandbox no se hablan entre sí. No hay red directa desde santorini a `192.168.82.13`. Publicar en un sandbox nunca modifica el sitio productivo.

## Cuál sirve para qué

- **Producción** — todo cambio publicado en `www.itrc.gov.co` pasa por santorini. El único mecanismo válido es el webhook. No hay ninguna forma de que `git push` alcance producción.
- **Sandbox** — sirve para probar builds, previsualizar cambios de plantilla frente a la copia del CMS que corre ahí, y observar el runner en verde antes de mover algo a producción. Su webroot (`/var/www/itrc-web/`) no es institucional.

## Flujo real de producción (santorini)

Producción está separada de `origin/main`. El working tree en santorini (`/home/admweb/itrc-cms/`) es la fuente que compila el webhook, no el repo remoto. El webhook **no ejecuta `git pull`**: opera sobre el árbol de archivos tal como está en disco. Un cambio solo llega a producción si el archivo llega antes al working tree.

### Nueve archivos `as any` que viven en producción

El working tree de santorini contiene nueve archivos con la variante `factories.createCoreController('api::site.site' as any)` (y equivalentes para otros singles). Son parches necesarios: durante el build de la imagen Docker de Strapi el typegen aún no ha corrido y esas rutas fallan la compilación sin el cast. **No borrarlos, no ejecutar `git reset --hard` sobre el working tree**. Cualquier deploy que arrastre versiones sin el cast rompe Strapi.

### Procedimiento para un cambio de plantilla o contenido de código

1. Copiar el archivo modificado al working tree de santorini:

   ```bash
   scp <archivo-local> itrc-prod:/home/admweb/itrc-cms/<ruta-relativa>/
   ssh itrc-prod 'chown admweb:admweb /home/admweb/itrc-cms/<ruta-relativa>/<archivo>'
   ```

   Para varios archivos o carpetas usar `rsync -av` respetando la estructura del working tree.

2. Disparar el webhook local (Bearer sacado de `/etc/default/strapi-deploy`):

   ```bash
   ssh itrc-prod 'SECRET=$(grep WEBHOOK_SECRET /etc/default/strapi-deploy | cut -d= -f2)
     curl -s -X POST http://127.0.0.1:9001/publish \
       -H "Authorization: Bearer $SECRET" \
       -H "Content-Type: application/json" \
       -d "{\"event\":\"manual\",\"model\":\"manual\"}"'
   ```

3. Verificar el resultado:

   ```bash
   ssh itrc-prod 'tail -f /var/log/strapi-deploy/webhook.log'
   ```

   El log muestra `=== BUILD START ===`, la salida de `pnpm build`, el rsync, el `chown` y termina con `=== DEPLOY DONE ===`. Un build limpio toma unos 85 segundos.

4. Smoke test contra la URL pública:

   ```bash
   curl -I https://www.itrc.gov.co/
   curl -I https://www.itrc.gov.co/agencia/mision-vision
   ```

Si el webhook recibe otro evento mientras un build está en curso, encola un único build al final. No hace falta reintentar.

### Publicación desde Strapi

Cuando un editor pulsa **Publish** en `https://www.itrc.gov.co/admin/`, Strapi llama al mismo webhook con el evento del content-type. El operador editorial nunca invoca `curl` a mano — el flujo es transparente. Este es el camino habitual para cambios de contenido.

### Qué NO deploya a producción

- `git push origin main` — no toca santorini. Dispara el runner del sandbox.
- Tocar el sandbox (`192.168.82.13`) — sirve solo como canario del build.
- Merge o commit sobre `origin/main` — cambia el repo público pero no llega al working tree productivo hasta que alguien copie los archivos.

## Flujo del sandbox (`192.168.82.13`)

El workflow `.github/workflows/deploy.yml` corre en un runner self-hosted instalado en `192.168.82.13`. Se dispara con cada push a `main` (respetando `paths-ignore` en `docs/`, `README.md`, `LICENSE`, `.gitignore`, `CLAUDE.md`, `GEMINI.md`). El workflow instala dependencias con pnpm, compila con Astro leyendo el Strapi local del sandbox, hace rsync a `/var/www/itrc-web/` y recarga nginx.

El nombre del workflow es "Deploy to test server" y no engaña: solo actualiza el sandbox.

Para acceder al sandbox: VPN institucional FortiClient hasta `192.168.82.13`, después `http://192.168.82.13/`.

### Deploy manual al sandbox (fallback)

Si el runner cae y se necesita probar una build local contra el sandbox:

```bash
pnpm deploy              # ops/deploy.sh — build local + rsync
pnpm deploy:binarios     # sube public/documentos/ sin --delete
```

`ops/deploy.sh` lee `.env.deploy` (gitignored) y respeta `--exclude=/documentos/` para no borrar binarios ya subidos.

## Variables del `.env.deploy` (sandbox)

Solo se usan con `pnpm deploy` / `pnpm deploy:binarios`.

| Variable | Ejemplo | Uso |
|---|---|---|
| `SITE_URL` | `http://192.168.82.13` | URL canónica para el build dirigido al sandbox |
| `BASE_PATH` | `/` | Raíz del routing en el sandbox |
| `DEPLOY_HOST` | `192.168.82.13` | Host SSH del sandbox |
| `DEPLOY_USER` | `admweb` | Usuario SSH con permisos de escritura en `DEPLOY_PATH` |
| `DEPLOY_PATH` | `/var/www/itrc-web` | Webroot del sandbox |
| `SSH_BIN` *(opcional)* | `ssh` | Fuerza un binario SSH concreto |

Producción no consume estas variables: la configuración vive en `/etc/default/strapi-deploy` dentro de santorini.

## VPN desde WSL

Para llegar a cualquiera de los dos servidores desde una máquina Windows con WSL, la VPN se sostiene en Windows y WSL la comparte con `networkingMode=mirrored`:

```ini
[wsl2]
networkingMode=mirrored
dnsTunneling=true
autoProxy=true
```

Con eso (Windows 11 + WSL 2.x) `ssh`, `rsync` y `curl` nativos de Linux funcionan sin cambios. Para aplicar el archivo: `wsl --shutdown` en PowerShell y reabrir WSL.

Producción usa openfortivpn dentro de WSL (perfil de HostDime). Sandbox usa la VPN institucional FortiClient en Windows. Los dos túneles pueden convivir.

## Qué viaja al webroot en cada mecanismo

| Mecanismo | Origen del build | Rsync | Excluye |
|---|---|---|---|
| Webhook santorini | `/home/admweb/itrc-cms/` (working tree del server) | `/home/admweb/itrc-cms/dist/` → `/var/www/portal_nuevo/` | `/uploads/` (los gestiona Strapi) |
| Runner sandbox | checkout de `main` en el runner | `dist/` → `/var/www/itrc-web/` | `/documentos/` (binarios históricos gitignored) |

En ambos casos Astro copia `public/` a `dist/` durante el build y el rsync corre con `--delete`. Los uploads administrados por Strapi viven en volúmenes Docker y no los toca ningún rsync.

## Diagnóstico

| Síntoma | Causa probable | Solución |
|---|---|---|
| `Connection refused` al hacer `curl :9001` en santorini | Servicio `strapi-deploy` caído | `ssh itrc-prod 'systemctl status strapi-deploy && journalctl -u strapi-deploy -n 100'` |
| Webhook responde 401 | Bearer incorrecto | Volver a leer `WEBHOOK_SECRET` desde `/etc/default/strapi-deploy` |
| Build falla con error de typegen en `api::site.site` | Alguien reemplazó los archivos `as any` con la versión de `origin/main` | Restaurar los nueve archivos parcheados (buscar en `.local-docs/SERVER.md` la lista canónica) |
| `Permission denied` en rsync a santorini | Owner incorrecto tras `scp` | `ssh itrc-prod 'chown admweb:admweb <ruta>'` |
| Página nueva no aparece tras `DEPLOY DONE` | Caché de nginx o del cliente | Ctrl+F5; revisar `curl -I` con `Cache-Control` |
| Runner del sandbox no arranca | Servicio caído en `192.168.82.13` | `sudo systemctl status 'actions.runner.*.service'` |
| Push a `main` no dispara nada | Cambios solo en rutas de `paths-ignore` | Confirmado, es el comportamiento esperado |

Para arquitectura del servidor productivo (nginx, Docker, systemd, ufw) ver [`manual-operador/09-despliegue-datacenter.md`](manual-operador/09-despliegue-datacenter.md). Para la política de backup ver [`backup.md`](backup.md).
