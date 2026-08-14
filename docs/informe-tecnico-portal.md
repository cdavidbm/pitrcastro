# Informe técnico — Portal web de la Agencia ITRC

Documentación de infraestructura y configuración para la administración, el
soporte y los despliegues del portal `www.itrc.gov.co`.

> Este informe **no contiene contraseñas ni llaves**. Las credenciales se
> entregan por separado; el apartado [9](#9-credenciales) indica cuáles son y
> quién las custodia.

---

## 1. Infraestructura

| Concepto | Valor |
|---|---|
| Servidor | `santorini` |
| Dirección IP | `10.5.10.6` (red privada del proveedor) |
| Ubicación | Datacenter HostDime |
| Sistema operativo | Ubuntu 24.04.3 LTS (kernel 6.8) |
| Recursos | 2 núcleos · 7,8 GB de memoria · 192 GB de disco (53 % en uso) |
| Interfaz de red | `ens33` — 10.5.10.6/24 |

El servidor no es alcanzable directamente desde internet. El tráfico público
entra por el intermediario de seguridad de HostDime, que actúa como
intermediario inverso hacia este equipo. Para administrarlo hace falta la VPN
del proveedor.

### Puertos a la escucha

| Puerto | Servicio | Alcance |
|---|---|---|
| 22 | SSH | Todas las interfaces |
| 80 / 443 | nginx | Todas las interfaces |
| 9001 | Webhook de publicación | Todas las interfaces |
| 1337 | Strapi (CMS) | Solo local (`127.0.0.1`) |
| 5432 | PostgreSQL | Solo local (`127.0.0.1`) |
| 3306 | MariaDB | Todas las interfaces |

**Dos observaciones de seguridad** que conviene revisar con el área
correspondiente:

- El cortafuegos del sistema (`ufw`) está **inactivo**. La protección depende
  por completo del perímetro del proveedor.
- Los puertos **9001** y **3306** escuchan en todas las interfaces. El 9001
  exige una clave de autorización para responder, pero ambos podrían limitarse
  a la interfaz local o a direcciones concretas.

---

## 2. Plataforma

El portal es un **sitio estático**: las páginas se generan por adelantado y
nginx las sirve como archivos HTML. No hay código ejecutándose por cada visita,
lo que reduce la superficie de ataque y el consumo del servidor.

| Componente | Versión | Función |
|---|---|---|
| **nginx** | 1.24.0 | Servidor web; sirve el sitio y hace de intermediario hacia el CMS |
| **Astro** | 7.2.1 | Generador del sitio estático; compila el portal a HTML |
| **Strapi** | 5.52.0 (Community Edition) | Gestor de contenidos; panel de edición y API |
| **Node.js** | 22.23.2 | Entorno de ejecución de Astro y del CMS |
| **Docker** | 29.6.0 | Contenedores del CMS y de su base de datos |
| **PHP-FPM** | 8.2.29 | Solo para la aplicación de denuncias (ver [8](#8-dependencias)) |
| **fail2ban** | — | Bloqueo de direcciones con intentos de acceso fallidos |

### Cómo encajan

```
Visitante  →  Intermediario HostDime  →  nginx (10.5.10.6)
                                          ├── /            → HTML estático de /var/www/portal_nuevo
                                          ├── /admin, /api → Strapi, en el contenedor (127.0.0.1:1337)
                                          └── /denuncias/  → aplicación PHP
```

### Rutas en disco

| Ruta | Contenido | Tamaño |
|---|---|---|
| `/var/www/portal_nuevo` | El sitio publicado que sirve nginx | 7,0 GB |
| `/home/admweb/itrc-cms` | Código fuente y área de compilación | 11 GB |
| `/var/www/portal_principal` | Aplicación de denuncias y archivos heredados | — |
| `/root/backups/itrc` | Copias de seguridad | 25 GB |

---

## 3. Base de datos

| Concepto | Valor |
|---|---|
| Motor | PostgreSQL 16.14 |
| Alojamiento | Contenedor Docker `itrc-cms-postgres` |
| Base de datos | `strapi` |
| Usuario | `strapi` |
| Acceso | Solo desde el propio servidor (`127.0.0.1:5432`) |
| Persistencia | Volumen Docker `itrc-cms-postgres-data` |

Guarda **todo el contenido editable** del portal: páginas, noticias, banners,
notificaciones y traslados, configuración global y el registro de archivos
subidos.

Los archivos en sí (PDF, imágenes) **no están en la base de datos**: viven en
`/var/www/portal_nuevo/uploads` y nginx los sirve directamente.

Existe además un **MariaDB** en el servidor, ajeno al portal: pertenece a la
aplicación de denuncias.

---

## 4. Repositorio

| Concepto | Valor |
|---|---|
| Ubicación | GitHub — `github.com/comunicaciones-itrc/web` |
| Rama principal | `main` |
| Acceso | Por llave SSH; los permisos los concede el propietario del repositorio |

Contiene el código del sitio (plantillas, estilos), la definición de los tipos
de contenido del CMS y los guiones de operación. **No contiene** el contenido
editorial (que vive en la base de datos) ni los archivos subidos.

Un detalle importante para operar: **el repositorio no dispara despliegues**.
Publicar en el sitio es independiente de subir código a GitHub; el detalle está
en el apartado [6](#6-despliegue).

---

## 5. Accesos

### Al servidor

Acceso por **SSH con llave pública** al usuario `root` en `10.5.10.6`, previa
conexión a la **VPN del proveedor** (FortiClient / openfortivpn). No hay acceso
por contraseña.

Para incorporar a un administrador nuevo se añade su llave pública en el
servidor; no se comparte una llave existente.

### Al panel de contenidos

- **Dirección**: `https://10.5.10.6/admin`, con la VPN conectada. El navegador
  avisará del certificado porque se entra por dirección numérica; es esperado.
- **Cuentas**: personales, con correo y contraseña, administradas dentro del
  propio Strapi.

> La dirección pública `www.itrc.gov.co/admin` **no funciona actualmente**: la
> política de seguridad que aplica el proveedor sobre el dominio impide que el
> panel dibuje su interfaz. Hay una solicitud abierta para ajustarla. El sitio
> público no está afectado.

### Protecciones del acceso

- `fail2ban` bloquea direcciones tras varios intentos fallidos.
- nginx limita a 5 intentos de inicio de sesión por minuto y dirección.
- El CMS rechaza la subida de archivos ejecutables, guiones y SVG.

---

## 6. Despliegue

El portal se reconstruye **por completo** cada vez que se publica algo. No se
actualizan páginas sueltas.

### Publicación de contenido (lo habitual)

```
Editor pulsa "Publish" en el panel
        ↓
Strapi avisa al webhook (puerto 9001, con clave de autorización)
        ↓
Se compila el sitio entero con Astro leyendo el contenido del CMS   (~95 s)
        ↓
Se copian los archivos generados a /var/www/portal_nuevo            (~45 s)
        ↓
Publicado
```

Tiempo total: **dos a tres minutos**. Es automático: el editor no ejecuta nada
más. Si llegan varias publicaciones seguidas, se agrupan en una sola
compilación.

El servicio que lo gobierna es `strapi-deploy.service`, y deja registro en el
diario del sistema (`journalctl -u strapi-deploy`).

### Cambios de código

El código se sincroniza al área de trabajo del servidor
(`/home/admweb/itrc-cms`) y se dispara el mismo webhook. **La compilación toma
el código de esa carpeta, no de GitHub**: subir a GitHub respalda, pero no
publica.

Los cambios que afectan al CMS (nuevos tipos de contenido, ajustes del panel)
requieren además reconstruir su contenedor.

---

## 7. Configuración

| Archivo | Qué define |
|---|---|
| `/etc/nginx/conf.d/portal_nuevo.conf` | Sitio público, certificado, redirecciones y proxy al CMS |
| `/home/admweb/itrc-cms/docker-compose.yml` | Contenedores del CMS y su base de datos |
| `/home/admweb/itrc-cms/.env.cms` | Credenciales y secretos del CMS **(contiene claves)** |
| `/etc/default/strapi-deploy` | Clave de autorización del webhook **(contiene claves)** |
| `/etc/systemd/system/strapi-deploy.service` | Servicio de publicación |
| `/etc/cron.d/itrc-backup` | Programación de las copias de seguridad |
| `/home/admweb/itrc-cms/astro.config.mjs` | Configuración del generador del sitio |

### Certificado TLS

| Concepto | Valor |
|---|---|
| Tipo | Comodín `*.itrc.gov.co` |
| Titular | Agencia del Inspector General de Tributos, Rentas y Contribuciones Parafiscales |
| Ruta | `/etc/pki/tls/certs/STAR_itrc_gov_co2026.crt` |
| **Vence** | **14 de octubre de 2026** |

> Conviene agendar la renovación con antelación: al vencer, los navegadores
> bloquean el acceso al portal.

### Copias de seguridad

Tarea diaria a las **03:00** (`/usr/local/bin/backup-itrc-daily.sh`), con cuatro
niveles de retención: día actual, día anterior, semanal y mensual. Ocupan 25 GB
en `/root/backups/itrc`.

Cada copia incluye la base de datos completa, los archivos subidos, los
documentos y el área de trabajo del código.

**Las copias residen en el mismo servidor.** No hay un destino externo, de modo
que no protegen frente a la pérdida del equipo. Conviene definir con el
proveedor y con el área de infraestructura una copia fuera de sitio.

---

## 8. Dependencias

### Del proveedor de hospedaje

| Servicio | Qué aporta | Efecto si falla |
|---|---|---|
| Intermediario de seguridad HostDime | Único camino entre internet y el servidor | El portal deja de ser accesible |
| VPN del proveedor | Única vía de administración | No se puede administrar |

El intermediario **reemplaza las cabeceras de seguridad** que envía el servidor
por las suyas. Es la causa de que el panel no abra por la dirección pública, y
la razón por la que el portal no puede usar recursos alojados en terceros.

### Aplicaciones alojadas en el mismo servidor

| Aplicación | Ruta pública | Tecnología | Responsable |
|---|---|---|---|
| Denuncias | `/denuncias/` | PHP 8.2 + MariaDB | Equipo distinto al del portal |

Es una aplicación independiente que comparte servidor con el portal. **Detener
PHP-FPM o MariaDB la deja fuera de servicio.**

También se conservan archivos del portal anterior bajo `/Itrc/` y
`/version-anterior/`, servidos como archivos estáticos.

### Externas al servidor

| Servicio | Uso |
|---|---|
| GitHub | Alojamiento del código |
| YouTube | Vídeos institucionales incrustados (actualmente bloqueados por la política del proveedor) |

El portal **no depende de redes de distribución de contenido externas**: tipos
de letra, iconos y hojas de estilo se sirven desde el propio dominio.

---

## 9. Credenciales

Por seguridad no se incluyen en este documento. Se entregan por canal separado
y quedan registradas en el gestor de claves institucional.

| Credencial | Para qué | Dónde está hoy |
|---|---|---|
| Usuario y clave de la VPN | Alcanzar el servidor | Proveedor HostDime |
| Llave SSH privada | Administrar el servidor | Equipo de quien administra |
| Cuenta del panel de contenidos | Publicar y editar | Gestionada dentro de Strapi |
| Credenciales de PostgreSQL | Acceso directo a los datos | `/home/admweb/itrc-cms/.env.cms` |
| Secretos del CMS | Firma de sesiones y tokens | `/home/admweb/itrc-cms/.env.cms` |
| Clave del webhook | Autorizar publicaciones | `/etc/default/strapi-deploy` |
| Acceso al repositorio | Código fuente | GitHub, por llave SSH |

### Recomendaciones para la entrega

1. **Enviar las credenciales por un canal distinto a este informe**, y a
   destinatarios nominados.
2. **Crear cuentas nominales** en el panel para cada persona, en lugar de
   compartir una cuenta común: así queda registro de quién publicó qué.
3. **Añadir llaves SSH nuevas** por cada administrador, en lugar de compartir
   una existente.
4. **Rotar las claves compartidas** cuando alguien deje de necesitar el acceso.

---

## Resumen de puntos que requieren atención

| Asunto | Detalle |
|---|---|
| Certificado TLS | Vence el 14 de octubre de 2026 |
| Copias de seguridad | Solo en el mismo servidor; sin destino externo |
| Cortafuegos | `ufw` inactivo |
| Puertos expuestos | 9001 y 3306 escuchan en todas las interfaces |
| Panel de contenidos | Inaccesible por la dirección pública; solicitud abierta con el proveedor |
| Dependencia compartida | La aplicación de denuncias comparte servidor y responsable distinto |
