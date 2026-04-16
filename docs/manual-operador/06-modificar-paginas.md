# Capítulo 6 — Modificar páginas institucionales

## Qué se puede editar desde el CMS

Desde el CMS se puede modificar el contenido de la mayoría de las páginas del portal sin tocar código. Esto incluye:

- Textos de presentación de las páginas (misión, visión, propósito estratégico, etc.).
- Datos de contacto de la entidad (dirección, teléfono, correo, redes sociales).
- Menú principal de navegación y enlaces del pie de página.
- Accesos rápidos de la página de inicio.
- Integrantes del equipo directivo (nombres, cargos, fotos, biografías).
- Secciones de documentos (ver [Capítulo 4](04-gestionar-documentos.md)).

Lo que **no** se puede modificar fácilmente desde el CMS sin conocimientos técnicos:
- La estructura visual de una página (número de columnas, disposición de secciones).
- Agregar una página completamente nueva.
- Modificar los estilos CSS.

Para esos cambios, consulte el [Capítulo 7 — Edición directa en VS Code](07-edicion-directa-vscode.md) o solicite ayuda al equipo técnico.

## Actualizar datos de contacto

Los datos de contacto aparecen en el pie de página del portal y en la página de Atención al Ciudadano. Para modificarlos:

1. En el CMS, haga clic en **CONFIGURACIÓN** en la barra lateral.
2. Haga clic en **"Datos de Contacto"**.
3. Se abrirá el formulario con los siguientes campos:

| Campo | Ejemplo |
|-------|---------|
| `Dirección` | Cra. 7 No. 6-54, piso 6 |
| `Ciudad` | Bogotá D.C. |
| `Código Postal` | 110311 |
| `Teléfono principal` | (601) 381 5000 |
| `Línea gratuita` | 01 8000 910 615 |
| `Correo electrónico` | contactenos@itrc.gov.co |
| `Correo notificaciones` | notificaciones@itrc.gov.co |
| `Horario de atención` | Lunes a viernes, 8:00 a.m. a 5:00 p.m. |

4. Actualice los campos que corresponda.
5. Para las redes sociales, expanda la sección **"Redes sociales"** y actualice las URLs de cada red.
6. Haga clic en **"Save"** o **"Publish"**.

> **Nota:** Los cambios en los datos de contacto toman 2 a 5 minutos en verse reflejados en el sitio público.

## Modificar el menú de navegación

El menú principal del portal (barra horizontal en el encabezado) se administra desde **CONFIGURACIÓN > Menú de Navegación**.

**Estructura del menú:**

El menú tiene dos niveles:
- **Ítems principales**: aparecen en la barra de navegación del encabezado.
- **Sub-menú (hijos)**: aparecen como un desplegable cuando el usuario pasa el cursor sobre un ítem principal.

Cada ítem del menú tiene los campos:

| Campo | Descripción |
|-------|-------------|
| `Texto` | Nombre que aparece en el menú |
| `URL` | Ruta de la página (interna: `/agencia`, `/transparencia`; externa: URL completa) |
| `Enlace externo` | Activar si la URL lleva fuera del portal |
| `Destacado (color especial)` | Activar para resaltar el ítem con un color diferente |

**Para modificar un ítem existente:**

1. En el CMS, vaya a **CONFIGURACIÓN > Menú de Navegación**.
2. Localice el ítem en la lista y haga clic sobre él para expandirlo.
3. Realice el cambio (por ejemplo, actualizar la URL o el texto).
4. Guarde.

**Para agregar un nuevo ítem:**

1. Haga clic en **"Add"** al final de la lista de ítems principales.
2. Complete los campos `Texto` y `URL`.
3. Si debe tener submenú, expanda la sección **"Submenú"** y agregue los ítems hijos.
4. Guarde.

> **Nota:** No elimine ni cambie los ítems del menú sin coordinar con el equipo técnico y con quien administra el sitio. Un cambio en la URL de un ítem puede romper los accesos existentes de los usuarios. Si necesita reorganizar el menú, consulte primero.

## Modificar los accesos rápidos de la página de inicio

Los accesos rápidos son los botones o enlaces destacados que aparecen en la sección superior de la página de inicio. Para modificarlos:

1. En el CMS, vaya a **CONFIGURACIÓN > Accesos Rápidos (Home)**.
2. Verá la lista de accesos rápidos actuales. Cada uno tiene:

| Campo | Descripción |
|-------|-------------|
| `Texto` | Texto visible del enlace |
| `URL` | Ruta destino |
| `Icono FontAwesome` | Código del ícono (ej: `fa-file-alt`, `fa-gavel`) |
| `Enlace externo` | Activar si la URL lleva fuera del portal |
| `Destacado` | Activar para resaltar visualmente este acceso |

3. Modifique, agregue o reordene los ítems según sea necesario.
4. Guarde los cambios.

> **Tip:** Para saber qué código corresponde a cada ícono, visite [fontawesome.com/icons](https://fontawesome.com/icons) y busque el nombre del ícono. Use el prefijo `fa-` seguido del nombre (por ejemplo, `fa-balance-scale`, `fa-search`, `fa-envelope`).

## Editar una página institucional de texto

Las páginas como Misión y Visión, Propósito Estratégico, Quiénes Somos, etc., se editan desde la sección **LA AGENCIA** del CMS.

**Ejemplo — Actualizar el texto de la Misión:**

1. En el CMS, haga clic en **LA AGENCIA**.
2. Haga clic en **"Misión y Visión"**.
3. Localice el campo `Misión`.
4. El campo acepta texto con negritas en HTML básico: use `<strong>texto</strong>` para poner palabras en negrita dentro del párrafo.
5. Actualice el texto.
6. Guarde los cambios.

**Ejemplo — Actualizar la fotografía y cargo de un subdirector:**

1. En el CMS, haga clic en **LA AGENCIA**.
2. Haga clic en **"Equipo Directivo"**.
3. Localice la sección **"Subdirectores"** y expanda el subdirector que desea modificar.
4. Actualice los campos `Cargo`, `Área/Dependencia` o `Foto` según corresponda.
5. Guarde los cambios.

## Precauciones al editar páginas

### No borre campos estructurales

Cada campo del formulario del CMS corresponde a un dato que el portal usa para construir la página. Si deja un campo obligatorio vacío (como el `Título` de una página), el portal puede generar un error al construirse. Antes de borrar el contenido de un campo, verifique si es realmente opcional (el CMS indica con `*` o con "required" cuáles son obligatorios).

### No modifique slugs sin coordinar

El slug es el identificador de una URL (por ejemplo, `gestion-misional` en la URL `/agencia/gestion-misional`). Si ve un campo `slug` o `id` en el formulario, **no lo cambie** sin coordinar con el equipo técnico. Cambiar un slug puede romper todos los enlaces existentes que apuntan a esa página, incluyendo enlaces desde otros sitios, documentos oficiales y comunicaciones.

### Cambie una cosa a la vez

Haga un cambio, guárdelo y espere a que el sitio se actualice antes de hacer el siguiente cambio. Esto le permite identificar fácilmente si algo salió mal.

### Si el sitio se ve extraño después de un cambio

Si después de guardar un cambio el portal muestra un error o la página se ve incorrecta:

1. Vuelva al CMS y revise el campo que modificó.
2. Verifique que no haya caracteres especiales no permitidos (comillas dobles sin escapar, corchetes, etc.).
3. Si no puede identificar el error, contacte al equipo técnico. El cambio puede revertirse desde el historial de Git.
