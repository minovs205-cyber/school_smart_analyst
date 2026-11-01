/** Модули профессионального роста — публичные описания для главной и программы. */

export interface GrowthModule {
  id: string;
  number: number;
  title: string;
  description: string;
  href: string;
}

export const GROWTH_MODULES: GrowthModule[] = [
  {
    id: 'm1',
    number: 1,
    title: 'Синхронизация с ИИ',
    description:
      'Научитесь формулировать контекст так, чтобы ИИ генерировал структурированные данные, а не воду.',
    href: '/scorecard',
  },
  {
    id: 'm2',
    number: 2,
    title: 'Язык аналитика и критика генерации',
    description:
      'Как валидировать ИИ-выводы и отличать галлюцинации от инсайтов.',
    href: '/workflows',
  },
  {
    id: 'm3',
    number: 3,
    title: 'Доменная экспертиза без Wiki',
    description:
      'Анализ банковских систем и legacy-интеграций через ИИ-интервью.',
    href: '/domain',
  },
  {
    id: 'm4',
    number: 4,
    title: 'Работа с неопределённостью',
    description:
      'Выявление скрытых требований и построение интеграционных схем.',
    href: '/cases/legacy-payment-cutoff',
  },
  {
    id: 'm5',
    number: 5,
    title: 'Люди и переговоры',
    description:
      'Использование ИИ для подготовки к стейкхолдер-встречам и фасилитации.',
    href: '/soft-skills',
  },
  {
    id: 'm6',
    number: 6,
    title: 'Синтез Middle+',
    description: 'Архитектура решений, где ИИ — ваш младший инженер.',
    href: '/program',
  },
];
