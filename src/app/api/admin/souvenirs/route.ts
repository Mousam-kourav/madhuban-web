import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { DbSouvenir } from '@/lib/souvenirs/types';
import type { Json } from '@/lib/supabase/database.types';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'madhubanecoretreat@gmail.com';

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return user;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

export async function GET() {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('souvenirs')
    .select('*')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });

  const rawSlug = typeof body.slug === 'string' && body.slug.trim() ? body.slug.trim() : slugify(name);
  const category = typeof body.category === 'string' ? body.category : 'general';

  const supabase = createAdminClient();

  // Slug uniqueness
  const { data: existing } = await supabase
    .from('souvenirs')
    .select('id')
    .eq('slug', rawSlug)
    .is('deleted_at', null)
    .maybeSingle();
  const finalSlug = existing ? `${rawSlug}-${Date.now()}` : rawSlug;

  const { data: maxOrder } = await supabase
    .from('souvenirs')
    .select('sort_order')
    .is('deleted_at', null)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = ((maxOrder as { sort_order: number } | null)?.sort_order ?? -1) + 1;

  const insert: Record<string, unknown> = {
    name,
    slug: finalSlug,
    category,
    short_description: body.shortDescription ?? null,
    long_description: body.longDescription ?? null,
    price: typeof body.price === 'number' ? body.price : null,
    show_price: body.showPrice !== false,
    cover_image: body.coverImage ?? null,
    detail_image_2: body.detailImage2 ?? null,
    detail_image_3: body.detailImage3 ?? null,
    artisan_credit: body.artisanCredit ?? null,
    is_active: body.isActive !== false,
    sort_order: typeof body.sortOrder === 'number' ? body.sortOrder : nextOrder,
  };

  const { data, error } = await supabase
    .from('souvenirs')
    .insert(insert as DbSouvenir)
    .select('id, slug')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('audit_log').insert({
    admin_user_id: user.id,
    action: 'create',
    entity_type: 'souvenir',
    entity_id: (data as { id: string }).id,
    details: { name, slug: finalSlug } as Json,
  });

  return NextResponse.json(data, { status: 201 });
}
