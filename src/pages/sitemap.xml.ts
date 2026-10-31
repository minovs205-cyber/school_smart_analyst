import type { APIRoute } from 'astro';
import { CASES } from '@/data/cases';
import { absoluteUrl } from '@/lib/site';

const STATIC_PATHS = [
  '/',
  '/program',
  '/scorecard',
  '/cases',
  '/journal',
  '/consultations',
  '/workflows',
  '/domain',
  '/soft-skills',
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const GET: APIRoute = () => {
  const base = import.meta.env.BASE_URL;
  const urls = [
    ...STATIC_PATHS.map((p) => absoluteUrl(base, p)),
    ...CASES.map((c) => absoluteUrl(base, `/cases/${c.slug}`)),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    <changefreq>weekly</changefreq>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
