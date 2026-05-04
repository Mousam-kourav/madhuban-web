import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import type { DbSouvenir } from '@/lib/souvenirs/types';
import { SouvenirForm } from '../../souvenir-form';

export default async function EditSouvenirPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('souvenirs')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div>
      <Link
        href="/admin/souvenirs"
        className="mb-6 inline-flex items-center gap-1 font-body text-sm text-[var(--color-muted)] hover:text-[var(--color-charcoal)]"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Souvenir Shop
      </Link>
      <h1 className="mb-8 font-display italic text-4xl text-[var(--color-charcoal)]">
        Edit Product
      </h1>
      <div className="max-w-2xl rounded-2xl border border-[var(--color-border)] bg-white p-8">
        <SouvenirForm initial={data as DbSouvenir} />
      </div>
    </div>
  );
}
