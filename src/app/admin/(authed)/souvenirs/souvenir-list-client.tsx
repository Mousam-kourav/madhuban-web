'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { getCategoryLabel } from '@/lib/souvenirs/categories';
import type { DbSouvenir } from '@/lib/souvenirs/types';

interface Props {
  initialSouvenirs: DbSouvenir[];
}

export function SouvenirListClient({ initialSouvenirs }: Props) {
  const [all, setAll] = useState<DbSouvenir[]>(initialSouvenirs);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const dragIndex = useRef<number | null>(null);

  // Displayed list (filtered)
  const visible = all.filter((s) => {
    const matchCat = catFilter === 'all' || s.category === catFilter;
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.short_description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchCat && matchSearch;
  });

  // Drag-to-reorder (operates on `all`, not filtered)
  function handleDragStart(allIdx: number) {
    dragIndex.current = allIdx;
  }

  function handleDrop(allDropIdx: number) {
    const from = dragIndex.current;
    if (from === null || from === allDropIdx) return;

    const reordered = [...all];
    const [moved] = reordered.splice(from, 1);
    if (!moved) return;
    reordered.splice(allDropIdx, 0, moved);
    const updated = reordered.map((r, i) => ({ ...r, sort_order: i }));
    setAll(updated);
    dragIndex.current = null;

    setSaving(true);
    fetch('/api/admin/souvenirs/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated.map((r) => ({ id: r.id, sort_order: r.sort_order }))),
    })
      .catch(() => undefined)
      .finally(() => setSaving(false));
  }

  async function toggleActive(id: string, current: boolean) {
    setAll((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: !current } : s)));
    await fetch(`/api/admin/souvenirs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Soft-delete "${name}"? It will no longer appear on the site.`)) return;
    const res = await fetch(`/api/admin/souvenirs/${id}`, { method: 'DELETE' });
    if (res.ok) setAll((prev) => prev.filter((s) => s.id !== id));
  }

  // Build unique categories from current list
  const usedCategories = [...new Set(all.map((s) => s.category))];

  return (
    <div className="space-y-4">
      {saving && (
        <div className="rounded-xl bg-[var(--color-gold-accent)]/10 px-4 py-2 font-body text-xs text-center text-[var(--color-gold-accent)]">
          Saving order…
        </div>
      )}

      {/* Search + Category filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 flex-1 rounded-xl border border-[var(--color-border)] bg-white px-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-earth-brown)]/40"
        />
        <div className="flex flex-wrap gap-2">
          {['all', ...usedCategories].map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => setCatFilter(slug)}
              className={`rounded-full px-3 py-1 font-body text-xs font-medium transition ${
                catFilter === slug
                  ? 'bg-[var(--color-earth-brown)] text-[var(--color-ivory)]'
                  : 'bg-[var(--color-cream)] text-[var(--color-charcoal)] border border-[var(--color-border)] hover:border-[var(--color-earth-brown)]/50'
              }`}
            >
              {slug === 'all' ? 'All' : getCategoryLabel(slug)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
        {visible.length === 0 ? (
          <div className="p-10 text-center font-body text-sm text-[var(--color-muted)]">
            No products match your filters.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-cream)]">
                <th className="w-10 px-3 py-3" aria-label="Drag" />
                <th className="w-12 px-3 py-3" aria-label="Image" />
                <th className="px-4 py-3 font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Product
                </th>
                <th className="hidden px-4 py-3 font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] sm:table-cell">
                  Category
                </th>
                <th className="hidden px-4 py-3 font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] md:table-cell">
                  Price
                </th>
                <th className="px-4 py-3 font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Active
                </th>
                <th className="px-4 py-3" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => {
                const allIdx = all.findIndex((r) => r.id === s.id);
                return (
                  <tr
                    key={s.id}
                    draggable
                    onDragStart={() => handleDragStart(allIdx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(allIdx)}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-cream)]/40 transition-colors"
                  >
                    <td className="px-3 py-3 text-[var(--color-muted)]">
                      <GripVertical className="h-4 w-4 cursor-grab" />
                    </td>
                    <td className="px-3 py-3">
                      {s.cover_image ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                          <Image
                            src={s.cover_image}
                            alt={s.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-[var(--color-warm-beige)]" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-body text-sm font-medium text-[var(--color-charcoal)] line-clamp-1">
                        {s.name}
                      </p>
                      <p className="font-body text-xs text-[var(--color-muted)]">{s.slug}</p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="rounded-full bg-[var(--color-warm-beige)] px-2 py-0.5 font-body text-xs text-[var(--color-charcoal)]">
                        {getCategoryLabel(s.category)}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 font-body text-sm text-[var(--color-charcoal)] md:table-cell">
                      {s.show_price && s.price != null
                        ? `₹${s.price.toLocaleString('en-IN')}`
                        : 'Ask'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={s.is_active}
                        onClick={() => void toggleActive(s.id, s.is_active)}
                        className={`relative h-5 w-9 rounded-full transition-colors ${
                          s.is_active
                            ? 'bg-[var(--color-earth-brown)]'
                            : 'bg-[var(--color-border)]'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                            s.is_active ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/souvenirs/${s.id}/edit`}
                          className="text-[var(--color-muted)] hover:text-[var(--color-earth-brown)] transition-colors"
                          aria-label={`Edit ${s.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => void handleDelete(s.id, s.name)}
                          className="text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors"
                          aria-label={`Delete ${s.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
