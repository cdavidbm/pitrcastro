import type { Core } from '@strapi/strapi';

const config: Core.Config.Api = {
  rest: {
    defaultLimit: 25,
    // El portal consume colecciones grandes (notificaciones: 1473 entries)
    // en builds estáticos con un solo request por colección.
    maxLimit: 5000,
    withCount: true,
  },
};

export default config;
