import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Max-width wrapper (1280px) with responsive horizontal padding. Always centered.
 *
 * @example
 * <Container><Section>...</Section></Container>
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}

export default Container;
