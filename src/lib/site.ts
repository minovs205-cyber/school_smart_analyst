import { withBase } from '@/lib/paths';

/** Публичный origin GitHub Pages (без trailing slash). */
export const SITE_ORIGIN = 'https://minovs205-cyber.github.io';

export const SITE_NAME = 'school_smart_analyst';
export const BRAND_RU = 'Антихрупкий системный аналитик';

/**
 * Абсолютный URL страницы с учётом Astro `base`.
 * @param baseUrl — import.meta.env.BASE_URL
 * @param path — путь вида `/program`
 */
export function absoluteUrl(baseUrl: string, path: string = '/'): string {
  const joined = withBase(baseUrl, path);
  if (joined.startsWith('http')) return joined;
  return `${SITE_ORIGIN}${joined.startsWith('/') ? joined : `/${joined}`}`;
}

/** Cal.com / аналог — задай PUBLIC_CAL_URL в .env (бесплатный tier). */
export function getConsultBookingUrl(): string {
  const fromEnv = import.meta.env.PUBLIC_CAL_URL;
  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }
  return 'https://cal.com/';
}
