import { useEffect, useMemo, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { createDefaultSkills, rankSkillsToTrain, SKILL_CATALOG } from '@/lib/skills-catalog';
import { getSkills, setSkills } from '@/lib/storage';
import type { SkillScore } from '@/lib/types';

function clampScore(n: number): number {
  if (Number.isNaN(n)) return 1;
  return Math.min(10, Math.max(1, Math.round(n)));
}

export function SkillsBoard() {
  const [skills, setLocalSkills] = useState<SkillScore[]>([]);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const stored = getSkills();
    setLocalSkills(stored.length > 0 ? stored : createDefaultSkills());
  }, []);

  const chartData = useMemo(
    () =>
      skills.map((s) => ({
        skill: s.name.length > 22 ? `${s.name.slice(0, 20)}…` : s.name,
        fullName: s.name,
        уровень: s.level,
        устойчивость: s.aiResistance,
      })),
    [skills],
  );

  const recommendations = useMemo(() => rankSkillsToTrain(skills).slice(0, 3), [skills]);

  function updateSkill(id: string, patch: Partial<Pick<SkillScore, 'level' | 'aiResistance'>>) {
    setLocalSkills((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...patch,
              level: patch.level !== undefined ? clampScore(patch.level) : s.level,
              aiResistance:
                patch.aiResistance !== undefined ? clampScore(patch.aiResistance) : s.aiResistance,
              updatedAt: new Date().toISOString(),
            }
          : s,
      ),
    );
  }

  function handleSave() {
    setSkills(skills);
    setSavedAt(new Date().toLocaleString('ru-RU'));
  }

  function handleReset() {
    const next = createDefaultSkills();
    setLocalSkills(next);
    setSkills(next);
    setSavedAt(new Date().toLocaleString('ru-RU'));
  }

  if (skills.length === 0) {
    return <p className="text-muted-foreground">Загрузка карты навыков…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Badge className="border border-primary/40 bg-transparent text-primary uppercase tracking-wider">
          Модуль · Карта навыков
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Карта навыков</h1>
        <p className="max-w-2xl text-muted-foreground">
          Оцени уровень (1–10) и устойчивость к ИИ (1–10: выше — сложнее заменить). Сохрани — и
          смотри, что качать первым: высокий «вес ИИ» при низком уровне.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card/80">
          <CardHeader>
            <CardTitle>Радар</CardTitle>
            <CardDescription>Зелёный — твой уровень, фиолетовый — устойчивость к ИИ</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#30363d" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#8b949e', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#8b949e', fontSize: 10 }} />
                <Radar
                  name="Уровень"
                  dataKey="уровень"
                  stroke="#cdf567"
                  fill="#cdf567"
                  fillOpacity={0.35}
                />
                <Radar
                  name="Устойчивость к ИИ"
                  dataKey="устойчивость"
                  stroke="#c9b7ec"
                  fill="#c9b7ec"
                  fillOpacity={0.2}
                />
                <Tooltip
                  contentStyle={{ background: '#161b22', border: '1px solid #30363d' }}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as { fullName?: string } | undefined;
                    return row?.fullName ?? '';
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/80">
          <CardHeader>
            <CardTitle>Качать в первую очередь</CardTitle>
            <CardDescription>
              Приоритет = устойчивость к ИИ × (насколько ты ещё слаб в навыке)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((s, i) => (
              <div
                key={s.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Уровень {s.level}/10 · устойчивость к ИИ {s.aiResistance}/10
                  </p>
                  <p className="mt-1 text-xs text-accent">
                    {SKILL_CATALOG.find((t) => t.id === s.id)?.hint}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/80">
        <CardHeader>
          <CardTitle>Оценки</CardTitle>
          <CardDescription>Двигай ползунки и нажми «Сохранить»</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {skills.map((s) => (
            <div key={s.id} className="space-y-2 border-b border-border/60 pb-4 last:border-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <Label className="text-sm font-medium">{s.name}</Label>
                <Badge variant="secondary">{s.category}</Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-xs text-muted-foreground">
                  Уровень: <span className="text-primary">{s.level}</span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={s.level}
                    className="w-full accent-[#cdf567]"
                    onChange={(e) => updateSkill(s.id, { level: Number(e.target.value) })}
                  />
                </label>
                <label className="space-y-1 text-xs text-muted-foreground">
                  Устойчивость к ИИ: <span className="text-accent">{s.aiResistance}</span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={s.aiResistance}
                    className="w-full accent-[#c9b7ec]"
                    onChange={(e) => updateSkill(s.id, { aiResistance: Number(e.target.value) })}
                  />
                </label>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="button" onClick={handleSave} className="font-semibold">
              Сохранить
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Сбросить к каталогу
            </Button>
            {savedAt ? (
              <p className="self-center text-xs text-muted-foreground">Сохранено: {savedAt}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
