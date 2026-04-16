# Capítulo 9 — Despliegue en Azure

Este capítulo describe cómo migrar el portal ITRC desde GitHub Pages a Microsoft Azure y cómo mantener el despliegue automático funcionando correctamente una vez realizado el cambio. Se presentan dos opciones según los recursos disponibles, y se explica el flujo de trabajo para varios webmasters trabajando en paralelo.

---

## A. Azure Static Web Apps (opción recomendada)

### Qué es y por qué es adecuado para este portal

Azure Static Web Apps es un servicio de Microsoft diseñado específicamente para sitios generados estáticamente como el portal ITRC. Al igual que GitHub Pages, toma el contenido de la carpeta `dist/` y lo sirve globalmente a través de una red de distribución de contenido (CDN). A diferencia de GitHub Pages, ofrece:

- Dominio personalizado con HTTPS gestionado automáticamente (necesario para `portal.itrc.gov.co`)
- Entornos de previsualización por cada pull request, sin costo adicional
- Integración nativa con GitHub Actions (la misma herramienta que ya usa el portal)
- Configuración de encabezados HTTP de seguridad y reglas de enrutamiento

### Prerrequisitos

- Suscripción activa a Microsoft Azure con permisos de **Colaborador** o superior
- Acceso al repositorio en GitHub (cuenta con permisos de escritura en `main`)
- El equipo técnico debe tener acceso al portal de Azure para el primer despliegue

### Paso 1 — Ajustar `astro.config.mjs` para Azure

En GitHub Pages el portal se publica bajo la ruta `/pitrcastro/`. En Azure se publica en la raíz `/`. Es necesario eliminar ese prefijo antes de desplegar.

Edite `/astro.config.mjs` y actualice las siguientes líneas:

```js
// Antes (GitHub Pages)
const isProduction = process.env.NODE_ENV === 'production';
const githubRepo = 'pitrcastro';

export default defineConfig({
  site: isProduction
    ? 'https://cdavidbm.github.io'
    : 'http://localhost:4321',
  base: isProduction ? `/${githubRepo}/` : '/',
  // ...
});
```

```js
// Después (Azure)
export default defineConfig({
  site: 'https://portal.itrc.gov.co',
  base: '/',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    assets: 'assets'
  },
  vite: {
    css: {
      devSourcemap: true
    }
  }
});
```

> **Nota:** Una vez hecho este cambio, el despliegue en GitHub Pages dejará de funcionar correctamente. Realice el cambio solo cuando Azure esté listo para recibir tráfico.

### Paso 2 — Crear el recurso en Azure Portal

1. Ingrese a [portal.azure.com](https://portal.azure.com) con su cuenta institucional.
2. Haga clic en **"Crear un recurso"** y busque **"Static Web Apps"**.
3. Haga clic en **"Crear"** y complete el formulario:
   - **Suscripción**: seleccione la suscripción de la agencia.
   - **Grupo de recursos**: cree uno nuevo llamado `rg-itrc-portal` o use uno existente.
   - **Nombre**: `itrc-portal`.
   - **Plan de hospedaje**: seleccione **"Gratis"** para empezar; cambie a **"Estándar"** si requiere dominios personalizados con SLA.
   - **Región**: `East US 2` o la región más cercana disponible.
   - **Origen**: seleccione **GitHub**.
4. Haga clic en **"Iniciar sesión con GitHub"** y autorice a Azure para acceder al repositorio.
5. Seleccione:
   - **Organización**: la organización o usuario dueño del repositorio.
   - **Repositorio**: el repositorio del portal ITRC.
   - **Rama**: `main`.
6. En **"Detalles de compilación"**, seleccione el preset **"Custom"** y configure:
   - **Ubicación de la aplicación**: `/`
   - **Ubicación de la API**: (dejar vacío)
   - **Ubicación de salida**: `dist`
7. Haga clic en **"Revisar y crear"** y luego en **"Crear"**.

Azure creará automáticamente un archivo de workflow en `.github/workflows/azure-static-web-apps-*.yml` dentro del repositorio. A partir de ese momento, cada `push` a `main` desencadenará un despliegue automático.

### Paso 3 — Crear el archivo `staticwebapp.config.json`

Cree el archivo `public/staticwebapp.config.json` con el siguiente contenido. Azure lo leerá automáticamente durante cada despliegue.

```json
{
  "routes": [
    {
      "route": "/admin",
      "rewrite": "/admin/index.html"
    }
  ],
  "navigationFallback": {
    "rewrite": "/404.html",
    "exclude": ["/assets/*", "/*.{css,js,png,jpg,svg,ico,woff2}"]
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/404.html",
      "statusCode": 404
    }
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=()"
  },
  "mimeTypes": {
    ".json": "application/json"
  }
}
```

> **Nota:** La sección `navigationFallback` asegura que las rutas del portal que no correspondan a archivos físicos devuelvan la página 404 personalizada en lugar de un error genérico de Azure.

### Paso 4 — Configurar el dominio personalizado

1. En Azure Portal, abra el recurso **Static Web App** que acaba de crear.
2. En el menú lateral, haga clic en **"Dominios personalizados"**.
3. Haga clic en **"Agregar"** e ingrese `portal.itrc.gov.co`.
4. Azure mostrará un registro `CNAME` que debe agregar en el DNS de la agencia:
   - **Nombre**: `portal`
   - **Valor**: la URL de Azure (ejemplo: `itrc-portal.azurestaticapps.net`)
5. Solicite al administrador de red de la agencia que agregue ese registro en el proveedor de DNS institucional.
6. Una vez propagado el DNS (puede tomar entre 30 minutos y 48 horas), Azure emitirá automáticamente un certificado TLS y habilitará HTTPS.

### Variables de entorno (si se requieren en el futuro)

Si en algún momento el portal necesita variables de entorno en tiempo de compilación (por ejemplo, una clave de API para un servicio externo):

1. En Azure Portal, vaya al recurso **Static Web App** → **"Configuración"** → **"Variables de entorno de la aplicación"**.
2. Agregue las variables necesarias con sus valores.
3. El siguiente despliegue las incluirá automáticamente durante el paso `npm run build`.

---

## B. Alternativa: Azure Blob Storage + CDN

Esta opción es adecuada cuando la agencia ya dispone de una cuenta de almacenamiento y prefiere mayor control sobre el proceso de despliegue, o cuando el presupuesto no permite el plan Estándar de Static Web Apps.

> **Nota:** Esta alternativa **no incluye despliegue automático desde Git**. Cada vez que se actualice el portal, alguien deberá ejecutar manualmente el proceso de subida o configurar un script adicional.

### Paso 1 — Crear la cuenta de almacenamiento

1. En Azure Portal, haga clic en **"Crear un recurso"** → **"Cuenta de almacenamiento"**.
2. Complete el formulario:
   - **Nombre**: `sitioitrc` (solo letras minúsculas y números, sin guiones).
   - **Rendimiento**: `Estándar`.
   - **Redundancia**: `LRS` (almacenamiento redundante localmente) es suficiente para un sitio estático.
3. Haga clic en **"Revisar y crear"** → **"Crear"**.

### Paso 2 — Habilitar el sitio web estático

1. Abra la cuenta de almacenamiento creada.
2. En el menú lateral, busque **"Sitio web estático"** y haga clic en él.
3. Cambie el estado a **"Habilitado"**.
4. Configure:
   - **Documento de índice**: `index.html`
   - **Documento de error 404**: `404.html`
5. Haga clic en **"Guardar"**. Azure creará automáticamente el contenedor `$web`.

### Paso 3 — Subir la carpeta `dist/`

En la máquina del webmaster, después de ejecutar `npm run build`:

```bash
# Instale la CLI de Azure si no la tiene
npm install -g @azure/static-web-apps-cli

# O use la CLI oficial de Azure
az storage blob upload-batch \
  --account-name sitioitrc \
  --destination '$web' \
  --source ./dist \
  --overwrite
```

> **Nota:** El comando `az` requiere tener instalada la [Azure CLI](https://learn.microsoft.com/es-es/cli/azure/install-azure-cli) y haber ejecutado `az login` previamente.

### Paso 4 — Configurar Azure CDN para dominio y HTTPS

1. En Azure Portal, busque **"Perfiles de CDN"** y cree uno nuevo (nivel **"Estándar de Microsoft"**).
2. Agregue un punto de conexión que apunte al sitio web estático de su cuenta de almacenamiento.
3. Configure el dominio personalizado `portal.itrc.gov.co` igual que en la sección A, paso 4.
4. Active HTTPS desde la sección **"HTTPS de dominio personalizado"** del punto de conexión.

| Criterio | Static Web Apps | Blob Storage + CDN |
|----------|----------------|--------------------|
| Despliegue automático desde Git | Sí | No (manual o script) |
| Dominio personalizado con HTTPS | Incluido | Requiere CDN adicional |
| Entornos de previsualización (PR) | Sí | No |
| Costo estimado (sitio de bajo tráfico) | Gratis / ~$9 USD/mes | ~$3–5 USD/mes |
| Complejidad de configuración | Baja | Media |

---

## C. CI/CD: despliegue automático con Git

### Cómo funciona el despliegue automático en Azure Static Web Apps

Cuando Azure crea el recurso, agrega al repositorio un archivo de workflow similar al siguiente:

```yaml
# .github/workflows/azure-static-web-apps-XXXX.yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches: [main]

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Astro site
        run: npm run build

      - name: Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: 'upload'
          app_location: '/'
          output_location: 'dist'
```

El secreto `AZURE_STATIC_WEB_APPS_API_TOKEN` lo agrega Azure automáticamente al repositorio durante la creación del recurso. No es necesario configurarlo manualmente.

### Entornos de previsualización por pull request

Cada vez que un webmaster abre un pull request hacia `main`, Azure despliega automáticamente una versión temporal del portal con los cambios propuestos. La URL de previsualización aparece como comentario en el pull request. Esto permite revisar los cambios antes de publicarlos en producción sin afectar el sitio real.

Cuando el pull request se cierra (aprobado o rechazado), Azure elimina el entorno de previsualización automáticamente.

### El workflow anterior de GitHub Pages

Una vez configurado Azure, el archivo `.github/workflows/deploy.yml` (el workflow original de GitHub Pages) puede desactivarse o eliminarse para evitar que GitHub Actions ejecute dos despliegues en paralelo.

Para desactivarlo sin eliminar el archivo, agregue la condición `if: false` en el job de despliegue, o simplemente elimine el archivo.

---

## D. Flujo de trabajo para varios webmasters

### Configuración inicial de cada webmaster

Cada persona responsable de mantener el portal debe tener:

1. Una copia local del repositorio (ver [Capítulo 7](07-edicion-directa-vscode.md)).
2. Node.js 20 instalado.
3. Acceso de escritura al repositorio en GitHub.

### Flujo de trabajo diario

```
Antes de empezar      →  git pull origin main
Editar archivos       →  VS Code (JSON, Markdown) o CMS en /admin
Verificar en local    →  npm run dev → http://localhost:4321
Preparar commit       →  git add [archivos específicos]
Registrar cambio      →  git commit -m "docs: descripción del cambio"
Publicar              →  git push origin main
Verificar deploy      →  GitHub → pestaña Actions → marca verde
                          Azure Portal → recurso → pestaña Implementaciones
```

### Qué ocurre cuando dos personas envían cambios al mismo tiempo

Git no sobrescribe el trabajo de nadie. Si dos webmasters hacen `push` casi al mismo tiempo:

- El primero en enviar sus cambios no tendrá ningún problema.
- El segundo recibirá un mensaje de error indicando que su rama local está desactualizada.

En ese caso, el segundo webmaster debe ejecutar:

```bash
git pull origin main
```

Si los dos editaron archivos distintos, Git combinará los cambios automáticamente y solo será necesario hacer `push` nuevamente. Si editaron el mismo archivo, aparecerá un conflicto que se resuelve siguiendo el procedimiento del [Capítulo 8](08-mantenimiento-git.md#resolver-conflictos-básicos).

### Cuándo usar ramas en lugar de publicar directamente en `main`

| Situación | Recomendación |
|-----------|--------------|
| Cambio menor de contenido (agregar un PDF, corregir un texto) | Publicar directamente en `main` |
| Cambio extenso que abarca múltiples archivos o secciones | Usar una rama y abrir un pull request para revisión |
| Cambio que aún no está listo para publicar | Usar una rama para trabajar sin afectar producción |
| Dos webmasters trabajando en secciones distintas al mismo tiempo | Cada uno en su propia rama; fusionar por separado |

Para crear una rama y publicar en ella:

```bash
git checkout -b actualizacion-transparencia-2025
# ... realizar cambios ...
git add [archivos]
git commit -m "docs: agrega documentos de transparencia 2025-II"
git push origin actualizacion-transparencia-2025
```

Luego, abra un pull request en GitHub desde esa rama hacia `main`. Azure desplegará una previsualización automáticamente.

---

## E. Reversión de un despliegue defectuoso y monitoreo

### Cómo revertir un despliegue con errores

Si después de un `push` el portal presenta problemas (página en blanco, error 404 generalizado, contenido incorrecto), el procedimiento para revertirlo es:

**Opción 1 — Revertir el último commit (recomendada para el webmaster):**

```bash
git revert HEAD --no-edit
git push origin main
```

Este comando crea un nuevo commit que deshace los cambios del commit anterior. Azure detecta el nuevo `push` y despliega automáticamente la versión corregida en 2 a 5 minutos.

**Opción 2 — Revertir un commit específico (cuando el error no es el último):**

```bash
# Ver los commits recientes
git log --oneline -10

# Revertir el commit con hash abc1234
git revert abc1234 --no-edit
git push origin main
```

> **Nota:** Nunca use `git push --force` para deshacer cambios en `main`. Ese comando elimina el historial y puede causar pérdida de trabajo de otros webmasters.

### Monitoreo desde Azure Portal

Para revisar el estado de los despliegues:

1. Ingrese a [portal.azure.com](https://portal.azure.com).
2. Abra el recurso **Static Web Apps** del portal ITRC.
3. En el menú lateral, haga clic en **"Implementaciones"**. Verá el historial de cada despliegue con su estado (correcto, fallido) y la fecha.
4. Haga clic sobre cualquier implementación para ver el log detallado.

Para el historial de ejecuciones del workflow de GitHub Actions:

1. Abra el repositorio en GitHub.
2. Haga clic en la pestaña **"Actions"**.
3. Cada fila corresponde a un despliegue. La marca verde indica éxito; la X roja indica fallo.

### Configurar alertas de fallo

Para recibir un correo electrónico automático cuando un despliegue falle:

1. En Azure Portal, abra el recurso **Static Web Apps**.
2. En el menú lateral, vaya a **"Supervisión"** → **"Alertas"**.
3. Haga clic en **"Crear regla de alerta"**.
4. Configure la condición: **"Implementaciones con error"** → umbral mayor a 0.
5. En **"Acciones"**, cree un grupo de acciones con el correo electrónico del webmaster o del equipo técnico.
6. Guarde la regla.

A partir de ese momento, cualquier despliegue fallido enviará una notificación automática sin necesidad de revisar Azure Portal manualmente.

---

## F. Configuración de documentos (binarios)

### Qué es `DOCS_BASE_URL` y por qué importa

El portal ITRC enlaza aproximadamente 4000 documentos (PDFs, XLSX, imágenes). La dirección base desde la que se sirven todos esos archivos está controlada por una sola variable: `DOCS_BASE_URL`, declarada en `src/config/docs.ts`.

```ts
// src/config/docs.ts
export const DOCS_BASE_URL: string =
  import.meta.env.DOCS_BASE_URL || '/documentos';
```

Cuando el portal se compila (`npm run build`), esa variable se concatena con la ruta de cada documento para construir la URL definitiva. Cambiar `DOCS_BASE_URL` redirige todos los documentos en la siguiente compilación, sin modificar ningún archivo JSON individualmente.

Los valores posibles son:

| Valor | Escenario |
|-------|-----------|
| `""` (vacío) | Transicional — se mantienen las URLs del WordPress de origen |
| `"/documentos"` | Misma máquina — Nginx sirve los archivos desde esa ruta |
| `"https://documentos.itrc.gov.co"` | Azure Blob Storage con dominio propio |
| `"https://portal.itrc.gov.co/documentos"` | Datacenter con subdominio del portal |

> **Nota:** El valor `""` (cadena vacía) se usa durante la fase de transición, mientras los JSONs aún apuntan al WordPress anterior. Una vez ejecutada la reescritura masiva de URLs (fase BIN-4 del proyecto), este valor ya no debe usarse.

---

### Opción 1 — Azure Blob Storage (cuando el portal va a Azure SWA)

Esta opción aplica cuando el portal está desplegado en Azure Static Web Apps según la sección A de este capítulo.

#### Paso 1 — Crear la cuenta de almacenamiento para documentos

1. En Azure Portal, cree una nueva cuenta de almacenamiento:
   - **Nombre**: `documentositrc` (solo letras minúsculas y números).
   - **Rendimiento**: `Estándar`.
   - **Redundancia**: `LRS` es suficiente.
2. Dentro de la cuenta, cree un contenedor llamado `documentos`:
   - **Nivel de acceso público**: `Blob` (para que los archivos sean descargables sin autenticación).
3. Si desea usar el dominio `documentos.itrc.gov.co`, configure Azure CDN y agregue el registro `CNAME` en el DNS institucional apuntando al endpoint del contenedor.

#### Paso 2 — Configurar `DOCS_BASE_URL` en Azure Static Web Apps

1. En Azure Portal, abra el recurso **Static Web Apps** del portal ITRC.
2. Vaya a **"Configuración"** → **"Variables de entorno de la aplicación"**.
3. Agregue la variable:
   - **Nombre**: `DOCS_BASE_URL`
   - **Valor**: `https://documentos.itrc.gov.co` (o la URL del endpoint del contenedor si no usa dominio personalizado)
4. Guarde. El siguiente despliegue tomará ese valor durante `npm run build`.

#### Paso 3 — Sincronizar los archivos al contenedor con GitHub Actions

Agregue al workflow de despliegue (`.github/workflows/azure-static-web-apps-*.yml`) un paso adicional que sube los binarios al contenedor. Colóquelo después del paso de instalación de dependencias y antes del despliegue:

```yaml
- name: Sync documents to Azure Blob Storage
  env:
    AZURE_STORAGE_CONNECTION_STRING: ${{ secrets.AZURE_STORAGE_CONN_STR }}
  run: |
    az storage blob sync \
      --container-name documentos \
      --source public/documentos \
      --connection-string "$AZURE_STORAGE_CONNECTION_STRING" \
      --delete-destination true
```

Para que este paso funcione:

1. Obtenga la cadena de conexión de la cuenta de almacenamiento en Azure Portal → cuenta de almacenamiento → **"Claves de acceso"**.
2. Agréguela como secreto en GitHub: repositorio → **"Settings"** → **"Secrets and variables"** → **"Actions"** → **"New repository secret"**, con el nombre `AZURE_STORAGE_CONN_STR`.
3. Asegúrese de que `public/documentos/` esté disponible en el runner. Si los binarios no están en el repositorio (están en `.gitignore`), el paso de sincronización debe ejecutarse desde la máquina del webmaster mediante el procedimiento manual descrito en el Paso 4.

> **Nota importante:** Los 3.2 GB de binarios descargados localmente están en `.gitignore` y no se suben al repositorio git. El Action de sincronización solo puede ejecutarse automáticamente si los binarios están en el repositorio (por ejemplo, con Git LFS) o si se cuenta con un runner auto-hospedado que tenga acceso a ellos. Para la mayoría de los casos, la primera sincronización se hace manualmente según el Paso 4.

#### Paso 4 — Sincronización manual desde la máquina del webmaster

Para la primera carga de los binarios, o cuando el runner no tiene acceso a ellos:

```bash
# Instale la CLI de Azure si aún no la tiene
# https://learn.microsoft.com/es-es/cli/azure/install-azure-cli

# Inicie sesión
az login

# Sincronice la carpeta local al contenedor (solo sube lo que ha cambiado)
az storage blob sync \
  --account-name documentositrc \
  --container-name documentos \
  --source ./public/documentos \
  --delete-destination false
```

El flag `--delete-destination false` evita borrar archivos históricos del contenedor que ya no estén en la copia local. Úselo siempre en sincronizaciones de mantenimiento.

---

### Opción 2 — Mismo servidor (datacenter propio del ITRC)

Esta opción aplica cuando el portal y los binarios se despliegan en un servidor institucional bajo el control del ITRC.

No se requiere ninguna cuenta externa. Nginx (u otro servidor web) sirve los binarios desde el mismo servidor que el portal.

#### Configuración de Nginx

Agregue una directiva `location` en la configuración del servidor para servir los archivos desde la ruta donde estén copiados:

```nginx
# /etc/nginx/sites-available/portal.itrc.gov.co
server {
    listen 443 ssl;
    server_name portal.itrc.gov.co;

    root /var/www/portal/dist;

    # Binarios institucionales
    location /documentos/ {
        alias /var/www/portal/documentos/;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Portal estático
    location / {
        try_files $uri $uri/index.html =404;
    }
}
```

#### Procedimiento de despliegue

```bash
# 1. Compilar el portal (en la máquina de desarrollo o en el servidor CI/CD)
npm run build

# 2. Subir el portal compilado al servidor
rsync -av --delete dist/ usuario@servidor.itrc.gov.co:/var/www/portal/dist/

# 3. Subir los binarios (solo en primera carga o cuando haya archivos nuevos)
rsync -av --ignore-existing \
  public/documentos/ \
  usuario@servidor.itrc.gov.co:/var/www/portal/documentos/
```

El flag `--ignore-existing` en el paso 3 evita resubir archivos que ya están en el servidor. Use `--update` en su lugar si necesita reemplazar versiones más antiguas.

`DOCS_BASE_URL` no requiere ser especificado explícitamente en este escenario porque el valor por defecto en `src/config/docs.ts` ya es `"/documentos"`. Sin embargo, si el equipo técnico usa un pipeline CI/CD, se recomienda declararlo explícitamente para que quede documentado en el historial del pipeline:

```bash
DOCS_BASE_URL="/documentos" npm run build
```

---

### Cambiar de escenario en el futuro

Si la agencia decide migrar de datacenter propio a Azure (o viceversa), el único cambio requerido en el código fuente es:

1. Actualizar el valor de `DOCS_BASE_URL` en el entorno de compilación (variable de entorno en Azure SWA, o en el script de CI/CD del datacenter).
2. Ejecutar `npm run build` y desplegar el resultado.
3. Asegurarse de que los binarios estén disponibles en la nueva ubicación antes de que el portal entre en producción.

No es necesario modificar ningún JSON de contenido ni ninguna página `.astro`.

---

### Efecto sobre el flujo de trabajo del webmaster

Para el webmaster, el hosting de los binarios es transparente. El flujo de trabajo del [Capítulo 4](04-gestionar-documentos.md) no cambia: basta con colocar el archivo en `public/documentos/` y registrar su ruta relativa en el CMS. El sistema construye la URL completa automáticamente en cada compilación según el escenario configurado.

---

## Resumen del proceso de migración

```
1. Ajustar astro.config.mjs        →  Cambiar site y base para Azure
2. Crear recurso en Azure Portal    →  Static Web Apps → vincular GitHub
3. Agregar staticwebapp.config.json →  public/staticwebapp.config.json
4. Configurar dominio personalizado →  DNS + HTTPS automático
5. Configurar DOCS_BASE_URL         →  Azure SWA: variable de entorno en portal.azure.com
                                       Datacenter: variable en pipeline o valor por defecto
6. Sincronizar binarios             →  Azure: az storage blob sync al contenedor
                                       Datacenter: rsync public/documentos/ al servidor
7. Verificar despliegue             →  Azure Portal → Implementaciones
8. Desactivar workflow de GitHub Pages → .github/workflows/deploy.yml
```
