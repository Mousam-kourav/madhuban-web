import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { assertRole } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { uploadToR2, deleteFromR2, downloadFromR2 } from '@/lib/r2/upload';
import { cropImage, imageMetadata } from '@/lib/images/crop';
import type { CropData, GalleryCategory, GalleryStatus, Json } from '@/lib/supabase/database.types';
import { randomBytes } from 'crypto';

const CROP_ASPECT = 4 / 3;
const CROP_OUTPUT_WIDTH = 1600;

type GalleryUpdate = {
  filename?: string;
  alt_text?: string;
  caption?: string | null;
  category?: GalleryCategory;
  sort_order?: number;
  status?: GalleryStatus;
  r2_key?: string;
  r2_url?: string;
  crop_data?: CropData | null;
  needs_review?: boolean;
  width?: number | null;
  height?: number | null;
  file_size_bytes?: number;
  mime_type?: string;
  updated_at: string;
};

function uid8(): string {
  return randomBytes(4).toString('hex');
}

function parseCropPixels(raw: unknown): { x: number; y: number; width: number; height: number } | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const x = Number(r.x);
  const y = Number(r.y);
  const width = Number(r.width);
  const height = Number(r.height);
  if ([x, y, width, height].some((n) => !Number.isFinite(n)) || width <= 0 || height <= 0) return null;
  return { x, y, width, height };
}

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

  const supabase = createAdminClient();
  const updates: GalleryUpdate = { updated_at: new Date().toISOString() };

  if ('filename' in body) updates.filename = body.filename as string;
  if ('alt_text' in body) updates.alt_text = body.alt_text as string;
  if ('caption' in body) updates.caption = body.caption as string | null;
  if ('category' in body) updates.category = body.category as GalleryCategory;
  if ('sort_order' in body) updates.sort_order = body.sort_order as number;
  if ('status' in body) updates.status = body.status as GalleryStatus;

  // Re-crop path: croppedAreaPixels triggers a fresh crop from the original.
  if ('croppedAreaPixels' in body) {
    const cropPixels = parseCropPixels(body.croppedAreaPixels);
    if (!cropPixels) {
      return NextResponse.json({ error: 'Invalid croppedAreaPixels' }, { status: 400 });
    }

    const { data: item, error: fetchErr } = await supabase
      .from('gallery_items')
      .select('original_r2_key, r2_key, category, filename, type')
      .eq('id', id)
      .single();
    if (fetchErr || !item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (item.type !== 'image') {
      return NextResponse.json({ error: 'Cannot crop a video item' }, { status: 400 });
    }

    let originalBuffer: Buffer;
    try {
      originalBuffer = await downloadFromR2(item.original_r2_key);
    } catch (err) {
      return NextResponse.json({ error: `Failed to fetch original: ${(err as Error).message}` }, { status: 500 });
    }

    let croppedBuffer: Buffer;
    try {
      croppedBuffer = await cropImage(originalBuffer, cropPixels, {
        aspectRatio: CROP_ASPECT,
        outputWidth: CROP_OUTPUT_WIDTH,
        quality: 82,
      });
    } catch (err) {
      return NextResponse.json({ error: `Crop failed: ${(err as Error).message}` }, { status: 400 });
    }

    const newCroppedKey = `gallery/${item.category}/${item.filename}-${uid8()}.webp`;
    const newCroppedUrl = await uploadToR2({ key: newCroppedKey, body: croppedBuffer, contentType: 'image/webp' });
    const meta = await imageMetadata(croppedBuffer).catch(() => ({ width: CROP_OUTPUT_WIDTH, height: Math.round(CROP_OUTPUT_WIDTH / CROP_ASPECT) }));

    // Best-effort delete of the previous cropped object — never deletes the original.
    if (item.r2_key && item.r2_key !== item.original_r2_key) {
      await deleteFromR2(item.r2_key).catch(() => {});
    }

    const zoom = Number(body.zoom ?? 1);
    const rotation = Number(body.rotation ?? 0);

    updates.r2_key = newCroppedKey;
    updates.r2_url = newCroppedUrl;
    updates.crop_data = {
      x: cropPixels.x,
      y: cropPixels.y,
      width: cropPixels.width,
      height: cropPixels.height,
      zoom: Number.isFinite(zoom) ? zoom : 1,
      rotation: Number.isFinite(rotation) ? rotation : 0,
    };
    updates.needs_review = false;
    updates.width = meta.width;
    updates.height = meta.height;
    updates.file_size_bytes = croppedBuffer.length;
    updates.mime_type = 'image/webp';
  }

  const { data, error } = await supabase
    .from('gallery_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  revalidatePath('/gallery');
  revalidatePath('/sitemap-images.xml');

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
    .select('r2_key, original_r2_key, filename')
    .eq('id', id)
    .single();

  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await deleteFromR2(item.r2_key).catch(() => {});
  if (item.original_r2_key && item.original_r2_key !== item.r2_key) {
    await deleteFromR2(item.original_r2_key).catch(() => {});
  }

  const { error } = await supabase.from('gallery_items').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath('/gallery');
  revalidatePath('/sitemap-images.xml');

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
