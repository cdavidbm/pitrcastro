# Capítulo 10 — Autenticación de Sveltia CMS con GitHub

Este capítulo explica cómo configurar el sistema de autenticación OAuth entre Sveltia CMS y GitHub, cómo agregar y retirar webmasters, y cómo mantener el acceso de forma segura. Está dirigido tanto al coordinador técnico que realiza la configuración inicial como a los webmasters que necesitan entender cómo funciona su acceso.

---

## A. Por qué GitHub OAuth

Sveltia CMS es un CMS basado en Git: cada vez que un webmaster guarda un cambio en el panel administrativo, ese cambio se convierte en un **commit real en el repositorio**. No hay base de datos intermedia; el repositorio es el almacén de contenido.

Esta arquitectura impone un requisito: la persona que opera el CMS debe estar autenticada ante GitHub con una identidad verificable, de modo que cada commit quede asociado a una persona real. Esto cumple tres objetivos institucionales:

- **Trazabilidad**: GitHub registra quién hizo cada cambio, cuándo y con qué descripción.
- **Control de acceso granular**: los permisos se otorgan por usuario, no por contraseña compartida.
- **Auditoría permanente**: el historial de commits es inmutable y sirve como registro de las actualizaciones del portal.

GitHub OAuth es el mecanismo estándar para que una aplicación web (en este caso Sveltia CMS) solicite acceso a una cuenta de GitHub sin manejar contraseñas directamente.

> **Nota:** Una alternativa a GitHub es alojar un repositorio Git propio con Gitea o GitLab. Para el portal ITRC, GitHub es el estándar adoptado dado que el repositorio ya reside allí y el equipo está familiarizado con la plataforma.

---

## B. Arquitectura del flujo de autenticación

Sveltia CMS no puede comunicarse directamente con la API de OAuth de GitHub desde el navegador, porque GitHub exige que el intercambio final del token ocurra desde un servidor con una URL de callback registrada. Por esa razón se necesita un **proxy OAuth** que intermedie el proceso.

El flujo completo es el siguiente:

```
Webmaster (navegador)
    |
    | 1. Clic en "Login with GitHub"
    v
Sveltia CMS (/admin en el portal)
    |
    | 2. Redirige al proxy OAuth con el Client ID
    v
OAuth Proxy (Cloudflare Worker o servidor propio)
    |
    | 3. Redirige a GitHub con los parámetros de la app
    v
GitHub (pantalla de autorización)
    |
    | 4. El webmaster autoriza la app
    v
GitHub devuelve el código de autorización al proxy
    |
    | 5. El proxy intercambia el código por un token de acceso
    v
OAuth Proxy devuelve el token a Sveltia CMS
    |
    | 6. Sveltia CMS usa el token para leer y escribir en el repo
    v
Dashboard del CMS disponible (autenticado)
```

El proxy cumple un rol puntual: recibir el código temporal que GitHub devuelve y canjearlo por el token de acceso real usando el `Client Secret`, que nunca puede quedar expuesto en el código del navegador.

---

## C. Crear la GitHub OAuth App (paso único, realizado por el administrador)

Este procedimiento se realiza una sola vez. La OAuth App representa al portal ITRC ante GitHub y se comparte entre todos los webmasters.

**Requisito:** acceso de administrador al repositorio del portal en GitHub.

1. Inicie sesión en GitHub y vaya a **Settings** (esquina superior derecha, menú de perfil).
2. En el panel lateral izquierdo, seleccione **Developer settings** → **OAuth Apps** → **New OAuth App**.
3. Complete los campos:

   | Campo | Valor |
   |-------|-------|
   | Application name | `Portal ITRC CMS` |
   | Homepage URL | `https://portal.itrc.gov.co` |
   | Authorization callback URL | URL del proxy OAuth (se obtiene en la sección D) |

4. Haga clic en **Register application**.
5. En la pantalla siguiente, copie y guarde en un lugar seguro:
   - **Client ID** (visible en la página)
   - **Client Secret** (haga clic en "Generate a new client secret" y cópielo de inmediato; no se vuelve a mostrar)

> **Importante:** El Client Secret equivale a una contraseña de acceso al portal. Nunca lo comparta por correo, chat o código fuente. Solo debe ir en las variables de entorno del proxy OAuth.

---

## D. Opciones de proxy OAuth

Existen dos alternativas para alojar el proxy. Elija la que mejor se ajuste a la infraestructura disponible.

### Opción 1: Cloudflare Worker (recomendado)

Cloudflare Workers es un servicio de computación en el borde que permite ejecutar código JavaScript sin administrar servidores. Sveltia CMS publica una plantilla oficial lista para desplegar.

**Ventajas:** configuración en aproximadamente 15 minutos, gratuito dentro del plan Free de Cloudflare, sin servidores que mantener.

**Pasos:**

1. Cree una cuenta gratuita en [cloudflare.com](https://cloudflare.com) si no la tiene.
2. En el repositorio oficial de Sveltia CMS, busque la plantilla de Worker en la documentación de autenticación: `https://github.com/sveltia/sveltia-cms/blob/main/docs/auth.md`
3. Cree un nuevo Worker en el panel de Cloudflare (**Workers & Pages** → **Create Worker**) y pegue el código de la plantilla.
4. Configure las siguientes variables de entorno en el Worker (**Settings** → **Variables**):

   | Variable | Valor |
   |----------|-------|
   | `GITHUB_CLIENT_ID` | Client ID obtenido en la sección C |
   | `GITHUB_CLIENT_SECRET` | Client Secret obtenido en la sección C |
   | `ALLOWED_DOMAINS` | `portal.itrc.gov.co` |

5. Haga clic en **Deploy** y anote la URL del Worker (por ejemplo, `https://sveltia-cms-auth.itrc.workers.dev`).
6. Regrese a la OAuth App en GitHub y actualice el campo **Authorization callback URL** con esa URL del Worker.

### Opción 2: Proxy self-hosted en el servidor ITRC

Si la organización prefiere no depender de servicios externos, el proxy puede alojarse en el servidor propio del datacenter ITRC.

**Ventajas:** control total, sin dependencias de terceros.

**Consideraciones:** requiere aproximadamente dos horas de configuración inicial y mantenimiento del servicio.

**Camino general:**

1. Clone uno de estos repositorios de referencia:
   - `decaporg/decap-proxy` (mantenido, bien documentado)
   - `vencax/netlify-cms-github-oauth-provider` (alternativa ligera)
2. Configure las variables de entorno `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` y `ORIGIN` en el archivo `.env` del proxy.
3. Cree un servicio `systemd` para que el proceso se mantenga activo y se reinicie automáticamente.
4. Configure nginx para enrutar el path `/oauth/*` del dominio `portal.itrc.gov.co` hacia el puerto local del proxy.
5. Registre esa ruta nginx como la **Authorization callback URL** en la OAuth App de GitHub.

Consulte al equipo técnico para el detalle de configuración de nginx y systemd según el entorno del servidor ITRC.

---

## E. Configuración en config.yml

Una vez que el proxy OAuth esté en funcionamiento, actualice el archivo `public/admin/config.yml` con los valores del entorno de producción.

El bloque relevante es la sección `backend` al inicio del archivo:

```yaml
backend:
  name: github
  repo: cdavidbm/pitrcastro       # Actualizar con el owner/repo definitivo del cliente
  branch: main
  base_url: https://sveltia-cms-auth.itrc.workers.dev   # URL del proxy OAuth
  auth_endpoint: /auth             # Path del proxy (estándar, no se modifica)
```

> **Importante:** El archivo `public/admin/config.yml` es **generado automáticamente**. No lo edite directamente. Aplique el cambio en los fuentes de CMS (`cms/`) y ejecute `npm run cms:generate` para regenerar el archivo. Consulte el [Capítulo 7](07-edicion-directa-vscode.md) para el procedimiento de edición directa.

Los únicos dos valores que cambian entre entornos son:

- `repo`: se actualiza cuando el repositorio se transfiere al owner definitivo del cliente.
- `base_url`: se actualiza con la URL del proxy OAuth correspondiente al entorno de producción.

El resto de los parámetros (`name: github`, `branch: main`, `auth_endpoint: /auth`) son estándar y no requieren modificación.

---

## F. Administración de webmasters — alta de usuarios

Este procedimiento lo realiza el coordinador técnico cada vez que se incorpora un nuevo webmaster al portal.

### Paso 1 — El webmaster crea su cuenta de GitHub

El webmaster debe tener una cuenta personal de GitHub. Si no la tiene:

1. Ir a [github.com/join](https://github.com/join).
2. Registrarse con su **correo institucional** (`@itrc.gov.co`).
3. Activar la verificación en dos pasos antes de solicitar acceso al repo (ver sección H).

### Paso 2 — El coordinador agrega al webmaster como colaborador

1. En GitHub, abra el repositorio del portal (`cdavidbm/pitrcastro` o el nombre definitivo).
2. Vaya a **Settings** → **Collaborators and teams** → **Add people**.
3. Busque el nombre de usuario de GitHub del webmaster.
4. Seleccione el rol **Write** (suficiente para que el CMS pueda hacer commits; ver tabla de roles más abajo).
5. Haga clic en **Add [nombre] to this repository**.

GitHub enviará automáticamente una invitación por correo al webmaster.

### Paso 3 — El webmaster acepta la invitación

El webmaster recibirá un correo de GitHub con el asunto "You've been invited to collaborate". Debe hacer clic en el enlace de la invitación e iniciar sesión en GitHub para aceptarla.

> **Nota:** La invitación expira en 7 días. Si el webmaster no la acepta a tiempo, el coordinador debe volver a enviarla desde Settings → Collaborators → pestaña "Pending".

### Paso 4 — Verificar el acceso

Pida al webmaster que abra el CMS en el navegador (`https://portal.itrc.gov.co/admin`), haga clic en **"Login with GitHub"** y verifique que llega al dashboard sin errores. Si el acceso es correcto, el proceso está completo.

### Tabla de roles de GitHub

| Rol | Puede hacer | Para quién |
|-----|-------------|------------|
| **Admin** | Todo: configurar el repo, gestionar colaboradores, proteger ramas | 1-2 coordinadores técnicos |
| **Maintain** | Push, gestionar issues y releases, sin acceder a configuración sensible | Coordinadores de contenido |
| **Write** | Push a `main` — suficiente para operar Sveltia CMS | Webmasters regulares |
| **Triage** | Gestionar issues y pull requests, sin poder hacer push | Revisores sin acceso de escritura |
| **Read** | Solo leer el repositorio | Auditores, control interno |

---

## G. Baja de usuarios — retiro de webmasters

Cuando un webmaster deja de trabajar en el portal, siga este procedimiento de inmediato para mantener la seguridad del repositorio.

1. En GitHub, abra el repositorio del portal.
2. Vaya a **Settings** → **Collaborators and teams**.
3. Localice el usuario y haga clic en el ícono de **Remove** (papelera o `X`) junto a su nombre.
4. Confirme la acción cuando GitHub lo solicite.

El usuario pierde el acceso inmediatamente. La próxima vez que intente hacer login en el CMS, GitHub rechazará el token y no podrá guardar cambios.

**Consideraciones importantes:**

- **Commits previos**: los commits que el usuario hizo mientras tenía acceso permanecen en el historial de Git. Esto es correcto e intencionado; el historial es la auditoría permanente de las acciones realizadas.
- **Cambios locales no enviados**: si el usuario tenía cambios sin hacer push en su máquina, esos cambios no llegan al repositorio una vez retirado el acceso. No hay riesgo de que publique contenido después de ser retirado.
- **OAuth App**: no revocar ni modificar la OAuth App. Está ligada al portal, no a usuarios individuales. Retirar la OAuth App desconectaría a todos los webmasters.

---

## H. Seguridad y buenas prácticas

### Cuentas individuales

Cada webmaster debe usar **su propia cuenta** de GitHub. Nunca comparta credenciales ni use una cuenta genérica del tipo `webmaster-itrc`. La trazabilidad de los commits depende de identidades individuales.

### Verificación en dos pasos (2FA)

Active la verificación en dos pasos en cada cuenta de GitHub:

1. En GitHub, vaya a **Settings** → **Password and authentication** → **Two-factor authentication**.
2. Elija el método preferido: aplicación de autenticación (recomendado) o SMS.
3. Siga los pasos para configurar y guarde los códigos de recuperación en un lugar seguro.

El repositorio puede requerir 2FA a todos sus colaboradores desde **Settings** → **Security** → **Require two-factor authentication for everyone**. Activar esta opción es una buena práctica para repositorios institucionales.

### Revisión periódica de colaboradores

Revise trimestralmente la lista de colaboradores en **Settings** → **Collaborators and teams** y retire a quienes ya no formen parte del equipo del portal.

### Respuesta ante una cuenta comprometida

Si se sospecha que la cuenta de GitHub de un webmaster fue comprometida:

1. Retire el acceso del usuario al repositorio inmediatamente (ver sección G).
2. Informe al usuario para que cambie su contraseña de GitHub y regenere sus códigos 2FA.
3. Una vez que el usuario confirme que su cuenta está asegurada, vuelva a agregarlo como colaborador.

### Protección del Client Secret

El `Client Secret` de la OAuth App no debe aparecer en ningún archivo del repositorio, ni en mensajes de chat, ni en correos. Solo debe residir en las variables de entorno del proxy OAuth. Si el secreto se expone accidentalmente:

1. Vaya a GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **Portal ITRC CMS**.
2. Haga clic en **Revoke** junto al Client Secret actual y genere uno nuevo.
3. Actualice la variable de entorno `GITHUB_CLIENT_SECRET` en el proxy OAuth con el nuevo valor.

---

## I. Solución de problemas frecuentes

| Problema | Causa probable | Solución |
|----------|---------------|----------|
| "No puedo hacer login" | El webmaster no aceptó la invitación de colaborador | Verificar en Settings → Collaborators → pestaña "Pending"; reenviar si es necesario |
| "Login funciona pero no puedo guardar" | El rol del colaborador es Read o Triage, no Write | Cambiar el rol a Write en Settings → Collaborators |
| "Me pide login cada vez que entro" | Comportamiento normal al inicio de sesión; los tokens de OAuth son de corta duración (~8 horas) | No requiere acción; el CMS renueva el token automáticamente al vencerse |
| "Error 403 al guardar un cambio" | El campo `repo` en `config.yml` no coincide con el repositorio actual (cambio de owner o nombre) | Actualizar `repo` en `cms/` y regenerar `config.yml` con `npm run cms:generate` |
| "Pantalla en blanco en /admin" | En desarrollo local, el navegador no es Chrome ni Edge | Usar Chrome o Microsoft Edge en desarrollo local; en producción cualquier navegador moderno funciona |
| "El proxy OAuth devuelve error 500" | Las variables de entorno del Worker no están configuradas o tienen un valor incorrecto | Verificar `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` y `ALLOWED_DOMAINS` en el panel de Cloudflare |
| "GitHub muestra 'redirect_uri_mismatch'" | La URL de callback registrada en la OAuth App no coincide con la URL real del proxy | Actualizar el campo Authorization callback URL en la OAuth App con la URL correcta del proxy |

---

## Resumen del proceso de configuración inicial

```
1. Crear OAuth App en GitHub
      Obtener Client ID y Client Secret

2. Desplegar proxy OAuth (Cloudflare Worker o servidor propio)
      Configurar variables: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, ALLOWED_DOMAINS
      Obtener URL del proxy

3. Registrar URL del proxy en la OAuth App de GitHub
      Authorization callback URL = URL del proxy

4. Actualizar config.yml
      base_url = URL del proxy
      npm run cms:generate

5. Para cada webmaster nuevo
      Crear cuenta GitHub con correo institucional
      Activar 2FA
      Agregar como colaborador con rol Write
      Webmaster acepta invitación por correo
      Verificar login en /admin
```
