import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  label: string;
  currentPath: string;
  onNavigate?: () => void;
}

function normalizePath(path: string): string {
  if (!path) return '/';
  return path.replace(/\/+$/, '') || '/';
}

export function NavLink({ href, label, currentPath, onNavigate }: NavLinkProps) {
  const active = normalizePath(currentPath) === normalizePath(href);

  return (
    <a
      href={href}
      onClick={onNavigate}
      className={cn(
        'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
      )}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </a>
  );
}
