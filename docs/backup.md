# Backup

Política de backup del servidor productivo `santorini` (`10.5.10.6`, HostDime) que sirve `www.itrc.gov.co`. Cubre todo el trabajo del equipo web: base de datos del CMS, media library, binarios históricos, working tree del build y configuraciones de servidor.

## Alcance

El backup del equipo web protege lo que el equipo web administra. Los siguientes puntos quedan por fuera y son responsabilidad de otros:

- **Snapshots de VM y replicación off-site** — los cubre HostDime.
- **DR de infraestructura y networking** — los cubre el equipo de Infra de ITRC.
- **Cuentas del sistema, VPN y firmas TLS globales** — los cubren HostDime + Infra.

El sandbox `192.168.82.13` no se respalda: es un entorno de pruebas del equipo, no destino institucional.

## Qué se backupea

Cada corrida diaria genera un directorio con estos artefactos:

| Artefacto | Origen | Cómo se genera |
|---|---|---|
| `strapi.pgcustom` | Postgres del contenedor `itrc-cms-postgres` | `pg_dump` formato custom (comprimido, restaurable con `pg_restore`) |
| `uploads.tgz` | Media library de Strapi (`/var/www/portal_nuevo/uploads/`) | tarball comprimido |
| `documentos.tgz` | Binarios históricos por área (`/home/admweb/itrc-cms/public/documentos/`) | tarball comprimido |
| `working-tree.tgz` | Working tree del build (`src/`, `cms-strapi/`, `public/images/`) | tarball comprimido; incluye los nueve parches `as any` que producción necesita |
| `etc/` | Configuración de servidor | `nginx/`, `default/strapi-deploy`, unit files (`strapi-deploy.service`), copia del script de backup |
| `METADATA` | Estado del working tree en el momento del backup | `git HEAD`, rama, listado de archivos con cambios locales |
| `SHA256SUMS` | Checksums de todos los artefactos | verificación de integridad |

## Política de retención

Rotación grandfather-father-son con cuatro slots. La corrida diaria escribe el snapshot fresco y hace rotación de los slots antiguos:

| Slot | Antigüedad garantizada | Cuándo rota |
|---|---|---|
| `daily-1/` | Backup más reciente (hoy) | En cada corrida |
| `daily-2/` | Backup del día anterior | En cada corrida |
| `weekly/` | Domingo más reciente | Los domingos |
| `monthly/` | Día 1 del mes más reciente | El día 1 |

Cada slot es un snapshot completo pero comparte inodos con el anterior vía hardlinks. Tamaño físico en régimen: unos 20 GB para los cuatro slots juntos (cada snapshot lógico ronda los 5 GB entre DB, media y binarios).

## Estructura en disco

```
/root/backups/itrc/
├── daily-1/
│   ├── strapi.pgcustom
│   ├── uploads.tgz
│   ├── documentos.tgz
│   ├── working-tree.tgz
│   ├── etc/
│   ├── METADATA
│   └── SHA256SUMS
├── daily-2/
├── weekly/
└── monthly/
```

## Cómo se dispara

- Script: `/usr/local/bin/backup-itrc-daily.sh`
- Cron: `/etc/cron.d/itrc-backup` con la línea `0 3 * * * root /usr/local/bin/backup-itrc-daily.sh`
- Log: `/var/log/itrc-backup.log`

El script se ejecuta como root, corre `pg_dump` contra el contenedor Postgres, arma los tarballs, escribe `METADATA` con el estado del working tree, calcula `SHA256SUMS` y rota los slots. Si el disco pasa el 85% de uso, deja un `WARN` en el log.

## Restauración

Todos los ejemplos asumen sesión root en santorini.

### Restaurar solo la base de datos de Strapi

```bash
# Localizar el slot deseado (por ejemplo daily-2)
ls /root/backups/itrc/daily-2/

# Restaurar sobre la DB corriente
docker exec -i itrc-cms-postgres pg_restore \
  -U strapi -d strapi -c --if-exists \
  < /root/backups/itrc/daily-2/strapi.pgcustom
```

`-c --if-exists` limpia las tablas antes de repoblar. Después de restaurar suele convenir reiniciar Strapi (`docker compose --env-file /home/admweb/itrc-cms/.env.cms restart strapi`).

### Restaurar la media library de Strapi

```bash
tar xzf /root/backups/itrc/daily-1/uploads.tgz \
  -C /var/www/portal_nuevo/
chown -R www-data:www-data /var/www/portal_nuevo/uploads
```

### Restaurar los binarios históricos

```bash
tar xzf /root/backups/itrc/daily-1/documentos.tgz \
  -C /home/admweb/itrc-cms/public/
chown -R admweb:admweb /home/admweb/itrc-cms/public/documentos
```

### Restaurar el working tree completo

Útil si alguien corrompió los archivos parcheados o si hay que reproducir un build antiguo:

```bash
tar xzf /root/backups/itrc/monthly/working-tree.tgz \
  -C /home/admweb/itrc-cms/
chown -R admweb:admweb /home/admweb/itrc-cms
```

Después revisar `METADATA` del mismo slot para saber exactamente qué commit y qué archivos con cambios locales quedaron restaurados.

### Restaurar configuración de servidor

```bash
# Ver qué hay en el snapshot
ls /root/backups/itrc/daily-1/etc/

# Restaurar un vhost puntual
cp /root/backups/itrc/daily-1/etc/nginx/conf.d/portal_nuevo.conf \
   /etc/nginx/conf.d/portal_nuevo.conf
nginx -t && systemctl reload nginx

# Restaurar la unit del servicio de deploy
cp /root/backups/itrc/daily-1/etc/systemd/system/strapi-deploy.service \
   /etc/systemd/system/
systemctl daemon-reload && systemctl restart strapi-deploy
```

## Verificación

### Confirmar la última corrida

```bash
tail -40 /var/log/itrc-backup.log
grep 'FIN BACKUP' /var/log/itrc-backup.log | tail -3
du -sh /root/backups/itrc/{daily-1,daily-2,weekly,monthly}
```

### Verificar integridad de un slot

```bash
cd /root/backups/itrc/daily-1
sha256sum -c SHA256SUMS
```

Cualquier `FAILED` en la salida indica que un artefacto se corrompió.

### Test recomendado de restauración parcial

Una vez por mes conviene restaurar la DB en un contenedor Postgres desechable para confirmar que el dump es utilizable:

```bash
docker run --rm -d --name pg-restore-test \
  -e POSTGRES_PASSWORD=test postgres:16-alpine
docker exec -i pg-restore-test createdb -U postgres strapi
docker exec -i pg-restore-test pg_restore -U postgres -d strapi \
  < /root/backups/itrc/daily-1/strapi.pgcustom
docker stop pg-restore-test
```

Si `pg_restore` termina en 0, el dump es restaurable.

## Modificar la política

Los parámetros de retención y los paths están definidos en `/usr/local/bin/backup-itrc-daily.sh`. Editar allí y luego:

```bash
systemctl restart cron   # innecesario si solo se cambian variables
grep -A2 backup-itrc-daily /etc/cron.d/itrc-backup
```

Para cambiar la frecuencia editar `/etc/cron.d/itrc-backup`. Por ejemplo, ejecutar cada seis horas:

```
0 */6 * * * root /usr/local/bin/backup-itrc-daily.sh
```

## Limitaciones conocidas

1. **Copia local únicamente**. Los cuatro slots viven en `/root/backups/itrc/` dentro de santorini. Una falla de disco de la VM se lleva los backups con ella. El off-site lo cubren HostDime + Infra; el equipo web no lo administra.
2. **Ventana de restauración limitada**. Solo hay cuatro snapshots (dos diarios, un semanal, un mensual). Problemas detectados con más de 30 días de retraso ya no son recuperables desde este backup.
3. **El script y la unidad de cron no se auto-restauran**. Si se reprovisiona la VM hay que copiar de nuevo `backup-itrc-daily.sh` y `/etc/cron.d/itrc-backup` desde el repo (`server/backup-prod-itrc.sh` y el snippet cron documentado aquí) antes de que corra la primera corrida.
4. **No incluye sub-sitios legacy remanentes**. `denuncias/` (PHP custom + `denuncias_db`) queda por fuera de este backup diario. Si sigue vivo cuando se actualice esta política, hay que sumarlo o migrarlo al patrón estándar.
