import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CURRICULUM_LEVELS,
  CURRICULUM_MODULES,
  PLATFORM,
  getRecommendedQuest,
  totalXp,
  type CurriculumQuest,
  type QuestKind,
} from '@/data/curriculum';
import { withBase } from '@/lib/paths';
import { getCurriculumProgress, toggleCurriculumQuest } from '@/lib/storage';

const KIND_LABEL: Record<QuestKind, string> = {
  theory: 'Теория',
  practice: 'Практика',
  case: 'Кейс',
  mentor: 'ИИ-наставник',
  reflection: 'Рефлексия',
  capstone: 'Capstone',
};

interface ProgramBoardProps {
  baseUrl: string;
}

export function ProgramBoard({ baseUrl }: ProgramBoardProps) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted(getCurriculumProgress().completedQuestIds);
  }, []);

  const earnedXp = useMemo(() => {
    return CURRICULUM_LEVELS.reduce((sum, level) => {
      const allDone = level.quests.every((q) => completed.includes(q.id));
      return allDone ? sum + level.xp : sum;
    }, 0);
  }, [completed]);

  const recommended = useMemo(() => getRecommendedQuest(completed), [completed]);

  function markQuest(quest: CurriculumQuest, done: boolean) {
    const next = toggleCurriculumQuest(quest.id, done);
    setCompleted(next.completedQuestIds);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge className="border border-primary/40 bg-transparent text-primary uppercase tracking-wider">
          school_smart_analyst · программа
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Путь junior → middle+</h1>
        <p className="max-w-2xl text-muted-foreground">{PLATFORM.tagline}</p>
        <p className="max-w-2xl text-sm text-muted-foreground">{PLATFORM.goal}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Badge variant="secondary">
            XP {earnedXp} / {totalXp()}
          </Badge>
          <Badge variant="secondary">
            Квестов {completed.length} / {CURRICULUM_LEVELS.reduce((n, l) => n + l.quests.length, 0)}
          </Badge>
          <Badge className="border-0 bg-accent/20 text-accent">Наставник — ИИ</Badge>
        </div>
      </div>

      <Card className="border-primary/40 bg-card/80">
        <CardHeader>
          <Badge className="w-fit bg-primary text-primary-foreground">Квест на сегодня</Badge>
          <CardTitle className="text-lg">
            Уровень {recommended.level.number}. {recommended.quest.title}
          </CardTitle>
          <CardDescription>{recommended.quest.do}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {recommended.quest.href ? (
            <Button asChild className="font-semibold">
              <a href={withBase(baseUrl, recommended.quest.href)}>Открыть квест</a>
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            onClick={() => markQuest(recommended.quest, true)}
            disabled={completed.includes(recommended.quest.id)}
          >
            Отметить выполненным
          </Button>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Модули платформы</h2>
        <p className="text-sm text-muted-foreground">
          Как треки JavaRush: каждый модуль — отдельный зал, программа связывает их в уровни.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CURRICULUM_MODULES.map((m) => (
            <a
              key={m.id}
              href={withBase(baseUrl, m.href)}
              className="block rounded-lg border border-border bg-muted/30 p-4 transition hover:border-primary"
            >
              <p className="text-xs uppercase tracking-wide text-primary">Модуль {m.order}</p>
              <p className="mt-1 font-semibold">{m.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.blurb}</p>
              <p className="mt-2 text-xs text-accent">{m.aiPartnership}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Уровни программы</h2>
        {CURRICULUM_LEVELS.map((level) => {
          const doneCount = level.quests.filter((q) => completed.includes(q.id)).length;
          const levelDone = doneCount === level.quests.length;
          return (
            <Card key={level.id} className="border-border bg-card/80">
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={levelDone ? 'bg-primary text-primary-foreground' : ''} variant={levelDone ? 'default' : 'secondary'}>
                    Уровень {level.number}
                  </Badge>
                  <Badge variant="outline">+{level.xp} XP</Badge>
                  <span className="text-xs text-muted-foreground">
                    {doneCount}/{level.quests.length} квестов
                  </span>
                </div>
                <CardTitle>{level.title}</CardTitle>
                <CardDescription>
                  {level.subtitle}. Итог: {level.outcome}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {level.quests.map((quest) => {
                  const isDone = completed.includes(quest.id);
                  return (
                    <div
                      key={quest.id}
                      className="space-y-2 rounded-lg border border-border/80 bg-muted/20 p-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{KIND_LABEL[quest.kind]}</Badge>
                        <span className="text-xs text-muted-foreground">~{quest.estimatedMinutes} мин</span>
                        {isDone ? (
                          <Badge className="border-0 bg-primary/20 text-primary">Сделано</Badge>
                        ) : null}
                      </div>
                      <p className="font-medium">{quest.title}</p>
                      <p className="text-sm text-muted-foreground">{quest.do}</p>
                      <p className="text-xs text-accent">
                        ИИ-наставник: {quest.mentorRole}
                      </p>
                      <p className="text-xs text-muted-foreground">Готово, когда: {quest.doneWhen}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {quest.href ? (
                          <Button asChild size="sm" variant="outline" className="border-primary text-primary">
                            <a href={withBase(baseUrl, quest.href)}>Перейти</a>
                          </Button>
                        ) : null}
                        <Button
                          type="button"
                          size="sm"
                          variant={isDone ? 'secondary' : 'default'}
                          onClick={() => markQuest(quest, !isDone)}
                        >
                          {isDone ? 'Снять отметку' : 'Закрыть квест'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
