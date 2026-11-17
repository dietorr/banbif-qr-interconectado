import { defineConfig } from 'astro/config';

// SITE_URL: dominio público (p. ej. https://usuario.github.io)
// BASE_PATH: subcarpeta del sitio (p. ej. /banbif-qr-interconectado en GitHub Pages; "/" en un dominio propio)
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
});
