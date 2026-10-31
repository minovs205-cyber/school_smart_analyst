/** Оценка навыка: уровень владения и устойчивость к автоматизации ИИ (1–10). */
export interface SkillScore {
  id: string;
  name: string;
  /** Уровень владения навыком (1–10). */
  level: number;
  /** Насколько ИИ сложно заменить этот навык (1–10, выше = устойчивее). */
  aiResistance: number;
  category?: string;
  updatedAt: string;
}

export interface CaseNote {
  caseSlug: string;
  notes: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  weekOf: string;
  learned: string;
  mistakes: string;
  aiCouldHelp: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  preferredModel: string;
}

export const STORAGE_KEYS = {
  skillsScore: 'skills_score',
  journalEntries: 'journal_entries',
  caseNotes: 'case_notes',
  /** OpenRouter API key (primary). */
  llmApiKey: 'llm_api_key',
  /** Legacy Groq key — читается как fallback. */
  groqApiKey: 'groq_api_key',
  settings: 'settings',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
