# Capítulo 9 — Despliegue en datacenter propio (Ubuntu + nginx)

Este capítulo describe cómo publicar el portal ITRC en el servidor institucional del ITRC (Ubuntu con nginx), que actualmente aloja el sitio WordPress `www.itrc.gov.co`. Ese servidor reemplazará WordPress con el nuevo portal Astro. Se explica la configuración del servidor, el pipeline de despliegue automático, el manejo de binarios y el flujo de trabajo para varios webmasters.

---

## A. Arquitectura general

El portal es un sitio completamente estático: no hay base de datos, no hay PHP, no hay proceso de servidor en ejecución. Nginx recibe las peticiones HTTP y devuelve archivos generados previamente por Astro. El proceso de publicación sigue este flujo:

```
Webmaster (VS Code / CMS)
        |
        | git push origin main
        v
  GitHub (repositorio)
        |
        | dispara GitHub Actions (push a main)
        v
  Runner de GitHub Actions
        | 1. checkout del repositorio
        | 2. npm ci
        | 3. npm run build  →  carpeta dist/
        | 4. rsync dist/ + public/documentos/ vía SSH
        v
  Servidor ITRC (Ubuntu + nginx)
  /var/www/portal.itrc.gov.co/
        |
        | nginx sirve los archivos estáticos
        v
  Visitante en portal.itrc.gov.co
```

Cada `push` a la rama `main` desencadena el proceso completo de compilación y transferencia al servidor. El tiempo habitual desde el push hasta que el cambio es visible en producción es de 2 a 4 minutos.

---

## B. Preparación del servidor Ubuntu

Los siguientes pasos los ejecuta el administrador de sistemas del ITRC con acceso root al servidor. Asuma Ubuntu 22.04 LTS o superior.

### Crear el usuario de despliegue

```bash
# Crear usuario sin contraseña interactiva (solo autenticación por clave SSH)
sudo adduser --disabled-password --gecos "" portal-deploy

# Crear directorio del portal y asignar propietario
sudo mkdir -p /var/www/portal.itrc.gov.co
sudo chown portal-deploy:portal-deploy /var/www/portal.itrc.gov.co
sudo chmod 755 /var/www/portal.itrc.gov.co
```

### Configurar la clave SSH para GitHub Actions

En el servidor, genere el par de claves para el usuario `portal-deploy`:

```bash
sudo -u portal-deploy ssh-keygen -t ed25519 -C "github-actions-deploy" -f /home/portal-deploy/.ssh/id_ed25519 -N ""

# Ver la clave pública (se añade a authorized_keys del mismo usuario)
sudo cat /home/portal-deploy/.ssh/id_ed25519.pub
```

Añada la clave pública al archivo de claves autorizadas:

```bash
sudo -u portal-deploy bash -c "cat /home/portal-deploy/.ssh/id_ed25519.pub >> /home/portal-deploy/.ssh/authorized_keys"
sudo chmod 600 /home/portal-deploy/.ssh/authorized_keys
```

La clave **privada** (`/home/portal-deploy/.ssh/id_ed25519`) se debe copiar al secreto `SSH_KEY` del repositorio en GitHub (ver sección D).

### Instalar nginx

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Instalar Certbot para TLS

```bash
sudo apt install -y certbot python3-certbot-nginx
```

El certificado se obtiene en la sección C, después de configurar nginx.

### Configurar el firewall UFW

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (redirige a HTTPS)
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
```

---

## C. Configuración nginx

Cree el archivo de configuración del sitio:

```bash
sudo nano /etc/nginx/sites-available/portal.itrc.gov.co
```

Pegue el siguiente contenido completo:

```nginx
# /etc/nginx/sites-available/portal.itrc.gov.co
# Portal estático ITRC — Astro JAMstack
# Generado según manual-operador capítulo 09

# Redirigir todo el tráfico HTTP a HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name portal.itrc.gov.co;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name portal.itrc.gov.co;

    root /var/www/portal.itrc.gov.co;
    index index.html;

    # Certificados TLS (Certbot los rellena automáticamente)
    ssl_certificate     /etc/letsencrypt/live/portal.itrc.gov.co/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/portal.itrc.gov.co/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    # Encabezados de seguridad
    add_header X-Frame-Options           "SAMEORIGIN"                       always;
    add_header X-Content-Type-Options    "nosniff"                          always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin"  always;
    add_header Permissions-Policy        "geolocation=(), microphone=()"    always;

    # Compresión gzip
    gzip on;
    gzip_types text/plain text/css application/javascript application/json
               image/svg+xml application/xml;
    gzip_min_length 1024;
    gzip_vary on;

    # Assets generados por Astro (hashes en nombre de archivo → cache inmutable)
    location /_astro/ {
        expires max;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Documentos institucionales (PDFs, XLSX, etc.)
    location /documentos/ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # Rutas del portal sin trailing slash
    # Prueba: /pagina → /pagina.html → /pagina/index.html → 404 personalizado
    location / {
        try_files $uri $uri.html $uri/index.html =404;
    }

    # Página de error 404 personalizada
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }

    # Logs
    access_log /var/log/nginx/portal.itrc.gov.co.access.log;
    error_log  /var/log/nginx/portal.itrc.gov.co.error.log;
}
```

Active el sitio y verifique la configuración:

```bash
sudo ln -s /etc/nginx/sites-available/portal.itrc.gov.co \
           /etc/nginx/sites-enabled/

# Desactivar el sitio por defecto si aún está activo
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t          # debe decir "syntax is ok" y "test is successful"
sudo systemctl reload nginx
```

### Obtener el certificado TLS

Una vez que el registro DNS `portal.itrc.gov.co` apunte a la IP del servidor:

```bash
sudo certbot --nginx -d portal.itrc.gov.co
```

Certbot modificará el bloque `server` de nginx con las rutas del certificado y configurará la renovación automática.

### Nota sobre protección de contenido específico

Si en el futuro algún documento o sección requiere autenticación (por ejemplo, contenido de acceso restringido a funcionarios), se puede añadir un bloque `location` con `auth_basic`. El criterio editorial y legal sobre qué contenido debe protegerse debe definirse formalmente antes de implementar cualquier restricción. No implemente protección de acceso sin una decisión documentada del área jurídica o de la Dirección.

---

## D. GitHub Action de despliegue

### Secretos necesarios en el repositorio

Antes de crear el workflow, añada los siguientes secretos en GitHub: repositorio → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.

| Secreto | Valor |
|---------|-------|
| `SSH_HOST` | IP o nombre DNS del servidor (ejemplo: `10.0.1.5`) |
| `SSH_USER` | `portal-deploy` |
| `SSH_KEY` | Contenido completo de `/home/portal-deploy/.ssh/id_ed25519` (clave privada) |
| `SSH_KNOWN_HOSTS` | Huella del servidor — obténgala con `ssh-keyscan -H <IP-del-servidor>` desde cualquier máquina |

### Archivo del workflow

Cree o reemplace el archivo `.github/workflows/deploy.yml` con el siguiente contenido:

```yaml
# .github/workflows/deploy.yml
# Despliegue automático del portal ITRC al servidor datacenter Ubuntu + nginx
# Se ejecuta en cada push a la rama main

name: Deploy — Portal ITRC (datacenter)

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Obtener código fuente
        uses: actions/checkout@v4
        with:
          submodules: false
          fetch-depth: 1

      - name: Configurar Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Instalar dependencias
        run: npm ci

      - name: Compilar portal (Astro)
        run: npm run build
        env:
          DOCS_BASE_URL: /documentos

      - name: Configurar clave SSH
        uses: shimataro/ssh-key-action@v2
        with:
          key: ${{ secrets.SSH_KEY }}
          known_hosts: ${{ secrets.SSH_KNOWN_HOSTS }}

      - name: Transferir portal compilado al servidor
        run: |
          rsync -avz --delete \
            dist/ \
            ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }}:/var/www/portal.itrc.gov.co/

      - name: Transferir documentos institucionales al servidor
        run: |
          rsync -avz --ignore-existing \
            public/documentos/ \
            ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }}:/var/www/portal.itrc.gov.co/documentos/

      - name: Recargar nginx
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: sudo systemctl reload nginx
```

> **Nota sobre `sudo reload nginx`:** Para que el usuario `portal-deploy` pueda recargar nginx sin contraseña, añada esta línea al archivo sudoers del servidor con `sudo visudo`:
>
> ```
> portal-deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl reload nginx
> ```

---

## E. Manejo de binarios

### Cambio respecto a versiones anteriores del manual

En versiones anteriores del portal (cuando se contemplaba Azure Static Web Apps), la carpeta `public/documentos/` estaba excluida del repositorio mediante `.gitignore` para evitar superar los límites de Azure. **Eso ya no aplica.**

Con el despliegue en el servidor propio del ITRC, `public/documentos/` **se trackea en git** junto con el resto del código fuente. Las razones son:

- **No hay límite externo.** El servidor del ITRC no tiene la restricción de 500 MB de Azure SWA.
- **Una sola fuente de verdad.** Los binarios viven en el mismo repositorio que los JSONs de contenido que los referencian. No hay estado separado que pueda desincronizarse.
- **Sveltia CMS funciona correctamente.** El CMS puede subir archivos a `public/documentos/` y hacer commit automáticamente; el flujo no requiere configuración adicional.
- **Rollback completo.** Si una actualización rompe algo, `git revert` restaura tanto el código como los documentos al estado anterior en un solo paso.
- **Solo deltas.** El clone inicial del repositorio es pesado (aproximadamente 3,5 GB), pero los push y pull posteriores solo transfieren los archivos que cambiaron.

### Configuración de `DOCS_BASE_URL`

El valor adecuado para este escenario es:

```
DOCS_BASE_URL=/documentos
```

Este es el valor por defecto en `src/config/docs.ts`. Con el despliegue en datacenter, nginx sirve los documentos desde `/var/www/portal.itrc.gov.co/documentos/` y los expone en la ruta `/documentos/` del portal. No se requiere ninguna variable de entorno adicional en el servidor; el workflow ya lo declara explícitamente en el paso de compilación.

---

## F. Flujo multi-webmaster

### Cuentas y acceso

Cada webmaster tiene una cuenta GitHub propia con permisos de escritura al repositorio. El administrador del repo (o quien tenga rol Owner) otorga acceso desde GitHub → repositorio → **Settings** → **Collaborators**.

No se comparten credenciales. Cada persona es responsable de sus commits y puede identificarse en el historial.

### Flujo de trabajo diario

```
Antes de empezar       →  git pull origin main
Editar contenido       →  VS Code (JSON, Markdown) o CMS en /admin
Verificar localmente   →  npm run dev → http://localhost:4321
Preparar commit        →  git add [archivos específicos]
Registrar cambio       →  git commit -m "docs: descripción del cambio"
Publicar               →  git push origin main
Verificar deploy       →  GitHub → pestaña Actions → marca verde
                           Revisar portal.itrc.gov.co en el navegador
```

> **Importante:** ejecute siempre `git pull` antes de empezar a editar. Si trabaja sobre una copia desactualizada y otro webmaster publicó cambios mientras tanto, Git le pedirá que resuelva las diferencias antes de poder hacer `push`.

### Cuando dos personas editan lo mismo

Git no sobrescribe el trabajo de nadie. Si dos webmasters hacen `push` al mismo tiempo:

- El primero no tendrá ningún problema.
- El segundo recibirá un error indicando que su copia local está desactualizada.

El segundo webmaster debe ejecutar:

```bash
git pull origin main
```

Si editaron archivos distintos, Git combinará los cambios automáticamente. Si editaron el mismo archivo, aparecerá un conflicto que se resuelve en VS Code con la herramienta de merge integrada. Consulte el [Capítulo 8](08-mantenimiento-git.md) para el procedimiento detallado de resolución de conflictos.

### Cuándo usar ramas

Para cambios de contenido diarios (agregar un PDF, corregir un texto, publicar una noticia) **no se usan ramas**: se trabaja directamente en `main`. Cada `push` a `main` dispara el despliegue automático.

Use una rama solo si el cambio es un refactor técnico extenso que tomará varios días y no debe publicarse hasta estar completo:

```bash
git checkout -b refactor-seccion-transparencia
# ... realizar cambios durante varios días ...
git push origin refactor-seccion-transparencia
# Abrir pull request en GitHub cuando esté listo para revisión
```

### Autenticación de Sveltia CMS

Para la configuración de cuentas en el panel `/admin` del CMS, consulte el Capítulo 10 (autenticación y gestión de usuarios de Sveltia CMS).

---

## G. Rollback y monitoreo

### Revertir un despliegue defectuoso

Si después de un `push` el portal presenta problemas (página en blanco, error 404 generalizado, contenido incorrecto):

**Revertir el último commit:**

```bash
git revert HEAD --no-edit
git push origin main
```

Este comando crea un nuevo commit que deshace los cambios del commit anterior. GitHub Actions detecta el nuevo `push`, compila y despliega automáticamente la versión corregida. El tiempo de recuperación habitual es de 2 a 4 minutos.

**Revertir un commit específico (cuando el error no es el último):**

```bash
# Ver los commits recientes
git log --oneline -10

# Revertir el commit con hash abc1234
git revert abc1234 --no-edit
git push origin main
```

> **Nunca use `git push --force` en `main`.** Ese comando elimina el historial y puede causar pérdida de trabajo de otros webmasters.

### Ver logs del servidor

Conéctese al servidor por SSH o solicite al administrador de sistemas que revise:

```bash
# Peticiones recibidas (acceso)
sudo tail -f /var/log/nginx/portal.itrc.gov.co.access.log

# Errores del servidor web
sudo tail -f /var/log/nginx/portal.itrc.gov.co.error.log
```

### Ver logs del pipeline de despliegue

Si el despliegue falla, el error aparecerá en GitHub:

1. Abra el repositorio en GitHub.
2. Haga clic en la pestaña **Actions**.
3. Cada fila corresponde a un despliegue. La marca verde indica éxito; la X roja indica fallo.
4. Haga clic sobre la fila con error para ver el log detallado de cada paso.

Los errores más comunes son: fallo de conexión SSH (verificar secretos), error de compilación Astro (verificar el log del paso `npm run build`), o espacio insuficiente en el servidor.

---

## H. Nota sobre la alternativa Azure (referencia histórica)

Durante la fase de planificación del proyecto se evaluó Microsoft Azure Static Web Apps como plataforma de hosting. Las instrucciones detalladas para ese escenario están preservadas en el historial git de este archivo (consulte los commits anteriores al 2026-04-22 mediante `git log --follow docs/manual-operador/09-despliegue-datacenter.md`).

La opción adoptada es el datacenter propio del ITRC por las siguientes razones:

- El servidor ya existe y está operativo — no hay costo incremental de infraestructura.
- El equipo técnico del ITRC ya administra Ubuntu y nginx para el WordPress actual.
- No se depende de un proveedor externo para la disponibilidad del sitio institucional.
- Control total sobre la configuración de seguridad, backups y acceso.
- Los binarios (aproximadamente 3,5 GB) se pueden alojar sin restricciones de tamaño.

Si en el futuro la agencia decide migrar a Azure o a cualquier otra plataforma de hosting estático, los únicos cambios requeridos en el código fuente son: actualizar `astro.config.mjs` (valores de `site` y `base`), reemplazar el workflow de GitHub Actions, y ajustar `DOCS_BASE_URL` según el destino de los binarios.
