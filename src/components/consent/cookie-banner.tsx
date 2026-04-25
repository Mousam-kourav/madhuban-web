'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useConsent } from '@/lib/consent/consent-context';

type Panel = 'main' | 'customize';

export function CookieBanner() {
  const { isLoaded, state, acceptAll, rejectAll, customize } = useConsent();
  const [panel, setPanel] = useState<Panel>('main');
  const [analyticsOn, setAnalyticsOn] = useState(false);
  const [marketingOn, setMarketingOn] = useState(false);
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Trigger slide-in after hydration confirms consent is needed
  useEffect(() => {
    if (isLoaded && state === null) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isLoaded, state]);

  // Focus first interactive element once banner is visible
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => {
        bannerRef.current
          ?.querySelector<HTMLElement>('button, [href]')
          ?.focus();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [visible]);

  // SSR-safe: nothing rendered server-side or when consent already recorded
  if (!isLoaded || state !== null) return null;

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-modal="false"
      aria-label="Cookie preferences"
      className={cn(
        // Position: mobile full-width bottom sheet / desktop bottom-right card
        'fixed bottom-0 left-0 right-0 z-50',
        'md:bottom-6 md:left-auto md:right-6 md:max-w-[420px]',
        // Visual
        'bg-cream border border-border shadow-xl',
        'rounded-t-2xl md:rounded-2xl',
        // Mobile scroll guard
        'max-h-[80vh] overflow-y-auto md:max-h-none md:overflow-visible',
        // Entry animation (CSS only, no Framer Motion)
        'transition-all duration-300 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}
    >
      {panel === 'main' ? (
        <MainPanel
          onRejectAll={rejectAll}
          onAcceptAll={acceptAll}
          onCustomize={() => setPanel('customize')}
        />
      ) : (
        <CustomizePanel
          analyticsOn={analyticsOn}
          marketingOn={marketingOn}
          onAnalyticsChange={setAnalyticsOn}
          onMarketingChange={setMarketingOn}
          onBack={() => setPanel('main')}
          onSave={() =>
            customize({ analytics: analyticsOn, marketing: marketingOn })
          }
          onAcceptAll={acceptAll}
        />
      )}
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

type MainPanelProps = {
  onRejectAll: () => void;
  onAcceptAll: () => void;
  onCustomize: () => void;
};

function MainPanel({ onRejectAll, onAcceptAll, onCustomize }: MainPanelProps) {
  return (
    <div className="p-5 md:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Cookie className="size-4 text-earth-brown shrink-0" aria-hidden="true" />
        <h2 className="font-body text-sm font-semibold text-charcoal">
          Cookie Preferences
        </h2>
      </div>

      <p className="font-body text-sm text-muted-foreground leading-relaxed">
        We use cookies to enhance your browsing experience, analyze site traffic,
        and personalize content. By clicking &ldquo;Accept All&rdquo;, you
        consent to our use of cookies.
      </p>

      <Link
        href="/cookies-and-consent-policy"
        className="inline-block font-body text-sm text-earth-brown underline underline-offset-2 hover:text-blush-dusk transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown rounded-sm"
      >
        View Cookie Policy →
      </Link>

      {/* Button order: Reject · Customize · Accept — equal size, no dark patterns */}
      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <Button
          variant="ghost"
          size="default"
          className="flex-1"
          onClick={onRejectAll}
        >
          Reject All
        </Button>
        <Button
          variant="outline"
          size="default"
          className="flex-1"
          onClick={onCustomize}
        >
          Customize
        </Button>
        <Button
          variant="default"
          size="default"
          className="flex-1"
          onClick={onAcceptAll}
        >
          Accept All
        </Button>
      </div>
    </div>
  );
}

// ── Customize panel ───────────────────────────────────────────────────────────

type CustomizePanelProps = {
  analyticsOn: boolean;
  marketingOn: boolean;
  onAnalyticsChange: (v: boolean) => void;
  onMarketingChange: (v: boolean) => void;
  onBack: () => void;
  onSave: () => void;
  onAcceptAll: () => void;
};

function CustomizePanel({
  analyticsOn,
  marketingOn,
  onAnalyticsChange,
  onMarketingChange,
  onBack,
  onSave,
  onAcceptAll,
}: CustomizePanelProps) {
  return (
    <div className="p-5 md:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back to cookie preferences"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-charcoal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown rounded"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </button>
        <h2 className="font-body text-sm font-semibold text-charcoal">
          Customize Preferences
        </h2>
      </div>

      <div className="divide-y divide-border">
        {/* Necessary — always on, no toggle (GDPR Article 6(1)(b): legitimate interest) */}
        <div className="flex items-start justify-between gap-4 py-3 first:pt-0">
          <div>
            <p className="font-body text-sm font-medium text-charcoal">
              Strictly Necessary
            </p>
            <p className="font-body text-xs text-muted-foreground leading-relaxed mt-0.5">
              Required for basic site functionality. Cannot be disabled.
            </p>
          </div>
          <span
            className="font-body text-xs text-muted-foreground shrink-0 mt-0.5 italic"
            aria-label="Always enabled"
          >
            Always on
          </span>
        </div>

        {/* Analytics */}
        <div className="flex items-start justify-between gap-4 py-3">
          <div id="analytics-label">
            <p className="font-body text-sm font-medium text-charcoal">
              Analytics
            </p>
            <p className="font-body text-xs text-muted-foreground leading-relaxed mt-0.5">
              Helps us understand how visitors interact with our site.
            </p>
          </div>
          <Switch
            checked={analyticsOn}
            onCheckedChange={(v) => onAnalyticsChange(v)}
            aria-labelledby="analytics-label"
          />
        </div>

        {/* Marketing */}
        <div className="flex items-start justify-between gap-4 py-3">
          <div id="marketing-label">
            <p className="font-body text-sm font-medium text-charcoal">
              Marketing
            </p>
            <p className="font-body text-xs text-muted-foreground leading-relaxed mt-0.5">
              Used to track visitors across sites for ad personalization.
            </p>
          </div>
          <Switch
            checked={marketingOn}
            onCheckedChange={(v) => onMarketingChange(v)}
            aria-labelledby="marketing-label"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          size="default"
          className="flex-1"
          onClick={onSave}
        >
          Save Preferences
        </Button>
        <Button
          variant="default"
          size="default"
          className="flex-1"
          onClick={onAcceptAll}
        >
          Accept All
        </Button>
      </div>
    </div>
  );
}
