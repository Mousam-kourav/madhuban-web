# Madhuban Eco Retreat — Rebuild Progress

## Phase 0 — Scaffold ✅ COMPLETE (2026-04-23)

### What shipped
- Next.js 16.2.4 + TypeScript strict scaffold (replacing old JSX/MUI codebase)
- pnpm as package manager; pnpm-lock.yaml committed
- `tsconfig.json`: `strict: true` + `noUncheckedIndexedAccess: true`
- `next.config.ts` (TypeScript): `reactStrictMode`, R2 image remote pattern, stub redirects
- `eslint.config.mjs` (flat config, ESLint 9): `@typescript-eslint/no-explicit-any: error`, `no-console: warn`
- `src/app/globals.css`: Tailwind v4 `@theme` with all brand tokens; shadcn `:root` vars remapped to brand palette (hex, not oklch)
- `src/app/layout.tsx`: Cormorant Garamond + DM Sans via `next/font/google`, brand metadata, preconnect links to R2 + Razorpay
- shadcn/ui initialized; `src/components/ui/button.tsx` + `src/lib/utils.ts` (cn helper) created
- Full folder structure from CLAUDE.md §3 scaffolded with stub files (36 routes, all API endpoints)
- `src/lib/supabase/` — client.ts, server.ts, admin.ts (server-only), database.types.ts (stub pending project ID)
- `.env.local` template with all 17 vars from CLAUDE.md §17 (blank values, never committed)
- Production deps: `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `react-hook-form`, `@hookform/resolvers`, `date-fns`, `react-day-picker`, `framer-motion`, `zustand`, `@tanstack/react-query`, `resend`
- Dev deps: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@vitest/coverage-v8`
- `pnpm typecheck` — ✅ zero errors
- `pnpm build` — ✅ 36 routes, compiled in 4.2s

### Decisions made
- Next.js 16.2.4 (not 15 as originally written — updated CLAUDE.md §2)
- `eslint.config.mjs` kept as `.mjs` (not `.ts`) — ESLint 9 TS config loading is unstable; rules added directly
- `AGENTS.md` deleted — CLAUDE.md is the single source of truth
- `pnpm-workspace.yaml` kept — only suppresses build warnings for `sharp`/`unrs-resolver`, not workspace config
- Playwright deferred to Phase 11 (300MB of binaries not needed until E2E phase)
- shadcn dark mode vars kept for shadcn component compatibility; site itself does not use dark mode

---

## Phase 1 — Design System Foundation (Part 1) ✅ COMPLETE (2026-04-24)

### What shipped

**404 fix**
- Deleted `src/app/page.tsx` (boilerplate root page that collided with `(marketing)/page.tsx` at `/`)
- `(marketing)/page.tsx` now returns real content; `pnpm build` confirms `○ /` static prerender

**UI primitives** (`src/components/ui/`)
- `container.tsx` — max-width 1280px wrapper, responsive `px-4 md:px-6 lg:px-8`, server component
- `section.tsx` — semantic `<section>`, `py-12 md:py-20` rhythm, `aria-label` prop, server component
- `heading.tsx` — decorative heading (display font, rotated-square diamond ornament, hover-expanding lines via CSS `group`); `as` h1–h6, `color` theme, optional `subheading`; server component
- `button.tsx` — restyled to brand tokens; default size raised to `h-12` (48px WCAG tap target); variants: default/secondary/outline/ghost/link
- `image-wrapper.tsx` (`ResortImage`) — wraps `next/image`; typed `alt` required; auto-prefixes R2 base URL for `/r2/` paths; server component
- `seo.tsx` — renders `<script type="application/ld+json">`; escapes `<` → `<`; server component

**Lib files** (`src/lib/`)
- `seo.ts` — `buildMetadata()` helper; assembles Next.js `Metadata` with canonical URL, OG, Twitter card, optional noIndex; title format: `{page} — Madhuban Eco Retreat`
- `content/business.ts` — `BUSINESS as const`; single NAP source of truth with name, legalName, parent, phone, email, address (with `full` display field), geo, `sameAs`, cancellationPolicy, advancePayment

**Schema generators** (`src/lib/schema/`)
- `types.ts` — shared input interfaces: `FaqItem`, `PostalAddress`, `GeoCoordinates`, `MonetaryAmount`, `ImageObject`
- `faq-page.ts` — `faqPage({ items })` → `FAQPage` + `Question` + `Answer` schema
- `lodging-business.ts` — `lodgingBusiness()` → `LodgingBusiness` + `LocalBusiness`; optional `aggregateRating`
- `resort.ts` — `resort()` → `Resort` with amenity features and star rating
- `room.ts` — `room({ name, path, pricePerNight, ... })` → `HotelRoom` + `Offer` + `UnitPriceSpecification`
- `article.ts` — `article({ title, path, publishedAt, ... })` → `BlogPosting` with `Organization` author/publisher
- `breadcrumb-list.ts` — `breadcrumbList({ items })` explicit; `breadcrumbListFromPath(pathname)` auto-generates from slug
- `speakable.ts` — `speakable({ path, cssSelectors })` → `SpeakableSpecification` targeting `[data-speakable]` by default
- `index.ts` — barrel export for all generators

**Homepage**
- `src/app/(marketing)/page.tsx` — placeholder using Container + Section + Heading + Button; `buildMetadata()` for page metadata
- `pnpm build` ✅ · `pnpm typecheck` ✅ · `curl /` → 200 OK ✅

### Decisions made
- `Button` uses `@base-ui/react/button` (shadcn v4 direction, already installed) — not Radix
- Schema generators: typed inputs, loose `Record<string, unknown>` output — no `schema-dts` dependency
- `font-display` / `font-body` Tailwind utilities: confirmed wired via `next/font → CSS var → @theme → utility class`
- Heading diamond: CSS rotated `<span>` (not Unicode ◆) — font-independent, no render artifacts
- `buildMetadata` title separator: em dash `—` to match `layout.tsx` template (CLAUDE.md §7.1 uses em dash; session instruction said pipe — using em dash for consistency)
- `cancellationPolicy` key corrected: `threeToSevenDays` (typo `threToSevenDays` fixed before commit)

### Phase 1 open items
- **`business.ts` sameAs has 9 entries; CLAUDE.md §7.3 says 10** — 10th social profile not documented in CLAUDE.md. Needs client confirmation before next schema pass.
- Deferred to Phase 1 Part 2: `Input`, `Textarea`, `Label` (shadcn), `Card` (shadcn), `Faq` (accordion + FAQPage auto-emit), `Breadcrumb` (BreadcrumbList JSON-LD + visual)

---

## Phase 1 — Design System Foundation (Part 2) ✅ COMPLETE (2026-04-24)

### What shipped

**shadcn components installed + restyled** (`src/components/ui/`)
- `input.tsx` — h-12 (48px tap target), px-3 padding; uses `@base-ui/react/input`
- `textarea.tsx` — min-h-[96px], resize-y, px-3 py-3; removed `field-sizing-content`
- `label.tsx` — `text-charcoal` added; `'use client'` per shadcn convention
- `card.tsx` — `rounded-[16px]`, `bg-cream`, `border border-border shadow-sm`; all 6 sub-components (Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter)
- `accordion.tsx` — shadcn generated via `npx shadcn add accordion`; uses `@base-ui/react/accordion`

**New composite components** (`src/components/ui/`)
- `faq.tsx` — `'use client'`; accordion UI wrapping `@base-ui/react/accordion`; auto-emits `FAQPage` JSON-LD via internal `<Seo>` call; answer text tagged `data-speakable="true"` for Phase 3 SpeakableSpecification
- `breadcrumb.tsx` — server component; derives items from `pathname` prop or accepts explicit `items`; filters route group segments (`(marketing)` etc.) defensively; no-op (returns null + no JSON-LD) when `items.length <= 1`; auto-emits `BreadcrumbList` JSON-LD; visual: `<nav aria-label="Breadcrumb">` with Links + ChevronRight + `aria-current="page"` on last item

**Homepage smoke test**
- `src/app/(marketing)/page.tsx` updated with Card + Breadcrumb (pathname="/stay/safari-tent") + Faq test section
- `pnpm typecheck` ✅ · `pnpm build` ✅ (36 routes, `○ /` static) · `curl /` JSON-LD verified:
  - `"@type":"FAQPage"` ✅ in initial HTML
  - `"@type":"BreadcrumbList"` ✅ in initial HTML

### Decisions made
- `Faq` is `'use client'` (accordion state) — JSON-LD still lands in initial HTML because Next.js SSRs client components on first request; Google crawlers see it
- `Breadcrumb` is a server component — no interactivity needed
- `breadcrumbList` import in `breadcrumb.tsx` uses the schema generator from `@/lib/schema`

---

## Phase 1 open items (carry to Phase 2)
- **`business.ts` sameAs has 9 entries; CLAUDE.md §7.3 says 10** — 10th social profile not documented. Needs client confirmation.

---

## Next: Phase 2 — Global Shell
Header (sticky-on-scroll + booking widget + mega-menu for Stay)
Footer (4 columns, Somaiya branding, working newsletter)
WhatsApp floater
Cookie banner with real consent gating
