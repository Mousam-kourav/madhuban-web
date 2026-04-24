import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  /** Accessible label surfaced to screen readers via aria-label. */
  label?: string;
  id?: string;
}

/**
 * Semantic <section> with consistent vertical rhythm: py-12 mobile, py-20 desktop (48px → 80px).
 *
 * @example
 * <Section label="Our Accommodations" id="accommodations">...</Section>
 */
export function Section({ children, className, label, id }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn('py-12 md:py-20', className)}
    >
      {children}
    </section>
  );
}

export default Section;
