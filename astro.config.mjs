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
  // El WP origen exponía /rendicion-de-cuentas/ y /control-social/ en raíz;
  // el portal nuevo los reubicó bajo /participa/. Estos redirects preservan
  // los enlaces externos indexados (Google, prensa, gov.co) sin tocar nginx.
  redirects: {
    '/rendicion-de-cuentas': '/participa/rendicion-de-cuentas',
    '/control-social': '/participa/control-social',
    // Página ITA "normas que sustentan a la entidad" se cubre con el
    // listado completo de marco legal (decretos, leyes, resoluciones).
    '/normas-que-los-sustentan': '/marco-legal',
  },
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
