import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ModuleStubProps {
  title: string;
  step: string;
  description: string;
  bullets: string[];
  settingsHref: string;
}

export function ModuleStub({ title, step, description, bullets, settingsHref }: ModuleStubProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="secondary">{step}</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Что будет в модуле</CardTitle>
          <CardDescription>Каркас готов. Полная реализация — на следующем шаге плана.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Button asChild variant="outline">
            <a href={settingsHref}>Настроить OpenRouter API-ключ</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
