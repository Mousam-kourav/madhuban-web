import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Json } from '@/lib/supabase/database.types';
import type { SouvenirRow } from '@/lib/supabase/database.types';
import { assertAdmin } from "@/lib/admin/auth";

import { ADMIN_EMAIL } from "@/lib/admin/constants";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('souvenirs')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Build update object from whichever fields were sent
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const fieldMap: Record<string, string> = {
    name: 'name',
    slug: 'slug',
    category: 'category',
    shortDescription: 'short_description',
    longDescription: 'long_description',
    price: 'price',
    showPrice: 'show_price',
    coverImage: 'cover_image',
    detailImage2: 'detail_image_2',
    detailImage3: 'detail_image_3',
    artisanCredit: 'artisan_credit',
    isActive: 'is_active',
    sortOrder: 'sort_order',
  };

  for (const [tsKey, dbKey] of Object.entries(fieldMap)) {
    if (tsKey in body) update[dbKey] = body[tsKey] ?? null;
  }

  // Slug uniqueness check
  if (typeof update.slug === 'string') {
    const { data: existing } = await supabase
      .from('souvenirs')
      .select('id')
      .eq('slug', update.slug)
      .neq('id', id)
      .is('deleted_at', null)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
    }
  }

  const { data, error } = await supabase
    .from('souvenirs')
    .update(update as unknown as Partial<SouvenirRow>)
    .eq('id', id)
    .select('id, slug')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('audit_log').insert({
    admin_user_id: user.id,
    actor_email: user.email ?? null,
    action: 'update',
    entity_type: 'souvenir',
    entity_id: id,
    details: update as unknown as Json,
  });

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('souvenirs')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('audit_log').insert({
    admin_user_id: user.id,
    actor_email: user.email ?? null,
    action: 'delete',
    entity_type: 'souvenir',
    entity_id: id,
    details: { soft_deleted: true } as unknown as Json,
  });

  return NextResponse.json({ ok: true });
}
