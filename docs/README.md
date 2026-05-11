# Documentación del portal ITRC

Esta carpeta es el conjunto público de guías para operar el sitio.

## Para arrancar

| Documento | Para qué sirve |
|---|---|
| [`instalacion.md`](instalacion.md) | Levantar el repo en una máquina nueva (Astro + Strapi + Postgres). |
| [`despliegue.md`](despliegue.md) | Subir cambios al servidor de pruebas. Auto-deploy por push y fallback manual. |
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
| [09](manual-operador/09-despliegue-datacenter.md) | Servidor: nginx, runner, systemd, ufw |
| [10](manual-operador/10-autenticacion-strapi.md) | Cuentas y roles del CMS |

## Para entender la arquitectura

| Documento | Para qué sirve |
|---|---|
| [`arquitectura/`](arquitectura/) | Manual técnico en LaTeX (compilable) con la arquitectura del sistema. |
