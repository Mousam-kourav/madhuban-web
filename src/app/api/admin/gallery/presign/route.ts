import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { assertRole } from '@/lib/admin/auth';
import { presignR2Upload } from '@/lib/r2/upload';
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
const PRESIGN_EXPIRES_IN = 300;

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

let _limiter: Ratelimit | null = null;
function getPresignLimiter(): Ratelimit | null {
  if (_limiter) return _limiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(60, '1 h'),
    prefix: 'madhuban:gallery-presign',
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

  const limiter = getPresignLimiter();
  if (limiter) {
    const ip = getClientIP(request);
    const { success } = await limiter.limit(ip);
    if (!success) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const filename = typeof input.filename === 'string' ? input.filename.trim() : '';
  const mimeType = typeof input.mimeType === 'string' ? input.mimeType.trim() : '';
  const fileSize = typeof input.fileSize === 'number' ? input.fileSize : NaN;
  const category = typeof input.category === 'string' ? (input.category.trim() as GalleryCategory) : null;

  if (!filename) return NextResponse.json({ error: 'filename is required' }, { status: 400 });
  if (!category || !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'category is required' }, { status: 400 });
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType);
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: 'File type not allowed. Use JPG, PNG, WebP, MP4, or WebM.' }, { status: 400 });
  }

  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    return NextResponse.json({ error: 'fileSize is required' }, { status: 400 });
  }
  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (fileSize > maxBytes) {
    const limitMB = isImage ? 5 : 25;
    return NextResponse.json({ error: `File exceeds ${limitMB} MB limit` }, { status: 400 });
  }

  const slug = slugifyFilename(filename);
  if (!slug) return NextResponse.json({ error: 'filename could not be slugified' }, { status: 400 });

  const ext = EXT_BY_MIME[mimeType] ?? 'bin';
  // For images: client uploads the ORIGINAL (server later downloads + crops/encodes to a separate
  // display key). For videos: client uploads the only copy.
  const r2Key = isImage
    ? `gallery/${category}/originals/${slug}-${uid8()}.${ext}`
    : `gallery/${category}/${slug}-${uid8()}.${ext}`;

  let uploadUrl: string;
  try {
    uploadUrl = await presignR2Upload({ key: r2Key, contentType: mimeType, expiresIn: PRESIGN_EXPIRES_IN });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to generate upload URL: ${(err as Error).message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ uploadUrl, r2Key });
}
