// Genera un único HTML autocontenido a partir de dist/ (CSS, JS, fuentes e imágenes embebidos).
// Uso: npm run build && node scripts/single-html.mjs [salida.html] [página en dist, p. ej. completa/index.html] [enlaces: /ruta=archivo.html,...]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const out = process.argv[2] || join(root, 'preview.html');
const page = process.argv[3] || 'index.html';
const linkMap = Object.fromEntries((process.argv[4] || '').split(',').filter(Boolean).map((p) => p.split('=')));

const MIME = {
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.webp': 'image/webp', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif',
};
const file = (p) => join(dist, p.replace(/^\//, '').split(/[?#]/)[0]);
const dataUri = (p) => {
  const f = file(p);
  if (!existsSync(f)) return p;
  return `data:${MIME[extname(f)] || 'application/octet-stream'};base64,${readFileSync(f).toString('base64')}`;
};

// Dentro del CSS: fuentes e imágenes (se descarta el respaldo .woff: todos los navegadores modernos usan .woff2)
const inlineCss = (css) =>
  css
    .replace(/,\s*url\(([^)]+?\.woff)\)\s*format\(["']woff["']\)/g, '')
    .replace(/url\((["']?)(\/[^)"']+)\1\)/g, (_, q, p) => `url(${dataUri(p)})`);

let html = readFileSync(join(dist, page), 'utf8');
// Enlaces entre páginas → archivos de vista previa
for (const [from, to] of Object.entries(linkMap)) html = html.replaceAll(`href="${from}"`, `href="${to}"`);

html = html.replace(/<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_, href) =>
  `<style>${inlineCss(readFileSync(file(href), 'utf8'))}</style>`);
html = html.replace(/<style>([\s\S]*?)<\/style>/g, (_, css) => `<style>${inlineCss(css)}</style>`);

html = html.replace(/<script type="module" src="([^"]+)"><\/script>/g, (_, src) => {
  const js = readFileSync(file(src), 'utf8');
  if (/\bimport\s*[{(*"']|\bfrom\s*["']/.test(js)) console.warn('Aviso: el script importa otros módulos:', src);
  return `<script type="module">${js.replace(/<\/script/g, '<\\/script')}</script>`;
});

html = html.replace(/(src|href)="(\/(?:logos|equipo|_astro)\/[^"]+|\/favicon\.svg|\/og\.png)"/g, (_, a, p) => `${a}="${dataUri(p)}"`);
html = html.replace(/(<meta property="og:image" content=")[^"]*(")/, '$1$2');

writeFileSync(out, html);
console.log(`OK: ${out} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
