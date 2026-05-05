'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/souvenirs/categories';

interface Props {
  activeCategory: string;
  query: string;
}

export function FilterBar({ activeCategory, query }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const update = useCallback(
    (cat: string, q: string) => {
      const params = new URLSearchParams();
      if (cat && cat !== 'all') params.set('category', cat);
      if (q.trim()) params.set('q', q.trim());
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [router, pathname],
  );

  const hasFilters = (activeCategory && activeCategory !== 'all') || query;

  return (
    <div className="flex flex-col gap-3">
      {/* Search input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
        <input
          type="search"
          aria-label="Search products"
          placeholder="Search products…"
          defaultValue={query}
          onChange={(e) => update(activeCategory, e.target.value)}
          className="h-11 w-full rounded-xl border border-border bg-white pl-9 pr-4 font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-earth-brown/40"
        />
      </div>

      {/* Category pills + clear */}
      <div className="flex flex-wrap items-center gap-2">
        {[{ slug: 'all', label: 'All' }, ...CATEGORIES].map((cat) => {
          const active = cat.slug === 'all' ? !activeCategory || activeCategory === 'all' : activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => update(cat.slug, query)}
              className={`rounded-full px-3 py-1.5 font-body text-xs font-medium transition ${
                active
                  ? 'bg-earth-brown text-ivory'
                  : 'border border-warm-beige bg-cream text-charcoal hover:border-earth-brown/50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
        {hasFilters && (
          <button
            type="button"
            onClick={() => update('all', '')}
            className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 font-body text-xs text-charcoal/60 hover:text-charcoal transition"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
