# Seguridad del CMS

## Verificación en dos pasos

**Strapi Community Edition no incluye verificación en dos pasos para el panel
de administración.** Es una función de la edición Enterprise, que es de pago.

Comprobado en el código del panel distribuido y en el endpoint
`/admin/users/me`: no existen los campos ni las rutas correspondientes.

## Qué protege el panel en su lugar

| Medida | Estado | Dónde |
|---|---|---|
| Solo accesible por VPN | **Activa** | El servidor no es alcanzable desde internet |
| Lista blanca de direcciones sobre `/admin` | **Activa** | `location /admin` del vhost: `allow` a la red interna, `deny all` al resto |
| Límite de intentos de inicio de sesión | **Activa** | 5 por minuto y dirección, con ráfaga de 3 (`limit_req zone=admin_login`) |
| Bloqueo por intentos fallidos | **Activa** | `fail2ban` |
| Rechazo de subidas ejecutables | **Activa** | Middleware propio del CMS |
| Contraseña mínima de 8 caracteres con mayúsculas, minúsculas y números | **Activa** | Impuesta por Strapi |
| Caducidad de sesión corta | **No aplicada** | Ver abajo |

Las cuatro primeras equivalen, en conjunto, a un factor de red: sin estar dentro
de la red del proveedor no se llega siquiera a la pantalla de inicio de sesión.

## Lo que falta

**La sesión del panel dura 30 días**, que es el valor por defecto de Strapi.
`cms-strapi/config/admin.ts` no define `auth.sessions`, así que no se ha
acortado. Para uso institucional, ocho horas es más razonable:

```ts
auth: {
  secret: env('ADMIN_JWT_SECRET'),
  sessions: {
    maxRefreshTokenLifespan: 60 * 60 * 8,
    maxSessionLifespan: 60 * 60 * 8,
  },
},
```

Requiere reconstruir el contenedor del CMS y obliga a los editores a volver a
entrar cada jornada.

## Si se exigiera verificación en dos pasos

Dos caminos, ninguno gratuito:

- Evaluar un complemento de la comunidad, con la revisión de seguridad que eso
  exige.
- Pasar a la edición Enterprise, que es de pago.

Mientras tanto, las medidas activas de arriba son proporcionadas para un panel
interno con un puñado de personas identificables.

## Recomendaciones de gestión

- Guardar las contraseñas en un gestor institucional, no en archivos ni correos.
- Una cuenta por persona. Nunca compartir una cuenta entre varias.
- Dar de baja la cuenta el mismo día en que alguien deja de necesitarla.
