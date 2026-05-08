import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { GalleryItemRow, GalleryCategory, GalleryItemType, GalleryStatus } from '@/lib/supabase/database.types';

export type { GalleryItemRow };

export async function getPublishedGalleryItems(opts?: {
  category?: GalleryCategory;
  limit?: number;
  offset?: number;
}): Promise<GalleryItemRow[]> {
  const supabase = await createClient();
  let q = supabase
    .from('gallery_items')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('uploaded_at', { ascending: false });

  if (opts?.category) q = q.eq('category', opts.category);
  if (opts?.limit) q = q.limit(opts.limit);
  if (opts?.offset) q = q.range(opts.offset, (opts.offset ?? 0) + (opts.limit ?? 100) - 1);

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as GalleryItemRow[];
}

export async function adminGetGalleryItems(opts?: {
  category?: string;
  type?: string;
  status?: string;
  q?: string;
  sortBy?: 'sort_order' | 'uploaded_at_desc' | 'uploaded_at_asc';
  limit?: number;
  offset?: number;
}): Promise<GalleryItemRow[]> {
  const supabase = createAdminClient();
  let query = supabase.from('gallery_items').select('*');

  if (opts?.category && opts.category !== 'all') query = query.eq('category', opts.category as GalleryCategory);
  if (opts?.type && opts.type !== 'all') query = query.eq('type', opts.type as GalleryItemType);
  if (opts?.status && opts.status !== 'all') query = query.eq('status', opts.status as GalleryStatus);
  if (opts?.q) {
    query = query.or(`filename.ilike.%${opts.q}%,alt_text.ilike.%${opts.q}%`);
  }

  if (opts?.sortBy === 'uploaded_at_asc') {
    query = query.order('uploaded_at', { ascending: true });
  } else if (opts?.sortBy === 'uploaded_at_desc') {
    query = query.order('uploaded_at', { ascending: false });
  } else {
    query = query.order('sort_order', { ascending: true }).order('uploaded_at', { ascending: false });
  }

  if (opts?.limit) {
    const from = opts.offset ?? 0;
    query = query.range(from, from + opts.limit - 1);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as GalleryItemRow[];
}
