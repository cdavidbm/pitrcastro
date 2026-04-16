# Capítulo 4 — Gestionar documentos institucionales

## Cómo están organizados los documentos en el portal

Las páginas institucionales del portal (transparencia, informes, planes, normativa, etc.) muestran listas de documentos descargables. Estos documentos no se suben directamente al servidor del portal: se enlazan desde su URL de origen (por ejemplo, desde el servidor de WordPress anterior en `www.itrc.gov.co`, o desde cualquier otra URL pública donde esté alojado el archivo).

Lo que el CMS gestiona es la **referencia al documento**: su nombre visible, la URL donde está alojado, el año y la descripción. El archivo PDF o XLSX en sí debe estar disponible en una URL pública antes de agregarlo al portal.

## Estructura típica de una sección de documentos

La mayoría de las páginas de documentos tienen esta estructura en el CMS:

```
Página (ej: Gestión Misional)
  └── Sección (ej: Subdirección de Auditoría)
        └── Categoría de documentos (ej: Programa Anual de Inspecciones)
              └── Documento
                    ├── Nombre (ej: PAI 2025 ejecutado)
                    ├── URL del archivo (ej: https://www.itrc.gov.co/.../PAI-2025.pdf)
                    └── Año (ej: 2025)
```

Los campos disponibles para cada documento son:

| Campo | Descripción |
|-------|-------------|
| `Nombre` | Texto que verá el usuario en el portal (ejemplo: "Informe de Gestión I Semestre 2025") |
| `URL del archivo` | URL completa y pública del PDF o archivo (debe comenzar con `https://`) |
| `Año` | Año del documento, usado para ordenar y filtrar (ejemplo: `2025`) |
| `Descripción` | Campo opcional con información adicional sobre el documento |

## Ejemplo práctico 1: Agregar un nuevo informe de gestión

Suponga que la Subdirección de Auditoría le solicita publicar el Informe de Gestión del II Semestre 2025 en formato PDF, el cual ya está disponible en `https://www.itrc.gov.co/Itrc/wp-content/uploads/2026/01/Informe-gestion-II-sem-2025.pdf`.

**Pasos:**

1. En el CMS, haga clic en **LA AGENCIA** en la barra lateral.
2. Haga clic en **"Gestión Misional"**.
3. Se abrirá el formulario de edición de esa página. Localice la sección correspondiente a la Subdirección que corresponda (por ejemplo, "Subdirección de Auditoría y Gestión del Riesgo").
4. Dentro de esa sección, localice la categoría **"Informes de Gestión SAGR"**.
5. Haga clic en el botón **"Add Documento"** (o el botón de agregar dentro de esa lista).
6. Aparecerá una nueva fila con los campos vacíos. Complete:
   - **Nombre**: `Informe de gestión II Semestre 2025`
   - **URL del archivo**: `https://www.itrc.gov.co/Itrc/wp-content/uploads/2026/01/Informe-gestion-II-sem-2025.pdf`
   - **Año**: `2025`
7. El nuevo documento debe quedar al principio de la lista (documentos más recientes primero). Si quedó al final, arrástrelo hacia la parte superior usando el ícono de arrastre (seis puntos) que aparece a la izquierda de la fila.
8. Haga clic en **"Save"** o **"Publish"** para guardar los cambios.

> **Nota:** Los documentos dentro de una categoría se muestran en el portal en el orden en que aparecen en la lista del CMS. Ubique siempre los documentos más recientes al principio.

## Ejemplo práctico 2: Actualizar la tabla de contratación suscrita

Las tablas de contratación se encuentran generalmente en la sección **TRANSPARENCIA** o en páginas de Transparencia específicas. El procedimiento es similar al ejemplo anterior.

**Pasos:**

1. En el CMS, haga clic en **TRANSPARENCIA** en la barra lateral.
2. Seleccione la sub-página correspondiente (por ejemplo, **"Contratación"** o la página donde está la tabla).
3. Localice la sección de contratación dentro del formulario de edición.
4. Si necesita reemplazar el documento del año actual:
   - Encuentre el documento existente con el año en curso.
   - Actualice el campo **URL del archivo** con la nueva URL del documento actualizado.
   - Actualice el **Nombre** si es necesario (por ejemplo, cambiarlo de "Contratos suscritos 2025 — I semestre" a "Contratos suscritos 2025 — II semestre").
5. Si necesita agregar un documento nuevo para un nuevo período:
   - Haga clic en **"Add Documento"**.
   - Complete los campos como se describe en el Ejemplo 1.
6. Guarde los cambios.

> **Nota:** Nunca borre un documento anterior de contratación. Las normas de transparencia exigen mantener el histórico de contratos disponible en el portal. Agregue el nuevo documento al comienzo de la lista, sin eliminar los existentes.

## Verificar que el enlace funciona

Antes de guardar cualquier documento nuevo, verifique que la URL del archivo es correcta y el archivo abre sin errores:

1. Copie la URL del campo **URL del archivo**.
2. Abra una nueva pestaña del navegador.
3. Pegue la URL y presione Enter.
4. El archivo debe abrirse o descargarse correctamente.

> **Nota:** Si el archivo no carga, verifique con el área que solicitó la publicación que el archivo haya sido correctamente subido al servidor. No publique un enlace que lleva a una página de error.

## Cómo se construyen las URLs de los documentos

> **No es necesario construir las URLs manualmente.** El portal genera la URL completa de cada documento automáticamente según la configuración de hosting vigente.

Cuando el equipo técnico sube los binarios al servidor de producción, configura una variable llamada `DOCS_BASE_URL` que indica el servidor y la ruta desde donde se sirven los archivos. El portal toma esa base y la combina con la ruta del documento registrado en el CMS para construir el enlace completo.

Por ejemplo, si un documento está registrado con la ruta `/2025/03/informe-gestion.pdf` y la variable de hosting tiene el valor `https://documentos.itrc.gov.co`, el portal generará automáticamente el enlace:

```
https://documentos.itrc.gov.co/2025/03/informe-gestion.pdf
```

Si en el futuro la agencia cambia de servidor, el equipo técnico actualiza esa variable y todos los enlaces del portal se actualizan en la siguiente compilación, sin que el webmaster deba tocar ningún archivo de contenido.

**Lo que sí debe hacer el webmaster:**

- Asegurarse de que el archivo esté físicamente disponible en el servidor antes de publicar el enlace.
- Registrar en el CMS la ruta relativa del archivo (o la URL completa si el archivo está en un servidor externo, como el WordPress anterior durante la transición).

**Lo que NO debe hacer el webmaster:**

- Construir manualmente la URL completa sumando dominios y carpetas.
- Modificar la variable `DOCS_BASE_URL` — eso es responsabilidad del equipo técnico y se documenta en el [Capítulo 9, sección F](09-deploy-azure.md#f-configuración-de-documentos-binarios).

---

## Subir archivos al repositorio del portal

Si el archivo aún no está alojado en ningún servidor público, puede subirlo directamente al repositorio del portal usando el selector de medios del CMS:

1. En el campo de URL del archivo, haga clic en el ícono de carpeta o en **"Choose a file"**.
2. Haga clic en **"Upload"** y seleccione el archivo desde su computador.
3. El archivo se guardará en la carpeta `public/uploads/` del repositorio.
4. El CMS completará automáticamente la URL del campo con la ruta `/uploads/nombre-del-archivo.pdf`.

> **Tip:** Esta opción es útil para archivos pequeños y documentos definitivos. Para archivos grandes (más de 10 MB), es preferible alojarlos en el servidor de WordPress o en SharePoint y pegar la URL directamente, para no incrementar el tamaño del repositorio Git.

## Agregar una nueva sección de documentos

Si una dependencia solicita una categoría completamente nueva dentro de una página existente (por ejemplo, agregar "Informes de Supervisión" donde antes no existía esa categoría):

1. En el CMS, abra la página correspondiente.
2. Dentro de la sección de la subdirección, busque el botón **"Add Categoría"** o equivalente.
3. Complete el campo **Título** de la nueva categoría.
4. Luego agregue los documentos dentro de esa categoría como se describe en los ejemplos anteriores.
5. Guarde los cambios.

> **Nota:** Si la estructura de la página no admite agregar nuevas categorías desde el CMS (el botón no aparece), es necesario hacer el cambio directamente en el archivo JSON. Consulte el [Capítulo 7 — Edición directa en VS Code](07-edicion-directa-vscode.md) o solicite ayuda al equipo técnico.
