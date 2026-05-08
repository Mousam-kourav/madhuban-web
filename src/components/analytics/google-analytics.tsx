'use client';

import Script from 'next/script';
import { ConsentGate } from '@/lib/consent/consent-gate';

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID ?? '';

export function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <ConsentGate category="analytics">
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
      </Script>
    </ConsentGate>
  );
}
