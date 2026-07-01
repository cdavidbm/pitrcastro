# Capítulo 9 — Despliegue en datacenter

Este capítulo describe cómo el portal `www.itrc.gov.co` llega desde el CMS hasta el navegador del ciudadano. Está pensado para que el operador entienda el circuito, sepa dónde mirar cuando algo no sale y sepa qué está fuera de sus manos.

**Buena noticia para el operador**: no tiene que ejecutar nada de este capítulo en el día a día. Cuando pulsa **Publish** en Strapi, el sitio se actualiza solo. Este capítulo describe lo que ocurre por debajo y lo que se puede revisar si algo tarda.

---

## A. Piezas del servidor productivo

El portal corre en un servidor Ubuntu del datacenter HostDime, alias `santorini`, con IP `10.5.10.6`. Las piezas relevantes:

```
                  ┌─────────────────────────────┐
                  │       Visitante / editor    │
                  └────────────┬────────────────┘
                               │ HTTPS (www.itrc.gov.co)
                               ▼
                  ┌─────────────────────────────┐
                  │           nginx             │
                  │  /          → estático      │
                  │  /admin/    → :1337         │
                  │  /api/      → :1337         │
                  └─────┬─────────────┬─────────┘
                        │             │
              archivos  │             │ proxy_pass
                        ▼             ▼
        /var/www/portal_nuevo/  ┌─────────────────────┐
        (HTML estático          │ itrc-cms-strapi     │
         generado por Astro)    │ (Docker, port 1337) │
                                └──────────┬──────────┘
                                           │
                                           ▼
                                ┌─────────────────────┐
                                │ itrc-cms-postgres   │
                                │ (Docker, volumen    │
                                │  persistente)       │
                                └─────────────────────┘

                     ┌─────────────────────────────┐
                     │  strapi-deploy (systemd)    │
                     │  escucha en 127.0.0.1:9001  │
                     └─────────────────────────────┘
```

| Componente | Qué hace |
|---|---|
| nginx | Sirve el HTML estático y proxya `/admin/` y `/api/` al CMS. |
| Strapi (contenedor `itrc-cms-strapi`) | Panel administrativo y API de contenido. |
| Postgres (contenedor `itrc-cms-postgres`) | Base de datos del CMS. El volumen persistente `itrc-cms-postgres-data` guarda todo el contenido editable. |
| `strapi-deploy` (servicio systemd) | Escucha eventos de Strapi y recompila el sitio. |
| Working tree | Directorio `/home/admweb/itrc-cms/` donde vive el código que el servicio compila. |
| Webroot | `/var/www/portal_nuevo/` donde nginx lee el HTML publicado. |

El sitio público es 100% archivos pre-compilados. Strapi solo se consulta cuando el editor entra al panel o cuando el servicio recompila.

---

## B. El ciclo de publicación

Cuando el editor pulsa **Publish** en `/admin/`, esto ocurre sin intervención humana:

```
1. Strapi guarda el cambio en Postgres.
2. Strapi llama al servicio strapi-deploy (webhook local).
3. strapi-deploy corre "pnpm build" en el working tree.
   Astro lee la API de Strapi y arma el HTML nuevo.
4. strapi-deploy copia el HTML al webroot y ajusta permisos.
5. El cambio queda visible en www.itrc.gov.co.
```

Duración habitual: **unos 85 segundos** desde el Publish hasta que el HTML nuevo está en línea.

Si el editor publica varias veces mientras un build está en curso, el servicio encola una sola recompilación al final y descarta los intermedios. No hay riesgo de saturarlo con clics.

---

## C. Qué hacer cuando el cambio no aparece

Antes de pedir ayuda técnica, el operador puede correr estos chequeos:

1. **Esperar 90 segundos** desde el Publish. El ciclo completo toma alrededor de ese tiempo.
2. **Refrescar con Ctrl+F5** o abrir la página en una ventana de incógnito. A veces el caché del navegador engaña.
3. **Confirmar que la entrada quedó en estado "Published" en Strapi**. En el Content Manager, la etiqueta verde debe decir Published, no Draft.
4. **Probar la URL directamente en `https://www.itrc.gov.co/<ruta>`**, no desde un enlace viejo.

Si a los 5 minutos el cambio sigue sin aparecer, escalar a un desarrollador. Los datos que va a pedir son:

- Qué entrada se publicó (content-type y título).
- Hora exacta del Publish.
- URL donde el operador esperaba ver el cambio.

Con eso el desarrollador puede revisar el log del servicio en un solo comando (`tail /var/log/strapi-deploy/webhook.log`) y ver si el build corrió, si dio error o si el evento nunca llegó.

---

## D. Qué NO debe hacer el operador

- **No tocar el servicio `strapi-deploy`** desde el sistema. Reiniciarlo mal puede dejar el sitio congelado en la última versión buena.
- **No borrar el contenedor `itrc-cms-postgres` ni su volumen**. Contiene todo el contenido editable del portal. Perderlo obliga a restaurar del backup diario.
- **No editar archivos directamente en `/var/www/portal_nuevo/`**. Ese directorio lo reescribe el servicio en cada build; cualquier edición manual se pierde en el próximo Publish.
- **No editar el working tree `/home/admweb/itrc-cms/` sin coordinar con un desarrollador**. Esos archivos incluyen parches necesarios para que Strapi arranque; una limpieza equivocada rompe el sitio.
- **No usar `git push --force` en `main`**. Ese comando puede eliminar historial y trabajo de otros editores.

Todas estas tareas son competencia de un desarrollador con acceso al servidor.

---

## E. Rutas útiles para el operador

Estas rutas son las que va a mencionar un desarrollador cuando pida un dato en soporte. El operador no necesita ejecutarlas, solo reconocerlas.

| Recurso | Dónde vive |
|---|---|
| Panel del CMS | `https://www.itrc.gov.co/admin/` |
| API del CMS | `https://www.itrc.gov.co/api/` |
| Sitio público | `https://www.itrc.gov.co/` |
| HTML servido | `/var/www/portal_nuevo/` (dentro del servidor) |
| Working tree del build | `/home/admweb/itrc-cms/` |
| Log del servicio de deploy | `/var/log/strapi-deploy/webhook.log` |
| Log del backup diario | `/var/log/itrc-backup.log` |

---

## F. Backups

Todas las noches a las 3:00 se ejecuta un backup automático que guarda:

- La base de datos del CMS.
- La media library (los archivos que suben los editores).
- Los binarios institucionales históricos.
- El working tree del build.
- La configuración de nginx y del servicio de deploy.

La política es de cuatro slots rotativos: dos diarios, uno semanal y uno mensual. Detalles operativos y procedimientos de restauración en [`backup.md`](../backup.md).

El backup lo administra el equipo web. La replicación off-site y las snapshots de VM las cubren HostDime e Infra ITRC; el operador no necesita gestionarlas.

---

## G. Sandbox de pruebas

Existe un segundo servidor interno (`192.168.82.13`, alias `ubu_24_bolivia`) que el equipo técnico usa para probar cambios de plantilla antes de moverlos a producción. **No es un destino publicable**: no lo ven los ciudadanos y no hay ruta desde producción hacia allí.

Si un desarrollador le pide al operador probar algo en `http://192.168.82.13/`, esa dirección solo funciona con VPN institucional FortiClient conectada.

---

## H. Cuándo escalar a un desarrollador

Este es el criterio práctico. El operador escala cuando:

- Después de 5 minutos el Publish no se refleja en el sitio público.
- El panel `/admin/` devuelve 502, 504 o queda en blanco.
- La subida de un PDF falla con "Tipo de archivo no permitido" y es un tipo que debería estar permitido.
- Aparece un banner de error en Strapi que menciona base de datos, contenedor o webhook.
- Hay que restaurar contenido borrado por accidente (los backups los aplica un desarrollador).
- Hay que dar de alta un contenido nuevo que no existe como content-type todavía.

Con la información de qué se estaba haciendo, en qué URL y a qué hora, un desarrollador con acceso al servidor puede diagnosticar y actuar en pocos comandos.
