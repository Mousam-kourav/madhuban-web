import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { assertRole } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/lib/supabase/database.types';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await assertRole('admin');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('gallery_items')
    .update({ needs_review: false, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  revalidatePath('/gallery');

  await supabase.from('audit_log').insert({
    admin_user_id: auth.user.id,
    actor_email: auth.user.email ?? null,
    action: 'approve',
    entity_type: 'gallery_item',
    entity_id: id,
    details: { filename: data.filename } as Json,
  });

  return NextResponse.json(data);
}
