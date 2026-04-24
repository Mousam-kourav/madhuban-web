import { cn } from '@/lib/utils';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingColor = 'earth-brown' | 'ivory' | 'charcoal';

interface HeadingProps {
  /** The heading text rendered in the display font. */
  text: string;
  /** Semantic heading level. Defaults to h2. */
  as?: HeadingLevel;
  /** Optional body copy rendered below the decorative separator. */
  subheading?: string;
  /** Text and accent color theme. Defaults to earth-brown. Use ivory on dark backgrounds. */
  color?: HeadingColor;
  className?: string;
}

const TEXT_COLOR: Record<HeadingColor, string> = {
  'earth-brown': 'text-earth-brown',
  'ivory': 'text-ivory',
  'charcoal': 'text-charcoal',
};

const LINE_COLOR: Record<HeadingColor, string> = {
  'earth-brown': 'bg-earth-brown',
  'ivory': 'bg-ivory',
  'charcoal': 'bg-charcoal',
};

const SUBHEADING_COLOR: Record<HeadingColor, string> = {
  'earth-brown': 'text-muted-foreground',
  'ivory': 'text-ivory/75',
  'charcoal': 'text-charcoal/70',
};

const FONT_SIZE: Record<HeadingLevel, string> = {
  h1: 'text-4xl md:text-5xl lg:text-6xl',
  h2: 'text-3xl md:text-4xl',
  h3: 'text-2xl md:text-3xl',
  h4: 'text-xl md:text-2xl',
  h5: 'text-lg md:text-xl',
  h6: 'text-base md:text-lg',
};

/**
 * Decorative branded heading with diamond flanking elements and hover-expanding lines.
 * Hover animation is CSS-only via Tailwind group variant — safe as a server component.
 *
 * @example
 * <Heading as="h2" text="Our Accommodations" subheading="Six unique stays in the forest" />
 * <Heading as="h1" text="Welcome to Madhuban" color="ivory" />
 */
export function Heading({
  text,
  as = 'h2',
  subheading,
  color = 'earth-brown',
  className,
}: HeadingProps) {
  const Tag = as;

  return (
    <div className={cn('group text-center', className)}>
      <Tag
        className={cn(
          'font-display font-medium leading-tight tracking-wide',
          FONT_SIZE[as],
          TEXT_COLOR[color],
        )}
      >
        {text}
      </Tag>

      {/* Decorative separator: ── ◆ ── (lines expand on hover) */}
      <div aria-hidden="true" className="mt-4 flex items-center justify-center gap-3">
        <span
          className={cn(
            'block h-px w-8 transition-[width] duration-300 ease-out group-hover:w-16',
            LINE_COLOR[color],
          )}
        />
        <span className={cn('block size-1.5 rotate-45', LINE_COLOR[color])} />
        <span
          className={cn(
            'block h-px w-8 transition-[width] duration-300 ease-out group-hover:w-16',
            LINE_COLOR[color],
          )}
        />
      </div>

      {subheading && (
        <p className={cn('mt-4 font-body text-base leading-relaxed', SUBHEADING_COLOR[color])}>
          {subheading}
        </p>
      )}
    </div>
  );
}

export default Heading;
