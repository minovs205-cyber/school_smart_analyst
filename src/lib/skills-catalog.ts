import type { SkillScore } from '@/lib/types';

/** Стартовый каталог навыков SA в банке (AI-resistance — экспертная оценка «насколько ИИ сложно заменить»). */
export interface SkillTemplate {
  id: string;
  name: string;
  category: string;
  /** Базовая устойчивость к ИИ 1–10 (подсказка, пользователь может менять). */
  defaultAiResistance: number;
  hint: string;
}

export const SKILL_CATALOG: SkillTemplate[] = [
  {
    id: 'negotiation',
    name: 'Переговоры со стейкхолдерами',
    category: 'Люди',
    defaultAiResistance: 9,
    hint: 'Конфликт интересов, win-win, давление сроков',
  },
  {
    id: 'uncertainty',
    name: 'Работа с неопределённостью',
    category: 'Мышление',
    defaultAiResistance: 8,
    hint: 'Гипотезы, допущения, когда «требования ещё плывут»',
  },
  {
    id: 'architecture',
    name: 'Системная архитектура и интеграции',
    category: 'Системы',
    defaultAiResistance: 7,
    hint: 'Границы систем, события, согласованность данных',
  },
  {
    id: 'domain-banking',
    name: 'Домен banking / продукты',
    category: 'Домен',
    defaultAiResistance: 8,
    hint: 'Кредиты, карты, платежи, клиентский путь',
  },
  {
    id: 'regulation',
    name: 'Регуляторика (115-ФЗ, ЦБ, PCI DSS)',
    category: 'Домен',
    defaultAiResistance: 8,
    hint: 'Глубина «почему нельзя просто так», не пересказ норм',
  },
  {
    id: 'facilitation',
    name: 'Фасилитация и модерация',
    category: 'Люди',
    defaultAiResistance: 9,
    hint: 'Воркшопы, приоритизация в группе, конфликт ролей',
  },
  {
    id: 'ai-prompting',
    name: 'Постановка задач ИИ',
    category: 'ИИ',
    defaultAiResistance: 6,
    hint: 'Контекст, критерии приёмки, итерации с моделью',
  },
  {
    id: 'ai-critique',
    name: 'Критический разбор генерации ИИ',
    category: 'ИИ',
    defaultAiResistance: 7,
    hint: 'Находить дыры в US/BRD/схемах от модели',
  },
  {
    id: 'legacy',
    name: 'Legacy и интеграционные риски',
    category: 'Системы',
    defaultAiResistance: 8,
    hint: 'Шлюзы, пакетные обмены, «на проде иначе»',
  },
  {
    id: 'scope',
    name: 'Управление scope и ожиданиями',
    category: 'Мышление',
    defaultAiResistance: 8,
    hint: 'Вырезать must/should, защищать фокус релиза',
  },
  {
    id: 'decisions',
    name: 'Фиксация решений (ADR / decision log)',
    category: 'Мышление',
    defaultAiResistance: 6,
    hint: 'Почему выбрали вариант B, а не A',
  },
  {
    id: 'discovery',
    name: 'Discovery и проверка гипотез',
    category: 'Мышление',
    defaultAiResistance: 8,
    hint: 'Интервью, метрики, falsify assumptions',
  },
];

export function createDefaultSkills(): SkillScore[] {
  const now = new Date().toISOString();
  return SKILL_CATALOG.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    level: 5,
    aiResistance: t.defaultAiResistance,
    updatedAt: now,
  }));
}

/** Приоритет прокачки: высокий gap = низкий уровень при высокой устойчивости к ИИ. */
export function rankSkillsToTrain(skills: SkillScore[]): SkillScore[] {
  return [...skills]
    .map((s) => ({
      skill: s,
      priority: s.aiResistance * (11 - s.level),
    }))
    .sort((a, b) => b.priority - a.priority)
    .map((x) => x.skill);
}
