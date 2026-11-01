import { useEffect, useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getJournalEntries, setJournalEntries } from '@/lib/storage';
import type { JournalEntry } from '@/lib/types';

function weekStartIso(d = new Date()): string {
  const day = new Date(d);
  const diff = (day.getDay() + 6) % 7;
  day.setDate(day.getDate() - diff);
  day.setHours(0, 0, 0, 0);
  return day.toISOString().slice(0, 10);
}

function formatWeek(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function JournalBoard() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [learned, setLearned] = useState('');
  const [mistakes, setMistakes] = useState('');
  const [aiCouldHelp, setAiCouldHelp] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setEntries(getJournalEntries());
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!learned.trim() && !mistakes.trim() && !aiCouldHelp.trim()) {
      setMessage('Заполни хотя бы одно поле.');
      return;
    }

    const now = new Date().toISOString();
    const weekOf = weekStartIso();
    const existingIdx = entries.findIndex((e) => e.weekOf === weekOf);

    let next: JournalEntry[];
    if (existingIdx >= 0) {
      const updated: JournalEntry = {
        ...entries[existingIdx],
        learned: learned.trim(),
        mistakes: mistakes.trim(),
        aiCouldHelp: aiCouldHelp.trim(),
        updatedAt: now,
      };
      next = [...entries];
      next[existingIdx] = updated;
      setMessage('Запись этой недели обновлена.');
    } else {
      const created: JournalEntry = {
        id: crypto.randomUUID(),
        weekOf,
        learned: learned.trim(),
        mistakes: mistakes.trim(),
        aiCouldHelp: aiCouldHelp.trim(),
        createdAt: now,
        updatedAt: now,
      };
      next = [created, ...entries];
      setMessage('Неделя сохранена.');
    }

    setEntries(next);
    setJournalEntries(next);
    setLearned('');
    setMistakes('');
    setAiCouldHelp('');
  }

  const sorted = [...entries].sort((a, b) => b.weekOf.localeCompare(a.weekOf));

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Badge className="border border-primary/40 bg-transparent text-primary uppercase tracking-wider">
          Модуль · Журнал
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Журнал инсайтов</h1>
        <p className="max-w-2xl text-muted-foreground">
          Три поля — без эссе. Фиксируйте решения, ошибки суждения и роль ИИ. Разбор паттернов
          подключим позже; сначала инженерная привычка.
        </p>
      </div>

      <Card className="border-border bg-card/80">
        <CardHeader>
          <CardTitle>Неделя с {formatWeek(weekStartIso())}</CardTitle>
          <CardDescription>Повторное сохранение обновит запись этой недели</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="learned">Что узнал</Label>
              <Textarea
                id="learned"
                rows={3}
                value={learned}
                onChange={(e) => setLearned(e.target.value)}
                placeholder="Новый паттерн, доменный факт, приём в переговорах…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mistakes">Где ошибся</Label>
              <Textarea
                id="mistakes"
                rows={3}
                value={mistakes}
                onChange={(e) => setMistakes(e.target.value)}
                placeholder="Что упустил в требованиях, с кем не дожал согласование…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai">Как ИИ мог помочь — или помешал</Label>
              <Textarea
                id="ai"
                rows={3}
                value={aiCouldHelp}
                onChange={(e) => setAiCouldHelp(e.target.value)}
                placeholder="Черновик US, поиск дыр, галлюцинации в схеме…"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" className="font-semibold">
                Сохранить неделю
              </Button>
              {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Прошлые недели</h2>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">Пока пусто — сделай первую запись.</p>
        ) : (
          sorted.map((e) => (
            <Card key={e.id} className="border-border bg-card/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">С {formatWeek(e.weekOf)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {e.learned ? (
                  <p>
                    <span className="font-medium text-foreground">Узнал: </span>
                    {e.learned}
                  </p>
                ) : null}
                {e.mistakes ? (
                  <p>
                    <span className="font-medium text-foreground">Ошибки: </span>
                    {e.mistakes}
                  </p>
                ) : null}
                {e.aiCouldHelp ? (
                  <p>
                    <span className="font-medium text-foreground">ИИ: </span>
                    {e.aiCouldHelp}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
