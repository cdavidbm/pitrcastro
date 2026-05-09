# Seguridad del CMS — POC y handoff

## Estado del 2FA TOTP

**Strapi v5 Community Edition (5.45.0) no incluye 2FA TOTP nativo para
el panel admin.** La feature está en la edición Enterprise (paga).

Confirmado al revisar el código del admin distribuido y el endpoint
`/admin/users/me`: no hay campos `isMfaEnabled`, `tfaSecret` ni rutas
relacionadas.

## Mitigaciones aceptadas para producción

En lugar de 2FA, la combinación que protege el panel admin para el
caso de ITRC es:

1. **VPN-only**: el servidor de pruebas y producción solo es accesible
   vía la VPN institucional FortiClient. Sin VPN, ni siquiera se puede
   resolver el host. Equivale a un primer factor de red.

2. **Allowlist nginx**: cuando Strapi se mueva al servidor de pruebas,
   añadir en `/etc/nginx/sites-available/itrc-web`:

   ```nginx
   location /admin {
       allow 192.168.0.0/16;   # rangos VPN institucional
       deny all;
       proxy_pass http://127.0.0.1:1337;
       # ... resto del proxy_pass habitual
   }
   ```

3. **Política de contraseñas fuertes**: Strapi v5 ya impone min 8
   caracteres con mayús/minús/números. Documentar en el manual del
   operador que la contraseña debe ser de gestor (Bitwarden / 1Password)
   y rotarse cada 90 días.

4. **Session timeout corto**: `cms-strapi/config/admin.ts` permite
   ajustar `auth.sessions.maxRefreshTokenLifespan` y
   `auth.sessions.maxSessionLifespan`. Por default es 30 días — bajarlo
   a 8h es razonable para uso institucional.

5. **Rate limiting en login**: el plugin
   `@strapi/plugin-users-permissions` ya tiene rate limiting; aplicarlo
   también a `/admin/login` mediante middleware custom.

## Plan futuro (cuando entre Enterprise o aparezca plugin estable)

Si más adelante el área legal exige 2FA estricto:

- Evaluar `strapi-plugin-passwordless` u otros plugins community
  (vetting necesario).
- O migrar a Strapi Enterprise (licencia $$).

Hasta entonces, las 5 mitigaciones de arriba son suficientes para el
contexto de un panel interno con un puñado de webmasters
identificables.

## Configuración recomendada de session timeout

Editar `cms-strapi/config/admin.ts`:

```ts
export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    sessions: {
      maxRefreshTokenLifespan: 60 * 60 * 8,     // 8h
      maxSessionLifespan: 60 * 60 * 8,
    },
  },
  // ...resto
});
```
