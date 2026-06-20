# server/ — configuraciones para el servidor de producción

Configs que viven en `/etc/nginx/...` del server `ubu24bolivia` (192.168.82.13),
pero versionadas aquí para que el equipo de DNS / infra las aplique antes o
durante el cutover del dominio `www.itrc.gov.co`.

## `nginx-redirects-wp-legacy.conf`

Redirects 301 desde URLs de WordPress legado hacia las rutas del portal Astro.
Generado por la auditoría pre-cutover del 2026-06-17. Cubre 16 URLs WP cuyo
contenido vive bajo otro slug en el portal nuevo + 5 fallbacks para vigencias
históricas aún no migradas (mejor catálogo padre que 404 ciego).

### Cómo aplicarlo (3 pasos, ~2 min)

1. Copiar el snippet al server:
   ```bash
   scp server/nginx-redirects-wp-legacy.conf \
     admweb@192.168.82.13:/tmp/itrc-wp-legacy-redirects.conf
   ssh admweb@192.168.82.13 \
     "sudo mv /tmp/itrc-wp-legacy-redirects.conf /etc/nginx/snippets/itrc-wp-legacy-redirects.conf"
   ```

2. Editar `/etc/nginx/sites-enabled/itrc-web` y agregar dentro del bloque
   `server { ... }`, justo después de la línea `root /var/www/itrc-web;`:
   ```nginx
   include /etc/nginx/snippets/itrc-wp-legacy-redirects.conf;
   ```

3. Validar y recargar:
   ```bash
   ssh admweb@192.168.82.13 "sudo nginx -t && sudo systemctl reload nginx"
   ```

### Smoke test post-aplicación

```bash
for url in \
  /mision-vision-y-proposito-estrategico/ \
  /sistema-de-control-interno/ \
  /noticias/ \
  /rendicion-de-cuentas/ \
  /vigencia-2022/ \
  /documentos-de-interes/; do
  echo -n "$url → "
  curl -sS -o /dev/null -w "%{http_code} → %{redirect_url}\n" \
    "http://192.168.82.13$url"
done
```

Esperado: HTTP 301 con `Location` apuntando a la ruta nueva en cada caso.

## `nginx-itrc-web.conf` — site config para cutover detrás de WAF

Reemplazo completo del archivo `/etc/nginx/sites-available/itrc-web` para el
día del cutover. Cambios vs el actual:

- **Acepta el dominio público** en `server_name` (`www.itrc.gov.co`).
- **Confía en `X-Forwarded-Proto`** del WAF mediante el map `$forwarded_proto`,
  para que las URLs generadas por Strapi salgan como `https://...`.
- **Hueco listo para `set_real_ip_from`**: descomentar e introducir la IP/rango
  de salida del WAF cuando el equipo de DNS la entregue (sin eso, los logs y
  controles de IP del back-end ven la IP del WAF en vez del usuario real).
- **Endpoint `/healthz`** que devuelve `200 ok` para que el WAF monitorice el
  origen sin tocar Strapi.
- **Anti H2C smuggling** (CWE-444): se omite intencionalmente cualquier
  `proxy_set_header Upgrade` — Strapi v5 en modo producción no necesita
  WebSocket y nginx por defecto no propaga ese header.

### Aplicar (3 pasos)

1. Copiar y validar:
   ```bash
   scp server/nginx-itrc-web.conf admweb@192.168.82.13:/tmp/itrc-web
   ssh admweb@192.168.82.13 \
     "sudo cp /etc/nginx/sites-available/itrc-web /etc/nginx/sites-available/itrc-web.bak.$(date +%F) && \
      sudo mv /tmp/itrc-web /etc/nginx/sites-available/itrc-web && \
      sudo nginx -t"
   ```

2. Si el test pasa, recargar:
   ```bash
   ssh admweb@192.168.82.13 "sudo systemctl reload nginx"
   ```

3. (Cuando el equipo de WAF entregue la IP) editar el archivo en el server y
   descomentar el bloque `set_real_ip_from` con la IP recibida; volver a
   `nginx -t && systemctl reload nginx`.

### Ajuste en Strapi (commit aparte)

`cms-strapi/config/server.ts` ahora lee `IS_PROXIED` para activar
`proxy: true` en Koa. Añadir al `.env.cms` del server:

```
IS_PROXIED=true
```

Y rebuild del contenedor (el cambio toca `config/`, se aplica con un restart):

```bash
ssh admweb@192.168.82.13 "cd ~/itrc-cms && docker compose --profile server up -d --build strapi"
```

### Variables de build de Astro (GitHub Actions)

En la UI de GitHub → Settings → Variables → Actions, fijar:

- `SITE_URL = https://www.itrc.gov.co`
- `BASE_PATH = /`
- `STRAPI_URL = http://127.0.0.1:1337` (sin cambio)

El próximo build/dispatch las usa automáticamente. Sitemap y URLs absolutas
quedan con el dominio público.

### Smoke test post-cutover

```bash
# Desde dentro de la red (acceso directo a la IP, debe seguir funcionando)
curl -sI http://192.168.82.13/healthz
curl -sI http://192.168.82.13/

# Desde fuera (via WAF, una vez DNS apunte)
curl -sI https://www.itrc.gov.co/healthz
curl -sI https://www.itrc.gov.co/admin/  # 200 + login page
```
