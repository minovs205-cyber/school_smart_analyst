import { withBase } from '@/lib/paths';

/**
 * Программа school_smart_analyst — модули профессионального роста Middle+/Senior.
 * Практика: теория → упражнение → кейс с ИИ-наставником → рефлексия.
 */

export type QuestKind = 'theory' | 'practice' | 'case' | 'mentor' | 'reflection' | 'capstone';

export interface CurriculumQuest {
  id: string;
  title: string;
  kind: QuestKind;
  do: string;
  mentorRole: string;
  doneWhen: string;
  href?: string;
  caseSlug?: string;
  skillIds?: string[];
  estimatedMinutes: number;
}

export interface CurriculumLevel {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  outcome: string;
  /** Условный вес модуля для прогресса */
  weight: number;
  quests: CurriculumQuest[];
}

export interface CurriculumModule {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  href: string;
  blurb: string;
  aiPartnership: string;
}

export const PLATFORM = {
  id: 'school_smart_analyst',
  brandRu: 'Антихрупкий системный аналитик',
  tagline:
    'Превратите генеративный ИИ в своего младшего помощника. Делегируйте рутину, работайте с неопределённостью и фокусируйтесь на архитектуре.',
  goal:
    'Инженерная платформа для практикующих SA: антихрупкость, делегирование рутины ИИ, фокус на архитектуре, бизнес-ценности и стейкхолдерах.',
} as const;

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 'scorecard',
    order: 1,
    title: 'AI-диагностика',
    shortTitle: 'Диагностика',
    href: '/scorecard',
    blurb: 'Ситуационные вопросы и первичная оценка компетенций за ~5 минут.',
    aiPartnership: 'ИИ задаёт контекст и разбирает подход — без самооценки ползунками.',
  },
  {
    id: 'workflows',
    order: 2,
    title: 'Сценарии с ИИ',
    shortTitle: 'Сценарии',
    href: '/workflows',
    blurb: 'Контекст, критерии приёмки, разбор галлюцинаций.',
    aiPartnership: 'Постановка задачи модели и инженерная валидация результата.',
  },
  {
    id: 'domain',
    order: 3,
    title: 'Домен банка',
    shortTitle: 'Домен',
    href: '/domain',
    blurb: 'Платежи, онбординг, регуляторика, legacy.',
    aiPartnership: 'ИИ-интервью по домену; решение остаётся за аналитиком.',
  },
  {
    id: 'cases',
    order: 4,
    title: 'Кейсы',
    shortTitle: 'Кейсы',
    href: '/cases',
    blurb: 'Банковские напряжения + диалог с ИИ-наставником.',
    aiPartnership: 'Наставник уточняет; архитектурное решение — ваше.',
  },
  {
    id: 'soft-skills',
    order: 5,
    title: 'Переговоры',
    shortTitle: 'Переговоры',
    href: '/soft-skills',
    blurb: 'Стейкхолдеры, фасилитация, подготовка к встречам.',
    aiPartnership: 'ИИ как спарринг для аргументов и повестки.',
  },
  {
    id: 'journal',
    order: 6,
    title: 'Журнал инсайтов',
    shortTitle: 'Журнал',
    href: '/journal',
    blurb: 'Фиксация решений и роли ИИ в работе.',
    aiPartnership: 'Рефлексия усиливает антихрупкость быстрее идеального текста.',
  },
];

export const CURRICULUM_LEVELS: CurriculumLevel[] = [
  {
    id: 'L1',
    number: 1,
    title: 'Синхронизация с ИИ',
    subtitle: 'Контекст вместо воды',
    outcome: 'Формулируете контекст так, что модель отдаёт структуру, а не общие слова.',
    weight: 100,
    quests: [
      {
        id: 'L1-Q1',
        title: 'AI-диагностика компетенций',
        kind: 'practice',
        do: 'Пройдите ситуационную диагностику (~5 мин) и сохраните первичную оценку.',
        mentorRole: 'Задаёт вопросы и формирует профиль для трека.',
        doneWhen: 'Результат диагностики сохранён.',
        href: '/scorecard',
        estimatedMinutes: 5,
      },
      {
        id: 'L1-Q2',
        title: 'Диалог с ИИ-наставником',
        kind: 'mentor',
        do: 'Откройте кейс и ответьте на 2 уточняющих вопроса наставника своими словами.',
        mentorRole: 'Уточняет стейкхолдеров, риски и критерии приёмки.',
        doneWhen: 'Есть полный обмен «вы → наставник → вы».',
        href: '/cases/legacy-payment-cutoff',
        caseSlug: 'legacy-payment-cutoff',
        estimatedMinutes: 30,
      },
      {
        id: 'L1-Q3',
        title: 'Инсайт недели',
        kind: 'reflection',
        do: 'Зафиксируйте: что усилили, где ошибка суждения, какую рутину делегировали ИИ.',
        mentorRole: 'Позже разберёт паттерны.',
        doneWhen: 'Есть запись текущей недели.',
        href: '/journal',
        estimatedMinutes: 15,
      },
    ],
  },
  {
    id: 'L2',
    number: 2,
    title: 'Язык аналитика и критика генерации',
    subtitle: 'Валидация вместо доверия к уверенному тону',
    outcome: 'Находите дыры в генерации и формулируете критерии приёмки.',
    weight: 150,
    quests: [
      {
        id: 'L2-Q1',
        title: 'Шаблон постановки задачи ИИ',
        kind: 'practice',
        do: 'Соберите шаблон: роль, контекст банка, артефакт, DoD, анти-паттерны.',
        mentorRole: 'Проверит полноту контекста.',
        doneWhen: 'Шаблон готов к повторному использованию.',
        href: '/workflows',
        estimatedMinutes: 40,
      },
      {
        id: 'L2-Q2',
        title: 'Ревью «готовых» историй от модели',
        kind: 'mentor',
        do: 'Попросите наставника сгенерировать истории по кейсу cutoff — найдите ≥3 дыры.',
        mentorRole: 'Сначала генератор, затем ревьюер.',
        doneWhen: 'Список дыр с обоснованием.',
        href: '/cases/legacy-payment-cutoff',
        caseSlug: 'legacy-payment-cutoff',
        estimatedMinutes: 45,
      },
      {
        id: 'L2-Q3',
        title: 'Критерий приёмки: до / после',
        kind: 'reflection',
        do: 'Запишите один критерий, который был размыт, и как переписали.',
        mentorRole: '—',
        doneWhen: 'Запись в журнале.',
        href: '/journal',
        estimatedMinutes: 15,
      },
    ],
  },
  {
    id: 'L3',
    number: 3,
    title: 'Доменная экспертиза без Wiki',
    subtitle: 'Банк, legacy, регуляторика',
    outcome: 'Отличаете общее знание модели от риска на проде.',
    weight: 180,
    quests: [
      {
        id: 'L3-Q1',
        title: 'Платёжный путь своими словами',
        kind: 'theory',
        do: 'Зафиксируйте: инициация → клиринг/статус → сверка (без копипаста).',
        mentorRole: 'Проверит online vs batch.',
        doneWhen: 'Конспект 5–7 предложений.',
        href: '/domain',
        estimatedMinutes: 50,
      },
      {
        id: 'L3-Q2',
        title: 'Кейс: чат-бот и 115-ФЗ',
        kind: 'case',
        do: 'Разложите: данные × можно/нельзя × хранение × владелец риска.',
        mentorRole: 'Давит на ПДн, идентификацию, подрядчика.',
        doneWhen: 'Таблица границ готова.',
        href: '/cases/115fz-chatbot-kyc',
        caseSlug: '115fz-chatbot-kyc',
        estimatedMinutes: 60,
      },
      {
        id: 'L3-Q3',
        title: 'Повторная диагностика после домена',
        kind: 'practice',
        do: 'Пройдите AI-диагностику снова и сравните профиль.',
        mentorRole: '—',
        doneWhen: 'Новый результат сохранён.',
        href: '/scorecard',
        estimatedMinutes: 10,
      },
    ],
  },
  {
    id: 'L4',
    number: 4,
    title: 'Работа с неопределённостью',
    subtitle: 'Скрытые требования и интеграции',
    outcome: 'Управляете scope: риски и допущения явны.',
    weight: 200,
    quests: [
      {
        id: 'L4-Q1',
        title: 'Кейс: cutoff и REST поверх пакета',
        kind: 'case',
        do: 'MVP: online / eventual, критерии, стоп-факторы.',
        mentorRole: 'Ломает упрощения про идемпотентность и дубли.',
        doneWhen: 'Одна страница решения.',
        href: '/cases/legacy-payment-cutoff',
        caseSlug: 'legacy-payment-cutoff',
        estimatedMinutes: 70,
      },
      {
        id: 'L4-Q2',
        title: 'ADR-lite по решению',
        kind: 'practice',
        do: 'Контекст → варианты → выбор → последствия.',
        mentorRole: 'Спросит «почему не A».',
        doneWhen: 'ADR сохранён.',
        href: '/journal',
        estimatedMinutes: 30,
      },
    ],
  },
  {
    id: 'L5',
    number: 5,
    title: 'Люди и переговоры',
    subtitle: 'Стейкхолдеры и фасилитация',
    outcome: 'Готовите встречи и аргументы с опорой на ИИ как ассистента.',
    weight: 200,
    quests: [
      {
        id: 'L5-Q1',
        title: 'Спарринг со стейкхолдером',
        kind: 'mentor',
        do: 'Попросите наставника сыграть CISO / спонсора; зафиксируйте 3 хода.',
        mentorRole: 'Жёсткий оппонент + разбор.',
        doneWhen: 'Три хода диалога записаны.',
        href: '/soft-skills',
        estimatedMinutes: 45,
      },
      {
        id: 'L5-Q2',
        title: 'Повестка воркшопа 45 мин',
        kind: 'practice',
        do: 'Цель, роли, решения к концу, парковка конфликтов.',
        mentorRole: 'Проверит decision owner.',
        doneWhen: 'Повестка 6–8 пунктов.',
        href: '/soft-skills',
        estimatedMinutes: 35,
      },
      {
        id: 'L5-Q3',
        title: 'Рефлексия переговоров',
        kind: 'reflection',
        do: 'Где усилили позицию / где уступили / где ИИ дал слабый аргумент.',
        mentorRole: '—',
        doneWhen: 'Запись в журнале.',
        href: '/journal',
        estimatedMinutes: 15,
      },
    ],
  },
  {
    id: 'L6',
    number: 6,
    title: 'Синтез Middle+',
    subtitle: 'ИИ — младший инженер',
    outcome: 'Есть playbook и закрытый разбор кейса end-to-end.',
    weight: 250,
    quests: [
      {
        id: 'L6-Q1',
        title: 'Диагностика: дельта роста',
        kind: 'practice',
        do: 'Повторная AI-диагностика; 3 фокуса на квартал.',
        mentorRole: 'Разберёт дельту.',
        doneWhen: 'Профиль и цели сохранены.',
        href: '/scorecard',
        estimatedMinutes: 25,
      },
      {
        id: 'L6-Q2',
        title: 'Capstone: полный разбор кейса',
        kind: 'capstone',
        do: 'Стейкхолдеры, допущения, scope, риски, критерии, роль ИИ.',
        mentorRole: 'Экзаменатор по слабым местам.',
        doneWhen: 'Пакет артефактов + ретро.',
        href: '/cases',
        estimatedMinutes: 120,
      },
      {
        id: 'L6-Q3',
        title: 'Playbook аналитика + ИИ',
        kind: 'reflection',
        do: 'Когда зову ИИ / когда нет / чеклист ревью / красные флаги банка.',
        mentorRole: 'Ревью на пустые формулировки.',
        doneWhen: 'Playbook зафиксирован.',
        href: '/journal',
        estimatedMinutes: 40,
      },
    ],
  },
];

export function getLevelById(id: string): CurriculumLevel | undefined {
  return CURRICULUM_LEVELS.find((l) => l.id === id);
}

export function getAllQuests(): CurriculumQuest[] {
  return CURRICULUM_LEVELS.flatMap((l) => l.quests);
}

export function totalWeight(): number {
  return CURRICULUM_LEVELS.reduce((sum, l) => sum + l.weight, 0);
}

/** @deprecated используйте totalWeight */
export function totalXp(): number {
  return totalWeight();
}

export function resolveQuestHref(baseUrl: string, quest: CurriculumQuest): string | undefined {
  if (!quest.href) return undefined;
  return withBase(baseUrl, quest.href);
}

export function getRecommendedQuest(completedQuestIds: string[] = []): {
  level: CurriculumLevel;
  quest: CurriculumQuest;
} {
  for (const level of CURRICULUM_LEVELS) {
    for (const quest of level.quests) {
      if (!completedQuestIds.includes(quest.id)) {
        return { level, quest };
      }
    }
  }
  const last = CURRICULUM_LEVELS[CURRICULUM_LEVELS.length - 1];
  return { level: last, quest: last.quests[last.quests.length - 1] };
}
