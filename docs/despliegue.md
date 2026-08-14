# Despliegue

Cómo llegan los cambios al portal público `www.itrc.gov.co`.

## El mecanismo

El sitio es estático: nginx sirve archivos HTML ya generados. Publicar significa
volver a compilar el sitio y copiar el resultado al directorio que nginx sirve.

De eso se encarga un servicio en el servidor de producción, `strapi-deploy`, que
escucha en el puerto `9001` y hace tres cosas seguidas:

```
pnpm build  →  rsync de dist/ al webroot  →  chown a www-data
```

| Dato | Valor |
|---|---|
| Servidor | `santorini`, `10.5.10.6` |
| Acceso | VPN openfortivpn del proveedor + llave SSH (`ssh itrc-prod`) |
| Árbol que se compila | `/home/admweb/itrc-cms/` |
| Directorio publicado | `/var/www/portal_nuevo/` |
| Servicio | `strapi-deploy` (puerto `9001`, solo local) |
| Duración | 2 a 3 minutos |

**El servicio compila el árbol de archivos tal como está en el disco del
servidor.** No ejecuta `git pull`. Un cambio solo llega al portal si el archivo
llega antes a ese árbol.

Por eso `git push` no publica nada: el repositorio respalda el código, no lo
despliega.

## Publicar contenido

Es el camino habitual y no requiere hacer nada de lo anterior. Cuando un editor
pulsa **Publish** en el panel, Strapi llama al servicio por su cuenta y el
cambio aparece en el portal en dos o tres minutos.

## Publicar un cambio de código

Cuando lo que cambia es una plantilla, un componente o la configuración:

**1. Copiar los archivos al árbol del servidor.**

```bash
rsync -a <archivos-locales> itrc-prod:/home/admweb/itrc-cms/<ruta-relativa>/
ssh itrc-prod 'chown -R admweb:admweb /home/admweb/itrc-cms/src'
```

**2. Si cambiaron las dependencias, instalarlas.** El servicio compila pero no
instala; sin este paso compilaría con las versiones anteriores sin avisar.

```bash
ssh itrc-prod 'cd /home/admweb/itrc-cms && sudo -u admweb pnpm install --frozen-lockfile'
```

**3. Disparar la publicación.**

```bash
ssh itrc-prod 'SECRET=$(grep WEBHOOK_SECRET /etc/default/strapi-deploy | cut -d= -f2)
  curl -s -X POST http://127.0.0.1:9001/publish \
    -H "Authorization: Bearer $SECRET" \
    -H "Content-Type: application/json" \
    -d "{\"event\":\"manual\",\"model\":\"manual\"}"'
```

**4. Seguir el registro.**

```bash
ssh itrc-prod 'tail -f /var/log/strapi-deploy/webhook.log'
```

Empieza con `=== BUILD START ===` y termina con `=== DEPLOY DONE ===`.

**5. Comprobar el resultado.**

```bash
curl -I https://www.itrc.gov.co/
curl -I https://www.itrc.gov.co/agencia/mision-vision
```

Si llega otra petición mientras hay una compilación en curso, el servicio encola
una sola al final. No hace falta reintentar.

## Antes de publicar un cambio visible

El intermediario de seguridad del proveedor aplica una política que **solo
existe en producción**: prohíbe todo estilo y todo código escrito dentro de la
página. Un cambio puede funcionar en local y quedar inerte publicado.

La compilación no debe dejar nada incrustado:

```bash
grep -rl '<style\|style="' dist --include='*.html' | wc -l    # debe dar 0
grep -rl '<script type="module">' dist --include='*.html' | wc -l   # debe dar 0
```

## Qué impide publicar el portal en blanco

Trabajar en local con un CMS vacío **no puede vaciar el portal**: la compilación
que se publica corre en el servidor y lee el CMS del servidor. Lo que se sube
desde una máquina de trabajo es código, nunca contenido.

Aun así, si el CMS del servidor estuviera caído o sin datos, la compilación
podría salir vacía. Para eso el servicio de publicación **compara la compilación
nueva con el sitio que ya está publicado** antes de copiar nada:

| Comprobación | Qué exige |
|---|---|
| Mínimo absoluto | 100 páginas |
| Frente a lo publicado | Al menos el 80 % de las páginas |
| Frente a lo publicado | Al menos el 80 % del peso del contenido |

Si alguna falla, **no se copia nada** y el sitio se queda exactamente como
estaba. El registro dice por qué. La causa habitual es que el CMS no respondió.

Cuando el recorte es intencionado y grande —retirar una sección entera, por
ejemplo— hay que decirlo explícitamente:

```bash
-d '{"event":"manual","model":"manual","force":true}'
```

Las publicaciones que dispara el CMS al pulsar **Publish** nunca llevan `force`,
así que un editor no puede saltarse la comprobación sin querer.

## Lo que sí puede destruir contenido

Tres cosas que ninguna comprobación evita, porque no pasan por la publicación:

**1 · `docker compose down -v` en el servidor.** La opción `-v` borra el volumen
`itrc-cms-postgres-data`, que es donde vive **todo** el contenido del portal.
Para parar el CMS, `docker compose stop` o `docker compose down` **sin `-v`**.

**2 · Copiar un `dist/` local directamente al directorio publicado.** Se salta
el servicio y su comprobación. Los archivos se llevan al árbol del servidor y se
dispara la publicación; nunca al directorio que sirve nginx.

**3 · Ejecutar los guiones de `cms-strapi/scripts/` contra el servidor.**
Escriben en el CMS. Todos apuntan por defecto al CMS local; solo alcanzan el
servidor si alguien pone `STRAPI_URL` a mano.

La red de seguridad frente a los tres es la copia diaria de las 03:00, que
conserva cuatro puntos de restauración. Ver [`backup.md`](backup.md).

## Cómo volver atrás

Antes de una publicación arriesgada conviene dejar preparada una copia del sitio
que funciona. Se hace por enlaces duros: tarda una fracción de segundo, no gasta
disco y sobrevive al `rsync --delete` de la publicación siguiente.

```bash
ssh itrc-prod 'cp -al /var/www/portal_nuevo /var/www/portal_respaldo'
```

Para restaurarla:

```bash
ssh itrc-prod 'rsync -a --delete /var/www/portal_respaldo/ /var/www/portal_nuevo/
  chown -R www-data:www-data /var/www/portal_nuevo'
```

## Qué se copia

El `rsync` de la publicación va de `/home/admweb/itrc-cms/dist/` a
`/var/www/portal_nuevo/`, con `--delete` y excluyendo `/uploads/`, que gestiona
Strapi. Astro copia `public/` dentro de `dist/` al compilar, así que los
documentos y las imágenes viajan en el mismo paso.

## VPN desde WSL

En una máquina Windows con WSL, la VPN se sostiene en Windows y WSL la comparte:

```ini
[wsl2]
networkingMode=mirrored
dnsTunneling=true
autoProxy=true
```

Con eso, `ssh`, `rsync` y `curl` de Linux funcionan sin cambios. Para aplicarlo:
`wsl --shutdown` en PowerShell y volver a abrir WSL.

## Diagnóstico

| Síntoma | Causa probable | Solución |
|---|---|---|
| `Connection refused` en el puerto 9001 | Servicio caído | `ssh itrc-prod 'systemctl status strapi-deploy && journalctl -u strapi-deploy -n 100'` |
| Responde 401 | Clave incorrecta | Volver a leer `WEBHOOK_SECRET` de `/etc/default/strapi-deploy` |
| `Permission denied` al compilar | Dueño incorrecto tras copiar archivos | `ssh itrc-prod 'chown -R admweb:admweb /home/admweb/itrc-cms/src'` |
| Compila con una versión que ya no es | Faltó `pnpm install` en el servidor | Instalar y volver a disparar |
| La página nueva no aparece | Caché | Ctrl+F5; comprobar el archivo en el servidor antes de darlo por roto |
| Un control dejó de responder | La política del proveedor bloqueó código incrustado | Revisar las comprobaciones de arriba |

Para la arquitectura del servidor ver
[`manual-operador/09-despliegue-datacenter.md`](manual-operador/09-despliegue-datacenter.md).
Para las copias de seguridad, [`backup.md`](backup.md).
