/**
 * Партнёрские / реферальные слоты (коммерческий фундамент).
 * Подставь свои affiliate URL, когда появятся кабинеты партнёрок.
 * UTM всегда добавляем — чтобы считать CTR даже на «обычных» ссылках.
 */

export interface PartnerOffer {
  id: string;
  title: string;
  blurb: string;
  /** Базовый URL без UTM */
  url: string;
  /** Где показывать по умолчанию */
  placements: Array<'case' | 'consultations' | 'footer' | 'program'>;
}

export const PARTNER_OFFERS: PartnerOffer[] = [
  {
    id: 'analyst-course',
    title: 'Курс системного аналитика',
    blurb: 'Если нужен структурированный фундамент рядом с тренажёром — курсы школ (партнёрская ссылка).',
    url: 'https://www.notion.so/',
    placements: ['consultations', 'footer'],
  },
  {
    id: 'miro',
    title: 'Miro для фасилитации',
    blurb: 'Доска для воркшопов со стейкхолдерами — удобный спарринг к уровню L5.',
    url: 'https://miro.com/',
    placements: ['case', 'program', 'footer'],
  },
  {
    id: 'books-sa',
    title: 'Книги по анализу и архитектуре',
    blurb: 'Подборка на маркетплейсе — когда кейс упирается в теорию интеграций.',
    url: 'https://www.ozon.ru/',
    placements: ['case', 'consultations'],
  },
];

export function withUtm(
  url: string,
  opts: { campaign: string; content?: string; medium?: string },
): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'school_smart_analyst');
    u.searchParams.set('utm_medium', opts.medium ?? 'affiliate');
    u.searchParams.set('utm_campaign', opts.campaign);
    if (opts.content) u.searchParams.set('utm_content', opts.content);
    return u.toString();
  } catch {
    return url;
  }
}

export function partnersFor(placement: PartnerOffer['placements'][number]): PartnerOffer[] {
  return PARTNER_OFFERS.filter((p) => p.placements.includes(placement));
}
