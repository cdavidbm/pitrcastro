# Documentación del portal ITRC

Esta carpeta es el conjunto público de guías para operar el sitio.

## Para arrancar

| Documento | Para qué sirve |
|---|---|
| [`instalacion.md`](instalacion.md) | Levantar el proyecto en una máquina nueva, incluido cómo traer el contenido. |
| [`despliegue.md`](despliegue.md) | Publicar cambios en el portal. |
| [`backup.md`](backup.md) | Política de snapshots y procedimiento de restauración del servidor. |

## Para usar el CMS (webmaster / editor)

El [`manual-operador/`](manual-operador/) cubre todo el flujo editorial:

| Capítulo | Tema |
|---|---|
| [01](manual-operador/01-introduccion.md) | Introducción al CMS y al portal |
| [02](manual-operador/02-acceso-dashboard.md) | Acceso al admin de Strapi |
| [03](manual-operador/03-publicar-noticia.md) | Publicar una noticia |
| [04](manual-operador/04-gestionar-documentos.md) | Subir y organizar documentos |
| [05](manual-operador/05-banners-slider.md) | Banners del slider del home |
| [06](manual-operador/06-modificar-paginas.md) | Modificar páginas existentes |
| [07](manual-operador/07-edicion-directa-vscode.md) | Edición directa de contenido en VS Code |
| [08](manual-operador/08-mantenimiento-git.md) | Mantenimiento Git para el operador |
| [09](manual-operador/09-despliegue-datacenter.md) | Servidor: nginx, systemd, ufw |
| [10](manual-operador/10-autenticacion-strapi.md) | Cuentas y roles del CMS |
| [11](manual-operador/11-capacitacion-sucesor.md) | Capacitación de un operador nuevo |
| [12](manual-operador/12-notificaciones-y-traslados.md) | Notificaciones y traslados — **la tarea más frecuente** |

## Para entender la arquitectura

| Documento | Para qué sirve |
|---|---|
| [`arquitectura/`](arquitectura/) | Manual técnico en LaTeX (compilable) con la arquitectura del sistema. |
