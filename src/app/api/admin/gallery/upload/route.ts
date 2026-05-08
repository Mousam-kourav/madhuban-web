import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';
import { assertRole } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { uploadToR2 } from '@/lib/r2/upload';
import { createNotification } from '@/lib/admin/notifications';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { getClientIP } from '@/lib/ratelimit';
import type { GalleryCategory } from '@/lib/supabase/database.types';
import { randomBytes } from 'crypto';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const VALID_CATEGORIES: GalleryCategory[] = ['stays', 'dining', 'aranyashala', 'forest', 'events', 'behind-the-scenes'];

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
  const category = typeof rawCategory === 'string' ? rawCategory.trim() as GalleryCategory : null;
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
  const ext = isImage ? 'webp' : file.name.split('.').pop() ?? (file.type === 'video/mp4' ? 'mp4' : 'webm');
  const r2Key = `gallery/${category}/${baseFilename}-${uid8()}.${ext}`;

  let finalBuffer = buffer;
  let finalMimeType = file.type;
  let width: number | null = null;
  let height: number | null = null;

  if (isImage) {
    const sharpImg = sharp(buffer);
    const meta = await sharpImg.metadata();
    width = meta.width ?? null;
    height = meta.height ?? null;
    finalBuffer = (await sharpImg.webp({ quality: 85 }).toBuffer()) as Buffer<ArrayBuffer>;
    finalMimeType = 'image/webp';
  }

  const r2Url = await uploadToR2({ key: r2Key, body: finalBuffer, contentType: finalMimeType });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('gallery_items')
    .insert({
      filename: baseFilename,
      alt_text: altText,
      caption,
      category,
      type: isImage ? 'image' : 'video',
      r2_key: r2Key,
      r2_url: r2Url,
      width,
      height,
      file_size_bytes: file.size,
      mime_type: finalMimeType,
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
    body: `New ${isImage ? 'image' : 'video'} uploaded to the ${category} gallery.`,
    linkUrl: '/admin/gallery',
  }).catch(() => {});

  return NextResponse.json(data, { status: 201 });
}
