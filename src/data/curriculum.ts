import { withBase } from '@/lib/paths';

/**
 * Базовая программа school_smart_analyst — путь junior → middle+.
 * Структура как у JavaRush: уровни → квесты → практика с ИИ-наставником.
 */

export type QuestKind = 'theory' | 'practice' | 'case' | 'mentor' | 'reflection' | 'capstone';
export type QuestStatusHint = 'available' | 'locked' | 'recommended';

export interface CurriculumQuest {
  id: string;
  title: string;
  kind: QuestKind;
  /** Что сделаешь руками */
  do: string;
  /** Как помогает ИИ-наставник */
  mentorRole: string;
  /** Критерий «квест закрыт» */
  doneWhen: string;
  /** Относительный путь приложения (без base) */
  href?: string;
  /** Связанный slug кейса */
  caseSlug?: string;
  /** Связанные skill ids из каталога */
  skillIds?: string[];
  estimatedMinutes: number;
}

export interface CurriculumLevel {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  /** Выход уровня: что умеешь как middle-кандидат */
  outcome: string;
  xp: number;
  quests: CurriculumQuest[];
}

export interface CurriculumModule {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  href: string;
  blurb: string;
  /** Почему модуль важен против «замены ИИ» */
  aiPartnership: string;
}

export const PLATFORM = {
  id: 'school_smart_analyst',
  brandRu: 'Антихрупкий аналитик',
  tagline:
    'Из джуна в крепкого middle+: не бояться ИИ, а идти с ним рука об руку.',
  goal:
    'Подготовить системного аналитика банка уровня middle+: суждение, переговоры, неопределённость, домен и критическая работа с ИИ.',
} as const;

/** Карта модулей платформы (навигация + программа). */
export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 'scorecard',
    order: 1,
    title: 'Карта навыков',
    shortTitle: 'Карта',
    href: '/scorecard',
    blurb: 'Базовая диагностика: где ты сейчас и что качать первым.',
    aiPartnership: 'ИИ не ставит тебе оценки за тебя — ты честно меришь себя, ИИ потом бьёт в слабые зоны.',
  },
  {
    id: 'workflows',
    order: 2,
    title: 'Сценарии с ИИ',
    shortTitle: 'Сценарии',
    href: '/workflows',
    blurb: 'Промпты аналитика, разбор галлюцинаций, сравнение вариантов.',
    aiPartnership: 'Учишься ставить задачи модели и ловить дыры — рука об руку, не «сдай ТЗ».',
  },
  {
    id: 'domain',
    order: 3,
    title: 'Домен банка',
    shortTitle: 'Домен',
    href: '/domain',
    blurb: 'Платежи, кредиты, KYC/115-ФЗ, клиентский путь.',
    aiPartnership: 'Модель знает википедию; ты знаешь, как у вас на проде и что скажет комплаенс.',
  },
  {
    id: 'cases',
    order: 4,
    title: 'Кейсы',
    shortTitle: 'Кейсы',
    href: '/cases',
    blurb: 'Реальные напряжения банка + диалог с ИИ-наставником.',
    aiPartnership: 'Наставник давит вопросами; готовое решение не выдаёт.',
  },
  {
    id: 'soft-skills',
    order: 5,
    title: 'Переговоры',
    shortTitle: 'Переговоры',
    href: '/soft-skills',
    blurb: 'Стейкхолдеры, конфликт интересов, фасилитация.',
    aiPartnership: 'ИИ — спарринг-партнёр оппонента, не спичрайтер для спонсора.',
  },
  {
    id: 'journal',
    order: 6,
    title: 'Журнал',
    shortTitle: 'Журнал',
    href: '/journal',
    blurb: 'Еженедельная рефлексия: урок, ошибка, роль ИИ.',
    aiPartnership: 'Привычка важнее идеального текста; разбор паттернов — позже с наставником.',
  },
];

/**
 * Уровни 1–6 ≈ 8–12 недель при 4–6 ч/нед.
 * JavaRush-логика: теория коротко → практика → кейс с ментором → рефлексия.
 */
export const CURRICULUM_LEVELS: CurriculumLevel[] = [
  {
    id: 'L1',
    number: 1,
    title: 'Ориентир и союз с ИИ',
    subtitle: 'Не «ИИ заменит», а «я + ИИ сильнее»',
    outcome: 'Понимаешь свою карту навыков, умеешь начать диалог с наставником, ведёшь журнал.',
    xp: 100,
    quests: [
      {
        id: 'L1-Q1',
        title: 'Диагностика: карта 12 навыков',
        kind: 'practice',
        do: 'Оцени уровень и устойчивость к ИИ по каждому навыку. Сохрани.',
        mentorRole: 'Пока не нужен — сначала честная самооценка.',
        doneWhen: 'Карта сохранена, видишь топ-3 «качать первым».',
        href: '/scorecard',
        skillIds: ['negotiation', 'uncertainty', 'ai-prompting'],
        estimatedMinutes: 25,
      },
      {
        id: 'L1-Q2',
        title: 'Контракт с наставником',
        kind: 'mentor',
        do: 'Открой любой кейс, нажми «Начать разбор», ответь на 2 вопроса наставника своими словами.',
        mentorRole: 'Задаёт неудобные стартовые вопросы; ловит общие слова.',
        doneWhen: 'Есть минимум 1 полный обмен «ты → наставник → ты».',
        href: '/cases/legacy-payment-cutoff',
        caseSlug: 'legacy-payment-cutoff',
        skillIds: ['ai-prompting', 'ai-critique'],
        estimatedMinutes: 30,
      },
      {
        id: 'L1-Q3',
        title: 'Первая неделя в журнале',
        kind: 'reflection',
        do: 'Заполни: что узнал / где ошибся / как ИИ помог или мешал.',
        mentorRole: 'Позже разберёт паттерны; сейчас — привычка.',
        doneWhen: 'Есть запись текущей недели.',
        href: '/journal',
        estimatedMinutes: 15,
      },
    ],
  },
  {
    id: 'L2',
    number: 2,
    title: 'Язык аналитика + критика генерации',
    subtitle: 'Истории, критерии приёмки, дыры в тексте модели',
    outcome: 'Пишешь чёткие критерии приёмки и находишь минимум 3 дыры в черновике от ИИ.',
    xp: 150,
    quests: [
      {
        id: 'L2-Q1',
        title: 'Сценарий: постановка задачи ИИ',
        kind: 'practice',
        do: 'Пройди модуль сценариев: контекст → критерии → итерация (пока stub — зафиксируй свой шаблон промпта в заметках).',
        mentorRole: 'Проверит, не слишком ли общий промпт и где нет DoD.',
        doneWhen: 'Есть личный шаблон: роль, контекст банка, артефакт, критерии, анти-паттерны.',
        href: '/workflows',
        skillIds: ['ai-prompting', 'scope'],
        estimatedMinutes: 40,
      },
      {
        id: 'L2-Q2',
        title: 'Квест: дыры в «готовых» историях',
        kind: 'mentor',
        do: 'Попроси наставника сгенерировать 3 user story по кейсу cutoff — затем сам найди дыры; наставник бьёт в пропущенное.',
        mentorRole: 'Сначала «плохой отличник», потом жёсткий ревьюер.',
        doneWhen: 'Список ≥3 дыр (стейкхолдер, данные, идемпотентность, безопасность…).',
        href: '/cases/legacy-payment-cutoff',
        caseSlug: 'legacy-payment-cutoff',
        skillIds: ['ai-critique', 'scope'],
        estimatedMinutes: 45,
      },
      {
        id: 'L2-Q3',
        title: 'Журнал: урок про критерии приёмки',
        kind: 'reflection',
        do: 'Запиши один критерий, который раньше писал размыто, и как переписал.',
        mentorRole: '—',
        doneWhen: 'Запись в журнале с конкретным до/после.',
        href: '/journal',
        estimatedMinutes: 15,
      },
    ],
  },
  {
    id: 'L3',
    number: 3,
    title: 'Домен банка без википедии',
    subtitle: 'Платежи, онбординг, 115-ФЗ — где модель врёт уверенно',
    outcome: 'Отличаешь «общее знание» от банковского риска; ставишь границы данных и процессов.',
    xp: 180,
    quests: [
      {
        id: 'L3-Q1',
        title: 'Доменный конспект: платежный путь',
        kind: 'theory',
        do: 'В модуле Домен зафиксируй: инициация → авторизация/клиринг → статус → сверка (своими словами).',
        mentorRole: 'Проверит, не смешал ли online и batch.',
        doneWhen: '5–7 предложений своего конспекта без копипаста.',
        href: '/domain',
        skillIds: ['domain-banking', 'legacy'],
        estimatedMinutes: 50,
      },
      {
        id: 'L3-Q2',
        title: 'Кейс: чат-бот и 115-ФЗ',
        kind: 'case',
        do: 'Разбери кейс онбординга с наставником: что можно боту, что нельзя подрядчику.',
        mentorRole: 'Давит на ПДн, идентификации, DPA, КИБ.',
        doneWhen: 'Таблица: данные × можно/нельзя × где хранить × кто владелец риска.',
        href: '/cases/115fz-chatbot-kyc',
        caseSlug: '115fz-chatbot-kyc',
        skillIds: ['regulation', 'domain-banking', 'negotiation'],
        estimatedMinutes: 60,
      },
      {
        id: 'L3-Q3',
        title: 'Обнови карту: домен и регуляторика',
        kind: 'practice',
        do: 'Пересмотри оценки «Домен» и «Регуляторика» после кейса.',
        mentorRole: '—',
        doneWhen: 'Оценки обновлены и сохранены.',
        href: '/scorecard',
        skillIds: ['domain-banking', 'regulation'],
        estimatedMinutes: 10,
      },
    ],
  },
  {
    id: 'L4',
    number: 4,
    title: 'Неопределённость и интеграции',
    subtitle: 'Legacy, cutoff, eventual — управляемый объём',
    outcome: 'Режешь scope без «зарубить идею»; явно фиксируешь риски и допущения.',
    xp: 200,
    quests: [
      {
        id: 'L4-Q1',
        title: 'Кейс: ночной cutoff и «простое» API',
        kind: 'case',
        do: 'Предложи MVP: что online, что eventual, какие критерии приёмки и стоп-факторы.',
        mentorRole: 'Ломает красивые REST-сказки вопросами про идемпотентность и дубли.',
        doneWhen: '1 страница: scope must/should, риски, метрики успеха, вопросы архитектору.',
        href: '/cases/legacy-payment-cutoff',
        caseSlug: 'legacy-payment-cutoff',
        skillIds: ['uncertainty', 'legacy', 'architecture', 'scope'],
        estimatedMinutes: 70,
      },
      {
        id: 'L4-Q2',
        title: 'Журнал решений (ADR-lite)',
        kind: 'practice',
        do: 'Оформи 1 решение: контекст → варианты → выбор → последствия.',
        mentorRole: 'Спросит «почему не вариант A» до тех пор, пока ответ не станет конкретным.',
        doneWhen: 'ADR на полстраницы сохранён (журнал или заметка кейса).',
        href: '/journal',
        skillIds: ['decisions'],
        estimatedMinutes: 30,
      },
    ],
  },
  {
    id: 'L5',
    number: 5,
    title: 'Люди и переговоры',
    subtitle: 'Спонсор, комплаенс, ИБ — один стол',
    outcome: 'Ведишь конфликт интересов к взаимовыгодному объёму, не к «победе в споре».',
    xp: 200,
    quests: [
      {
        id: 'L5-Q1',
        title: 'Спарринг: оппонент с характером',
        kind: 'mentor',
        do: 'В модуле Переговоры (или в кейсе 115-ФЗ) попроси наставника сыграть CISO / спонсора.',
        mentorRole: 'Играет жёсткого стейкхолдера; потом даёт разбор твоих ходов.',
        doneWhen: 'Зафиксированы 3 хода: твоя позиция → возражение → твой ответ с вопросом.',
        href: '/soft-skills',
        skillIds: ['negotiation', 'facilitation'],
        estimatedMinutes: 45,
      },
      {
        id: 'L5-Q2',
        title: 'Фасилитация на бумаге',
        kind: 'practice',
        do: 'Составь повестку 45-мин воркшопа: цель, роли, решения к концу, парковка конфликтов.',
        mentorRole: 'Проверит, есть ли явный decision owner.',
        doneWhen: 'Повестка из 6–8 пунктов готова.',
        href: '/soft-skills',
        skillIds: ['facilitation', 'negotiation'],
        estimatedMinutes: 35,
      },
      {
        id: 'L5-Q3',
        title: 'Рефлексия недели переговоров',
        kind: 'reflection',
        do: 'В журнале: где сдавил / где сдался / где ИИ подсказал слабый аргумент.',
        mentorRole: '—',
        doneWhen: 'Запись недели с фокусом на людей.',
        href: '/journal',
        estimatedMinutes: 15,
      },
    ],
  },
  {
    id: 'L6',
    number: 6,
    title: 'Синтез middle+',
    subtitle: 'Свой playbook: суждение + ИИ как усилитель',
    outcome: 'Есть личный playbook и закрытый capstone: кейс от входа до решения без готового ТЗ от модели.',
    xp: 250,
    quests: [
      {
        id: 'L6-Q1',
        title: 'Повторная карта навыков',
        kind: 'practice',
        do: 'Пройди карту снова. Сравни с L1: что выросло, что всё ещё дыра.',
        mentorRole: 'Разберёт дельту и предложит фокус на квартал.',
        doneWhen: 'Новые оценки сохранены; 3 цели на следующий цикл.',
        href: '/scorecard',
        estimatedMinutes: 25,
      },
      {
        id: 'L6-Q2',
        title: 'Capstone: полный разбор одного кейса',
        kind: 'capstone',
        do: 'Выбери кейс. Артефакты: стейкхолдеры, допущения, scope, риски, критерии, открытые вопросы, роль ИИ в работе.',
        mentorRole: 'Финальный экзаменатор: бьёт в слабые места, не пишет артефакты за тебя.',
        doneWhen: 'Пакет артефактов + журнал «что бы сделал иначе».',
        href: '/cases',
        skillIds: [
          'negotiation',
          'uncertainty',
          'architecture',
          'domain-banking',
          'ai-critique',
          'decisions',
        ],
        estimatedMinutes: 120,
      },
      {
        id: 'L6-Q3',
        title: 'Playbook аналитика + ИИ',
        kind: 'reflection',
        do: '1 страница: когда зову ИИ / когда не зову / чеклист ревью генерации / красные флаги банка.',
        mentorRole: 'Ревью playbook на пустые лозунги.',
        doneWhen: 'Playbook в журнале или отдельной заметке.',
        href: '/journal',
        skillIds: ['ai-prompting', 'ai-critique', 'discovery'],
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

export function totalXp(): number {
  return CURRICULUM_LEVELS.reduce((sum, l) => sum + l.xp, 0);
}

export function resolveQuestHref(baseUrl: string, quest: CurriculumQuest): string | undefined {
  if (!quest.href) return undefined;
  return withBase(baseUrl, quest.href);
}

/** Рекомендация «квест на сегодня»: первый квест L1, далее — по порядку программы. */
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
