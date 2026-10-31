import {
  STORAGE_KEYS,
  type AppSettings,
  type CaseNote,
  type JournalEntry,
  type SkillScore,
  type StorageKey,
} from '@/lib/types';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getItem<T>(key: StorageKey): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: StorageKey, value: T): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: StorageKey): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
}

export function getSkills(): SkillScore[] {
  return getItem<SkillScore[]>(STORAGE_KEYS.skillsScore) ?? [];
}

export function setSkills(skills: SkillScore[]): void {
  setItem(STORAGE_KEYS.skillsScore, skills);
}

export function getJournalEntries(): JournalEntry[] {
  return getItem<JournalEntry[]>(STORAGE_KEYS.journalEntries) ?? [];
}

export function setJournalEntries(entries: JournalEntry[]): void {
  setItem(STORAGE_KEYS.journalEntries, entries);
}

export function getCaseNotes(): CaseNote[] {
  return getItem<CaseNote[]>(STORAGE_KEYS.caseNotes) ?? [];
}

export function setCaseNotes(notes: CaseNote[]): void {
  setItem(STORAGE_KEYS.caseNotes, notes);
}

function getBuildTimeLlmKey(): string | null {
  const fromEnv = import.meta.env.PUBLIC_OPENROUTER_API_KEY;
  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }
  return null;
}

export function getLlmApiKey(): string | null {
  if (isBrowser()) {
    const fromStorage =
      window.localStorage.getItem(STORAGE_KEYS.llmApiKey) ??
      window.localStorage.getItem(STORAGE_KEYS.groqApiKey);
    if (fromStorage && fromStorage.trim().length > 0) {
      return fromStorage.trim();
    }
  }
  return getBuildTimeLlmKey();
}

export function setLlmApiKey(key: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEYS.llmApiKey, key.trim());
}

export function clearLlmApiKey(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEYS.llmApiKey);
  window.localStorage.removeItem(STORAGE_KEYS.groqApiKey);
}

/** @deprecated Используй getLlmApiKey / setLlmApiKey / clearLlmApiKey */
export const getGroqApiKey = getLlmApiKey;
/** @deprecated */
export const setGroqApiKey = setLlmApiKey;
/** @deprecated */
export const clearGroqApiKey = clearLlmApiKey;

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  preferredModel: 'meta-llama/llama-3.3-70b-instruct:free',
};

export function getSettings(): AppSettings {
  return getItem<AppSettings>(STORAGE_KEYS.settings) ?? { ...DEFAULT_SETTINGS };
}

export function setSettings(settings: AppSettings): void {
  setItem(STORAGE_KEYS.settings, settings);
}
