import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { clearLlmApiKey, getLlmApiKey, setLlmApiKey } from '@/lib/storage';

function maskKey(key: string): string {
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

export function ApiKeyForm() {
  const [value, setValue] = useState('');
  const [savedMasked, setSavedMasked] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const existing = getLlmApiKey();
    if (existing) {
      setSavedMasked(maskKey(existing));
      // Подтянуть MVP-ключ из build-time env в localStorage, если пользователь ещё ничего не сохранял
      if (!window.localStorage.getItem('llm_api_key') && !window.localStorage.getItem('groq_api_key')) {
        setLlmApiKey(existing);
      }
    }
  }, []);

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setMessage('Вставьте API-ключ OpenRouter.');
      return;
    }
    setLlmApiKey(trimmed);
    setSavedMasked(maskKey(trimmed));
    setValue('');
    setMessage('Ключ сохранён в localStorage этого браузера.');
  }

  function handleClear() {
    clearLlmApiKey();
    setSavedMasked(null);
    setValue('');
    setMessage('Ключ удалён.');
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="llm-api-key">OpenRouter API-ключ</Label>
        <Input
          id="llm-api-key"
          type="password"
          autoComplete="off"
          placeholder="sk-or-v1-…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Ключ хранится только в localStorage. Не коммитьте его в репозиторий и не вставляйте в Issues /
          чаты. На публичном сайте ключ виден в DevTools — при утечке сразу отзовите его на
          openrouter.ai/keys.
        </p>
        {savedMasked ? (
          <p className="text-xs text-muted-foreground">
            Сейчас сохранён: <span className="font-mono">{savedMasked}</span>
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Ключ ещё не задан.</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit">Сохранить</Button>
        <Button type="button" variant="outline" onClick={handleClear} disabled={!savedMasked}>
          Удалить
        </Button>
      </div>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </form>
  );
}
