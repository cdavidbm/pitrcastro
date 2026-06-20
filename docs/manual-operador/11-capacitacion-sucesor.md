# Capítulo 11 — Capacitación de un nuevo operador

Este capítulo es la guía para entrenar a un nuevo editor o webmaster que reciba el portal. Está pensado para que la persona que entrega y la persona que recibe puedan recorrerlo juntas en una sesión de 1 a 2 horas.

---

## A. Antes de empezar

El nuevo operador debería tener:

- Cuenta de correo institucional `@itrc.gov.co` válida.
- Una computadora con Windows o Linux y permisos para instalar software.
- Acceso a internet (cualquier conexión, no requiere red institucional).

Lo que NO necesita en el día a día:

- VPN ni FortiClient (el admin es público en `www.itrc.gov.co/admin`).
- Cuenta de GitHub.
- Conocimiento de Astro, Strapi v5, Docker, ni nginx.

Lo que NO necesita pero ayuda saber existe:

- Editor de código (recomendado VS Code) para ediciones avanzadas opcionales.
- Cuenta de GitHub si en algún momento toca aprobar PRs de desarrollo.
- Cliente SSH si necesita inspeccionar el server (rara vez).

---

## B. Sesión 1 — Entender el modelo (30 min)

**Objetivo**: que el nuevo operador entienda QUÉ es lo que está editando.

1. Mostrar el portal público `www.itrc.gov.co/` en un browser.
2. Explicar la diferencia entre **contenido** (texto, PDFs, sliders) y **estructura** (template, layout, código). El operador edita contenido. El desarrollador edita estructura.
3. Recorrer 3-4 páginas del portal y mostrar cuáles partes vienen del CMS (text, datos, listas) y cuáles del código (layout, estilos).
4. Mostrar el admin `www.itrc.gov.co/admin` y hacer el login con la cuenta del nuevo operador (que ya debe estar creada — ver [Capítulo 10](10-autenticacion-strapi.md)).
5. Explicar el ciclo: **edito → Publish → en ~90 segundos el cambio aparece en el sitio público**. No requiere intervención de un desarrollador.

---

## C. Sesión 2 — Práctica guiada (45 min)

**Objetivo**: que el nuevo operador realice 4 publicaciones de prueba revertibles.

### Ejercicio 1 — Publicar una noticia

1. Recorrer juntos el [Capítulo 3 — Publicar noticia](03-publicar-noticia.md).
2. Crear una noticia titulada `Prueba capacitación [iniciales del operador]`.
3. Verificar que aparece en `/prensa/noticias` en ~90 segundos.
4. Eliminarla.

### Ejercicio 2 — Subir un PDF al Media Library y referenciarlo en una página

1. Recorrer el [Capítulo 4 — Gestionar documentos](04-gestionar-documentos.md).
2. Subir un PDF de prueba (~1 MB).
3. Asociarlo a un campo de prueba en algún content type secundario (ej. `transparencia-evaluacion-independiente`).
4. Confirmar que la URL del PDF resuelve.
5. Quitar la referencia y borrar el PDF.

### Ejercicio 3 — Reordenar un slider del home

1. Ver [Capítulo 5 — Banners y slider](05-banners-slider.md).
2. Cambiar el orden de dos slides.
3. Refrescar `www.itrc.gov.co/` en incógnito tras 90 segundos para verificar.
4. Volver al orden original.

### Ejercicio 4 — Editar un texto institucional

1. Ver [Capítulo 6 — Modificar páginas institucionales](06-modificar-paginas.md).
2. Cambiar el campo `description` del content type **Sitio (configuracion global)** agregándole un espacio al final.
3. Publicar.
4. Verificar que en ~90 segundos no rompió nada (inspeccionar `<meta name="description">` del HTML público).
5. Revertir el cambio.

---

## D. Sesión 3 — Casos especiales y resolución de problemas (30 min)

**Objetivo**: que el nuevo operador sepa qué hacer cuando algo no funciona.

### Cosas que SÍ puede tocar sin pedir ayuda

- Crear, editar y borrar noticias.
- Subir PDFs y otros documentos al Media Library.
- Editar single-types: Home, Sitio, Contacto, Menu, Accesos rapidos, CIPREP, normativa, etc.
- Editar collection-types: Notificación, Eventos, Sliders, etc.
- Gestionar usuarios y permisos (si tiene rol Super Admin — ver [Capítulo 10](10-autenticacion-strapi.md)).

### Cosas que NO debería tocar sin escalar

- **Content-Type Builder** (Settings → Content-Type Builder). Cambiar schemas rompe el sitio público si no se sincronizan los componentes Astro. Escalar a un desarrollador.
- **Webhooks** (Settings → Webhooks). Hay uno llamado `deploy-trigger` que NO debe ser editado ni borrado — es el que hace que las publicaciones se vean en el sitio.
- **Plugins**. No instalar plugins de terceros sin autorización técnica.
- **El repositorio GitHub**. Si necesita hacer un cambio de código, escalar.

### Si algo no aparece en el sitio público después de publicar

1. Esperar 90 segundos (el ciclo build + deploy toma ~85 seg).
2. Refrescar con **Ctrl + F5** o probar en una ventana de incógnito.
3. Si después de 5 minutos sigue sin aparecer, revisar el log del deploy: pedir a un desarrollador que ejecute `ssh itrc-prod 'tail -30 /var/log/strapi-deploy/webhook.log'` para diagnosticar.

### Si el login al admin no funciona

1. Verificar que la URL sea exactamente `https://www.itrc.gov.co/admin` (no `http://`).
2. Si dice "Too Many Requests" (HTTP 429), esperar 1 minuto.
3. Si dice "401 Unauthorized" muchas veces seguidas, la IP puede haber sido baneada por fail2ban — esperar 1 hora o pedir desbloqueo a un desarrollador (`fail2ban-client set strapi-admin unbanip <IP>`).
4. Si olvidó la contraseña, usar **"Forgot your password?"** del formulario (Strapi envía email).

### Si el editor sube un archivo y dice "Tipo de archivo no permitido"

- El middleware de seguridad rechaza ejecutables, scripts y SVGs.
- Tipos permitidos: pdf, docx, doc, xlsx, xls, pptx, ppt, odt, ods, odp, rtf, txt, csv, jpg, jpeg, png, gif, webp, mp4, mp3, ogg, webm, wav, zip.
- Si necesita subir un tipo nuevo legítimo, pedir a un desarrollador que actualice el middleware.

---

## E. Sesión 4 — Mantenimiento mensual recomendado (15 min)

**Objetivo**: que el nuevo operador entienda las tareas de higiene que conviene hacer cada mes.

| Tarea | Frecuencia | Cómo |
|---|---|---|
| Revisar logs de intentos sospechosos al admin | Mensual | Pedir a un desarrollador: `fail2ban-client status strapi-admin` |
| Verificar que el backup automático corrió | Semanal | Revisar `/root/backups/itrc-cms-*/SHA256SUMS` está presente y se verifica |
| Confirmar espacio disponible en disco | Mensual | `df -h /` debería mostrar < 80% usado |
| Actualizar la lista de "noticias archivadas" | Trimestral | Marcar como `archived: true` las noticias > 12 meses |
| Recopilar y subir actos administrativos nuevos | Continuo | Cada nueva resolución/decreto/circular se sube al normograma |

---

## F. Recursos de referencia

- **Manual del operador completo**: este directorio `docs/manual-operador/`.
- **Documentación técnica de arquitectura**: `docs/arquitectura/` (LaTeX, para desarrolladores).
- **Estado operativo actual**: `info_bkp/07-operacion-cms-prod.md` (en el equipo del coordinador técnico).
- **Cheatsheet de reconexión técnica**: `info_bkp/04-retomar-itrc-prod.md`.
- **Soporte HostDime** (proveedor del servidor): contacto de Deyby/área cliente.

---

## G. Checklist de "fin de la capacitación"

Antes de declarar al nuevo operador como autónomo, validar:

- [ ] Hace login a `www.itrc.gov.co/admin` sin asistencia.
- [ ] Publica una noticia de prueba y verifica que aparece en el sitio público.
- [ ] Sube un PDF al Media Library, lo asocia a un content type, lo despublica.
- [ ] Edita y publica un cambio en un single-type (ej. Sitio, Contacto).
- [ ] Sabe dónde está la documentación si tiene dudas.
- [ ] Tiene los datos de contacto del coordinador técnico y de HostDime para escalar.
- [ ] Entiende cuáles son las tareas que NO debe hacer sin escalar (Content-Type Builder, Webhooks, plugins).
- [ ] Conoce el ciclo de 90 segundos entre publicar y ver el cambio.
- [ ] Sabe que el portal estático sigue sirviendo aunque el admin falle (defensa en profundidad).
