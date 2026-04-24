import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Seo } from '@/components/ui/seo';
import { breadcrumbList } from '@/lib/schema';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  name: string;
  /** URL path, e.g. '/stay/safari-tent'. */
  path: string;
}

interface BreadcrumbProps {
  /** Explicit items list. Provide this OR pathname, not both. Home should be first item. */
  items?: BreadcrumbItem[];
  /**
   * URL pathname to auto-derive items from (e.g. '/stay/safari-tent').
   * Route group segments like (marketing) are filtered defensively — Next.js
   * already strips them from the actual pathname, but the guard is belt-and-suspenders.
   */
  pathname?: string;
  className?: string;
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function deriveItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname
    .split('/')
    .filter((s) => s.length > 0 && !/^\(.+\)$/.test(s));

  const items: BreadcrumbItem[] = [{ name: 'Home', path: '/' }];
  let cumPath = '';
  for (const segment of segments) {
    cumPath += `/${segment}`;
    items.push({ name: titleCase(segment), path: cumPath });
  }
  return items;
}

/**
 * Breadcrumb navigation with BreadcrumbList JSON-LD auto-emission.
 * No-op on root pages: returns null and emits no JSON-LD when items.length <= 1 —
 * a single-item breadcrumb has no ancestors and provides no navigation value.
 * Only renders when there is at least one ancestor to navigate to.
 *
 * @example
 * // Auto-derive from pathname
 * <Breadcrumb pathname="/stay/safari-tent" />
 * // → Home > Stay > Safari Tent  (with <Link>s + BreadcrumbList JSON-LD)
 *
 * // Explicit items with curated display names
 * <Breadcrumb items={[
 *   { name: 'Home', path: '/' },
 *   { name: 'Stay', path: '/stay' },
 *   { name: 'Safari Tent', path: '/stay/safari-tent' },
 * ]} />
 */
export function Breadcrumb({ items, pathname, className }: BreadcrumbProps) {
  const resolvedItems: BreadcrumbItem[] = items ?? (pathname ? deriveItems(pathname) : []);

  // No-op: single-item breadcrumb (root page or empty) has no navigational value
  if (resolvedItems.length <= 1) return null;

  return (
    <>
      <Seo schemas={[breadcrumbList({ items: resolvedItems })]} />
      <nav aria-label="Breadcrumb" className={cn(className)}>
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {resolvedItems.map((item, index) => {
            const isLast = index === resolvedItems.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight
                    className="size-3.5 shrink-0 text-earth-brown"
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span aria-current="page" className="font-medium text-charcoal">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="transition-colors duration-200 hover:text-earth-brown"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export default Breadcrumb;
