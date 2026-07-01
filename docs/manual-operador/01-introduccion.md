# Capítulo 1 — Introducción al portal ITRC

## Qué es el portal ITRC

El portal web de la Agencia del Inspector General de Tributos, Rentas y Contribuciones Parafiscales (ITRC) es el sitio institucional oficial de la entidad. Su propósito es publicar información pública de manera oportuna, cumplir con las obligaciones de transparencia establecidas por la Ley 1712 de 2014, y servir como canal de comunicación con la ciudadanía.

## Stack tecnológico

El portal se compone de tres piezas que conviven en el servidor del datacenter ITRC:

| Pieza | Función |
|-------|---------|
| **Astro** | Generador estático que produce las páginas HTML del sitio público. El sitio servido es archivos pre-compilados, no procesa peticiones dinámicas. |
| **Strapi v5 CE** | CMS headless. Aloja todo el contenido editable (páginas, noticias, eventos, slider, configuración global) y expone una API REST que Astro consume al compilar. |
| **PostgreSQL** | Base de datos del CMS. Persiste el contenido y los archivos subidos a través del Media Library de Strapi. |

Astro y Strapi son servicios independientes:

- El sitio público (`/`) lo sirve nginx desde `/var/www/portal_nuevo/` (HTML estático).
- El CMS (`/admin/`) y la API (`/api/`) los sirve un contenedor Docker `itrc-cms-strapi` por proxy de nginx hacia `127.0.0.1:1337`.
- Postgres corre en otro contenedor (`itrc-cms-postgres`) y solo es accesible desde el contenedor Strapi.

## Flujo general de trabajo

El editor opera siempre desde el panel `/admin/` de Strapi. El ciclo de publicación es:

```
Editor en /admin/ (Strapi)
        │
        │ 1. Edita una entrada y pulsa "Publish"
        ▼
Strapi guarda el cambio en Postgres
        │
        │ 2. Strapi llama al servicio de deploy (webhook local :9001)
        ▼
El servicio compila el sitio (pnpm build)
        │    Astro lee la API de Strapi y genera el HTML estático
        ▼
El sitio compilado se copia a /var/www/portal_nuevo/ y nginx lo sirve
        │
        ▼
Cambio visible en el portal público
```

El tiempo habitual desde la publicación en el CMS hasta que el cambio aparece en el sitio es de **~90 segundos** (build + rsync).

## Quién hace qué

| Tarea | Dónde se hace |
|-------|---------------|
| Crear o editar una noticia | `/admin/` → Content Manager → Noticia |
| Subir un PDF a una página | `/admin/` → la página correspondiente, campo de documentos |
| Cambiar el slider de la portada | `/admin/` → Slider Principal |
| Modificar contacto, menú, accesos rápidos | `/admin/` → Configuración → bloque correspondiente |
| Crear un tipo de contenido nuevo (estructura) | Edición directa en VS Code (`cms-strapi/src/api/`) por el equipo técnico |
| Cambiar diseño visual o agregar una página estática | Edición directa en VS Code (`src/pages/`, `src/styles/`) |

> **Nota:** el manual está orientado al editor / webmaster que opera el CMS. Tareas que requieran tocar código fuente (estructura de schemas, layout, plantillas Astro) se cubren en el [Capítulo 7 — Edición directa en VS Code](07-edicion-directa-vscode.md).

## Estructura del contenido en el CMS

El sidebar del Content Manager agrupa todos los tipos de contenido del portal. Los grupos principales son:

| Grupo en el CMS | Qué contiene |
|-----------------|--------------|
| **Inicio** | Slider principal, accesos rápidos, entidades vigiladas |
| **La Agencia** | Páginas institucionales: misión, visión, equipo directivo, organigrama, etc. |
| **Transparencia** | Índice de transparencia y sub-páginas asociadas |
| **Normativa** | Normograma, decretos, resoluciones, marco legal |
| **Atención y Servicios** | Canales de atención, PQRS, glosario, notificaciones |
| **Participa** | Mecanismos de participación ciudadana |
| **Prensa** | Noticias, eventos, boletines, videos, galería, cápsulas |
| **Observatorio** | Observatorio de Fraude y Corrupción |
| **Configuración** | Datos de contacto, menú de navegación, información del sitio |

Cada grupo se compone de uno o varios *content types* (single-types para páginas únicas y collection-types para listados). Los capítulos siguientes detallan los flujos editoriales por grupo.

## Requisitos para usar el CMS

1. **Navegador**: Chrome, Edge o Firefox en versión reciente.
2. **Cuenta de editor en Strapi**: usuario y contraseña asignados por el administrador del portal. La gestión de cuentas se describe en el [Capítulo 10](10-autenticacion-strapi.md).
3. **Conexión a la red institucional o VPN ITRC**: el CMS está en `http://192.168.82.13/admin/`, dentro de la red privada del datacenter.
