import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  label: string;
  currentPath: string;
  onNavigate?: () => void;
}

function normalizePath(path: string): string {
  if (!path) return '/';
  const withoutTrailing = path.replace(/\/+$/, '') || '/';
  return withoutTrailing;
}

export function NavLink({ href, label, currentPath, onNavigate }: NavLinkProps) {
  const active = normalizePath(currentPath) === normalizePath(href);

  return (
    <a
      href={href}
      onClick={onNavigate}
      className={cn(
        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </a>
  );
}
