import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { assertRole } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { uploadToR2, downloadFromR2 } from '@/lib/r2/upload';
import { centerCropArea, cropImage, imageMetadata } from '@/lib/images/crop';
import type { CropData } from '@/lib/supabase/database.types';
import { randomBytes } from 'crypto';

const CROP_ASPECT = 4 / 3;
const CROP_OUTPUT_WIDTH = 1600;

function uid8(): string {
  return randomBytes(4).toString('hex');
}

interface ItemResult {
  id: string;
  filename: string;
  status: 'success' | 'skipped' | 'failed';
  message?: string;
}

export const maxDuration = 300;

export async function POST() {
  const auth = await assertRole('admin');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createAdminClient();
  const { data: items, error } = await supabase
    .from('gallery_items')
    .select('id, filename, category, type, r2_key, original_r2_key, crop_data');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results: ItemResult[] = [];

  for (const item of items ?? []) {
    if (item.type !== 'image') {
      results.push({ id: item.id, filename: item.filename, status: 'skipped', message: 'video item' });
      continue;
    }
    if (item.crop_data) {
      results.push({ id: item.id, filename: item.filename, status: 'skipped', message: 'already cropped' });
      continue;
    }

    try {
      const buffer = await downloadFromR2(item.original_r2_key);
      const meta = await imageMetadata(buffer);
      const area = centerCropArea(meta.width, meta.height, CROP_ASPECT);
      const croppedBuffer = await cropImage(buffer, area, {
        aspectRatio: CROP_ASPECT,
        outputWidth: CROP_OUTPUT_WIDTH,
        quality: 82,
      });
      const newKey = `gallery/${item.category}/${item.filename}-${uid8()}.webp`;
      const newUrl = await uploadToR2({ key: newKey, body: croppedBuffer, contentType: 'image/webp' });
      const newMeta = await imageMetadata(croppedBuffer).catch(() => ({
        width: CROP_OUTPUT_WIDTH,
        height: Math.round(CROP_OUTPUT_WIDTH / CROP_ASPECT),
      }));

      const cropData: CropData = {
        x: area.x,
        y: area.y,
        width: area.width,
        height: area.height,
        zoom: 1,
        rotation: 0,
      };

      const { error: updateErr } = await supabase
        .from('gallery_items')
        .update({
          r2_key: newKey,
          r2_url: newUrl,
          crop_data: cropData,
          needs_review: true,
          width: newMeta.width,
          height: newMeta.height,
          file_size_bytes: croppedBuffer.length,
          mime_type: 'image/webp',
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id);
      if (updateErr) throw new Error(updateErr.message);

      results.push({ id: item.id, filename: item.filename, status: 'success' });
    } catch (err) {
      results.push({ id: item.id, filename: item.filename, status: 'failed', message: (err as Error).message });
    }
  }

  revalidatePath('/gallery');
  revalidatePath('/sitemap-images.xml');

  const summary = {
    processed: results.length,
    succeeded: results.filter((r) => r.status === 'success').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    failed: results.filter((r) => r.status === 'failed').length,
  };

  return NextResponse.json({ summary, results });
}
