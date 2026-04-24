import Image from 'next/image';
import { cn } from '@/lib/utils';

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

interface ImageWrapperProps {
  /** Image URL. Paths starting with "/r2/" have NEXT_PUBLIC_R2_BASE auto-prepended. */
  src: string;
  /** Curated alt text. Required — never omitted on meaningful images. */
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  /**
   * Marks as LCP image. Adds priority + fetchPriority="high".
   * Use only on the single above-the-fold image per page.
   */
  priority?: boolean;
  quality?: number;
  className?: string;
}

/**
 * Thin wrapper over next/image. Enforces typed alt text and auto-prefixes R2 CDN paths.
 * Provide either width+height (fixed), or fill=true with a positioned parent (fluid).
 *
 * @example
 * <ResortImage src="/r2/rooms/safari-tent.jpg" alt="Safari tent at sunset" width={800} height={600} />
 * <ResortImage src="/r2/hero.jpg" alt="Forest canopy at Madhuban" fill sizes="100vw" priority />
 */
export function ResortImage({
  src,
  alt,
  className,
  priority = false,
  ...props
}: ImageWrapperProps) {
  const resolvedSrc = src.startsWith('/r2/')
    ? `${R2_BASE}${src.slice(3)}`
    : src;

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      className={cn(className)}
      priority={priority}
      {...props}
    />
  );
}

export default ResortImage;
