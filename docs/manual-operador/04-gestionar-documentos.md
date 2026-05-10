# Capítulo 4 — Gestionar documentos institucionales

## Cómo están organizados los documentos en el portal

Las páginas institucionales del portal (transparencia, informes, planes, normativa, etc.) muestran listas de documentos descargables. Hay dos formas en que esos documentos se almacenan:

1. **Subidos al Media Library de Strapi** — el editor sube el PDF directamente desde el panel del CMS. Strapi guarda el binario y devuelve una URL pública estable. Es el flujo recomendado para documentos nuevos.
2. **Servidos desde `/documentos/`** — colección histórica de PDFs migrados desde el portal anterior, alojados en `/var/www/itrc-web/documentos/` y servidos por nginx. El editor solo gestiona la referencia a la URL ya existente.

En ambos casos lo que el editor edita es el campo **Documento** dentro del content type que aloja la lista (la página específica de transparencia, agencia, etc.).

## Estructura típica de una sección de documentos

Una página con documentos en el CMS tiene esta forma:

```
Página Strapi (ej: Transparencia Plan Estratégico)
  └── Sección (componente repetible)
        └── Categoría de documentos
              └── Documento (componente)
                    ├── Nombre (ej: "PAI 2025 ejecutado")
                    ├── Archivo (Media Library) o URL externa
                    ├── Año (ej: 2025)
                    └── Descripción (opcional)
```

Los campos típicos del componente **Documento** son:

| Campo | Descripción |
|-------|-------------|
| `Nombre` | Texto que verá el usuario en el portal (ejemplo: "Informe de Gestión I Semestre 2025") |
| `Archivo` | Selector del Media Library de Strapi — sube o elige un PDF/XLSX ya cargado |
| `URL` | Alternativa al campo Archivo cuando el documento está en otro servidor (legacy `/documentos/...`) |
| `Año` | Año del documento, usado para ordenar y filtrar (ejemplo: `2025`) |
| `Descripción` | Campo opcional con información adicional sobre el documento |

> **Nota:** schemas más antiguos pueden tener solo `URL del archivo` (sin selector de Media Library). En esos casos use la URL absoluta del archivo si está alojado externamente, o la ruta relativa `/documentos/...` si está dentro del servidor del portal.

## Ejemplo práctico 1: Agregar un nuevo informe de gestión

Suponga que la Subdirección de Auditoría le solicita publicar el Informe de Gestión del II Semestre 2025 en formato PDF.

**Pasos:**

1. En el CMS, abra **Content Manager** y seleccione la página **Agencia Gestión Misional** (single type).
2. Localice la sección correspondiente (por ejemplo, "Subdirección de Auditoría y Gestión del Riesgo") y dentro de ella la categoría **"Informes de Gestión SAGR"**.
3. Pulse el botón **Add an entry** (o **+** según el componente) en la lista de documentos de esa categoría.
4. Aparece un nuevo bloque con los campos vacíos. Complete:
   - **Nombre**: `Informe de gestión II Semestre 2025`
   - **Archivo**: clic en el selector → en el Media Library, pestaña **Add new assets** → seleccione el PDF desde su computador → **Upload**.
   - **Año**: `2025`
5. El nuevo documento debe quedar al principio de la lista (más recientes primero). Si quedó al final, arrástrelo hacia arriba con el ícono de seis puntos a la izquierda del bloque.
6. Pulse **Save** para guardar el draft, y luego **Publish** para que el cambio se refleje en el sitio público.

> **Nota:** los documentos dentro de una categoría se muestran en el portal en el orden en que aparecen en la lista del CMS. Ubique siempre los documentos más recientes al principio.

## Ejemplo práctico 2: Actualizar la tabla de contratación suscrita

**Pasos:**

1. En el CMS, abra **Content Manager** y seleccione la página de transparencia que aloja la tabla (ej: **Transparencia Contratación**).
2. Localice la sección de contratación dentro del formulario de edición.
3. Si necesita reemplazar el documento del período en curso:
   - Encuentre el documento existente.
   - Pulse el campo **Archivo** y suba el archivo actualizado al Media Library.
   - Actualice el **Nombre** si cambió (por ejemplo, "Contratos suscritos 2025 — II semestre").
4. Si necesita agregar un documento nuevo para un nuevo período:
   - Pulse **Add an entry** dentro de la lista de documentos.
   - Complete los campos como en el Ejemplo 1.
5. **Save** y **Publish**.

> **Importante:** nunca borre un documento anterior de contratación. Las normas de transparencia exigen mantener el histórico disponible en el portal. Agregue el nuevo documento al comienzo de la lista, sin eliminar los existentes.

## Verificar que el enlace funciona

Antes de publicar, verifique que el archivo abre correctamente:

1. En el formulario, haga clic en el preview del archivo o copie la URL que muestra el campo.
2. Abra la URL en una nueva pestaña del navegador.
3. El archivo debe abrirse o descargarse sin errores.

Si el archivo no carga, **no publique** la entrada. Vuelva a subir el archivo desde el Media Library o verifique con el área solicitante que el binario es válido.

## Cómo se construyen las URLs de los documentos

El portal genera la URL final del archivo automáticamente. El editor no necesita conocer ni construir las URLs manualmente.

| Origen del archivo | Forma de la URL |
|--------------------|-----------------|
| Subido al Media Library de Strapi | `/api/uploads/<hash>-<nombre>.pdf` (gestionado por Strapi) |
| Migrado del portal anterior | `/documentos/<carpeta>/<nombre>.pdf` (servido por nginx) |
| Externo (URL absoluta a otro servidor) | La URL tal como se ingrese, comenzando con `https://` |

Cuando el equipo técnico cambia la configuración de hosting (por ejemplo, mover los binarios a otro path), Astro y nginx se ajustan; el editor no debe modificar nada en las entradas existentes.

## Subir archivos al CMS

Para subir un binario al Media Library de Strapi:

1. Sidebar → **Media Library**.
2. Pulse **Add new assets**.
3. Arrastre el archivo desde su computador o use el selector.
4. Strapi muestra el archivo en la grilla con su preview, tamaño y URL.

Una vez en el Media Library, el archivo queda disponible para asociarlo a cualquier entrada (no solo a la que motivó la subida).

> **Tip:** Strapi permite organizar el Media Library en carpetas. Para mantener el orden, cree una carpeta por sección (`Transparencia`, `Agencia`, `Normativa`, etc.) y suba cada archivo a la carpeta correspondiente.

## Agregar una nueva sección de documentos

Si una dependencia solicita una categoría completamente nueva dentro de una página existente (por ejemplo, "Informes de Supervisión" donde antes no existía esa categoría):

1. En el CMS, abra la página correspondiente.
2. Dentro de la sección de la subdirección, pulse **Add an entry** en la lista de categorías.
3. Complete el campo **Título** de la nueva categoría.
4. Agregue los documentos dentro de esa categoría como se describe en los ejemplos anteriores.
5. **Save** y **Publish**.

> **Nota:** si la estructura de la página no admite agregar categorías nuevas (el botón no aparece o el componente está limitado), es necesario modificar el schema del content type. Consulte al equipo técnico — la edición de schemas se cubre en el [Capítulo 7](07-edicion-directa-vscode.md).
