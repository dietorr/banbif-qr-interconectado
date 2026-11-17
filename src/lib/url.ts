// Antepone la ruta base del sitio (p. ej. "/banbif-qr-interconectado/" en GitHub Pages, "/" en un dominio propio).
export const withBase = (path: string): string =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
