# Webhook Strapi → GitHub Actions

Cuando un editor pulsa "Publish" o "Unpublish" en el panel de Strapi,
queremos que GitHub Actions dispare un build+deploy automático. Este
documento describe la configuración runtime del webhook (vive en la BD
de Strapi, no en el código).

## Pre-requisitos

1. **Personal Access Token (PAT) de GitHub** con permiso para disparar
   workflows en el repo:
   - GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
   - Repository access: solo el repo del portal (`cdavidbm/pitrcastro`).
   - Permisos: `Actions: Read and write` (para `repository_dispatch`),
     `Contents: Read` (para que el workflow pueda hacer checkout).
   - Guardar el token (sólo se muestra una vez).

2. **Workflow del runner** ya acepta `repository_dispatch` con
   `event_type=strapi-publish`. Ver `.github/workflows/deploy.yml`.

## Configuración del webhook en Strapi

1. Login en `http://localhost:1337/admin`.
2. Settings → Webhooks → Create new webhook.
3. Campos:
   - **Name**: `github-actions-deploy`
   - **URL**: `https://api.github.com/repos/cdavidbm/pitrcastro/dispatches`
   - **Headers**:
     - `Authorization: Bearer <PAT>` ← reemplazar con el token del paso 1
     - `Accept: application/vnd.github.v3+json`
     - `Content-Type: application/json`
   - **Events**: marcar
     - Entry → Publish
     - Entry → Unpublish
     - (Opcional) Entry → Update si quieres rebuilds en cada save
4. Save.

## Verificación

Después de publicar un contenido en Strapi, ir a GitHub →
`Actions` y confirmar que aparece un run con trigger
`repository_dispatch`.

## Limitación conocida

Strapi v5 envía el body con su propio formato, NO con el formato esperado
por GitHub. GitHub espera:

```json
{
  "event_type": "strapi-publish",
  "client_payload": { ... }
}
```

Strapi envía:

```json
{
  "event": "entry.publish",
  "createdAt": "...",
  "model": "marco-legal",
  "entry": { ... }
}
```

GitHub rechaza el body con error porque le falta `event_type`. Hay tres
soluciones:

1. **Recomendada**: Custom webhook plugin de Strapi que adapte el body.
   Pendiente para fase post-POC.
2. **Intermedia**: Cloudflare Workers o serverless function que reciba
   el body de Strapi y lo reenvíe a GitHub con el formato correcto.
   Requiere endpoint público.
3. **POC pragmática**: Strapi lifecycle hook (server-side) que después
   de cada publish hace `fetch()` directo a GitHub con el body correcto.
   No usa el sistema de webhooks de Strapi pero funciona en el mismo
   servidor sin endpoints externos.

Para el POC vamos con la opción 3. Ver
`cms-strapi/src/api/marco-legal/content-types/marco-legal/lifecycles.ts`.

## Producción futura

Cuando Strapi corra en el servidor de pruebas (no en WSL local), basta
con que tenga acceso saliente a `api.github.com`. El servidor ya tiene
salida HTTPS por la VPN, así que el webhook funcionará sin más.
