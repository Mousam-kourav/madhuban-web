/**
 * Cookie consent management per GDPR (EU) and India's DPDP Act (Digital Personal
 * Data Protection Act, 2023).
 *
 * Key principles:
 * - "Reject All" must actually reject. Analytics and marketing state = false.
 * - Necessary cookies (session, CSRF, consent-state) are exempt from consent (legitimate interest).
 * - User preference stored locally (not server-side) — no tracking until consent.
 * - 6-month expiry forces re-consent (configurable; EU recommends 6-13 months).
 * - Version field allows forced re-consent if categories change in future.
 * - All buttons equivalent in prominence — no dark patterns.
 *
 * Consent is not required to view the site. Users who reject get the site minus
 * analytics/marketing. Necessary cookies remain.
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const CONSENT_KEY = 'madhuban_consent';
const CONSENT_VERSION = 1 as const;
const EXPIRY_MS = 6 * 30 * 24 * 60 * 60 * 1000; // ~6 months

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version: typeof CONSENT_VERSION;
};

export type ConsentContextValue = {
  state: ConsentState | null; // null = not yet consented (first visit or expired)
  isLoaded: boolean;          // false during SSR and initial hydration
  acceptAll: () => void;
  rejectAll: () => void;
  customize: (prefs: Partial<Pick<ConsentState, 'analytics' | 'marketing'>>) => void;
  reset: () => void;          // clears stored consent, re-shows banner
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

function isConsentState(v: unknown): v is ConsentState {
  if (typeof v !== 'object' || v === null) return false;
  const c = v as Record<string, unknown>;
  return (
    c['necessary'] === true &&
    typeof c['analytics'] === 'boolean' &&
    typeof c['marketing'] === 'boolean' &&
    typeof c['timestamp'] === 'number' &&
    c['version'] === CONSENT_VERSION
  );
}

function readStored(): ConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isConsentState(parsed)) return null;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (Date.now() - parsed.timestamp > EXPIRY_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(next: ConsentState): void {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConsentState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // SSR safety: only read localStorage after hydration
  useEffect(() => {
    setState(readStored());
    setIsLoaded(true);
  }, []);

  const acceptAll = useCallback(() => {
    const next: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
    persist(next);
    setState(next);
  }, []);

  const rejectAll = useCallback(() => {
    const next: ConsentState = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
    persist(next);
    setState(next);
  }, []);

  const customize = useCallback(
    (prefs: Partial<Pick<ConsentState, 'analytics' | 'marketing'>>) => {
      const next: ConsentState = {
        necessary: true,
        analytics: prefs.analytics ?? false,
        marketing: prefs.marketing ?? false,
        timestamp: Date.now(),
        version: CONSENT_VERSION,
      };
      persist(next);
      setState(next);
    },
    [],
  );

  const reset = useCallback(() => {
    localStorage.removeItem(CONSENT_KEY);
    setState(null);
  }, []);

  return (
    <ConsentContext.Provider
      value={{ state, isLoaded, acceptAll, rejectAll, customize, reset }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used inside <ConsentProvider>');
  return ctx;
}
