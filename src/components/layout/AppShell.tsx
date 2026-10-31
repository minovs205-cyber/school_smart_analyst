import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NavLink } from '@/components/layout/NavLink';
import { Separator } from '@/components/ui/separator';

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

function joinBase(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/+$/, '') || '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}` || '/';
}

export function AppShell({ baseUrl, currentPath, items, title = 'AI-Resistance Analyst' }: AppShellProps) {
  const [open, setOpen] = useState(false);
  const resolvedItems = items.map((item) => ({
    ...item,
    href: joinBase(baseUrl, item.href),
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <a href={joinBase(baseUrl, '/')} className="shrink-0 text-sm font-semibold tracking-tight">
          {title}
        </a>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Основная навигация">
          {resolvedItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} currentPath={currentPath} />
          ))}
        </nav>

        <div className="ml-auto md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Открыть меню">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{title}</SheetTitle>
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
    </header>
  );
}
