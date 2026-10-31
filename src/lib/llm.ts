import { getLlmApiKey, getSettings } from '@/lib/storage';

/** OpenRouter — OpenAI-compatible API с бесплатными моделями. */
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/** Дефолтная бесплатная модель OpenRouter (суффикс :free). */
export const DEFAULT_LLM_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

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

/**
 * Chat Completions через OpenRouter.
 * Ключ берётся из localStorage — только для персонального MVP.
 */
export async function chatCompletion(options: ChatOptions): Promise<string> {
  const apiKey = getLlmApiKey();
  if (!apiKey) {
    throw new LlmError(
      'API-ключ OpenRouter не задан. Откройте Настройки и вставьте ключ с openrouter.ai/keys.',
    );
  }

  const model = options.model ?? getSettings().preferredModel ?? DEFAULT_LLM_MODEL;

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://minovs205-cyber.github.io/school_smart_analyst/',
      'X-Title': 'Антихрупкий аналитик',
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
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new LlmError('Пустой ответ от OpenRouter API');
  }
  return content;
}
