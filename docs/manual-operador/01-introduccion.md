# Capítulo 1 — Introducción al portal ITRC

## ¿Qué es el portal ITRC nuevo?

El portal web de la Agencia del Inspector General de Tributos, Rentas y Contribuciones Parafiscales (ITRC) es el sitio institucional oficial de la entidad. Su propósito es publicar información pública de manera oportuna, cumplir con las obligaciones de transparencia establecidas por la Ley 1712 de 2014, y servir como canal de comunicación con la ciudadanía.

El portal fue construido con **Astro**, un generador de sitios estáticos moderno, como reemplazo del sitio anterior en WordPress (`www.itrc.gov.co`). A diferencia de WordPress, este portal no depende de una base de datos ni de un servidor de aplicaciones: los archivos que se publican son páginas HTML estáticas, lo que lo hace más rápido, más seguro y más fácil de respaldar.

## Diferencias con el WordPress anterior

| Aspecto | WordPress (anterior) | Portal Astro + Sveltia CMS (actual) |
|---------|----------------------|-------------------------------------|
| Base de datos | Sí (MySQL) | No — el contenido vive en archivos de texto |
| Servidor requerido | Sí (PHP + MySQL) | No — archivos estáticos servidos desde la nube |
| Panel de administración | wp-admin (propio) | Sveltia CMS en `/admin` |
| Respaldo | Requiere exportar DB y archivos | El repositorio Git es el respaldo completo |
| Historial de cambios | Limitado (revisiones de WP) | Completo — cada cambio queda registrado en Git con fecha y autor |
| Velocidad del sitio | Variable | Alta — páginas pre-generadas |

## ¿Qué es Sveltia CMS?

Sveltia CMS es el panel de administración del portal. Es una herramienta de edición de contenidos que trabaja directamente sobre los archivos del repositorio Git, sin necesidad de base de datos. Desde este panel usted puede:

- Crear y editar noticias.
- Agregar documentos (PDFs, XLSX) a las páginas institucionales.
- Modificar el slider o carrusel de la página de inicio.
- Actualizar datos de contacto, menú de navegación y accesos rápidos.
- Gestionar eventos, boletines, videos y galería.

El CMS se diferencia de WordPress en que no tiene un servidor propio: actúa como una interfaz gráfica que guarda los cambios directamente en los archivos del repositorio GitHub.

## Requisitos para usar el CMS

Antes de comenzar, verifique que cuenta con lo siguiente:

1. **Navegador**: Google Chrome o Microsoft Edge (versión reciente). El CMS utiliza la API de acceso al sistema de archivos del navegador, que no está disponible en Firefox ni Safari.

2. **Cuenta de GitHub**: debe tener una cuenta en [github.com](https://github.com) con acceso de escritura al repositorio del portal ITRC. Si no tiene acceso, solicítelo al equipo técnico.

3. **Acceso a internet**: el CMS en producción se conecta con GitHub para guardar los cambios.

> **Nota:** Si necesita trabajar sin conexión a internet o hacer cambios estructurales avanzados, consulte el [Capítulo 7 — Edición directa en VS Code](07-edicion-directa-vscode.md).

## Flujo general de trabajo

Cada vez que usted realiza un cambio en el CMS, el proceso que ocurre es el siguiente:

```
Usted edita en el CMS
        |
        v
El CMS guarda el cambio en GitHub (commit automático)
        |
        v
GitHub Actions detecta el nuevo commit
        |
        v
Se ejecuta la construcción del sitio (npm run build)
        |
        v
El sitio actualizado se publica automáticamente
```

Este proceso tarda entre **2 y 5 minutos** desde que usted guarda un cambio hasta que aparece en el sitio público. No es necesario hacer ninguna acción adicional: el despliegue es completamente automático.

> **Tip:** Si pasados 10 minutos el cambio no aparece en el sitio, revise la pestaña "Actions" en el repositorio GitHub para verificar si hubo algún error en la construcción.

## Estructura del contenido

El contenido del portal está organizado en las siguientes colecciones, todas accesibles desde el menú lateral del CMS:

| Sección en el CMS | Qué contiene |
|-------------------|--------------|
| **INICIO** | Entidades vigiladas y enlaces de servicios de la página de inicio |
| **LA AGENCIA** | Páginas institucionales: misión, visión, equipo directivo, organigrama, etc. |
| **TRANSPARENCIA** | Índice de transparencia y sub-páginas asociadas |
| **NORMATIVA** | Normograma, decretos, resoluciones y marco legal |
| **ATENCION Y SERVICIOS** | Canales de atención, PQRS, glosario, notificaciones |
| **PARTICIPA** | Mecanismos de participación ciudadana |
| **PRENSA** | Noticias, eventos, boletines, videos, galería y cápsulas |
| **OBSERVATORIO** | Observatorio de Fraude y Corrupción |
| **SLIDERS** | Carruseles de imágenes del portal |
| **CONFIGURACIÓN** | Contacto, menú de navegación, información del sitio, accesos rápidos |

Cada una de estas secciones se explica en detalle en los capítulos siguientes.
