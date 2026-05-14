import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';
import { assertRole } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { downloadFromR2, r2PublicUrl, uploadToR2 } from '@/lib/r2/upload';
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
const AS_IS_MAX_DIMENSION = 2400;

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

interface CropPixels { x: number; y: number; width: number; height: number }
function parseCropPixels(raw: unknown): CropPixels | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const x = Number(obj.x);
  const y = Number(obj.y);
  const width = Number(obj.width);
  const height = Number(obj.height);
  if ([x, y, width, height].some((n) => !Number.isFinite(n)) || width <= 0 || height <= 0) return null;
  return { x, y, width, height };
}

interface MetadataPayload {
  r2Key: string;
  filename: string;
  alt_text: string;
  caption?: string | null;
  category: GalleryCategory;
  sort_order?: number;
  status?: 'published' | 'draft';
  type: 'image' | 'video';
  mimeType: string;
  fileSize: number;
  width?: number | null;
  height?: number | null;
  croppedAreaPixels?: CropPixels | null;
  zoom?: number;
  rotation?: number;
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

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const input = raw as Partial<MetadataPayload>;

  const r2Key = typeof input.r2Key === 'string' ? input.r2Key.trim() : '';
  if (!r2Key) return NextResponse.json({ error: 'r2Key is required' }, { status: 400 });

  const type = input.type === 'image' || input.type === 'video' ? input.type : null;
  if (!type) return NextResponse.json({ error: 'type must be image or video' }, { status: 400 });

  const mimeType = typeof input.mimeType === 'string' ? input.mimeType : '';
  const isImage = type === 'image' && ALLOWED_IMAGE_TYPES.includes(mimeType);
  const isVideo = type === 'video' && ALLOWED_VIDEO_TYPES.includes(mimeType);
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: 'mimeType does not match a supported type' }, { status: 400 });
  }

  const fileSize = typeof input.fileSize === 'number' ? input.fileSize : NaN;
  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    return NextResponse.json({ error: 'fileSize is required' }, { status: 400 });
  }
  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (fileSize > maxBytes) {
    const limitMB = isImage ? 5 : 25;
    return NextResponse.json({ error: `File exceeds ${limitMB} MB limit` }, { status: 400 });
  }

  const category = typeof input.category === 'string' ? (input.category.trim() as GalleryCategory) : null;
  if (!category || !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'category is required' }, { status: 400 });
  }

  // Belt-and-suspenders: ensure r2Key was minted for this category by /presign.
  const expectedPrefix = isImage ? `gallery/${category}/originals/` : `gallery/${category}/`;
  if (!r2Key.startsWith(expectedPrefix)) {
    return NextResponse.json({ error: 'r2Key does not match category' }, { status: 400 });
  }

  const altText = typeof input.alt_text === 'string' ? input.alt_text.trim() : '';
  if (altText.length < 10) {
    return NextResponse.json({ error: 'alt_text must be at least 10 characters' }, { status: 400 });
  }

  const baseFilename = typeof input.filename === 'string' && input.filename.trim()
    ? slugifyFilename(input.filename.trim())
    : slugifyFilename(r2Key.split('/').pop() ?? 'upload');
  const caption = typeof input.caption === 'string' && input.caption.trim() ? input.caption.trim() : null;
  const sortOrder = typeof input.sort_order === 'number' && Number.isFinite(input.sort_order)
    ? Math.trunc(input.sort_order)
    : 0;
  const status: 'published' | 'draft' = input.status === 'draft' ? 'draft' : 'published';

  const supabase = createAdminClient();

  if (isImage) {
    const cropPixels = parseCropPixels(input.croppedAreaPixels);
    const zoom = Number(input.zoom ?? 1);
    const rotation = Number(input.rotation ?? 0);

    // Original is already in R2 (uploaded directly by browser via presigned URL).
    const originalKey = r2Key;
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

    let displayBuffer: Buffer;
    let cropData: CropData | null = null;

    if (cropPixels) {
      const boundsError = validateCropBounds(cropPixels, sourceMeta.width, sourceMeta.height);
      if (boundsError) return NextResponse.json({ error: boundsError }, { status: 400 });

      try {
        displayBuffer = await cropImage(originalBuffer, cropPixels, {
          aspectRatio: CROP_ASPECT,
          outputWidth: CROP_OUTPUT_WIDTH,
          quality: 82,
        });
      } catch (err) {
        return NextResponse.json({ error: `Crop failed: ${(err as Error).message}` }, { status: 400 });
      }

      cropData = {
        x: cropPixels.x,
        y: cropPixels.y,
        width: cropPixels.width,
        height: cropPixels.height,
        zoom: Number.isFinite(zoom) ? zoom : 1,
        rotation: Number.isFinite(rotation) ? rotation : 0,
      };
    } else {
      const longest = Math.max(sourceMeta.width, sourceMeta.height);
      const pipeline = sharp(originalBuffer).rotate();
      if (longest > AS_IS_MAX_DIMENSION) {
        pipeline.resize({
          width: sourceMeta.width >= sourceMeta.height ? AS_IS_MAX_DIMENSION : undefined,
          height: sourceMeta.height > sourceMeta.width ? AS_IS_MAX_DIMENSION : undefined,
          fit: 'inside',
          withoutEnlargement: true,
        });
      }
      try {
        displayBuffer = (await pipeline.webp({ quality: 82, effort: 6 }).toBuffer()) as Buffer;
      } catch (err) {
        return NextResponse.json({ error: `Encode failed: ${(err as Error).message}` }, { status: 400 });
      }
    }

    const displayKey = `gallery/${category}/${baseFilename}-${uid8()}.webp`;
    const displayUrl = await uploadToR2({ key: displayKey, body: displayBuffer, contentType: 'image/webp' });

    const fallbackDims = cropPixels
      ? { width: CROP_OUTPUT_WIDTH, height: Math.round(CROP_OUTPUT_WIDTH / CROP_ASPECT) }
      : sourceMeta;
    const meta = await imageMetadata(displayBuffer).catch(() => fallbackDims);

    const { data, error } = await supabase
      .from('gallery_items')
      .insert({
        filename: baseFilename,
        alt_text: altText,
        caption,
        category,
        type: 'image',
        r2_key: displayKey,
        r2_url: displayUrl,
        original_r2_key: originalKey,
        original_r2_url: originalUrl,
        crop_data: cropData,
        needs_review: false,
        width: meta.width,
        height: meta.height,
        file_size_bytes: displayBuffer.length,
        mime_type: 'image/webp',
        sort_order: sortOrder,
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

  // Video path — original and display point to the same uploaded object.
  const videoKey = r2Key;
  const videoUrl = r2PublicUrl(videoKey);
  const videoWidth = typeof input.width === 'number' && Number.isFinite(input.width) ? Math.trunc(input.width) : null;
  const videoHeight = typeof input.height === 'number' && Number.isFinite(input.height) ? Math.trunc(input.height) : null;

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
      file_size_bytes: fileSize,
      mime_type: mimeType,
      sort_order: sortOrder,
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
