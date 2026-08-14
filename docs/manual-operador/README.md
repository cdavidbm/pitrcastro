# Manual del Operador — Portal Web ITRC

Manual de referencia para el editor o webmaster encargado de mantener el contenido del portal institucional de la Agencia ITRC.

---

## Capítulos

| N.° | Capítulo | Descripción |
|-----|----------|-------------|
| 01 | [Introducción al portal](01-introduccion.md) | Qué es el portal, qué stack lo compone (Astro + Strapi) y cómo se publica el contenido |
| 02 | [Acceso y dashboard del CMS](02-acceso-dashboard.md) | Login a Strapi, orientación del panel y guardar/publicar |
| 03 | [Publicar una noticia](03-publicar-noticia.md) | Crear, corregir y retirar noticias y ediciones del periódico |
| 04 | [Gestionar documentos](04-gestionar-documentos.md) | Subir PDFs y archivos al Media Library, asociarlos a páginas |
| 05 | [Banners del inicio](05-banners-slider.md) | Cambiar, reordenar y agregar banners del carrusel de la portada |
| 06 | [Modificar páginas institucionales](06-modificar-paginas.md) | Editar textos, contacto, menú y accesos rápidos |
| 07 | [Edición directa en VS Code](07-edicion-directa-vscode.md) | Cuándo y cómo editar archivos fuente sin pasar por el CMS |
| 08 | [Mantenimiento con Git](08-mantenimiento-git.md) | Flujo diario de trabajo, resolución de conflictos y respaldo |
| 09 | [Despliegue en datacenter (Ubuntu + nginx + Strapi)](09-despliegue-datacenter.md) | Arquitectura del servidor, publicación, manejo de binarios y copias de seguridad |
| 10 | [Autenticación y gestión de usuarios en Strapi](10-autenticacion-strapi.md) | Crear, retirar y gestionar cuentas de editores; roles, permisos y recuperación de contraseña |
| 11 | [Capacitación de un nuevo operador](11-capacitacion-sucesor.md) | Sesiones guiadas de entrega, ejercicios prácticos, checklist de cierre |
| 12 | [Notificaciones y traslados](12-notificaciones-y-traslados.md) | Publicar edictos, estados y traslados a partir del correo que los envía |

---

## Las tres tareas del día a día

Casi todo el trabajo de mantenimiento del portal son estas tres, y las tres se
hacen enteras desde el panel:

| Tarea | Capítulo | Con qué frecuencia |
|---|---|---|
| Publicar un edicto, estado o traslado | [12 — Notificaciones y traslados](12-notificaciones-y-traslados.md) | Varias veces por semana |
| Publicar una noticia o comunicado | [03 — Publicar una noticia](03-publicar-noticia.md) | Semanal |
| Cambiar un banner de la portada | [05 — Banners del inicio](05-banners-slider.md) | Ocasional |

Cada uno de esos capítulos trae un ejemplo completo, con datos reales, de
principio a fin.

---

## Escenarios frecuentes

Use esta tabla para encontrar rápidamente el capítulo que necesita según la tarea.

| Tarea solicitada | Capítulo |
|------------------|----------|
| Publicar un edicto, estado o traslado | [12 — Notificaciones y traslados](12-notificaciones-y-traslados.md) |
| Corregir una notificación ya publicada | [12 — Notificaciones y traslados](12-notificaciones-y-traslados.md) |
| Publicar una noticia nueva | [03 — Publicar noticia](03-publicar-noticia.md) |
| Publicar una edición del periódico institucional | [03 — Publicar noticia](03-publicar-noticia.md) |
| Editar el texto de una noticia existente | [03 — Publicar noticia](03-publicar-noticia.md) |
| Agregar un PDF a una página de transparencia o informes | [04 — Gestionar documentos](04-gestionar-documentos.md) |
| Actualizar la tabla de contratación | [04 — Gestionar documentos](04-gestionar-documentos.md) |
| Cambiar el banner de inicio (slider) | [05 — Banners del inicio](05-banners-slider.md) |
| Quitar un banner sin borrarlo | [05 — Banners del inicio](05-banners-slider.md) |
| Agregar un slide temporal para un evento | [05 — Banners y slider](05-banners-slider.md) |
| Actualizar el teléfono o correo de contacto | [06 — Modificar páginas](06-modificar-paginas.md) |
| Cambiar un enlace del menú de navegación | [06 — Modificar páginas](06-modificar-paginas.md) |
| Actualizar los accesos rápidos de la página de inicio | [06 — Modificar páginas](06-modificar-paginas.md) |
| Crear un content type nuevo o agregar un campo a uno existente | [07 — Edición directa VS Code](07-edicion-directa-vscode.md) |
| Hacer cambios masivos en plantillas Astro | [07 — Edición directa VS Code](07-edicion-directa-vscode.md) |
| Sincronizar cambios de código con el repositorio | [08 — Mantenimiento Git](08-mantenimiento-git.md) |
| Resolver un conflicto de git cuando dos personas editaron lo mismo | [08 — Mantenimiento Git](08-mantenimiento-git.md) |
| Verificar el estado del despliegue del portal | [09 — Despliegue en datacenter](09-despliegue-datacenter.md) |
| Entender qué corre en el servidor productivo | [09 — Despliegue en datacenter, sección A](09-despliegue-datacenter.md#a-piezas-del-servidor-productivo) |
| Qué NO debe tocar el operador | [09 — Despliegue en datacenter, sección D](09-despliegue-datacenter.md#d-qué-no-debe-hacer-el-operador) |
| Cuándo escalar un problema al desarrollador | [09 — Despliegue en datacenter, sección H](09-despliegue-datacenter.md#h-cuándo-escalar-a-un-desarrollador) |
| Crear una cuenta nueva de editor en el CMS | [10 — Autenticación, sección C](10-autenticacion-strapi.md#c-crear-un-usuario-nuevo) |
| Retirar acceso a un editor que se va | [10 — Autenticación, sección E](10-autenticacion-strapi.md#e-dar-de-baja-a-un-usuario) |
| Recuperar contraseña olvidada | [10 — Autenticación, sección F](10-autenticacion-strapi.md#f-recuperar-contraseña) |

---

## Convenciones de este manual

- **CMS / Strapi**: panel administrativo accesible en `/admin/`. Es donde el editor pasa el 95% del tiempo.
- **Content type**: estructura de un tipo de contenido en Strapi (single-type para páginas únicas, collection-type para listados).
- **Repositorio / repo**: carpeta del proyecto en GitHub donde vive el código fuente (templates Astro, schemas Strapi, configuración).
- **Publicación**: proceso que reconstruye el sitio público. Se dispara solo al publicar en el CMS. Subir código al repositorio **no publica nada**.
- **Editor**: persona con cuenta en Strapi que crea/modifica contenido del portal.
- **Desarrollador**: persona con cuenta de GitHub que toca código (templates, schemas, infraestructura).

> **Nota:** el panel se abre con la VPN del proveedor conectada, en `https://10.5.10.6/admin`. Ver [Capítulo 2](02-acceso-dashboard.md).
