import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { assertRole } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { uploadToR2 } from '@/lib/r2/upload';
import { cropImage, imageMetadata, validateCropBounds } from '@/lib/images/crop';
import type { CropData, Json } from '@/lib/supabase/database.types';
import { randomBytes } from 'crypto';

const FEATURED_ASPECT = 16 / 9;
const FEATURED_OUTPUT_WIDTH = 1920;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ctaLinkSchema = z
  .string()
  .min(1, 'cta_link is required')
  .refine(
    (v) => v.startsWith('/') || v.startsWith('https://'),
    'cta_link should start with / (internal) or https:// (external).',
  );

const createSchema = z.object({
  slug: z.string().min(1).max(120),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(200),
  cta_label: z.string().min(1).max(40),
  cta_link: ctaLinkSchema,
  sort_order: z.coerce.number().int().default(0),
  status: z.enum(['published', 'draft']).default('draft'),
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

function parseCropPixels(raw: FormDataEntryValue | null): { x: number; y: number; width: number; height: number } | null {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const x = Number(parsed.x);
    const y = Number(parsed.y);
    const width = Number(parsed.width);
    const height = Number(parsed.height);
    if ([x, y, width, height].some((n) => !Number.isFinite(n)) || width <= 0 || height <= 0) return null;
    return { x, y, width, height };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const auth = await assertRole('admin');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Use JPG, PNG, or WebP.' }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'File exceeds 5 MB limit' }, { status: 400 });
  }

  const raw = {
    slug: formData.get('slug')?.toString().trim() ?? '',
    title: formData.get('title')?.toString().trim() ?? '',
    description: formData.get('description')?.toString().trim() ?? '',
    cta_label: formData.get('cta_label')?.toString().trim() ?? '',
    cta_link: formData.get('cta_link')?.toString().trim() ?? '',
    sort_order: formData.get('sort_order')?.toString() ?? '0',
    status: (formData.get('status')?.toString() ?? 'draft'),
  };

  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? 'Invalid input' }, { status: 400 });
  }
  const input = parsed.data;
  const slug = slugify(input.slug || input.title);
  if (!slug) return NextResponse.json({ error: 'Slug could not be derived' }, { status: 400 });

  const cropPixels = parseCropPixels(formData.get('croppedAreaPixels'));
  if (!cropPixels) return NextResponse.json({ error: 'croppedAreaPixels is required' }, { status: 400 });
  const zoom = Number(formData.get('zoom') ?? 1);
  const rotation = Number(formData.get('rotation') ?? 0);

  const buffer = Buffer.from(await file.arrayBuffer());

  let sourceMeta: { width: number; height: number };
  try {
    sourceMeta = await imageMetadata(buffer);
  } catch (err) {
    return NextResponse.json({ error: `Unable to read image: ${(err as Error).message}` }, { status: 400 });
  }
  const boundsError = validateCropBounds(cropPixels, sourceMeta.width, sourceMeta.height);
  if (boundsError) return NextResponse.json({ error: boundsError }, { status: 400 });

  // Upload original
  const originalExt = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  const originalKey = `featured-experiences/${slug}/originals/${slug}-${uid8()}.${originalExt}`;
  const originalUrl = await uploadToR2({ key: originalKey, body: buffer, contentType: file.type });

  // Crop + upload cropped
  let croppedBuffer: Buffer;
  try {
    croppedBuffer = await cropImage(buffer, cropPixels, {
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
    x: cropPixels.x,
    y: cropPixels.y,
    width: cropPixels.width,
    height: cropPixels.height,
    zoom: Number.isFinite(zoom) ? zoom : 1,
    rotation: Number.isFinite(rotation) ? rotation : 0,
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
