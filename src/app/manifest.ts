import type { MetadataRoute } from 'next';
import { R2_BASE } from '@/lib/r2';

// Phase 12.E.3 — Web App Manifest.
// Next.js serves this at /manifest.webmanifest and auto-emits the
// <link rel="manifest"> tag — no layout.tsx change required.
//
// theme_color matches src/app/layout.tsx viewport.themeColor (#2D3B2D,
// forest-green) per Phase 12.E Step 1 approval (Decision 3).
// background_color is #FAF7F2 (cream) — the marketing-site canvas colour.
//
// Maskable icon is intentionally omitted — no maskable PNG exists on R2 yet.
// Generate one from the existing 512x512 source when convenient and add
// `{ src: ..., sizes: '512x512', type: 'image/png', purpose: 'maskable' }`.

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Madhuban Eco Retreat',
    short_name: 'Madhuban',
    description:
      'A twenty-acre eco retreat at the edge of Ratapani Tiger Reserve. Forest stays, naturalist-led experiences, slow tourism near Bhopal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF7F2',
    theme_color: '#2D3B2D',
    orientation: 'portrait',
    icons: [
      {
        src: `${R2_BASE}/branding/logo/android-chrome-192x192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `${R2_BASE}/branding/logo/android-chrome-512x512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
