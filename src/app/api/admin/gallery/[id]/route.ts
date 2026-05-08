import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { assertRole } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { deleteFromR2 } from '@/lib/r2/upload';
import type { GalleryCategory, GalleryStatus, Json } from '@/lib/supabase/database.types';

type GalleryUpdate = {
  filename?: string;
  alt_text?: string;
  caption?: string | null;
  category?: GalleryCategory;
  sort_order?: number;
  status?: GalleryStatus;
  updated_at: string;
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await assertRole('admin');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const updates: GalleryUpdate = { updated_at: new Date().toISOString() };
  if ('filename' in body) updates.filename = body.filename as string;
  if ('alt_text' in body) updates.alt_text = body.alt_text as string;
  if ('caption' in body) updates.caption = body.caption as string | null;
  if ('category' in body) updates.category = body.category as GalleryCategory;
  if ('sort_order' in body) updates.sort_order = body.sort_order as number;
  if ('status' in body) updates.status = body.status as GalleryStatus;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('gallery_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await supabase.from('audit_log').insert({
    admin_user_id: auth.user.id,
    actor_email: auth.user.email ?? null,
    action: 'update',
    entity_type: 'gallery_item',
    entity_id: id,
    details: updates as unknown as Json,
  });

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await assertRole('admin');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: item } = await supabase
    .from('gallery_items')
    .select('r2_key, filename')
    .eq('id', id)
    .single();

  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await deleteFromR2(item.r2_key).catch(() => {});

  const { error } = await supabase.from('gallery_items').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('audit_log').insert({
    admin_user_id: auth.user.id,
    actor_email: auth.user.email ?? null,
    action: 'delete',
    entity_type: 'gallery_item',
    entity_id: id,
    details: { filename: item.filename } as Json,
  });

  return NextResponse.json({ success: true });
}
