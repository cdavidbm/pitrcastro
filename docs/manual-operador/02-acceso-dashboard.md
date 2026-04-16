# Capítulo 2 — Acceso y dashboard del CMS

## Cómo acceder al panel de administración

El panel del CMS se encuentra en la ruta `/admin` del portal. Dependiendo del entorno en que trabaje, la URL es diferente:

| Entorno | URL del CMS |
|---------|-------------|
| Producción (sitio publicado) | `https://cdavidbm.github.io/pitrcastro/admin` |
| Desarrollo local | `http://localhost:4321/admin` |

> **Nota:** Abra siempre el CMS en **Google Chrome** o **Microsoft Edge**. Otros navegadores no son compatibles con la funcionalidad de guardado de archivos que utiliza Sveltia CMS.

## Autenticación con GitHub

Al abrir la URL del CMS por primera vez (o si su sesión expiró), verá una pantalla de inicio de sesión:

1. Haga clic en el botón **"Login with GitHub"**.
2. GitHub le pedirá autorizar a la aplicación del CMS para acceder a su cuenta. Haga clic en **"Authorize"**.
3. Si se le solicita, ingrese su contraseña de GitHub o complete la verificación de dos factores.
4. Una vez autenticado, será redirigido automáticamente al dashboard del CMS.

> **Nota:** Si GitHub le muestra un mensaje de error que indica que no tiene permisos sobre el repositorio, contacte al equipo técnico para que le otorguen acceso de escritura (`write`) al repositorio `cdavidbm/pitrcastro`.

> **Tip:** Su sesión permanece activa mientras no cierre el navegador. Si trabaja en un equipo compartido, cierre sesión al terminar haciendo clic en el ícono de usuario en la esquina superior derecha del CMS.

## Panorama general del dashboard

Al ingresar, verá la interfaz dividida en tres áreas principales:

### 1. Barra lateral izquierda (navegación de colecciones)

La barra lateral muestra todas las secciones de contenido del portal agrupadas en categorías. Las secciones principales son:

- **INICIO** — página de inicio del portal
- **LA AGENCIA** — información institucional
- **TRANSPARENCIA** — índice y sub-páginas
- **NORMATIVA** — marco legal
- **ATENCION Y SERVICIOS** — servicios al ciudadano
- **PARTICIPA** — participación ciudadana
- **PRENSA** — noticias, eventos y comunicaciones
- **OBSERVATORIO** — observatorio de fraude
- **SLIDERS** — carruseles
- **CONFIGURACIÓN** — datos globales del sitio

Haga clic en cualquier sección para ver su contenido en el área central.

### 2. Área central (listado o editor)

Cuando selecciona una sección en la barra lateral, el área central muestra:

- **Una lista de entradas** si la sección es una colección de múltiples elementos (por ejemplo, la lista de noticias o la lista de slides del carrusel).
- **Un formulario de edición** directamente, si la sección corresponde a un único archivo de configuración (por ejemplo, los datos de contacto).

### 3. Panel de vista previa (derecha)

Algunas entradas muestran una vista previa del contenido a la derecha del editor. Esta vista previa puede no reflejar exactamente el estilo final del sitio, pero es útil para verificar el texto y la estructura del contenido.

## Cómo encontrar cada sección

### Noticias

En la barra lateral, busque la sección **PRENSA** y debajo de ella la subsección **"> Noticias"**. Verá el listado de todas las noticias publicadas ordenadas por fecha.

### Páginas institucionales (Agencia, Transparencia, etc.)

Haga clic directamente sobre el nombre de la sección (por ejemplo, **LA AGENCIA**). El área central mostrará una lista con las sub-páginas disponibles. Haga clic en cualquiera para editarla.

### Slider / carrusel

En la barra lateral, busque **SLIDERS**. Verá las entradas de carrusel disponibles; el principal de la página de inicio se llama **"Slider Principal"**.

### Configuración global (contacto, menú, accesos rápidos)

En la barra lateral, busque **CONFIGURACIÓN**. Dentro encontrará cuatro archivos editables: **Datos de Contacto**, **Menú de Navegación**, **Información del Sitio** y **Accesos Rápidos (Home)**.

## Guardar cambios

En Sveltia CMS existen dos acciones para guardar:

| Acción | Cuándo usarla |
|--------|---------------|
| **Guardar borrador** | Cuando quiere conservar el trabajo sin publicarlo aún (el cambio queda en el CMS pero no se despliega al sitio) |
| **Publicar** | Cuando el contenido está listo para que aparezca en el sitio público |

> **Nota:** En la configuración actual del portal, la mayoría de los cambios se publican directamente al guardar, ya que el flujo de borradores depende de la configuración del backend de GitHub. Si tiene dudas sobre si un cambio es inmediatamente visible, consulte al equipo técnico.

## Búsqueda dentro del CMS

En la parte superior de la barra lateral hay un campo de búsqueda. Puede usarlo para encontrar una noticia o entrada específica por su título sin necesidad de desplazarse por toda la lista.
