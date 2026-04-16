# Capítulo 3 — Publicar una noticia

## Estructura de las noticias

Las noticias del portal se encuentran en la colección **"> Noticias"** dentro de la sección **PRENSA** del CMS. Cada noticia es un archivo Markdown independiente que contiene los siguientes campos:

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| `Título` | Sí | Título completo de la noticia |
| `Fecha de publicacion` | Sí | Fecha en formato AAAA-MM-DD |
| `Imagen destacada` | No | Imagen principal que aparece en el listado y en el encabezado de la noticia |
| `Extracto` | No | Resumen corto (máximo 160 caracteres) que aparece en los listados |
| `Contenido` | Sí | Cuerpo completo de la noticia en formato Markdown |
| `Etiquetas` | No | Palabras clave para clasificar la noticia |
| `Borrador` | No | Si está activado, la noticia no se publica aunque se guarde |

## Crear una nueva noticia

1. En el CMS, haga clic en **PRENSA** en la barra lateral.
2. Haga clic en la subsección **"> Noticias"**.
3. Haga clic en el botón **"New Noticia"** (o equivalente según el idioma del CMS) en la esquina superior derecha del listado.
4. Se abrirá el formulario de edición con los campos vacíos.

### Completar los campos

**Título**

Ingrese el título completo tal como debe aparecer en el sitio. Ejemplo:
```
Agencia ITRC detecta alteración fraudulenta de software en la DIAN
```

**Fecha de publicacion**

Seleccione la fecha con el selector de calendario o ingrésela manualmente en formato `AAAA-MM-DD`. Use la fecha real de la noticia, no la fecha en que la está cargando.

**Imagen destacada**

Haga clic en el campo de imagen y luego en **"Choose an image"**. Puede:
- Seleccionar una imagen ya subida al repositorio.
- Cargar una imagen nueva desde su computador.

Las imágenes se guardan en la carpeta `public/uploads/` del repositorio.

> **Tip:** Use imágenes en formato JPG o WebP con un ancho mínimo de 800 píxeles. Evite imágenes demasiado pesadas (más de 500 KB) para no afectar la velocidad del sitio.

**Extracto**

Escriba un resumen de no más de 160 caracteres. Este texto aparece en las tarjetas de noticias del portal. Ejemplo:
```
La Agencia ITRC descubrió una vulneración en sistemas de la DIAN que permitía
manipular registros de contribuyentes.
```

**Contenido**

El cuerpo de la noticia se escribe en Markdown. El editor del CMS incluye una barra de herramientas con los botones más comunes: negritas, cursivas, encabezados, listas, enlaces e imágenes.

Ejemplo de estructura típica de una noticia:

```markdown
**Bogotá, D.C., 10 de abril de 2026.** La Agencia del Inspector General de
Tributos, Rentas y Contribuciones Parafiscales – ITRC...

## Contexto

El hallazgo se produjo durante una auditoría de sistemas realizada en...

## Acciones adoptadas

1. Se notificó a las directivas de la DIAN.
2. Se solicitó bloqueo inmediato del módulo afectado.
3. Se abrió investigación disciplinaria.
```

**Etiquetas**

Ingrese etiquetas separadas por coma o usando el botón "Add". Las etiquetas ayudan a clasificar las noticias internamente, aunque no siempre son visibles en el portal.

**Borrador**

Deje este campo **desactivado** si la noticia está lista para publicarse. Actívelo solo si desea guardar un avance sin que sea visible en el sitio.

### Guardar y publicar

Una vez completados todos los campos obligatorios:

1. Haga clic en el botón **"Save"** o **"Publish"** en la parte superior del formulario.
2. El CMS creará un commit en el repositorio GitHub con el archivo de la noticia.
3. En 2 a 5 minutos, la noticia aparecerá en el portal bajo la sección de Prensa.

> **Nota:** El nombre del archivo de la noticia se genera automáticamente con el formato `AAAA-MM-DD-titulo-de-la-noticia.md`. No es necesario ni posible definirlo manualmente desde el CMS.

## Insertar imágenes en el cuerpo de la noticia

Para insertar una imagen dentro del texto de la noticia:

1. Posicione el cursor en el lugar del texto donde desea insertar la imagen.
2. En la barra de herramientas del editor, haga clic en el ícono de imagen (marco con montaña).
3. Se abrirá el selector de medios. Puede cargar una imagen nueva o seleccionar una existente.
4. El CMS insertará automáticamente la sintaxis Markdown correspondiente:
   ```markdown
   ![Texto alternativo de la imagen](/uploads/nombre-del-archivo.jpg)
   ```

> **Nota:** El texto entre corchetes (`[]`) es el texto alternativo de la imagen, necesario para accesibilidad. Descríbalo brevemente: por ejemplo, `![Funcionarios en reunión de trabajo]`.

## Editar una noticia existente

1. En el CMS, vaya a **PRENSA > "> Noticias"**.
2. En la lista de noticias, haga clic sobre el título de la noticia que desea modificar.
3. Realice los cambios necesarios en los campos del formulario.
4. Haga clic en **"Save"** o **"Publish"** para guardar.

> **Tip:** Puede ordenar la lista de noticias por fecha o por título usando las opciones de ordenamiento sobre el listado. Esto facilita encontrar noticias antiguas.

## Eliminar una noticia

> **Nota:** Eliminar una noticia es una acción permanente. El archivo se borrará del repositorio, aunque puede recuperarse desde el historial de Git. Consulte con el equipo técnico antes de eliminar contenido publicado.

Para eliminar:

1. Abra la noticia que desea eliminar.
2. Haga clic en el menú de opciones (tres puntos `...` o botón de configuración) en la parte superior del editor.
3. Seleccione **"Delete"**.
4. Confirme la acción.

## Diferencia entre noticia y boletín

El portal maneja dos tipos de publicaciones similares pero distintas:

- **Noticias** (`PRENSA > Noticias`): artículos de texto completo con imagen, cuerpo en Markdown y fecha. Aparecen en la sección de noticias del portal.
- **Boletines** (`PRENSA > Boletines`): entradas más cortas con enlace a un PDF adjunto. Se usan para publicar comunicados de prensa en formato de descarga.

Para publicar un comunicado de prensa con descarga en PDF, use la sección de Boletines, no Noticias.
