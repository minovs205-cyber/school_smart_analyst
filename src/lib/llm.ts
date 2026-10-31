import { getLlmApiKey, getSettings } from '@/lib/storage';

/** OpenRouter — OpenAI-compatible API с бесплатными моделями. */
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * Роутер бесплатных моделей OpenRouter (подбирает доступный :free endpoint).
 * Конкретные slug вроде llama-3.3:free часто снимают с free-пула.
 */
export const DEFAULT_LLM_MODEL = 'openrouter/free';

/** Устаревшие free-slug — автоматически заменяем на DEFAULT_LLM_MODEL. */
const OBSOLETE_FREE_MODELS = new Set([
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-3-27b-it:free',
  'openai/gpt-oss-20b:free',
  'qwen/qwen3-14b:free',
  'deepseek/deepseek-r1-distill-llama-70b:free',
]);

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class LlmError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'LlmError';
  }
}

export function hasLlmApiKey(): boolean {
  const key = getLlmApiKey();
  return Boolean(key && key.length > 0);
}

export function resolveLlmModel(preferred?: string | null): string {
  if (!preferred || OBSOLETE_FREE_MODELS.has(preferred)) {
    return DEFAULT_LLM_MODEL;
  }
  return preferred;
}

function extractAssistantText(message: {
  content?: string | null;
  reasoning?: string | null;
}): string | null {
  if (typeof message.content === 'string' && message.content.trim().length > 0) {
    return message.content.trim();
  }
  // Некоторые free-модели тратят budget на reasoning и оставляют content пустым
  if (typeof message.reasoning === 'string' && message.reasoning.trim().length > 0) {
    const text = message.reasoning.trim();
    const quoted = [...text.matchAll(/[«"]([^»"]{20,})[»"]/g)].map((m) => m[1]);
    if (quoted.length > 0) {
      return quoted.slice(0, 4).map((q, i) => `${i + 1}. ${q}`).join('\n');
    }
    return text.slice(0, 1200);
  }
  return null;
}

/**
 * Chat Completions через OpenRouter.
 * Ключ берётся из localStorage / PUBLIC_OPENROUTER_API_KEY — только для персонального MVP.
 */
export async function chatCompletion(options: ChatOptions): Promise<string> {
  const apiKey = getLlmApiKey();
  if (!apiKey) {
    throw new LlmError(
      'API-ключ OpenRouter не задан. Откройте Настройки и вставьте ключ с openrouter.ai/keys.',
    );
  }

  const model = resolveLlmModel(options.model ?? getSettings().preferredModel);

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://minovs205-cyber.github.io/school_smart_analyst/',
      // Fetch headers must be Latin-1; Cyrillic here breaks the request in browsers.
      'X-Title': 'Antihfragile Analyst',
    },
    body: JSON.stringify({
      model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
    }),
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      if (body.error?.message) detail = body.error.message;
    } catch {
      // ignore parse errors
    }
    throw new LlmError(`OpenRouter API: ${detail}`, response.status);
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: { content?: string | null; reasoning?: string | null };
    }>;
  };
  const content = data.choices?.[0]?.message
    ? extractAssistantText(data.choices[0].message)
    : null;
  if (!content) {
    throw new LlmError(
      'Пустой ответ от OpenRouter API. Попробуй ещё раз или смени модель в настройках.',
    );
  }
  return content;
}
