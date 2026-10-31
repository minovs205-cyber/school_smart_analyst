/**
 * @deprecated Используй `@/lib/llm` (OpenRouter).
 * Оставлен как тонкий реэкспорт для совместимости со старыми импортами.
 */
export {
  chatCompletion,
  hasLlmApiKey as hasGroqApiKey,
  LlmError as GroqError,
  DEFAULT_LLM_MODEL as DEFAULT_GROQ_MODEL,
  OPENROUTER_BASE_URL as GROQ_BASE_URL,
  type ChatMessage as GroqChatMessage,
  type ChatOptions as GroqChatOptions,
} from '@/lib/llm';
