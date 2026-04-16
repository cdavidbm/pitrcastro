# Capítulo 5 — Banners y slider principal

## Qué es el slider

El slider (o carrusel) es la sección de banners rotativos que aparece en la parte superior de la página de inicio del portal. Muestra una serie de diapositivas que pueden incluir imagen de fondo, título, subtítulo, descripción y un botón de llamado a la acción.

El slider principal del portal se llama **"Slider Principal"** y se administra desde la sección **SLIDERS** del CMS.

## Cómo acceder al slider

1. En el CMS, haga clic en **SLIDERS** en la barra lateral.
2. Verá la lista de sliders disponibles. Haga clic en **"Slider Principal"** (o en el slider que corresponda según el área del portal que desea modificar).
3. Se abrirá el formulario de edición del slider.

## Campos del slider

El formulario del slider tiene campos globales y campos por cada diapositiva:

**Campos globales del slider:**

| Campo | Descripción |
|-------|-------------|
| `Nombre del slider` | Nombre interno descriptivo (no aparece en el sitio) |
| `Descripcion` | Descripción interna (no aparece en el sitio) |
| `Reproduccion automatica` | Si está activado, las diapositivas cambian solas |
| `Intervalo (milisegundos)` | Tiempo entre cambios automáticos (5000 = 5 segundos, 6000 = 6 segundos) |

**Campos de cada diapositiva:**

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| `Imagen` | Sí | Imagen de fondo de la diapositiva (recomendado: 1920×600 px) |
| `Texto alternativo (accesibilidad)` | Sí | Descripción de la imagen para lectores de pantalla |
| `Titulo` | No | Título grande que aparece sobre la imagen |
| `Subtitulo` | No | Texto secundario debajo del título |
| `Descripcion` | No | Párrafo descriptivo debajo del subtítulo |
| `Enlace` | No | URL a donde lleva el botón de acción (puede ser interna o externa) |
| `Texto del boton` | No | Texto del botón de llamado a la acción (por defecto: "Ver más") |
| `Enlace externo` | No | Activar si el enlace lleva fuera del portal |
| `Filtro oscuro sobre imagen` | No | Oscurece la imagen para mejorar la legibilidad del texto. Desactivar si la imagen es gráfica o efeméride sin texto |
| `Activo` | No | Si está desactivado, la diapositiva no se muestra en el portal |
| `Orden` | No | Número que determina la posición (1 = primera, 2 = segunda, etc.) |

## Modificar una diapositiva existente

1. Abra el **Slider Principal** como se describe arriba.
2. Localice la diapositiva que desea modificar en la lista de **"Diapositivas"**.
3. Haga clic sobre ella para expandir sus campos.
4. Realice los cambios necesarios (por ejemplo, actualizar el texto del título o la imagen).
5. Haga clic en **"Save"** o **"Publish"** para guardar.

**Ejemplo — Actualizar el slide de Transparencia:**

Suponga que el texto de la diapositiva de Transparencia cambió. Para actualizarlo:

1. Abra el Slider Principal.
2. Encuentre la diapositiva con `Titulo` = "Programa de Transparencia y Ética Pública".
3. Actualice el campo `Descripcion` con el nuevo texto.
4. Guarde los cambios.

## Agregar una nueva diapositiva

1. Abra el **Slider Principal**.
2. Desplácese hasta la sección **"Diapositivas"**.
3. Haga clic en el botón **"Add Diapositiva"** al final de la lista.
4. Complete los campos de la nueva diapositiva:
   - **Imagen**: suba o seleccione la imagen de fondo.
   - **Texto alternativo**: describa la imagen brevemente.
   - **Titulo**: título principal (opcional si la imagen es autosuficiente).
   - **Descripcion**: texto descriptivo.
   - **Enlace** y **Texto del boton**: si debe llevar a una página.
   - **Orden**: asigne un número para definir su posición.
   - **Activo**: asegúrese de que esté activado.
5. Guarde los cambios.

> **Tip:** Para diapositivas de efemérides (Día del Agua, Día de la Mujer, etc.) que solo muestran una imagen institucional sin texto, desactive el campo **"Filtro oscuro sobre imagen"** para que la imagen se muestre con sus colores originales.

## Reordenar diapositivas

Existen dos maneras de reordenar las diapositivas:

**Opción 1 — Por el campo Orden:**
Cambie el valor del campo `Orden` en cada diapositiva. El slider mostrará las diapositivas de menor a mayor número de orden.

**Opción 2 — Arrastrando en el CMS:**
Algunas versiones de Sveltia CMS permiten arrastrar las filas de la lista para reordenarlas. Si esta función está disponible, aparecerá un ícono de arrastre (seis puntos) a la izquierda de cada diapositiva.

## Agregar un slide temporal para un evento

Cuando hay un evento institucional (rendición de cuentas, audiencia pública, congreso, etc.) se puede agregar temporalmente un slide que lo promocione.

**Procedimiento:**

1. Abra el **Slider Principal**.
2. Agregue una nueva diapositiva con la información del evento (imagen, título, descripción, enlace al formulario o página del evento).
3. Asígnele un `Orden` al principio de la lista (por ejemplo, `0` o `1`).
4. Asegúrese de que el campo **"Activo"** esté activado.
5. Guarde los cambios.

**Para removerlo después del evento:**

1. Abra el **Slider Principal**.
2. Encuentre la diapositiva del evento.
3. Desactive el campo **"Activo"** en esa diapositiva (no la elimine, a menos que esté seguro de que no la necesitará de nuevo).
4. Guarde los cambios.

> **Nota:** Desactivar una diapositiva (`Activo = false`) es preferible a eliminarla, porque permite reutilizarla en el futuro sin volver a cargar la imagen y el texto.

## Recomendaciones para imágenes del slider

- **Dimensiones**: 1920 × 600 píxeles o proporción 16:5.
- **Formato**: JPG para fotografías, PNG para imágenes con texto o fondo transparente.
- **Peso máximo**: 300 KB por imagen. Imágenes más pesadas ralentizan la carga del portal.
- **Contenido**: si la imagen ya lleva texto superpuesto (como una infografía o pieza gráfica de comunicaciones), desactive el filtro oscuro y no agregue título ni descripción en los campos del CMS, para evitar duplicar el texto.

> **Tip:** El área de comunicaciones de la Agencia suele entregar imágenes en las dimensiones correctas. Si recibe una imagen cuadrada o de formato diferente, solicite la versión horizontal antes de publicarla.
