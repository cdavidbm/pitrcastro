# Capítulo 7 — Edición directa en VS Code

## Cuándo usar VS Code en lugar del CMS

El CMS cubre la mayoría de las tareas cotidianas de mantenimiento del portal. Sin embargo, hay situaciones en que es más eficiente o necesario editar los archivos directamente:

| Situación | Por qué usar VS Code |
|-----------|----------------------|
| Agregar una página completamente nueva | El CMS no crea páginas nuevas; hay que crear el archivo JSON y el archivo `.astro` manualmente |
| Cambios masivos en muchos documentos | Editar un archivo JSON con 100 entradas a la vez es más rápido en un editor de texto |
| Corrección de formato JSON roto | Si el CMS rechaza guardar por un error de formato, hay que corregirlo en el archivo directamente |
| Cambios en la estructura de una sección | Agregar un nuevo nivel de jerarquía que el CMS no expone como campo editable |
| Reorganizar archivos o carpetas | El CMS no mueve archivos entre carpetas |

> **Nota:** Esta sección asume que usted tiene conocimientos básicos de edición de texto y puede seguir instrucciones con precisión. Si no está seguro de un cambio, consulte al equipo técnico antes de proceder.

## Requisitos previos

1. **Git**: instalado en su computador. Descarga en [git-scm.com](https://git-scm.com).
2. **Node.js**: versión 18 o superior. Descarga en [nodejs.org](https://nodejs.org).
3. **VS Code**: editor de código. Descarga en [code.visualstudio.com](https://code.visualstudio.com).
4. **Acceso al repositorio**: debe tener permisos de escritura en el repositorio GitHub del portal.

## Clonar el repositorio

Si es la primera vez que trabaja con el proyecto localmente:

```bash
git clone https://github.com/cdavidbm/pitrcastro.git
cd pitrcastro
npm install
```

Si ya clonó el repositorio antes, actualice su copia local antes de hacer cualquier cambio:

```bash
git pull origin main
```

> **Nota:** Realice siempre `git pull` antes de empezar a editar, para asegurarse de que tiene la versión más reciente del portal y evitar conflictos.

## Estructura de carpetas del proyecto

```
pitrcastro/
├── src/
│   ├── content/           ← Contenido editable
│   │   ├── pages/         ← Archivos JSON de páginas institucionales
│   │   │   ├── agencia/   ← Páginas de La Agencia
│   │   │   ├── transparencia/
│   │   │   ├── prensa/
│   │   │   └── ...
│   │   ├── news/          ← Noticias en formato Markdown (.md)
│   │   ├── events/        ← Eventos en formato JSON
│   │   └── sliders/       ← Sliders en formato JSON
│   ├── pages/             ← Plantillas Astro (.astro) — no editar sin conocimientos
│   └── styles/            ← Estilos CSS — no editar sin conocimientos
├── public/
│   ├── uploads/           ← Archivos subidos desde el CMS
│   └── images/            ← Imágenes del sitio
└── cms/                   ← Configuración del CMS — no editar sin conocimientos
```

Las carpetas que el operador puede editar con seguridad son:
- `src/content/pages/` — archivos JSON de contenido
- `src/content/news/` — archivos Markdown de noticias
- `src/content/sliders/` — archivos JSON de sliders

## Editar un archivo JSON directamente

Los archivos JSON deben seguir un formato estricto. Un error de formato (una coma faltante, una comilla sin cerrar) rompe toda la página.

**Reglas básicas de formato JSON:**

- Las cadenas de texto siempre van entre comillas dobles: `"texto"`.
- Los números no llevan comillas: `2025`.
- Los valores booleanos son `true` o `false` (sin comillas, en minúscula).
- Las listas se encierran entre `[` y `]`.
- Los objetos se encierran entre `{` y `}`.
- El último elemento de una lista u objeto **no** lleva coma al final.

**Ejemplo — Agregar un documento al JSON de Gestión Misional:**

Abra el archivo `src/content/pages/agencia/gestion-misional.json` en VS Code. Localice la categoría donde debe agregar el documento y agregue un nuevo objeto al array `documentos`:

```json
{
  "name": "Informe de gestión II Semestre 2025",
  "file": "https://www.itrc.gov.co/Itrc/wp-content/uploads/2026/01/Informe-II-sem-2025.pdf",
  "anio": "2025"
}
```

Colóquelo al principio del array (antes del primer elemento existente) y asegúrese de que termine con una coma si no es el último elemento:

```json
"documentos": [
  {
    "name": "Informe de gestión II Semestre 2025",
    "file": "https://www.itrc.gov.co/.../Informe-II-sem-2025.pdf",
    "anio": "2025"
  },
  {
    "name": "Informe de gestión I Semestre 2025",
    "file": "https://www.itrc.gov.co/.../Informe-I-sem-2025.pdf",
    "anio": "2025"
  }
]
```

> **Tip:** VS Code resalta automáticamente los errores de formato JSON. Si ve una línea subrayada en rojo, revise esa sección antes de guardar.

## Editar una noticia en Markdown

Los archivos de noticias están en `src/content/news/` con el formato de nombre `AAAA-MM-DD-titulo-de-la-noticia.md`.

Cada archivo tiene dos partes: el frontmatter (metadatos entre `---`) y el cuerpo del artículo.

```markdown
---
title: "Título de la noticia"
date: 2026-04-10
image: ""
excerpt: "Resumen corto para los listados."
tags: []
draft: false
---

Aquí va el cuerpo de la noticia en formato Markdown.

**Texto en negrita** y *texto en cursiva*.

## Subtítulo de sección

Párrafo de contenido...
```

> **Nota:** El frontmatter debe respetar el formato YAML. Las comillas, los dos puntos y la indentación son importantes. No agregue caracteres especiales en los campos del frontmatter sin asegurarse de que estén entre comillas.

## Verificar cambios localmente

Antes de enviar los cambios al repositorio, verifique que el portal funciona correctamente en su máquina local:

```bash
npm run dev
```

Abra `http://localhost:4321` en su navegador. Navegue hasta las páginas que modificó y verifique que se ven correctamente.

Si el terminal muestra errores (líneas en rojo), corrija el problema antes de continuar. Los errores más comunes son:

- **JSON inválido**: revise el archivo JSON con un validador en línea como [jsonlint.com](https://jsonlint.com).
- **Campo requerido vacío**: verifique que los campos obligatorios tienen contenido.
- **Error de importación**: si creó o renombró un archivo, verifique que las rutas en los archivos `.astro` coincidan.

## Hacer commit y push

Una vez verificado que el portal funciona correctamente en local:

1. Revise qué archivos modificó:
   ```bash
   git status
   ```

2. Agregue los archivos modificados al commit:
   ```bash
   git add src/content/pages/agencia/gestion-misional.json
   ```
   O para agregar todos los archivos modificados:
   ```bash
   git add src/content/
   ```

3. Cree el commit con un mensaje descriptivo:
   ```bash
   git commit -m "docs: agrega Informe de Gestión II Semestre 2025 a SAGR"
   ```

4. Envíe los cambios al repositorio remoto:
   ```bash
   git push origin main
   ```

5. Verifique en GitHub (pestaña "Actions") que el deploy se ejecutó correctamente.

> **Nota:** El mensaje del commit debe describir qué cambió y por qué. Mensajes como "cambios" o "actualización" no son útiles para el historial. Use mensajes como "docs: agrega contrato 2025-001 a sección de contratación" o "fix: corrige URL del informe de gestión I semestre".

> **Nota:** Nunca use `git push --force` sobre la rama `main`. Si tiene un conflicto, consulte el [Capítulo 8 — Mantenimiento con Git](08-mantenimiento-git.md) o pida ayuda al equipo técnico.
