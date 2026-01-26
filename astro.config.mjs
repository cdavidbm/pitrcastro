import { defineConfig } from 'astro/config';

// Detectar si estamos en produccion (GitHub Pages)
const isProduction = process.env.NODE_ENV === 'production';
const githubRepo = 'pitrcastro';

// https://astro.build/config
export default defineConfig({
  // En produccion usa GitHub Pages, en desarrollo usa localhost
  site: isProduction
    ? 'https://cdavidbm.github.io'
    : 'http://localhost:4321',

  // Base path solo en produccion (GitHub Pages)
  base: isProduction ? `/${githubRepo}/` : '/',

  output: 'static',
  trailingSlash: 'ignore',
  build: {
    assets: 'assets'
  },
  vite: {
    css: {
      devSourcemap: true
    }
  }
});
