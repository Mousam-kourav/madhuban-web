import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { assertRole } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { uploadToR2, deleteFromR2, downloadFromR2 } from '@/lib/r2/upload';
import { cropImage } from '@/lib/images/crop';
import type { CropData, FeaturedExperienceStatus, Json } from '@/lib/supabase/database.types';
import { randomBytes } from 'crypto';

const FEATURED_ASPECT = 16 / 9;
const FEATURED_OUTPUT_WIDTH = 1920;

const ctaLinkSchema = z
  .string()
  .min(1)
  .refine(
    (v) => v.startsWith('/') || v.startsWith('https://'),
    'cta_link should start with / (internal) or https:// (external).',
  );

const updateSchema = z.object({
  slug: z.string().min(1).max(120).optional(),
  title: z.string().min(1).max(120).optional(),
  description: z.string().min(1).max(200).optional(),
  cta_label: z.string().min(1).max(40).optional(),
  cta_link: ctaLinkSchema.optional(),
  sort_order: z.coerce.number().int().optional(),
  status: z.enum(['published', 'draft']).optional(),
  croppedAreaPixels: z
    .object({ x: z.number(), y: z.number(), width: z.number(), height: z.number() })
    .optional(),
  zoom: z.number().optional(),
  rotation: z.number().optional(),
});

type UpdatePayload = {
  slug?: string;
  title?: string;
  description?: string;
  cta_label?: string;
  cta_link?: string;
  sort_order?: number;
  status?: FeaturedExperienceStatus;
  r2_key?: string;
  r2_url?: string;
  crop_data?: CropData;
  updated_at: string;
  updated_by: string;
};

function uid8(): string {
  return randomBytes(4).toString('hex');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await assertRole('admin');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? 'Invalid input' }, { status: 400 });
  }
  const input = parsed.data;

  const supabase = createAdminClient();
  const updates: UpdatePayload = {
    updated_at: new Date().toISOString(),
    updated_by: auth.user.id,
  };

  if (input.slug !== undefined) updates.slug = input.slug;
  if (input.title !== undefined) updates.title = input.title;
  if (input.description !== undefined) updates.description = input.description;
  if (input.cta_label !== undefined) updates.cta_label = input.cta_label;
  if (input.cta_link !== undefined) updates.cta_link = input.cta_link;
  if (input.sort_order !== undefined) updates.sort_order = input.sort_order;
  if (input.status !== undefined) updates.status = input.status;

  // Re-crop path
  if (input.croppedAreaPixels) {
    const { data: item, error: fetchErr } = await supabase
      .from('featured_experiences')
      .select('original_r2_key, r2_key, slug')
      .eq('id', id)
      .single();
    if (fetchErr || !item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    let originalBuffer: Buffer;
    try {
      originalBuffer = await downloadFromR2(item.original_r2_key);
    } catch (err) {
      return NextResponse.json({ error: `Failed to fetch original: ${(err as Error).message}` }, { status: 500 });
    }

    let croppedBuffer: Buffer;
    try {
      croppedBuffer = await cropImage(originalBuffer, input.croppedAreaPixels, {
        aspectRatio: FEATURED_ASPECT,
        outputWidth: FEATURED_OUTPUT_WIDTH,
        quality: 82,
      });
    } catch (err) {
      return NextResponse.json({ error: `Crop failed: ${(err as Error).message}` }, { status: 400 });
    }

    const newKey = `featured-experiences/${item.slug}/${item.slug}-${uid8()}.webp`;
    const newUrl = await uploadToR2({ key: newKey, body: croppedBuffer, contentType: 'image/webp' });

    if (item.r2_key && item.r2_key !== item.original_r2_key) {
      await deleteFromR2(item.r2_key).catch(() => {});
    }

    updates.r2_key = newKey;
    updates.r2_url = newUrl;
    updates.crop_data = {
      x: input.croppedAreaPixels.x,
      y: input.croppedAreaPixels.y,
      width: input.croppedAreaPixels.width,
      height: input.croppedAreaPixels.height,
      zoom: input.zoom ?? 1,
      rotation: input.rotation ?? 0,
    };
  }

  const { data, error } = await supabase
    .from('featured_experiences')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  revalidatePath('/');

  await supabase.from('audit_log').insert({
    admin_user_id: auth.user.id,
    actor_email: auth.user.email ?? null,
    action: 'update',
    entity_type: 'featured_experience',
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
    .from('featured_experiences')
    .select('r2_key, original_r2_key, slug')
    .eq('id', id)
    .single();
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await deleteFromR2(item.r2_key).catch(() => {});
  if (item.original_r2_key && item.original_r2_key !== item.r2_key) {
    await deleteFromR2(item.original_r2_key).catch(() => {});
  }

  const { error } = await supabase.from('featured_experiences').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath('/');

  await supabase.from('audit_log').insert({
    admin_user_id: auth.user.id,
    actor_email: auth.user.email ?? null,
    action: 'delete',
    entity_type: 'featured_experience',
    entity_id: id,
    details: { slug: item.slug } as Json,
  });

  return NextResponse.json({ success: true });
}
