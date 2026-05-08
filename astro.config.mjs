import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Configuración env-driven. Sin valores hardcoded de hosting.
// Defaults seguros para desarrollo local; deploy/producción aportan vars.
const SITE_URL = process.env.SITE_URL || 'http://localhost:4321';
const BASE_PATH = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    assets: 'assets'
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  vite: {
    css: {
      devSourcemap: true
    }
  }
});
