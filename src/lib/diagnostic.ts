/**
 * AI-диагностика компетенций (мок-скоринг до подключения LLM).
 * Баллы: длина ответа + ключевые маркеры инженерной речи.
 */

export type DiagnosticSkillId =
  | 'uncertainty'
  | 'prompting'
  | 'systems'
  | 'validation'
  | 'stakeholders';

export interface DiagnosticSkillDef {
  id: DiagnosticSkillId;
  name: string;
}

export const DIAGNOSTIC_SKILLS: DiagnosticSkillDef[] = [
  { id: 'uncertainty', name: 'Работа с неопределённостью' },
  { id: 'prompting', name: 'Промпт-инжиниринг' },
  { id: 'systems', name: 'Системное мышление' },
  { id: 'validation', name: 'Валидация ИИ-генерации' },
  { id: 'stakeholders', name: 'Коммуникация со стейкхолдерами' },
];

export interface DiagnosticQuestion {
  id: string;
  prompt: string;
  /** Какие навыки сильнее затрагивает вопрос */
  skillIds: DiagnosticSkillId[];
  keywords: string[];
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'q1',
    prompt:
      'Опишите, как вы сейчас выявляете скрытые требования в legacy-системах? Приведите пример.',
    skillIds: ['uncertainty', 'systems'],
    keywords: [
      'интеграц',
      'legacy',
      'требован',
      'стейкхолдер',
      'допущен',
      'риск',
      'сверк',
      'контекст',
      'процесс',
      'данные',
    ],
  },
  {
    id: 'q2',
    prompt:
      'Как вы проверяете сгенерированную ИИ схему интеграции на реалистичность и полноту?',
    skillIds: ['validation', 'prompting', 'systems'],
    keywords: [
      'валид',
      'провер',
      'галлюцин',
      'чеклист',
      'интеграц',
      'полнот',
      'критер',
      'ревью',
      'схем',
      'контекст',
      'промпт',
    ],
  },
  {
    id: 'q3',
    prompt:
      'Представьте, что стейкхолдер против внедрения ИИ в ваш рабочий процесс. Ваши аргументы?',
    skillIds: ['stakeholders', 'prompting'],
    keywords: [
      'стейкхолдер',
      'ценност',
      'риск',
      'делегир',
      'рутин',
      'архитектур',
      'комплаенс',
      'пилот',
      'метрик',
      'переговор',
      'фасилит',
    ],
  },
];

export interface DiagnosticSkillScore {
  id: DiagnosticSkillId;
  name: string;
  score: number;
  advice: string;
}

export interface DiagnosticResult {
  answers: Record<string, string>;
  skills: DiagnosticSkillScore[];
  recommendedModuleIds: string[];
  createdAt: string;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(n)));
}

function scoreAnswer(text: string, keywords: string[]): number {
  const normalized = text.trim().toLowerCase();
  if (normalized.length < 12) return 3;
  let score = 4;
  const len = normalized.length;
  if (len >= 40) score += 1;
  if (len >= 90) score += 1;
  if (len >= 160) score += 1;
  const hits = keywords.filter((k) => normalized.includes(k)).length;
  score += Math.min(3, hits);
  if (/пример|когда|потому|чтобы|если/.test(normalized)) score += 1;
  return clamp(score, 1, 10);
}

const ADVICE: Record<DiagnosticSkillId, (score: number) => string> = {
  uncertainty: (s) =>
    s >= 7
      ? 'Вы уверенно держите неопределённость. Усильте фиксацию допущений в ADR — это ускорит согласования.'
      : 'Вы хорошо видите процесс, но стоит явно фиксировать гипотезы и стоп-факторы до детализации требований.',
  prompting: (s) =>
    s >= 7
      ? 'Контекст для модели формулируете сильно. Добавьте в шаблон критерии приёмки и анти-примеры.'
      : 'Усильте промпт-инжиниринг: роль, границы домена, формат выхода и критерии «готово».',
  systems: (s) =>
    s >= 7
      ? 'Системное мышление на уровне Middle+. Следующий шаг — границы ответственности между сервисами.'
      : 'Усильте взгляд на границы систем: кто источник истины, какие события, где eventual consistency.',
  validation: (s) =>
    s >= 7
      ? 'Валидация генерации уже в привычке. Оформите чек-лист ревью схем и историй.'
      : 'Стоит усилить валидацию ИИ-генерации через чек-листы: полнота, реалистичность, регуляторные дыры.',
  stakeholders: (s) =>
    s >= 7
      ? 'Аргументы для стейкхолдеров звучат зрело. Тренируйте фасилитацию конфликтных столов.'
      : 'Сместите акцент с «ИИ крутой» на бизнес-ценность, риски и пилот с измеримым эффектом.',
};

/** Мок-оценка: заглушка до реального LLM-API. */
export function evaluateDiagnostic(answers: Record<string, string>): DiagnosticResult {
  const accum = new Map<DiagnosticSkillId, number[]>();

  for (const q of DIAGNOSTIC_QUESTIONS) {
    const answer = answers[q.id] ?? '';
    const score = scoreAnswer(answer, q.keywords);
    for (const skillId of q.skillIds) {
      const list = accum.get(skillId) ?? [];
      list.push(score);
      accum.set(skillId, list);
    }
  }

  // Навыки без прямого вопроса — слегка тянем от связанных
  if (!accum.has('prompting')) accum.set('prompting', [5]);
  if (!accum.has('systems')) accum.set('systems', [5]);

  const skills: DiagnosticSkillScore[] = DIAGNOSTIC_SKILLS.map((def) => {
    const values = accum.get(def.id) ?? [5];
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const score = clamp(avg, 1, 10);
    return {
      id: def.id,
      name: def.name,
      score,
      advice: ADVICE[def.id](score),
    };
  });

  const sorted = [...skills].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 2).map((s) => s.id);
  const recommendedModuleIds: string[] = [];
  if (weakest.includes('prompting') || weakest.includes('validation')) {
    recommendedModuleIds.push('m1', 'm2');
  }
  if (weakest.includes('systems') || weakest.includes('uncertainty')) {
    recommendedModuleIds.push('m3', 'm4');
  }
  if (weakest.includes('stakeholders')) {
    recommendedModuleIds.push('m5');
  }
  recommendedModuleIds.push('m6');

  return {
    answers,
    skills,
    recommendedModuleIds: [...new Set(recommendedModuleIds)].slice(0, 4),
    createdAt: new Date().toISOString(),
  };
}
