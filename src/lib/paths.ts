/** Join Astro `BASE_URL` with a path safely (handles missing/extra slashes). */
export function withBase(baseUrl: string, path: string = '/'): string {
  const base = baseUrl.replace(/\/+$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (!base) return normalized || '/';
  return `${base}${normalized}`;
}
