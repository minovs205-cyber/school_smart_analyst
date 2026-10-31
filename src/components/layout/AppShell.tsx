import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NavLink } from '@/components/layout/NavLink';
import { Separator } from '@/components/ui/separator';
import { withBase } from '@/lib/paths';

export interface NavItem {
  href: string;
  label: string;
}

interface AppShellProps {
  baseUrl: string;
  currentPath: string;
  items: NavItem[];
  title?: string;
}

export function AppShell({
  baseUrl,
  currentPath,
  items,
  title = 'AI-Resistance',
}: AppShellProps) {
  const [open, setOpen] = useState(false);
  const resolvedItems = items.map((item) => ({
    ...item,
    href: withBase(baseUrl, item.href),
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <a href={withBase(baseUrl, '/')} className="flex shrink-0 items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
            AR
          </span>
          <span className="text-sm font-bold tracking-wide uppercase">{title}</span>
        </a>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
          {resolvedItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} currentPath={currentPath} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-3">
          <Button asChild size="sm" className="hidden sm:inline-flex font-semibold uppercase tracking-wide">
            <a href={withBase(baseUrl, '/scorecard')}>Начать</a>
          </Button>

          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Открыть меню">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 border-border bg-card">
                <SheetHeader>
                  <SheetTitle className="uppercase tracking-wide">{title}</SheetTitle>
                </SheetHeader>
                <Separator className="my-3" />
                <nav className="flex flex-col gap-1" aria-label="Мобильная навигация">
                  {resolvedItems.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      currentPath={currentPath}
                      onNavigate={() => setOpen(false)}
                    />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
