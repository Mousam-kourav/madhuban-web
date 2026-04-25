'use client';

import { useConsent } from './consent-context';

type ConsentGateProps = {
  category: 'analytics' | 'marketing'; // never 'necessary' — necessary scripts aren't gated
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

/**
 * Renders children only when explicit consent for `category` has been given.
 * Use to wrap GA4, GTM, Contentsquare, and any other non-essential scripts.
 *
 * Returns fallback (default: null) when:
 *   - consent not yet loaded (SSR / initial hydration)
 *   - user has not consented
 *   - user has actively rejected that category
 */
export function ConsentGate({
  category,
  children,
  fallback = null,
}: ConsentGateProps) {
  const { state, isLoaded } = useConsent();

  if (!isLoaded || state === null || !state[category]) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
