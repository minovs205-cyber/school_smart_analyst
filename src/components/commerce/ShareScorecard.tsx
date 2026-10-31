import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { rankSkillsToTrain } from '@/lib/skills-catalog';
import { absoluteUrl, BRAND_RU, SITE_NAME } from '@/lib/site';
import { getSkills } from '@/lib/storage';
import type { SkillScore } from '@/lib/types';

interface ShareScorecardProps {
  baseUrl: string;
}

function buildShareText(skills: SkillScore[], pageUrl: string): string {
  const top = rankSkillsToTrain(skills).slice(0, 3);
  const lines = top.map(
    (s, i) => `${i + 1}. ${s.name} — ур. ${s.level}/10, устойчивость к ИИ ${s.aiResistance}/10`,
  );
  return [
    `Моя карта AI-resistance · ${BRAND_RU} (${SITE_NAME})`,
    'Качаю в первую очередь:',
    ...lines,
    pageUrl,
  ].join('\n');
}

export function ShareScorecard({ baseUrl }: ShareScorecardProps) {
  const [message, setMessage] = useState<string | null>(null);
  const pageUrl = useMemo(() => absoluteUrl(baseUrl, '/scorecard'), [baseUrl]);

  async function handleShare() {
    const skills = getSkills();
    if (skills.length === 0) {
      setMessage('Сначала сохрани карту навыков.');
      return;
    }
    const text = buildShareText(skills, pageUrl);
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: BRAND_RU, text, url: pageUrl });
        setMessage('Спасибо за шаринг.');
        return;
      }
      await navigator.clipboard.writeText(text);
      setMessage('Текст скопирован — вставь в TG / LinkedIn / Habr.');
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setMessage('Текст скопирован в буфер.');
      } catch {
        setMessage('Не удалось поделиться — скопируй URL вручную.');
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" className="border-accent text-accent" onClick={() => void handleShare()}>
        Поделиться картой
      </Button>
      {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
    </div>
  );
}
