import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { GROWTH_MODULES } from '@/data/growth-modules';
import {
  DIAGNOSTIC_QUESTIONS,
  evaluateDiagnostic,
  type DiagnosticResult,
} from '@/lib/diagnostic';
import { withBase } from '@/lib/paths';
import { getDiagnosticResult, setDiagnosticResult } from '@/lib/storage';

type Phase = 'intro' | 'q1' | 'q2' | 'q3' | 'loading' | 'results';

const PHASE_TO_INDEX: Record<Exclude<Phase, 'intro' | 'loading' | 'results'>, number> = {
  q1: 0,
  q2: 1,
  q3: 2,
};

interface AIDiagnosticWizardProps {
  baseUrl: string;
  /** Сразу открыть мастер (например с ?start=1) */
  autoStart?: boolean;
}

export function AIDiagnosticWizard({ baseUrl, autoStart = false }: AIDiagnosticWizardProps) {
  const [phase, setPhase] = useState<Phase>(autoStart ? 'q1' : 'intro');
  const [answers, setAnswers] = useState<Record<string, string>>({
    q1: '',
    q2: '',
    q3: '',
  });
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  useEffect(() => {
    const stored = getDiagnosticResult();
    if (stored && !autoStart) {
      setResult(stored as DiagnosticResult);
    }
  }, [autoStart]);

  const questionIndex = phase === 'q1' || phase === 'q2' || phase === 'q3' ? PHASE_TO_INDEX[phase] : -1;
  const currentQuestion =
    questionIndex >= 0 ? DIAGNOSTIC_QUESTIONS[questionIndex] : null;

  const recommendedModules = useMemo(() => {
    if (!result) return [];
    return GROWTH_MODULES.filter((m) => result.recommendedModuleIds.includes(m.id));
  }, [result]);

  function setAnswer(qid: string, value: string) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  function goNextFromQuestion() {
    if (!currentQuestion) return;
    const text = (answers[currentQuestion.id] ?? '').trim();
    if (text.length < 8) return;

    if (phase === 'q1') setPhase('q2');
    else if (phase === 'q2') setPhase('q3');
    else if (phase === 'q3') {
      setPhase('loading');
      window.setTimeout(() => {
        const evaluated = evaluateDiagnostic(answers);
        setDiagnosticResult(evaluated);
        setResult(evaluated);
        setPhase('results');
      }, 2400);
    }
  }

  function restart() {
    setAnswers({ q1: '', q2: '', q3: '' });
    setResult(null);
    setPhase('q1');
  }

  if (phase === 'intro') {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge className="border border-primary/40 bg-transparent text-primary uppercase tracking-wider">
            AI-диагностика · ~5 мин
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Первичная оценка компетенций</h1>
          <p className="max-w-2xl text-muted-foreground">
            Три ситуационных вопроса. ИИ-наставник разберёт подход к неопределённости, валидации
            генерации и работе со стейкхолдерами — без ползунков самооценки.
          </p>
        </div>

        {result ? (
          <Card className="border-border bg-card/80">
            <CardHeader>
              <CardTitle className="text-base">Сохранённый профиль</CardTitle>
              <CardDescription>
                От {new Date(result.createdAt).toLocaleString('ru-RU')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button type="button" className="font-semibold" onClick={() => setPhase('results')}>
                Открыть результат
              </Button>
              <Button type="button" variant="outline" onClick={restart}>
                Пройти заново
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <Button type="button" size="lg" className="h-11 px-5 font-semibold" onClick={() => setPhase('q1')}>
          Пройти AI-диагностику (5 мин)
        </Button>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <Card className="border-primary/40 bg-card/80">
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div
            className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
            aria-hidden
          />
          <p className="text-lg font-medium">ИИ анализирует ваш подход…</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Сверяем ответы с маркерами инженерной речи и доменного контекста.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (phase === 'results' && result) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge className="border-0 bg-accent/20 text-accent">Первичная оценка компетенций</Badge>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Ваш профиль</h1>
          <p className="max-w-2xl text-muted-foreground">
            Мок-оценка по ответам (до подключения полного LLM). Используйте как точку старта трека.
          </p>
        </div>

        <div className="grid gap-3">
          {result.skills.map((skill) => (
            <Card key={skill.id} className="border-border bg-card/80">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <CardTitle className="text-base">{skill.name}</CardTitle>
                  <span className="font-mono text-lg font-semibold text-primary">{skill.score}/10</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${skill.score * 10}%` }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{skill.advice}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-primary/40 bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">Рекомендованный трек</CardTitle>
            <CardDescription>Модули под зоны роста из этой оценки</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {recommendedModules.map((m) => (
                <li key={m.id}>
                  <span className="font-medium text-foreground">
                    Модуль {m.number}. {m.title}
                  </span>
                  {' — '}
                  {m.description}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild className="font-semibold">
                <a href={withBase(baseUrl, '/program')}>
                  Построить индивидуальный трек развития на основе этой оценки
                </a>
              </Button>
              <Button type="button" variant="outline" onClick={restart}>
                Пройти заново
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const stepLabel = `Шаг ${questionIndex + 1} из 3`;
  const canNext = (answers[currentQuestion.id] ?? '').trim().length >= 8;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant="secondary">{stepLabel}</Badge>
        <div className="flex gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={
                i <= questionIndex
                  ? 'h-1.5 w-8 rounded-full bg-primary'
                  : 'h-1.5 w-8 rounded-full bg-muted'
              }
            />
          ))}
        </div>
      </div>

      <Card className="border-border bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg leading-snug">ИИ-наставник</CardTitle>
          <CardDescription className="text-base text-foreground/90">
            {currentQuestion.prompt}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            rows={5}
            value={answers[currentQuestion.id] ?? ''}
            onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
            placeholder="1–3 предложения. Опишите подход и пример из практики…"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="font-semibold"
              disabled={!canNext}
              onClick={goNextFromQuestion}
            >
              {phase === 'q3' ? 'Получить оценку' : 'Далее'}
            </Button>
            {phase !== 'q1' ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPhase(phase === 'q3' ? 'q2' : 'q1')}
              >
                Назад
              </Button>
            ) : (
              <Button type="button" variant="ghost" onClick={() => setPhase('intro')}>
                Отмена
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
