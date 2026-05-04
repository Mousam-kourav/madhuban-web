import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { dbSouvenirToSouvenir } from './mapper';
import type { Souvenir, DbSouvenir } from './types';
import type { CategorySlug } from './categories';

// ── Public queries (anon client, RLS enforced) ─────────────────────────────

export async function getActiveSouvenirs(opts?: {
  category?: string;
  q?: string;
}): Promise<Souvenir[]> {
  const supabase = await createClient();
  let query = supabase
    .from('souvenirs')
    .select('*')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (opts?.category && opts.category !== 'all') {
    query = query.eq('category', opts.category);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  const rows = data as DbSouvenir[];
  let result = rows.map(dbSouvenirToSouvenir);

  // Client-side text filter when full-text index not available in anon client
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.shortDescription?.toLowerCase().includes(q) ?? false) ||
        (s.longDescription?.toLowerCase().includes(q) ?? false),
    );
  }

  return result;
}

export async function getSouvenirBySlug(slug: string): Promise<Souvenir | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('souvenirs')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .is('deleted_at', null)
    .maybeSingle();

  if (error || !data) return null;
  return dbSouvenirToSouvenir(data as DbSouvenir);
}

export async function getRelatedSouvenirs(
  currentSlug: string,
  category: CategorySlug,
  limit = 4,
): Promise<Souvenir[]> {
  const supabase = await createClient();

  // First: same category, excluding current
  const { data: sameCat } = await supabase
    .from('souvenirs')
    .select('*')
    .eq('is_active', true)
    .is('deleted_at', null)
    .eq('category', category)
    .neq('slug', currentSlug)
    .order('sort_order', { ascending: true })
    .limit(limit);

  const rows = (sameCat ?? []) as DbSouvenir[];
  let result = rows.map(dbSouvenirToSouvenir);

  // Backfill from other categories if needed
  if (result.length < limit) {
    const exclude = [currentSlug, ...result.map((r) => r.slug)];
    const { data: others } = await supabase
      .from('souvenirs')
      .select('*')
      .eq('is_active', true)
      .is('deleted_at', null)
      .neq('category', category)
      .not('slug', 'in', `(${exclude.join(',')})`)
      .order('sort_order', { ascending: true })
      .limit(limit - result.length);

    const otherRows = (others ?? []) as DbSouvenir[];
    result = [...result, ...otherRows.map(dbSouvenirToSouvenir)];
  }

  return result;
}

export async function getAllActiveSlugs(): Promise<string[]> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('souvenirs')
      .select('slug')
      .eq('is_active', true)
      .is('deleted_at', null);
    return ((data ?? []) as { slug: string }[]).map((r) => r.slug);
  } catch {
    return [];
  }
}

// ── Admin queries (service role, bypasses RLS) ─────────────────────────────

export async function adminGetAllSouvenirs(): Promise<DbSouvenir[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('souvenirs')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });
  return (data ?? []) as DbSouvenir[];
}
