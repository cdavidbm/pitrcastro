# Manual del Operador — Portal Web ITRC

Manual de referencia para el webmaster o persona responsable de mantener el contenido del portal institucional de la Agencia ITRC.

---

## Capítulos

| N.° | Capítulo | Descripción |
|-----|----------|-------------|
| 01 | [Introducción al portal](01-introduccion.md) | Qué es el portal, qué es Sveltia CMS y cómo funciona el flujo de publicación |
| 02 | [Acceso y dashboard del CMS](02-acceso-dashboard.md) | Cómo ingresar al panel administrativo y orientarse en la interfaz |
| 03 | [Publicar una noticia](03-publicar-noticia.md) | Crear, editar y eliminar noticias en la sección de Prensa |
| 04 | [Gestionar documentos](04-gestionar-documentos.md) | Agregar PDFs y archivos a las páginas institucionales |
| 05 | [Banners y slider principal](05-banners-slider.md) | Modificar, reordenar y agregar diapositivas al carrusel de inicio |
| 06 | [Modificar páginas institucionales](06-modificar-paginas.md) | Editar textos, contacto, menú y accesos rápidos |
| 07 | [Edición directa en VS Code](07-edicion-directa-vscode.md) | Cuándo y cómo editar los archivos fuente sin pasar por el CMS |
| 08 | [Mantenimiento con Git](08-mantenimiento-git.md) | Flujo diario de trabajo, resolución de conflictos y respaldo |
| 09 | [Despliegue en datacenter propio (Ubuntu + nginx)](09-despliegue-datacenter.md) | Configuración del servidor institucional, pipeline SSH con GitHub Actions, manejo de binarios en git y flujo multi-webmaster |
| 10 | [Autenticación Sveltia CMS con GitHub](10-autenticacion-sveltia-github.md) | Configurar OAuth, crear y retirar cuentas de webmaster, roles de acceso y buenas prácticas de seguridad |

---

## Escenarios frecuentes

Use esta tabla para encontrar rápidamente el capítulo que necesita según la tarea que debe realizar.

| Tarea solicitada | Capítulo |
|------------------|----------|
| Publicar una noticia nueva | [03 — Publicar noticia](03-publicar-noticia.md) |
| Editar el texto de una noticia existente | [03 — Publicar noticia](03-publicar-noticia.md) |
| Agregar un PDF a una página de transparencia o informes | [04 — Gestionar documentos](04-gestionar-documentos.md) |
| Actualizar la tabla de contratación | [04 — Gestionar documentos](04-gestionar-documentos.md) |
| Cambiar el banner de inicio (slider) | [05 — Banners y slider](05-banners-slider.md) |
| Agregar un slide temporal para un evento | [05 — Banners y slider](05-banners-slider.md) |
| Actualizar el teléfono o correo de contacto | [06 — Modificar páginas](06-modificar-paginas.md) |
| Cambiar un enlace del menú de navegación | [06 — Modificar páginas](06-modificar-paginas.md) |
| Actualizar los accesos rápidos de la página de inicio | [06 — Modificar páginas](06-modificar-paginas.md) |
| Agregar una página nueva completa | [07 — Edición directa VS Code](07-edicion-directa-vscode.md) |
| Hacer cambios masivos en varios archivos a la vez | [07 — Edición directa VS Code](07-edicion-directa-vscode.md) |
| Sincronizar cambios con el servidor / repositorio | [08 — Mantenimiento Git](08-mantenimiento-git.md) |
| Resolver un conflicto cuando dos personas editaron lo mismo | [08 — Mantenimiento Git](08-mantenimiento-git.md) |
| Desplegar el portal en el servidor del ITRC | [09 — Despliegue en datacenter](09-despliegue-datacenter.md) |
| Configurar dominio personalizado (portal.itrc.gov.co) | [09 — Despliegue en datacenter, sección C](09-despliegue-datacenter.md#c-configuración-nginx) |
| Revertir un despliegue defectuoso | [09 — Despliegue en datacenter, sección G](09-despliegue-datacenter.md#g-rollback-y-monitoreo) |
| Configurar el hosting de documentos (binarios) | [09 — Despliegue en datacenter, sección E](09-despliegue-datacenter.md#e-manejo-de-binarios) |
| Configurar GitHub Actions para despliegue SSH | [09 — Despliegue en datacenter, sección D](09-despliegue-datacenter.md#d-github-action-de-despliegue) |
| Preparar el servidor Ubuntu para el portal | [09 — Despliegue en datacenter, sección B](09-despliegue-datacenter.md#b-preparación-del-servidor-ubuntu) |
| Dar acceso al CMS a un nuevo webmaster | [10 — Autenticación, sección F](10-autenticacion-sveltia-github.md#f-administración-de-webmasters--alta-de-usuarios) |
| Retirar acceso al CMS a un webmaster que se va | [10 — Autenticación, sección G](10-autenticacion-sveltia-github.md#g-baja-de-usuarios--retiro-de-webmasters) |

---

## Convenciones de este manual

- **CMS**: panel administrativo de Sveltia CMS, accesible en `/admin`.
- **Repositorio / repo**: carpeta del proyecto en GitHub donde viven todos los archivos fuente.
- **Deploy / despliegue**: proceso automático que publica los cambios en el sitio público.
- Los nombres de campos y colecciones se escriben en `formato de código` tal como aparecen en el CMS.

> **Nota:** Este manual asume que usted ya tiene una cuenta de GitHub con acceso al repositorio del portal ITRC y el navegador Chrome o Microsoft Edge instalado.
