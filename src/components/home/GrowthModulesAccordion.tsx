import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GROWTH_MODULES } from '@/data/growth-modules';
import { withBase } from '@/lib/paths';

interface GrowthModulesAccordionProps {
  baseUrl: string;
}

export function GrowthModulesAccordion({ baseUrl }: GrowthModulesAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(GROWTH_MODULES[0]?.id ?? null);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Модули профессионального роста
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Антихрупкость: хаос требований и возможности ИИ усиливают инженера, а не заменяют его.
        </p>
      </div>

      <div className="divide-y divide-border rounded-xl border border-border bg-card/60">
        {GROWTH_MODULES.map((mod) => {
          const open = openId === mod.id;
          return (
            <div key={mod.id} className="px-4">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 py-4 text-left"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : mod.id)}
              >
                <span className="font-medium">
                  <span className="text-primary">Модуль {mod.number}.</span> {mod.title}
                </span>
                <span
                  className={`text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
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
                  <div className="space-y-3 pb-4 text-sm text-muted-foreground">
                    <p>{mod.description}</p>
                    <Button asChild size="sm" variant="outline" className="border-primary text-primary">
                      <a href={withBase(baseUrl, mod.href)}>Перейти к практике</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button asChild variant="link" className="h-auto px-0 text-primary">
        <a href={withBase(baseUrl, '/program')}>Открыть программу модулей</a>
      </Button>
    </div>
  );
}
