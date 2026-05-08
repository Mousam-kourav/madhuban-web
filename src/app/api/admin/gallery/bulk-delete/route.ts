import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { assertRole } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { deleteFromR2 } from '@/lib/r2/upload';

export async function POST(request: NextRequest) {
  const auth = await assertRole('admin');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];
  if (!ids.length) return NextResponse.json({ error: 'ids array required' }, { status: 400 });

  const supabase = createAdminClient();
  const { data: items } = await supabase
    .from('gallery_items')
    .select('id, r2_key, filename')
    .in('id', ids);

  let deleted = 0;
  let failed = 0;

  for (const item of items ?? []) {
    try {
      await deleteFromR2(item.r2_key).catch(() => {});
      const { error } = await supabase.from('gallery_items').delete().eq('id', item.id);
      if (error) { failed++; continue; }
      deleted++;
    } catch {
      failed++;
    }
  }

  if (deleted > 0) {
    await supabase.from('audit_log').insert({
      admin_user_id: auth.user.id,
      actor_email: auth.user.email ?? null,
      action: 'bulk_delete',
      entity_type: 'gallery_item',
      entity_id: 'bulk',
      details: { ids, deleted, failed },
    });
  }

  return NextResponse.json({ deleted, failed });
}
