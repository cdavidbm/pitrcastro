# Backup

Política y procedimiento de backup del servidor ITRC. Para detalles del servidor (nginx, runner, systemd, ufw), ver [`manual-operador/09-despliegue-datacenter.md`](manual-operador/09-despliegue-datacenter.md).

## Qué se backupea

| Categoría | Path en el servidor | Tamaño aprox |
|---|---|---|
| Webroot completo (sitio Astro + binarios institucionales) | `/var/www/itrc-web/` | ~3.7 GB |
| Configs nginx | `/etc/nginx/sites-{available,enabled}/` | <1 MB |
| Sudoers de runner | `/etc/sudoers.d/` | <1 KB |
| Servicio systemd del runner | `/etc/systemd/system/actions.runner.*.service` | <1 KB |
| Reglas ufw | `/etc/ufw/user{,6}.rules` | <10 KB |
| Certbot (cuando exista TLS) | `/etc/letsencrypt/` | varía |
| Lista de paquetes instalados | snapshot diario via `dpkg --get-selections` | ~20 KB |
| Versión OS + kernel + uptime | snapshot diario | <1 KB |

## Política de retención

Snapshots con estrategia "Time Machine" usando `rsync --link-dest` (hardlinks): cada snapshot se ve como copia completa pero solo gasta espacio por archivos nuevos/modificados respecto al snapshot anterior.

| Tipo | Cuántos | Frecuencia |
|---|---|---|
| Daily | 7 | Cada noche a las 2:00 UTC (rotación FIFO) |
| Weekly | 4 | Cada domingo (clonado de daily.0 con hardlinks) |
| Monthly | 6 | Día 1 de cada mes (clonado de daily.0 con hardlinks) |
| Configs tarball + packages + system metadata | 30 | Uno por día, rotación FIFO |

Espacio físico estimado para volumen actual: ~6-8 GB para todos los snapshots combinados.

## Estructura en disco

```
/var/backups/itrc-web/
├── daily/
│   ├── daily.0/      ← snapshot de hoy
│   ├── daily.1/      ← snapshot de ayer (hardlinks contra daily.0)
│   └── ... daily.6
├── weekly/
│   ├── weekly.0/     ← último domingo
│   └── ... weekly.3
├── monthly/
│   ├── monthly.0/    ← último día 1
│   └── ... monthly.5
└── configs/
    ├── configs-2026-05-08.tar.gz       (nginx, sudoers, systemd, ufw)
    ├── packages-2026-05-08.txt         (dpkg --get-selections)
    ├── system-2026-05-08.txt           (kernel, OS, uptime)
    └── ... (hasta 30 archivos por prefijo)
```

## Cómo restaurar

### Restaurar el webroot completo desde un snapshot

```bash
# Ver snapshots disponibles
sudo ls -la /var/backups/itrc-web/daily/
sudo ls -la /var/backups/itrc-web/weekly/
sudo ls -la /var/backups/itrc-web/monthly/

# Restaurar (ejemplo: snapshot de hace 3 días)
sudo rsync -a --delete /var/backups/itrc-web/daily/daily.3/ /var/www/itrc-web/

# Reload nginx (opcional, no imprescindible si solo se restauraron archivos)
sudo systemctl reload nginx
```

### Restaurar configs del servidor

```bash
# Listar tarballs disponibles
sudo ls /var/backups/itrc-web/configs/

# Inspeccionar contenido (sin extraer)
sudo tar tzf /var/backups/itrc-web/configs/configs-2026-05-08.tar.gz | head

# Extraer un archivo específico (e.g., el server block de nginx)
sudo tar xzf /var/backups/itrc-web/configs/configs-2026-05-08.tar.gz \
  etc/nginx/sites-available/itrc-web -C /tmp/

# Comparar con el actual
sudo diff /tmp/etc/nginx/sites-available/itrc-web /etc/nginx/sites-available/itrc-web

# Restaurar si conviene
sudo cp /tmp/etc/nginx/sites-available/itrc-web /etc/nginx/sites-available/itrc-web
sudo nginx -t && sudo systemctl reload nginx
```

### Restaurar lista de paquetes (re-instalar todo desde cero)

Útil si hay que reprovisionar un servidor nuevo:

```bash
# En el servidor nuevo, después de Ubuntu base
sudo cp /var/backups/itrc-web/configs/packages-2026-05-08.txt /tmp/

# Reinstalar todo lo que estaba antes
sudo apt update
sudo dpkg --set-selections < /tmp/packages-2026-05-08.txt
sudo apt-get -y dselect-upgrade
```

## Verificación periódica

### Comprobar que el cron disparó el backup

```bash
# Ver últimas líneas del log
sudo tail -20 /var/log/itrc-backup.log

# Buscar la última ejecución exitosa
sudo grep "FIN BACKUP" /var/log/itrc-backup.log | tail -3

# Ver tamaño actual de los backups
sudo du -sh /var/backups/itrc-web/{daily,weekly,monthly,configs}
```

### Test mensual recomendado: restaurar a directorio temporal

```bash
# Crear dir temporal para validación
sudo mkdir /tmp/restore-test
sudo rsync -a /var/backups/itrc-web/daily/daily.0/ /tmp/restore-test/
sudo curl -I http://localhost/  # validar que la versión actual sigue
sudo diff -q /var/www/itrc-web/index.html /tmp/restore-test/index.html  # debería ser igual
sudo rm -rf /tmp/restore-test
```

### Alertas de disco lleno

El script imprime `WARN: disco al X% — considerar reducir retención o expandir LVM` cuando supera el 85%. Estos warnings van al `/var/log/itrc-backup.log` y, cuando esté configurado postfix, también por email.

## Limitaciones conocidas

1. **Single-host**: el backup vive en el mismo servidor. Si el servidor entero falla, los backups locales se pierden con él. Para mitigar conviene configurar push periódico a otra máquina institucional o a un repo privado para los configs.

2. **No protege contra ataque al cron**: si un atacante con root corrompe el cron, los backups dejan de generarse silenciosamente. Mitigación: monitorear `/var/log/itrc-backup.log`.

3. **Email de fallo requiere `postfix`**: el cron tiene `MAILTO=daniel@digitalia.gov.co` pero necesita un MTA configurado en el servidor. Sin él, revisar manualmente el log.

4. **No incluye la base de datos de Strapi**: el script backupea webroot y configs. El Postgres del contenedor `itrc-cms-postgres` (donde vive todo el contenido editable) no se respalda con este script. Para incluirlo hay que extender el cron con `pg_dump` contra el contenedor.

5. **El cron file no se backupea**: el script `/usr/local/bin/itrc-backup.sh` vive en `ops/server-backup.sh` del repo. El cron file `/etc/cron.d/itrc-backup` se re-crea manualmente si se reprovisiona el servidor.

## Modificar la política

Si necesitas cambiar la retención (e.g., guardar 14 días en vez de 7), edita en `/usr/local/bin/itrc-backup.sh`:

```bash
DAILY_KEEP=14    # antes 7
WEEKLY_KEEP=8    # antes 4
MONTHLY_KEEP=12  # antes 6
```

Después: `sudo cp ops/server-backup.sh /usr/local/bin/itrc-backup.sh` (asumiendo que actualizaste el archivo en el repo).

Si necesitas cambiar la frecuencia, edita `/etc/cron.d/itrc-backup`:

```
0 2 * * * root /usr/local/bin/itrc-backup.sh ...   # actual: diario 2 AM UTC
0 */6 * * * root ...                                # cada 6 horas
0 1 * * 0 root ...                                  # solo domingos 1 AM
```
