import 'server-only';
import sharp from 'sharp';

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropOptions {
  aspectRatio: number;
  outputWidth?: number;
  quality?: number;
}

export async function cropImage(
  buffer: Buffer,
  crop: CropArea,
  options: CropOptions,
): Promise<Buffer> {
  const { outputWidth, aspectRatio, quality = 82 } = options;

  let pipeline = sharp(buffer).extract({
    left: Math.max(0, Math.round(crop.x)),
    top: Math.max(0, Math.round(crop.y)),
    width: Math.max(1, Math.round(crop.width)),
    height: Math.max(1, Math.round(crop.height)),
  });

  if (outputWidth) {
    const outputHeight = Math.round(outputWidth / aspectRatio);
    pipeline = pipeline.resize(outputWidth, outputHeight, { fit: 'cover' });
  }

  return (await pipeline.webp({ quality, effort: 6 }).toBuffer()) as Buffer;
}

export function centerCropArea(
  sourceWidth: number,
  sourceHeight: number,
  aspectRatio: number,
): CropArea {
  const sourceAspect = sourceWidth / sourceHeight;

  if (sourceAspect > aspectRatio) {
    const newWidth = Math.round(sourceHeight * aspectRatio);
    const x = Math.round((sourceWidth - newWidth) / 2);
    return { x, y: 0, width: newWidth, height: sourceHeight };
  }

  const newHeight = Math.round(sourceWidth / aspectRatio);
  const y = Math.round((sourceHeight - newHeight) / 2);
  return { x: 0, y, width: sourceWidth, height: newHeight };
}

export async function imageMetadata(buffer: Buffer): Promise<{ width: number; height: number }> {
  const meta = await sharp(buffer).metadata();
  if (!meta.width || !meta.height) throw new Error('Unable to read image dimensions');
  return { width: meta.width, height: meta.height };
}
