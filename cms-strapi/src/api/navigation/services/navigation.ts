import { factories } from '@strapi/strapi';

// Cast 'as any' es necesario hasta que strapi ts:generate-types regenere
// contentTypes.d.ts con los nuevos schemas. En desarrollo local Strapi lo
// hace solo; en este Dockerfile el build de TS corre antes de cargar Strapi.
export default factories.createCoreService('api::navigation.navigation' as any);
