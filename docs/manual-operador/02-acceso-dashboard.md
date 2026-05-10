# Capítulo 2 — Acceso y dashboard del CMS

## Cómo acceder al panel de administración

El panel del CMS Strapi se encuentra en `/admin/` del servidor. Las URLs según entorno son:

| Entorno | URL del CMS |
|---------|-------------|
| Producción (red institucional / VPN) | `http://192.168.82.13/admin/` |
| Desarrollo local (con `cms-strapi` corriendo) | `http://localhost:1337/admin/` |

El servidor está dentro de la red privada del datacenter ITRC. Si trabaja desde fuera, conecte primero la VPN institucional (FortiClient) antes de abrir el navegador.

## Login con email y contraseña

Al abrir la URL del CMS verá la pantalla de login de Strapi:

1. Ingrese su **correo institucional** y su **contraseña** (asignados por el administrador).
2. Haga clic en **Login**.
3. La primera vez que ingresa, Strapi le pedirá cambiar la contraseña inicial; siga el formulario.

Si no recuerda la contraseña, use el enlace **"Forgot your password?"** del formulario. Strapi enviará un correo al buzón asociado a su cuenta con un enlace de recuperación.

> **Importante:** las cuentas son personales. No comparta credenciales. La trazabilidad de las publicaciones (autor, fecha) depende de que cada editor use su propia cuenta. Para alta y baja de usuarios, ver el [Capítulo 10](10-autenticacion-strapi.md).

> **Tip:** si trabaja en un equipo compartido, cierre sesión al terminar desde el menú de usuario en la esquina inferior izquierda del CMS.

## Panorama general del dashboard

Strapi divide la interfaz en cuatro áreas:

### 1. Sidebar izquierdo (navegación)

El sidebar contiene los menús principales:

- **Content Manager** — todas las entradas editables del portal (páginas, noticias, slider, configuración, etc.).
- **Content-Type Builder** — creación y modificación de schemas. Solo lo usa el equipo técnico para cambios estructurales; los editores no necesitan tocarlo.
- **Media Library** — todos los archivos subidos al CMS (imágenes, PDFs, etc.).
- **Settings** — configuración del CMS: usuarios, roles, internacionalización, plugins.

El editor regular pasa el 95% del tiempo en **Content Manager** y **Media Library**.

### 2. Sidebar secundario (lista de content types)

Al entrar a Content Manager se despliega la lista de todos los tipos de contenido del portal, agrupados visualmente:

- **Collection Types** — listados con múltiples entradas: Noticia, Evento, Notificación, Documento de galería, etc.
- **Single Types** — páginas únicas: Página de Misión y Visión, Inicio, Configuración de Contacto, etc.

### 3. Área central (listado o editor)

Al seleccionar un content type:

- **Si es collection type** — el área central muestra la tabla de entradas con búsqueda, filtros y paginación. Haga clic en una fila para editarla, o en **"Create new entry"** para una nueva.
- **Si es single type** — abre directamente el formulario de edición.

### 4. Panel lateral derecho (estado de publicación)

Mientras edita una entrada, el panel derecho muestra:

- **Status**: Draft o Published.
- **Published at** / **Updated at**: timestamps de la entrada.
- Botones **Save**, **Publish**, **Unpublish**.

## Cómo encontrar cada sección

### Noticias

Content Manager → **Noticia** (collection type). Listado paginado de todas las noticias publicadas, ordenado por fecha descendente.

### Páginas institucionales (Agencia, Transparencia, etc.)

Las páginas estáticas viven como single types nombrados según la sección. Por ejemplo:

- **Pagina Misión Visión** → la página de Misión y Visión.
- **Transparencia Plan Estratégico** → la página de plan estratégico de Transparencia.
- **Agencia Equipo Directivo** → equipo directivo de La Agencia.

El sidebar de Content Manager los lista por nombre. Use el campo de búsqueda en la parte superior para llegar más rápido a una página específica.

### Slider de la portada

Content Manager → **Slider Principal** (single type). Contiene los campos globales del carrusel y la lista de diapositivas.

### Configuración global (contacto, menú, accesos rápidos)

Content Manager → **Configuración** muestra los single types globales:

- **Configuración Contacto**: teléfonos, correos, dirección, horarios.
- **Configuración Navegación**: menú principal y mega-menú.
- **Configuración Sitio**: nombre del sitio, logo, descripción.
- **Configuración Quick Access**: accesos rápidos de la página de inicio.

## Guardar y publicar cambios

Strapi v5 distingue entre **Draft** (borrador, no visible en el sitio público) y **Published** (publicado, visible).

| Botón | Efecto |
|-------|--------|
| **Save** | Guarda el draft sin publicar. El cambio queda en el CMS pero NO se despliega al sitio. |
| **Publish** | Publica el draft. Strapi notifica a GitHub Actions y dispara el deploy del sitio. |
| **Unpublish** | Quita la entrada del sitio público sin borrarla del CMS. Vuelve a estado Draft. |
| **Delete** | Borra la entrada del CMS. Si estaba publicada, también dispara un rebuild del sitio. |

> **Nota:** después de pulsar **Publish**, el cambio aparece en el sitio público entre 2 y 4 minutos después (tiempo del build + rsync). Si pasados 10 minutos no aparece, revise el estado del workflow en GitHub → Actions.

## Búsqueda y filtros

En la lista de un collection type:

- **Search** (parte superior derecha): filtra por palabras clave en los campos de texto.
- **Filters** (botón al lado de Search): filtra por campos específicos (estado, fecha, categoría, etc.).
- **Sort**: ordena la tabla por cualquier columna haciendo clic en su encabezado.

## Cierre de sesión

Para cerrar sesión: avatar en la esquina inferior izquierda del sidebar → **Log out**.
