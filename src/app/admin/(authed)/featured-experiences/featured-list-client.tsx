'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, Trash2, AlertTriangle, Loader2, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import type { FeaturedExperienceRow } from '@/lib/featured-experiences/queries';

interface Props {
  initialItems: FeaturedExperienceRow[];
}

export function FeaturedListClient({ initialItems }: Props) {
  const [items, setItems] = useState<FeaturedExperienceRow[]>(initialItems);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteItem, setDeleteItem] = useState<FeaturedExperienceRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const filtered = items.filter((i) => filterStatus === 'all' || i.status === filterStatus);
  const sorted = [...filtered].sort((a, b) => a.sort_order - b.sort_order);

  const moveOrder = async (item: FeaturedExperienceRow, direction: -1 | 1) => {
    const peers = [...items].sort((a, b) => a.sort_order - b.sort_order);
    const idx = peers.findIndex((p) => p.id === item.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= peers.length) return;
    const other = peers[swapIdx];
    if (!other) return;

    setReorderingId(item.id);
    const aOrder = item.sort_order;
    const bOrder = other.sort_order;

    const newPeers = peers.map((p) => {
      if (p.id === item.id) return { ...p, sort_order: bOrder };
      if (p.id === other.id) return { ...p, sort_order: aOrder };
      return p;
    });
    setItems(newPeers);

    await Promise.all([
      fetch(`/api/admin/featured-experiences/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: bOrder }),
      }),
      fetch(`/api/admin/featured-experiences/${other.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: aOrder }),
      }),
    ]);
    setReorderingId(null);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/featured-experiences/${deleteItem.id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== deleteItem.id));
      setDeleteItem(null);
    }
    setDeleting(false);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-white py-24 text-center">
        <Sparkles className="mb-4 h-10 w-10 text-[var(--color-muted)]" />
        <p className="font-display text-xl text-[var(--color-charcoal)]">No featured experiences yet</p>
        <p className="mt-2 font-body text-sm text-[var(--color-muted)]">
          Create your first card to surface a promotion or experience on the homepage.
        </p>
        <Link
          href="/admin/featured-experiences/new"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--color-forest-green)] px-5 py-3 font-body text-sm font-medium text-[var(--color-ivory)] hover:opacity-90"
        >
          New Experience
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
          className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 font-body text-sm"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
        <table className="w-full">
          <thead className="bg-[var(--color-cream)] text-left">
            <tr>
              <th className="px-4 py-3 font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Image</th>
              <th className="px-4 py-3 font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Title</th>
              <th className="px-4 py-3 font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Status</th>
              <th className="px-4 py-3 font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Order</th>
              <th className="px-4 py-3 font-body text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr key={item.id} className="border-t border-[var(--color-border)]">
                <td className="px-4 py-3">
                  <div className="relative h-12 w-20 overflow-hidden rounded-md bg-warm-beige/30">
                    <Image src={item.r2_url} alt={item.title} fill className="object-cover" sizes="80px" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-body text-sm font-medium text-[var(--color-charcoal)]">{item.title}</div>
                  <div className="font-body text-xs text-[var(--color-muted)]">/{item.slug}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 font-body text-xs font-medium ${
                      item.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => moveOrder(item, -1)}
                      disabled={reorderingId === item.id}
                      className="rounded p-1 hover:bg-[var(--color-cream)] disabled:opacity-50"
                      aria-label="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center font-body text-xs">{item.sort_order}</span>
                    <button
                      onClick={() => moveOrder(item, 1)}
                      disabled={reorderingId === item.id}
                      className="rounded p-1 hover:bg-[var(--color-cream)] disabled:opacity-50"
                      aria-label="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 font-body text-xs text-[var(--color-muted)]">
                  {new Date(item.updated_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/featured-experiences/${item.id}/edit`}
                      className="rounded-lg p-2 hover:bg-[var(--color-cream)]"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4 text-[var(--color-charcoal)]" />
                    </Link>
                    <button
                      onClick={() => setDeleteItem(item)}
                      className="rounded-lg p-2 hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="font-display text-2xl text-[var(--color-charcoal)]">
                Delete &ldquo;{deleteItem.title}&rdquo;?
              </h2>
              <p className="mt-2 font-body text-sm text-[var(--color-muted)]">
                This removes the card from the homepage and deletes the image from R2. Cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
              <button
                onClick={() => setDeleteItem(null)}
                className="rounded-xl border border-[var(--color-border)] px-5 py-2 font-body text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 font-body text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
