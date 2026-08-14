# Configuración del servidor

Copia de referencia de los archivos que viven fuera del repositorio, en el
servidor de producción `santorini` (`10.5.10.6`). Están aquí para poder
consultarlos y reconstruirlos; **el original es el del servidor**.

| Archivo | Dónde vive | Qué hace |
|---|---|---|
| `nginx-portal.conf` | `/etc/nginx/conf.d/portal_nuevo.conf` | Sitio público: TLS, el portal estático, el intermediario hacia el panel y la aplicación de denuncias |
| `deploy-webhook.mjs` | `/home/admweb/itrc-cms/server/` | Servicio `strapi-deploy`: compila el sitio y lo copia al directorio publicado |
| `backup-prod-itrc.sh` | `/root/` | Copia de seguridad diaria |
| `nginx-redirects-wp-legacy.conf` | integrado en el vhost | Redirecciones de las direcciones del portal anterior |
| `nginx-snippet-upload.conf` | — | Límites de subida para el panel |
| `backup-wp-legacy.sh` | `/root/` | Copia de seguridad del portal anterior |

## Aplicar un cambio de nginx

```bash
scp server/nginx-portal.conf itrc-prod:/tmp/portal.conf
ssh itrc-prod 'cp /tmp/portal.conf /etc/nginx/conf.d/portal_nuevo.conf
  nginx -t && systemctl reload nginx'
```

`nginx -t` valida antes de recargar. Si falla, no recargar.

## El servicio de publicación

```bash
ssh itrc-prod 'systemctl status strapi-deploy'
ssh itrc-prod 'tail -f /var/log/strapi-deploy/webhook.log'
```

Escucha en `127.0.0.1:9001`, solo desde el propio servidor. La clave está en
`/etc/default/strapi-deploy`.

El procedimiento completo de publicación está en
[`../docs/despliegue.md`](../docs/despliegue.md).
