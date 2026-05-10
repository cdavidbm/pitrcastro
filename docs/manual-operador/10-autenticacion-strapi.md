# Capítulo 10 — Autenticación y gestión de usuarios en Strapi

Este capítulo describe cómo se gestionan las cuentas de los editores del CMS: alta, baja, roles y recuperación de contraseña. Está dirigido al administrador del CMS y a quien capacite a nuevos editores.

---

## A. Modelo de autenticación

Strapi mantiene su propio padrón de usuarios. Cada editor tiene una cuenta personal con:

- **Correo electrónico** (idealmente institucional `@itrc.gov.co`).
- **Contraseña** (gestionada y validada por Strapi, hash bcrypt en Postgres).
- **Rol** asignado por el administrador.

No hay integración con GitHub OAuth, LDAP ni Active Directory. La autenticación es local al CMS.

> **Nota:** las cuentas de Strapi son distintas de las cuentas de GitHub que usa el equipo de desarrollo para hacer push al repositorio. Un editor que solo publica contenido no necesita cuenta de GitHub; un desarrollador que toca código necesita cuenta de GitHub pero no necesariamente de Strapi.

---

## B. Roles disponibles

Strapi v5 trae tres roles de administración predefinidos. Cada uno define qué puede hacer su titular dentro del Content Manager.

| Rol | Permisos | Para quién |
|-----|----------|-----------|
| **Super Admin** | Acceso total: gestionar usuarios, roles, permisos, todos los content types. | 1-2 administradores del CMS (coordinador técnico). |
| **Editor** | Crear, editar, publicar y borrar contenido en todos los content types. No gestiona usuarios. | Webmasters / editores regulares del portal. |
| **Author** | Crear y editar SOLO sus propias entradas. No puede tocar las entradas creadas por otros. | Útil si se quiere que cada autor responda solo de sus contenidos (ej. periodistas con su propia área). |

Para casos especiales se puede crear un **rol custom** desde Settings → Roles → Create new role, ajustando permiso por permiso. En la práctica del portal ITRC los tres roles built-in cubren todo el flujo.

> **Rol "Public" ≠ rol de admin.** Strapi tiene además un rol llamado *Public* que controla qué endpoints de la API son accesibles sin autenticación (lo usa Astro al compilar). Ese rol se gestiona en Settings → Users & Permissions Plugin → Roles → Public, NO en Settings → Administration Panel → Roles. Está configurado automáticamente por el bootstrap del CMS (`cms-strapi/src/index.ts`); el editor no debe modificarlo.

---

## C. Crear un usuario nuevo

El administrador realiza este procedimiento cada vez que se incorpora un editor.

1. Ingrese a `/admin/` con su cuenta de **Super Admin**.
2. En el sidebar: **Settings** (engranaje, abajo a la izquierda).
3. **Administration Panel** → **Users** → **Invite new user**.
4. Complete el formulario:

   | Campo | Valor |
   |-------|-------|
   | First name | Nombre del editor |
   | Last name | Apellido del editor |
   | Email | Correo institucional `@itrc.gov.co` |
   | Roles | Marque **Editor** (o el que corresponda) |

5. Pulse **Invite user**. Strapi genera un enlace de registro de un solo uso.
6. Copie el enlace que muestra Strapi y envíeselo al editor por un canal seguro (correo institucional). El enlace expira en 30 días.

El editor abre el enlace, define su contraseña inicial y entra al panel.

> **Importante:** si el servidor de correo SMTP no está configurado, Strapi NO envía el enlace por correo automáticamente. Hay que copiarlo manualmente desde la pantalla de "Invite". Configurar SMTP es opcional pero recomendado para flujos de producción.

---

## D. Cambiar el rol de un usuario

1. Settings → Administration Panel → Users.
2. Haga clic sobre el usuario.
3. Marque o desmarque los roles en la lista **Roles**.
4. **Save**.

El cambio aplica inmediatamente. Si el usuario tiene una sesión abierta, los nuevos permisos se reflejan en el siguiente refresco.

---

## E. Dar de baja a un usuario

Cuando un editor deja de operar el portal:

1. Settings → Administration Panel → Users.
2. Haga clic sobre el usuario.
3. Desmarque la casilla **Active** y pulse **Save** — el usuario queda desactivado y no puede iniciar sesión, pero su historial de cambios queda intacto.

   *o, si se prefiere borrado completo:*

4. En la lista de Users, marque el checkbox del usuario y pulse **Delete**.

> **Nota:** desactivar es preferible a borrar porque preserva la trazabilidad ("entrada modificada por X el día Y") en el historial de cada entrada. Solo borre cuentas si la política institucional lo exige.

---

## F. Recuperar contraseña

### El editor olvidó su contraseña

En la pantalla de login del CMS (`/admin/`):

1. Hacer clic en **"Forgot your password?"**.
2. Introducir el correo institucional asociado a la cuenta.
3. Strapi envía un correo con un enlace de reset (si SMTP está configurado).

Si SMTP no está configurado, el editor debe contactar al administrador, que puede:

- Generar un nuevo enlace desde Settings → Administration Panel → Users → seleccionar usuario → **Reset password**, copiar el enlace y enviarlo al editor manualmente.

### Reset desde la consola del servidor (caso extremo)

Si el administrador perdió acceso completo al panel, hay un script de Strapi:

```bash
# En el servidor
cd /home/admweb/itrc-cms
docker compose --env-file .env.cms --profile server exec strapi \
  npx strapi admin:reset-user-password \
  --email admin@itrc.local --password 'NuevaPasswordSegura123!'
```

Use este comando solo en emergencia. Documente el cambio y rote la contraseña al recuperar acceso.

---

## G. Buenas prácticas

### Cuentas individuales

Cada editor debe usar **su propia cuenta**. No comparta credenciales ni use cuentas genéricas tipo `webmaster@itrc.gov.co`. La trazabilidad de las entradas (quién publicó, cuándo) depende de identidades individuales.

### Contraseñas

- Mínimo 12 caracteres.
- Combinación de mayúsculas, minúsculas, números y símbolos.
- Distinta de cualquier otra contraseña que el editor use en otro sistema.
- No la comparta por chat ni correo.

Strapi guarda la contraseña como hash bcrypt en Postgres; ni el administrador puede verla en texto plano.

### Revisión periódica

Cada trimestre, revise Settings → Administration Panel → Users y desactive/elimine cuentas de personas que ya no operan el portal.

### Rol Super Admin

Limite el rol Super Admin a 1-2 personas. El resto de los editores deben tener rol Editor o Author. Esto reduce el riesgo de cambios accidentales en la configuración del CMS.

### Respuesta ante una cuenta comprometida

Si se sospecha que la cuenta de un editor fue comprometida:

1. Settings → Administration Panel → Users → seleccionar usuario → desmarcar **Active** → Save (bloquea el acceso inmediato).
2. Resetear la contraseña con el flujo de la sección F.
3. Reactivar la cuenta y entregar la nueva contraseña al editor por canal seguro.
4. Revisar el historial de entradas tocadas por la cuenta en el periodo sospechoso (campo "Updated by" en cada content type).

---

## H. Solución de problemas

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| "No puedo iniciar sesión" — credenciales correctas | La cuenta está desactivada | Administrador: Settings → Users → marcar **Active** |
| El enlace de invitación no llega por correo | SMTP no configurado en el CMS | Administrador copia manualmente el enlace desde la pantalla "Invite" |
| "No tengo permiso para publicar" | El rol asignado no incluye permiso de publicar en ese content type | Administrador: revisar rol en Settings → Administration Panel → Roles |
| El enlace de invitación expiró | Pasaron más de 30 días | Administrador: re-invitar al usuario; el sistema genera un enlace nuevo |
| Sesión expira muy rápido | Configuración por defecto del JWT (8 h) | Aceptable para uso normal; si se requiere extender, ajustar `admin.auth.options.expiresIn` en `cms-strapi/config/admin.ts` |
