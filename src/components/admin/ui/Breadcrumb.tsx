'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
}

function segmentsToItems(pathname: string): BreadcrumbItem[] {
  const parts = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];
  let cumulative = '';
  for (const part of parts) {
    cumulative += `/${part}`;
    // Skip UUIDs and numeric IDs in breadcrumb labels
    if (/^[0-9a-f-]{8,}$/.test(part)) continue;
    items.push({ label: capitalize(part), href: cumulative });
  }
  return items;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const pathname = usePathname();
  const crumbs = items ?? segmentsToItems(pathname);

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1', className)}>
      <ol className="flex items-center gap-1 font-body text-xs">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="w-3 h-3 text-charcoal/30 flex-shrink-0" aria-hidden="true" />
              )}
              {isLast ? (
                <span className="text-charcoal/60 font-medium" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-charcoal/40 hover:text-gold-accent transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
