import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { assertRole } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { GalleryCategory } from '@/lib/supabase/database.types';

const VALID_CATEGORIES: GalleryCategory[] = ['stays', 'dining', 'aranyashala', 'forest', 'events', 'behind-the-scenes'];

export async function POST(request: NextRequest) {
  const auth = await assertRole('admin');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];
  const category = body?.category as GalleryCategory;

  if (!ids.length) return NextResponse.json({ error: 'ids array required' }, { status: 400 });
  if (!VALID_CATEGORIES.includes(category)) return NextResponse.json({ error: 'invalid category' }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('gallery_items')
    .update({ category, updated_at: new Date().toISOString() })
    .in('id', ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('audit_log').insert({
    admin_user_id: auth.user.id,
    actor_email: auth.user.email ?? null,
    action: 'bulk_category',
    entity_type: 'gallery_item',
    entity_id: 'bulk',
    details: { ids, category },
  });

  return NextResponse.json({ updated: ids.length });
}
