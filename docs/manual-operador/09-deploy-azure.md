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

## Resumen del proceso de migración

```
1. Ajustar astro.config.mjs        →  Cambiar site y base para Azure
2. Crear recurso en Azure Portal    →  Static Web Apps → vincular GitHub
3. Agregar staticwebapp.config.json →  public/staticwebapp.config.json
4. Configurar dominio personalizado →  DNS + HTTPS automático
5. Verificar despliegue             →  Azure Portal → Implementaciones
6. Desactivar workflow de GitHub Pages → .github/workflows/deploy.yml
```
