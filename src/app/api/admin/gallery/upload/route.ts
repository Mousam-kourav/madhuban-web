import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';
import { assertRole } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { uploadToR2 } from '@/lib/r2/upload';
import {
  cropImage,
  imageMetadata,
  validateCropBounds,
} from '@/lib/images/crop';
import { createNotification } from '@/lib/admin/notifications';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { getClientIP } from '@/lib/ratelimit';
import type { CropData, GalleryCategory } from '@/lib/supabase/database.types';
import { randomBytes } from 'crypto';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const VALID_CATEGORIES: GalleryCategory[] = ['stays', 'dining', 'aranyashala', 'forest', 'events', 'behind-the-scenes'];
const CROP_ASPECT = 4 / 3;
const CROP_OUTPUT_WIDTH = 1600;

let _limiter: Ratelimit | null = null;
function getUploadLimiter(): Ratelimit | null {
  if (_limiter) return _limiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(20, '1 h'),
    prefix: 'madhuban:gallery-upload',
  });
  return _limiter;
}

function slugifyFilename(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 60);
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

  const limiter = getUploadLimiter();
  if (limiter) {
    const ip = getClientIP(request);
    const { success } = await limiter.limit(ip);
    if (!success) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: 'File type not allowed. Use JPG, PNG, WebP, MP4, or WebM.' }, { status: 400 });
  }

  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (file.size > maxBytes) {
    const limitMB = isImage ? 5 : 25;
    return NextResponse.json({ error: `File exceeds ${limitMB} MB limit` }, { status: 400 });
  }

  const rawCategory = formData.get('category');
  const category = typeof rawCategory === 'string' ? (rawCategory.trim() as GalleryCategory) : null;
  if (!category || !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'category is required' }, { status: 400 });
  }

  const rawAlt = formData.get('alt_text');
  const altText = typeof rawAlt === 'string' ? rawAlt.trim() : '';
  if (altText.length < 10) {
    return NextResponse.json({ error: 'alt_text must be at least 10 characters' }, { status: 400 });
  }

  const rawFilename = formData.get('filename');
  const baseFilename = typeof rawFilename === 'string' && rawFilename.trim()
    ? slugifyFilename(rawFilename.trim())
    : slugifyFilename(file.name);
  const caption = typeof formData.get('caption') === 'string' ? (formData.get('caption') as string).trim() || null : null;
  const rawSort = formData.get('sort_order');
  const sortOrder = typeof rawSort === 'string' && rawSort.trim() ? parseInt(rawSort, 10) : 0;
  const rawStatus = formData.get('status');
  const status = rawStatus === 'draft' ? 'draft' : 'published';

  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = createAdminClient();

  if (isImage) {
    const cropPixels = parseCropPixels(formData.get('croppedAreaPixels'));
    if (!cropPixels) {
      return NextResponse.json({ error: 'croppedAreaPixels is required for image uploads' }, { status: 400 });
    }
    const zoom = Number(formData.get('zoom') ?? 1);
    const rotation = Number(formData.get('rotation') ?? 0);

    let sourceMeta: { width: number; height: number };
    try {
      sourceMeta = await imageMetadata(buffer);
    } catch (err) {
      return NextResponse.json({ error: `Unable to read image: ${(err as Error).message}` }, { status: 400 });
    }
    const boundsError = validateCropBounds(cropPixels, sourceMeta.width, sourceMeta.height);
    if (boundsError) return NextResponse.json({ error: boundsError }, { status: 400 });

    const originalExt = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const originalKey = `gallery/${category}/originals/${baseFilename}-${uid8()}.${originalExt}`;
    const originalUrl = await uploadToR2({ key: originalKey, body: buffer, contentType: file.type });

    let croppedBuffer: Buffer;
    try {
      croppedBuffer = await cropImage(buffer, cropPixels, {
        aspectRatio: CROP_ASPECT,
        outputWidth: CROP_OUTPUT_WIDTH,
        quality: 82,
      });
    } catch (err) {
      return NextResponse.json({ error: `Crop failed: ${(err as Error).message}` }, { status: 400 });
    }

    const croppedKey = `gallery/${category}/${baseFilename}-${uid8()}.webp`;
    const croppedUrl = await uploadToR2({ key: croppedKey, body: croppedBuffer, contentType: 'image/webp' });

    const meta = await imageMetadata(croppedBuffer).catch(() => ({ width: CROP_OUTPUT_WIDTH, height: Math.round(CROP_OUTPUT_WIDTH / CROP_ASPECT) }));

    const cropData: CropData = {
      x: cropPixels.x,
      y: cropPixels.y,
      width: cropPixels.width,
      height: cropPixels.height,
      zoom: Number.isFinite(zoom) ? zoom : 1,
      rotation: Number.isFinite(rotation) ? rotation : 0,
    };

    const { data, error } = await supabase
      .from('gallery_items')
      .insert({
        filename: baseFilename,
        alt_text: altText,
        caption,
        category,
        type: 'image',
        r2_key: croppedKey,
        r2_url: croppedUrl,
        original_r2_key: originalKey,
        original_r2_url: originalUrl,
        crop_data: cropData,
        needs_review: false,
        width: meta.width,
        height: meta.height,
        file_size_bytes: croppedBuffer.length,
        mime_type: 'image/webp',
        sort_order: isNaN(sortOrder) ? 0 : sortOrder,
        status,
        uploaded_by: auth.user.email ?? 'admin',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    revalidatePath('/gallery');
    revalidatePath('/sitemap-images.xml');

    await createNotification({
      type: 'gallery_uploaded',
      title: `Gallery upload: ${altText.slice(0, 60)}`,
      body: `New image uploaded to the ${category} gallery.`,
      linkUrl: '/admin/gallery',
    }).catch(() => {});

    return NextResponse.json(data, { status: 201 });
  }

  // Video path — no cropping; original and "display" point to the same upload.
  const videoExt = file.name.split('.').pop()?.toLowerCase() ?? (file.type === 'video/mp4' ? 'mp4' : 'webm');
  const videoKey = `gallery/${category}/${baseFilename}-${uid8()}.${videoExt}`;
  const videoUrl = await uploadToR2({ key: videoKey, body: buffer, contentType: file.type });

  let videoWidth: number | null = null;
  let videoHeight: number | null = null;
  try {
    const meta = await sharp(buffer).metadata();
    videoWidth = meta.width ?? null;
    videoHeight = meta.height ?? null;
  } catch {
    // Sharp can't read video metadata — leave dimensions null.
  }

  const { data, error } = await supabase
    .from('gallery_items')
    .insert({
      filename: baseFilename,
      alt_text: altText,
      caption,
      category,
      type: 'video',
      r2_key: videoKey,
      r2_url: videoUrl,
      original_r2_key: videoKey,
      original_r2_url: videoUrl,
      crop_data: null,
      needs_review: false,
      width: videoWidth,
      height: videoHeight,
      file_size_bytes: file.size,
      mime_type: file.type,
      sort_order: isNaN(sortOrder) ? 0 : sortOrder,
      status,
      uploaded_by: auth.user.email ?? 'admin',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath('/gallery');
  revalidatePath('/sitemap-images.xml');

  await createNotification({
    type: 'gallery_uploaded',
    title: `Gallery upload: ${altText.slice(0, 60)}`,
    body: `New video uploaded to the ${category} gallery.`,
    linkUrl: '/admin/gallery',
  }).catch(() => {});

  return NextResponse.json(data, { status: 201 });
}
