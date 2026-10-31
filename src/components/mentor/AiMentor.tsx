import { useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { chatCompletion, hasLlmApiKey, LlmError, type ChatMessage } from '@/lib/llm';

interface AiMentorProps {
  caseTitle: string;
  caseContext: string;
  settingsHref: string;
}

const SYSTEM_PROMPT = `Ты — жёсткий, но справедливый наставник системного аналитика в российском банке.
Говори по-русски, коротко, без воды и без похвалы ради похвалы.
Задавай неудобные уточняющие вопросы: стейкхолдеры, риски, критерии приёмки, регуляторика, legacy.
Не пиши готовое ТЗ целиком. Помогай думать. За один ответ — 2–4 вопроса или один разбор + вопрос.
Если ученик уходит в общие слова — дави конкретикой.`;

export function AiMentor({ caseTitle, caseContext, settingsHref }: AiMentorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const keyReady = hasLlmApiKey();

  async function askMentor(userText: string) {
    setLoading(true);
    setError(null);
    const nextUser: ChatMessage = { role: 'user', content: userText };
    const history = [...messages, nextUser];
    setMessages(history);

    try {
      const reply = await chatCompletion({
        temperature: 0.6,
        maxTokens: 900,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Кейс: ${caseTitle}\n\nКонтекст:\n${caseContext}`,
          },
          ...history,
        ],
      });
      setMessages([...history, { role: 'assistant', content: reply }]);
    } catch (e) {
      const msg =
        e instanceof LlmError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Неизвестная ошибка наставника';
      setError(msg);
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  }

  function handleStart() {
    void askMentor(
      'Я только открыл кейс. Задай стартовые неудобные вопросы, с чего мне начать разбор как системному аналитику.',
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    void askMentor(text);
  }

  return (
    <Card className="border-border bg-card/80">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>ИИ-наставник</CardTitle>
          <Badge className="border-0 bg-accent/20 text-accent">OpenRouter</Badge>
        </div>
        <CardDescription>
          Раньше наставник «не работал», потому что UI его не вызывал — был только каркас. Сейчас идёт
          реальный запрос к модели.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!keyReady ? (
          <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-4 text-sm">
            <p className="text-muted-foreground">
              Нет API-ключа. Добавь ключ OpenRouter в настройках (или через секрет сборки), затем
              вернись сюда.
            </p>
            <Button asChild variant="outline" className="border-primary text-primary">
              <a href={settingsHref}>Открыть настройки</a>
            </Button>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <Button type="button" onClick={handleStart} disabled={loading} className="font-semibold">
                {loading ? 'Думаю…' : 'Начать разбор с наставником'}
              </Button>
            ) : null}

            <div className="max-h-96 space-y-3 overflow-y-auto rounded-lg border border-border p-3">
              {messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={
                    m.role === 'assistant'
                      ? 'rounded-md bg-muted/50 p-3 text-sm'
                      : 'rounded-md border border-primary/30 bg-primary/5 p-3 text-sm'
                  }
                >
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {m.role === 'assistant' ? 'Наставник' : 'Ты'}
                  </p>
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                </div>
              ))}
              {loading ? <p className="text-xs text-muted-foreground">Наставник печатает…</p> : null}
            </div>

            {error ? (
              <p className="text-sm text-accent">
                {error}{' '}
                <a className="underline" href={settingsHref}>
                  Проверь ключ
                </a>
              </p>
            ) : null}

            {messages.length > 0 ? (
              <form onSubmit={handleSubmit} className="space-y-2">
                <Textarea
                  rows={3}
                  value={input}
                  disabled={loading}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ответь на вопрос наставника или опиши свой ход мысли…"
                />
                <Button type="submit" disabled={loading || !input.trim()} className="font-semibold">
                  Отправить
                </Button>
              </form>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
