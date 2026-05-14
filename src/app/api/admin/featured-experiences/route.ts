import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { assertRole } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { downloadFromR2, r2PublicUrl, uploadToR2 } from '@/lib/r2/upload';
import {
  cropImage,
  imageMetadata,
  validateCropBounds,
  isSourceTallerThanTarget,
  FEATURED_SOURCE_TOO_TALL_MESSAGE,
} from '@/lib/images/crop';
import type { CropData, Json } from '@/lib/supabase/database.types';
import { randomBytes } from 'crypto';

const FEATURED_ASPECT = 16 / 9;
const FEATURED_OUTPUT_WIDTH = 1920;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ctaLinkSchema = z
  .string()
  .min(1, 'cta_link is required')
  .refine(
    (v) => v.startsWith('/') || v.startsWith('https://'),
    'cta_link should start with / (internal) or https:// (external).',
  );

const cropPixelsSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
});

const createSchema = z.object({
  r2Key: z.string().min(1),
  slug: z.string().min(1).max(120),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(200),
  cta_label: z.string().min(1).max(40),
  cta_link: ctaLinkSchema,
  sort_order: z.coerce.number().int().default(0),
  status: z.enum(['published', 'draft']).default('draft'),
  mimeType: z.string().min(1),
  fileSize: z.number().positive(),
  croppedAreaPixels: cropPixelsSchema,
  zoom: z.number().optional(),
  rotation: z.number().optional(),
});

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80);
}

function uid8(): string {
  return randomBytes(4).toString('hex');
}

export async function POST(request: NextRequest) {
  const auth = await assertRole('admin');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? 'Invalid input' }, { status: 400 });
  }
  const input = parsed.data;

  if (!ALLOWED_IMAGE_TYPES.includes(input.mimeType)) {
    return NextResponse.json({ error: 'Use JPG, PNG, or WebP.' }, { status: 400 });
  }
  if (input.fileSize > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'File exceeds 5 MB limit' }, { status: 400 });
  }

  const slug = slugify(input.slug || input.title);
  if (!slug) return NextResponse.json({ error: 'Slug could not be derived' }, { status: 400 });

  // Belt-and-suspenders: ensure r2Key was minted under the featured-experiences originals path.
  if (!input.r2Key.startsWith('featured-experiences/') || !input.r2Key.includes('/originals/')) {
    return NextResponse.json({ error: 'r2Key is not a valid featured-experience original' }, { status: 400 });
  }

  const originalKey = input.r2Key;
  const originalUrl = r2PublicUrl(originalKey);

  let originalBuffer: Buffer;
  try {
    originalBuffer = await downloadFromR2(originalKey);
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to fetch uploaded original: ${(err as Error).message}` },
      { status: 500 },
    );
  }

  let sourceMeta: { width: number; height: number };
  try {
    sourceMeta = await imageMetadata(originalBuffer);
  } catch (err) {
    return NextResponse.json({ error: `Unable to read image: ${(err as Error).message}` }, { status: 400 });
  }
  if (isSourceTallerThanTarget(sourceMeta.width, sourceMeta.height, FEATURED_ASPECT)) {
    return NextResponse.json({ error: FEATURED_SOURCE_TOO_TALL_MESSAGE }, { status: 400 });
  }
  const boundsError = validateCropBounds(input.croppedAreaPixels, sourceMeta.width, sourceMeta.height);
  if (boundsError) return NextResponse.json({ error: boundsError }, { status: 400 });

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
  const croppedKey = `featured-experiences/${slug}/${slug}-${uid8()}.webp`;
  const croppedUrl = await uploadToR2({ key: croppedKey, body: croppedBuffer, contentType: 'image/webp' });

  const cropData: CropData = {
    x: input.croppedAreaPixels.x,
    y: input.croppedAreaPixels.y,
    width: input.croppedAreaPixels.width,
    height: input.croppedAreaPixels.height,
    zoom: input.zoom ?? 1,
    rotation: input.rotation ?? 0,
  };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('featured_experiences')
    .insert({
      slug,
      title: input.title,
      description: input.description,
      r2_key: croppedKey,
      r2_url: croppedUrl,
      original_r2_key: originalKey,
      original_r2_url: originalUrl,
      crop_data: cropData,
      cta_label: input.cta_label,
      cta_link: input.cta_link,
      sort_order: input.sort_order,
      status: input.status,
      created_by: auth.user.id,
      updated_by: auth.user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath('/');

  await supabase.from('audit_log').insert({
    admin_user_id: auth.user.id,
    actor_email: auth.user.email ?? null,
    action: 'create',
    entity_type: 'featured_experience',
    entity_id: data.id,
    details: { slug, title: input.title } as Json,
  });

  return NextResponse.json(data, { status: 201 });
}
