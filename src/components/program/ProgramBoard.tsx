import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CURRICULUM_LEVELS,
  CURRICULUM_MODULES,
  PLATFORM,
  getRecommendedQuest,
  totalWeight,
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
  const [openModuleId, setOpenModuleId] = useState<string | null>(CURRICULUM_LEVELS[0]?.id ?? null);

  useEffect(() => {
    setCompleted(getCurriculumProgress().completedQuestIds);
  }, []);

  const doneWeight = useMemo(() => {
    return CURRICULUM_LEVELS.reduce((sum, level) => {
      const allDone = level.quests.every((q) => completed.includes(q.id));
      return allDone ? sum + level.weight : sum;
    }, 0);
  }, [completed]);

  const recommended = useMemo(() => getRecommendedQuest(completed), [completed]);

  function markPractice(quest: CurriculumQuest, done: boolean) {
    const next = toggleCurriculumQuest(quest.id, done);
    setCompleted(next.completedQuestIds);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge className="border border-primary/40 bg-transparent text-primary uppercase tracking-wider">
          school_smart_analyst · программа
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Модули профессионального роста</h1>
        <p className="max-w-2xl text-muted-foreground">{PLATFORM.tagline}</p>
        <p className="max-w-2xl text-sm text-muted-foreground">{PLATFORM.goal}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Badge variant="secondary">
            Прогресс {doneWeight} / {totalWeight()}
          </Badge>
          <Badge variant="secondary">
            Практик {completed.length} / {CURRICULUM_LEVELS.reduce((n, l) => n + l.quests.length, 0)}
          </Badge>
          <Badge className="border-0 bg-accent/20 text-accent">ИИ — младший инженер</Badge>
        </div>
      </div>

      <Card className="border-primary/40 bg-card/80">
        <CardHeader>
          <Badge className="w-fit bg-primary text-primary-foreground">Практика на сегодня</Badge>
          <CardTitle className="text-lg">
            Модуль {recommended.level.number}. {recommended.quest.title}
          </CardTitle>
          <CardDescription>{recommended.quest.do}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {recommended.quest.href ? (
            <Button asChild className="font-semibold">
              <a href={withBase(baseUrl, recommended.quest.href)}>Открыть практику</a>
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            onClick={() => markPractice(recommended.quest, true)}
            disabled={completed.includes(recommended.quest.id)}
          >
            Отметить выполненной
          </Button>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Карта платформы</h2>
        <p className="text-sm text-muted-foreground">
          Разделы продукта. Программа ниже связывает их в модули роста.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CURRICULUM_MODULES.map((m) => (
            <a
              key={m.id}
              href={withBase(baseUrl, m.href)}
              className="block rounded-lg border border-border bg-muted/30 p-4 transition hover:border-primary"
            >
              <p className="text-xs uppercase tracking-wide text-primary">Раздел {m.order}</p>
              <p className="mt-1 font-semibold">{m.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.blurb}</p>
              <p className="mt-2 text-xs text-accent">{m.aiPartnership}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Модули</h2>
        <div className="divide-y divide-border rounded-xl border border-border bg-card/60">
          {CURRICULUM_LEVELS.map((level) => {
            const doneCount = level.quests.filter((q) => completed.includes(q.id)).length;
            const open = openModuleId === level.id;
            return (
              <div key={level.id} className="px-4">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 py-4 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenModuleId(open ? null : level.id)}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">Модуль {level.number}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {doneCount}/{level.quests.length}
                      </span>
                    </div>
                    <p className="font-medium">{level.title}</p>
                    <p className="text-sm text-muted-foreground">{level.subtitle}</p>
                  </div>
                  <span
                    className={`mt-1 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
                    aria-hidden
                  >
                    ▾
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-3 pb-4">
                      <p className="text-sm text-muted-foreground">Итог модуля: {level.outcome}</p>
                      {level.quests.map((quest) => {
                        const isDone = completed.includes(quest.id);
                        return (
                          <div
                            key={quest.id}
                            className="space-y-2 rounded-lg border border-border/80 bg-muted/20 p-3"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="secondary">{KIND_LABEL[quest.kind]}</Badge>
                              <span className="text-xs text-muted-foreground">
                                ~{quest.estimatedMinutes} мин
                              </span>
                              {isDone ? (
                                <Badge className="border-0 bg-primary/20 text-primary">Сделано</Badge>
                              ) : null}
                            </div>
                            <p className="font-medium">{quest.title}</p>
                            <p className="text-sm text-muted-foreground">{quest.do}</p>
                            <p className="text-xs text-accent">ИИ-наставник: {quest.mentorRole}</p>
                            <p className="text-xs text-muted-foreground">Готово, когда: {quest.doneWhen}</p>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {quest.href ? (
                                <Button
                                  asChild
                                  size="sm"
                                  variant="outline"
                                  className="border-primary text-primary"
                                >
                                  <a href={withBase(baseUrl, quest.href)}>Перейти</a>
                                </Button>
                              ) : null}
                              <Button
                                type="button"
                                size="sm"
                                variant={isDone ? 'secondary' : 'default'}
                                onClick={() => markPractice(quest, !isDone)}
                              >
                                {isDone ? 'Снять отметку' : 'Закрыть практику'}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
