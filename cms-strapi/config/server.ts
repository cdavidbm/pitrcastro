import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // En produccion Strapi corre detras de nginx (que a su vez recibe del WAF).
  // proxy: true hace que Koa confie en X-Forwarded-Proto / X-Forwarded-For,
  // para que ctx.request.protocol/ip reflejen al usuario real y no al WAF.
  proxy: env.bool('IS_PROXIED', false),
  app: {
    keys: env.array('APP_KEYS'),
  },
});

export default config;
