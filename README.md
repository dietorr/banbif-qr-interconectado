# BanBif · Pago QR interconectado

Landing en **Astro** (sitio estático) que cuenta el proyecto Pago QR interconectado (BanBif × Grupo Gloria).
Se publica en GitHub Pages: **https://dietorr.github.io/banbif-qr-interconectado/** (esa URL es la que va en el QR del polo).

## Dos versiones
- **`/` (versión corta, la del QR):** Inicio → Video → La historia → Cómo funciona → Resultados → Equipo → Cierre (~7 pantallas en celular). Se arma en `src/pages/index.astro` con los componentes de `src/components/compact/`.
- **`/completa` (versión larga):** las 12 secciones originales (~24 pantallas). Se arma en `src/pages/completa.astro`.

## Editar lo más común
| Qué | Dónde |
|---|---|
| ID del video de YouTube | `src/site.config.ts` → `youtubeId` (solo el ID, p. ej. `dQw4w9WgXcQ`) |
| Nombre del producto, título y descripción SEO | `src/site.config.ts` |
| Colores y tipografías (Manual de marca BanBif 2025) | `src/styles/global.css` (bloque `:root`, con la paleta oficial documentada) |
| Logos | `public/logos/` (BanBif color, negro y blanco; Gloria). Co-branding en `src/components/ui/Cobrand.astro` |
| Integrantes del equipo | Array `team` en `src/components/sections/Equipo.astro` (fotos en `public/equipo/`) |
| Textos de referencia | `src/content/copy.md` |

## Desarrollo local
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```

## Vista previa en un solo archivo
```bash
npm run build
node scripts/single-html.mjs preview-corta.html index.html "/completa=preview-completa.html"
node scripts/single-html.mjs preview-completa.html completa/index.html "/=preview-corta.html"
```
Genera un HTML autocontenido (CSS, fuentes, logos y JS embebidos) que se abre con doble clic.

## Despliegue en GitHub Pages
El flujo `.github/workflows/deploy.yml` compila y publica el sitio en cada push a `main`.

1. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions** (una sola vez).
2. Haz push a `main` (o ejecuta el flujo a mano en la pestaña **Actions → Deploy a GitHub Pages → Run workflow**).
3. La URL queda en `https://<usuario>.github.io/<repositorio>/` (la versión larga en `.../completa/`).
   Las rutas de logos, fotos y enlaces se ajustan solas a esa subcarpeta.

**Dominio propio (opcional):** en Settings → Pages → Custom domain pon el dominio, y en
Settings → Secrets and variables → Actions → Variables crea `CUSTOM_DOMAIN_URL` con la URL completa
(p. ej. `https://qr.midominio.pe`), para que el sitio se compile sin subcarpeta.

## QR para el polo
- Genera el QR **solo cuando la URL final funcione** (con `https://`).
- Usa corrección de errores **H** (30 %) si el QR va bordado o estampado; tamaño mínimo ~3 × 3 cm, con margen blanco alrededor.
- Prueba el QR impreso con varios celulares (iPhone y Android) y con poca luz antes de mandar a producir.
- El QR queda atado a la URL impresa: si más adelante cambias el nombre del repositorio o el usuario, la URL cambia y el QR deja de funcionar. Decide el nombre definitivo antes de imprimir.
