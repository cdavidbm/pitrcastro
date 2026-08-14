# Si algo se rompió

Guía de primera respuesta. Empiece por el diagnóstico y vaya al caso que
corresponda.

> **Lo primero, para tranquilidad**: el portal es HTML estático. Sigue en pie
> aunque el gestor de contenidos, la base de datos o el servicio de publicación
> estén caídos. Lo único que no se puede hacer entonces es publicar contenido
> nuevo. **Casi nada de lo que falle tumba el sitio.**

## Diagnóstico en un minuto

```bash
ssh itrc-prod '
  echo "nginx:         $(systemctl is-active nginx)"
  echo "publicacion:   $(systemctl is-active strapi-deploy)"
  echo "CMS:           $(docker inspect -f "{{.State.Status}}" itrc-cms-strapi)"
  echo "base de datos: $(docker inspect -f "{{.State.Status}}" itrc-cms-postgres)"
  echo "paginas:       $(find /var/www/portal_nuevo -name "*.html" | wc -l)"
'
```

Lo normal es `active`, `active`, `running`, `running` y **387 páginas**. Si el
número de páginas cayó mucho, vaya al caso 3.

Y desde fuera:

```bash
curl -I https://www.itrc.gov.co/
```

---

## Caso 1 — El portal no carga

**Compruebe primero si es el sitio o es la red.** Si `curl` desde el servidor
funciona pero desde fuera no, el problema está en el intermediario del
proveedor, no aquí:

```bash
ssh itrc-prod 'curl -sI http://127.0.0.1/ | head -1'
```

Si nginx está caído:

```bash
ssh itrc-prod 'nginx -t && systemctl restart nginx'
```

`nginx -t` valida la configuración antes. **Si `nginx -t` da error, no
reinicie**: arreglar el error primero, o nginx no volverá a levantar.

---

## Caso 2 — El portal carga pero se ve mal

Los controles no responden (pestañas, acordeones, buscador), o los estilos no
aparecen.

Casi siempre es la política de seguridad del proveedor, que **prohíbe todo
estilo y todo código escrito dentro de la página**. Compruébelo:

```bash
ssh itrc-prod '
  cd /var/www/portal_nuevo
  echo "estilos incrustados: $(grep -rl "<style\|style=\"" . --include="*.html" | wc -l)"
  echo "guiones incrustados: $(grep -rl "<script type=\"module\">" . --include="*.html" | wc -l)"
'
```

**Los dos deben dar cero.** Si no, el último cambio de código introdujo algo
incrustado. Ver [`despliegue.md`](despliegue.md#antes-de-publicar-un-cambio-visible).

---

## Caso 3 — Se publicó algo que no debía, o el portal se ve vacío

El servicio de publicación está para impedirlo: compara con lo publicado y se
niega a copiar si la compilación encogió. Pero si aun así pasó:

**Mire por qué:**

```bash
ssh itrc-prod 'tail -40 /var/log/strapi-deploy/webhook.log'
```

**Vuelva atrás.** Si hay una copia del directorio publicado, es cuestión de
segundos:

```bash
ssh itrc-prod '
  ls -d /var/www/portal_*respaldo* 2>/dev/null
  rsync -a --delete /var/www/<la-copia>/ /var/www/portal_nuevo/
  chown -R www-data:www-data /var/www/portal_nuevo
'
```

**Si no hay copia**, arregle la causa (normalmente el CMS caído o sin datos) y
vuelva a publicar: el sitio se regenera entero desde el contenido del CMS.

> **Antes de cualquier cambio arriesgado, deje la copia hecha.** Tarda una
> fracción de segundo y no gasta disco:
> ```bash
> ssh itrc-prod 'cp -al /var/www/portal_nuevo /var/www/portal_respaldo'
> ```

---

## Caso 4 — El panel de contenidos no abre

**Por la dirección pública nunca abre**: la política del proveedor lo impide.
Es lo esperado, no una avería. Se entra por la dirección interna con la VPN
conectada: `https://10.5.10.6/admin`.

Si tampoco abre así, mire el contenedor:

```bash
ssh itrc-prod '
  docker logs --tail 40 itrc-cms-strapi
  docker compose -f /home/admweb/itrc-cms/docker-compose.yml \
    --env-file /home/admweb/itrc-cms/.env.cms restart strapi
'
```

**Nunca use `docker compose down -v`.** La opción `-v` borra la base de datos
con todo el contenido del portal.

---

## Caso 5 — Se perdió contenido del CMS

Hay copia diaria a las 03:00, con cuatro puntos de restauración: `daily-1`
(anoche), `daily-2` (anteanoche), `weekly` y `monthly`.

```bash
ssh itrc-prod 'ls -la /root/backups/itrc/'
```

Restaurar la base entera desde el punto elegido:

```bash
ssh itrc-prod '
  docker exec -i itrc-cms-postgres pg_restore -U strapi -d strapi -c --if-exists \
    < /root/backups/itrc/daily-1/strapi.pgcustom
  docker compose -f /home/admweb/itrc-cms/docker-compose.yml \
    --env-file /home/admweb/itrc-cms/.env.cms restart strapi
'
```

Restaurar **sustituye todo**: se pierde lo publicado después de esa copia. Si
solo falta un elemento, suele salir más a cuenta volver a crearlo a mano.

Procedimiento completo en [`backup.md`](backup.md).

---

## Lo que no debe hacerse nunca

| | Por qué |
|---|---|
| `docker compose down -v` | Borra la base de datos entera |
| `rm -rf` sobre `/var/www/portal_nuevo` | Es el sitio en línea |
| Copiar un `dist/` local al directorio publicado | Se salta la comprobación que impide publicar en blanco |
| Reiniciar nginx sin `nginx -t` | Si la configuración tiene un error, no vuelve a levantar |
| Apagar `php8.2-fpm` | La aplicación de denuncias depende de él |

---

## Cuándo pedir ayuda

Si tras el diagnóstico no está claro qué falla, o si la solución implica
restaurar una copia, conviene parar y escalar. **Un portal caído unas horas se
arregla; una restauración mal hecha puede costar días de contenido.**

Al reportar, incluya siempre: la salida del diagnóstico de arriba, las últimas
40 líneas de `/var/log/strapi-deploy/webhook.log` y qué se hizo justo antes.
