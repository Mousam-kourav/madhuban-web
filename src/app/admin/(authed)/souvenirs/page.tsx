import Link from 'next/link';
import { Plus, ShoppingBag } from 'lucide-react';
import { adminGetAllSouvenirs } from '@/lib/souvenirs/queries';
import { SouvenirListClient } from './souvenir-list-client';

export default async function AdminSouvenirsPage() {
  const souvenirs = await adminGetAllSouvenirs();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display italic text-4xl text-[var(--color-charcoal)]">
            Souvenir Shop
          </h1>
          <p className="mt-1 font-body text-sm text-[var(--color-muted)]">
            {souvenirs.length} {souvenirs.length === 1 ? 'product' : 'products'} total
          </p>
        </div>
        <Link
          href="/admin/souvenirs/new"
          className="flex items-center gap-2 rounded-xl bg-[var(--color-forest-green)] px-5 py-3 font-body text-sm font-medium text-[var(--color-ivory)] transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Product
        </Link>
      </div>

      {souvenirs.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-16 text-center">
          <ShoppingBag className="mx-auto mb-4 h-8 w-8 text-[var(--color-muted)]" />
          <p className="font-display italic text-xl text-[var(--color-charcoal)]">
            No products yet
          </p>
          <p className="mt-2 font-body text-sm text-[var(--color-muted)]">
            Add your first souvenir to get started.
          </p>
          <Link
            href="/admin/souvenirs/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--color-forest-green)] px-5 py-3 font-body text-sm font-medium text-[var(--color-ivory)] transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Product
          </Link>
        </div>
      ) : (
        <SouvenirListClient initialSouvenirs={souvenirs} />
      )}
    </div>
  );
}
