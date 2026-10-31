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
      <div className="space-y-3">
        <Badge className="border border-primary/40 bg-transparent text-primary uppercase tracking-wider">
          {step}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
      </div>

      <Card className="border-border bg-card/80">
        <CardHeader>
          <CardTitle>Что тебя ждёт</CardTitle>
          <CardDescription>
            Каркас модуля уже на месте. Полная прокачка подключается на следующем шаге — а пока
            настрой AI-наставника.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Button
            asChild
            variant="outline"
            className="border-primary font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <a href={settingsHref}>Настроить AI-наставника</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
