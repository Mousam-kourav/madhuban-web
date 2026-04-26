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

## Phase 1 open items (carry forward)
- **`business.ts` sameAs has 9 entries; CLAUDE.md §7.3 says 10** — 10th social profile not documented. Needs client confirmation.

---

## Phase 2A — Global Shell: Header + Footer ✅ COMPLETE (2026-04-24)

### What shipped

**Nav config** (`src/lib/content/navigation.ts`)
- Single source of truth for all nav arrays: `PRIMARY_NAV`, `EXPLORE_NAV`, `FOOTER_EXPLORE`, `FOOTER_VISIT`, `LEGAL_NAV`
- Pure helper functions `isLinkActive(pathname, href)` and `isExploreActive(pathname)` co-located here

**UI additions** (`src/components/ui/`)
- `social-icons.tsx` — self-hosted inline SVG components for Instagram, Facebook, YouTube, LinkedIn, WhatsApp. lucide-react 1.8.0 dropped brand icons; these replace the Wikipedia-hosted icons from the old codebase (CLAUDE.md §10.2)
- `dropdown-menu.tsx` + `sheet.tsx` — shadcn components installed (Base UI primitives)
- `button.tsx` — restored h-12 default size (shadcn sheet install had overwritten Phase 1 WCAG fix)

**Header** (`src/components/marketing/header/`)
- `top-bar.tsx` — desktop-only earth-brown strip (phone, email, 5 social icons); non-sticky, scrolls out naturally
- `nav-desktop.tsx` — primary nav + Explore DropdownMenu; `openOnHover` + `closeDelay={150}` on Base UI trigger; `isLinkActive` on each item, `isExploreActive` on dropdown trigger; `aria-current="page"` on active links
- `mobile-drawer.tsx` — Sheet side="left"; flat nav (PRIMARY_NAV + "Explore" section + EXPLORE_NAV); contact + social at bottom; 48px tap targets
- `index.tsx` — `'use client'`; scroll listener (passive, Y > 40) toggles h-20 → h-16 + shadow; skip-to-content link first in DOM; hamburger opens drawer

**Footer** (`src/components/marketing/footer/`)
- `newsletter-form.tsx` — `'use client'`; single `status: 'idle'|'loading'|'success'|'error'` state; fetches `/api/newsletter`; inline error with `role=alert`; success replaces form
- `index.tsx` — server component; 4-column grid `[2fr_1fr_1fr_1fr]`; brand block with address, tagline, social, WhatsApp CTA; Explore + Visit columns; NewsletterForm island; earth-brown bottom strip with Somaiya attribution + legal links; all column headings semantic `<h3>`

**Route stubs** (2 new pages, 36 → 38 routes)
- `(marketing)/aranyashala/page.tsx` — placeholder with metadata + Heading
- `(marketing)/souvenir-shop/page.tsx` — same pattern

**API upgrade**
- `api/newsletter/route.ts` — upgraded from 501 stub to Zod-validated endpoint (400 on bad email, 200 on success); Resend + Supabase deferred to Phase 5

**Layout wired**
- `(marketing)/layout.tsx` — Header + `<main id="main-content">` + Footer

### Decisions made
- `lucide-react` 1.8.0 has no brand icons (they were removed years ago). Self-hosted inline SVG components chosen over installing another icon library — consistent with CLAUDE.md "lucide-react only" spirit (which targets UI icons, not brand marks) and §10.2 (self-host social icons)
- `openOnHover` moved to `Menu.Trigger` in Base UI 1.4.1 (was previously on Root) — verified from CHANGELOG before use
- TopBar: non-sticky, scrolls out naturally — the browser's default behavior. No JS, no opacity tricks
- Active link matching: `pathname === href || pathname.startsWith(href + '/')` — the `+ '/'` suffix prevents false matches (e.g. `/stay` matching a hypothetical `/stay-anywhere`)
- `status: 'idle'|'loading'|'success'|'error'` single state in NewsletterForm (not separate booleans)

### Verification
- `pnpm typecheck` ✅ zero errors
- `pnpm build` ✅ 38 routes, compiled in 4.7s

---

---

## Phase 2B Part 1 — WhatsApp Floater ✅ COMPLETE (2026-04-24)

### What shipped
- `src/components/marketing/whatsapp-floater.tsx` — fixed bottom-right `<a>`, `animate-float-in` CSS entry, `z-40`
- Mounted in `(marketing)/layout.tsx` below `<main>` so it appears on all marketing pages
- Updated in Phase 2B Part 2 to `'use client'` + hide while banner visible

---

## Phase 2B Part 2 — Cookie Consent Banner ✅ COMPLETE (2026-04-25)

### What shipped

**Consent architecture** (`src/lib/consent/`)
- `consent-context.tsx` — `ConsentProvider` + `useConsent` hook
  - localStorage key: `madhuban_consent` · version: `1` · expiry: 6 months
  - `isLoaded` starts `false` (SSR-safe); set `true` after hydration `useEffect`
  - `isConsentState()` type guard validates shape without `any`
  - `rejectAll()` stores `{ analytics: false, marketing: false }` — legally correct
  - `reset()` clears storage and returns `state` to `null` (re-shows banner)
  - `version` field: bump to force re-consent if categories change in future
- `consent-gate.tsx` — `<ConsentGate category="analytics|marketing">` renders children only when consent given; fallback prop defaults to `null`

**Banner UI** (`src/components/consent/cookie-banner.tsx`)
- Main panel: Cookie icon + title + description + Cookie Policy link + 3 equal buttons
- Button order (legally correct): **Reject All** (ghost) · **Customize** (outline) · **Accept All** (default) — all `size="default"` h-12, no dark patterns
- Customize panel: replaces main content in same container (no modal); 3 rows — Necessary (always-on text, no toggle) · Analytics (Switch) · Marketing (Switch); Save Preferences + Accept All
- Switches use `aria-labelledby` pointing to adjacent `<div id>` labels
- `role="dialog" aria-modal="false" aria-label="Cookie preferences"` on root
- Focus management: `bannerRef.current?.querySelector('button, [href]')?.focus()` 50ms after `visible` becomes true
- Escape does NOT close (user must make a choice)
- SSR safety: `if (!isLoaded || state !== null) return null` — no server-side render, no hydration mismatch
- Entry animation: `requestAnimationFrame` toggles `translate-y-4 opacity-0` → `translate-y-0 opacity-100`, CSS `transition-all duration-300 ease-out`, no Framer Motion
- Mobile: full-width bottom sheet, `rounded-t-2xl`, `max-h-[80vh]` scroll guard
- Desktop: bottom-right card `md:max-w-[420px] md:bottom-6 md:right-6`, `rounded-2xl`

**Integration**
- `src/app/layout.tsx` — `<body>` wrapped with `<ConsentProvider>`; `<CookieBanner />` mounted once at root
- `src/components/marketing/whatsapp-floater.tsx` — `'use client'`; hides (`return null`) while `isLoaded && state === null` (banner visible); reappears once consent recorded

**shadcn Switch** (`src/components/ui/switch.tsx`) — installed via `pnpm dlx shadcn@latest add switch`

### Decisions made
- `ConsentGate` is `'use client'` (uses context hook) — correct; it wraps tracking scripts which are always client-only
- WhatsApp floater hides entirely (both viewports) while banner visible — simpler than responsive offset math, no magic pixel values
- `rejectAll()` stores a full consent record with `analytics: false` so banner doesn't reappear on next page load (user chose; respect it)
- `text-muted-foreground` used for gray text (not `text-muted` which resolves to background color `#FAF7F2` in this token setup)
- Focus targets first `button` or `[href]` in banner via DOM query — avoids threading refs through sub-components

### Verification
- `pnpm typecheck` ✅ zero errors
- `pnpm build` ✅ 38 routes, clean

---

## Phase 2 — Global Shell ✅ COMPLETE (2026-04-25)

All Phase 2 deliverables shipped:
- ✅ Header (sticky, mega-menu, mobile drawer)
- ✅ Footer (4-column, newsletter form, Somaiya attribution)
- ✅ WhatsApp floater
- ✅ Cookie consent banner + ConsentContext + ConsentGate

---

## Phase 3A — Homepage: Hero + Welcome + Stats ✅ COMPLETE (2026-04-25)

### What shipped

**Content files**
- `src/lib/content/images.ts` — typed `HeroImage` registry; `readonly [HeroImage, HeroImage, HeroImage]` tuple prevents unsafe index access under `noUncheckedIndexedAccess`; R2_BASE sourced from `NEXT_PUBLIC_R2_BASE`
- `src/lib/content/homepage.ts` — all Phase 3A copy (`HERO_COPY`, `WELCOME_COPY`, `STATS`, `ANSWER_BLOCK`); live-site content preserved verbatim per §10.3; top-of-file TODO comment for post-launch editorial pass

**Hero carousel** (`src/components/marketing/hero/`)
- `index.tsx` — server shell
- `carousel.tsx` — `'use client'`; 3 slides, 6s auto-rotation, CSS `opacity` fade (600ms); slide 1: `priority` + LCP-optimised; slides 2–3: `loading="eager"` + `fetchPriority="low"`
- Two-state pause architecture: `userPaused` (explicit button, persists) vs `envPaused` (hover/focus/visibility, auto-clears)
- Reduced-motion: lazy `useState` initializer reads `window.matchMedia` on first client render — no effect-body setState, no flash
- Pause on hover, keyboard focus (`onFocus`/`onBlur` with `contains()` check), and `visibilitychange`
- ARIA: `aria-roledescription="carousel"`, slide `role="group"`, dot `role="tablist"`, polite announcer (only when user-paused)
- Dots: bottom-center mobile / bottom-right desktop; Pause/Play: top-right mobile / bottom-right desktop

**Homepage sections** (`src/components/marketing/homepage/`)
- `welcome.tsx` — server component; `Heading` h2 + 2 paragraphs + secondary CTA
- `stats.tsx` — server component; 4-col desktop / 2-col mobile; `border-l md:first:border-l-0` divider pattern; all figures from live sustainability section

**Homepage wiring** (`src/app/(marketing)/page.tsx`)
- `titleOverride` for verbatim indexed title; live meta description preserved with TODO comment
- JSON-LD: `LodgingBusiness` + `Resort` + `SpeakableSpecification` (targets `.answer-block`)
- Answer block (40–80 words, AEO) between Welcome and Stats

**Supporting changes**
- `src/lib/seo.ts` — added `titleOverride?` param; OG title also uses override when set
- `src/app/globals.css` — `--header-height: 5rem` in `:root`; `.hero-height` utility (80svh mobile / `calc(100svh - var(--header-height))` desktop)
- `src/components/ui/button.tsx` — `nativeButton` auto-resolves to `false` when `render` is provided; eliminated 6 Base UI console warnings across Header, Footer, Hero, Welcome with zero callsite changes
- `next.config.ts` — R2 `remotePatterns` hostname updated to correct bucket ID
- `src/lib/consent/consent-context.tsx` — `startTransition` wrapper satisfies `react-hooks/set-state-in-effect` lint rule (Phase 2B regression fix)
- `src/components/marketing/footer/newsletter-form.tsx` — apostrophe escaped (Phase 2A regression fix)

### Decisions made
- H1 uses hardcoded JSX with `<br className="hidden lg:block">` for controlled desktop line break — not the `HERO_COPY.h1` string, since `&amp;` entity requires JSX context and the break is presentational
- `userPaused` initialised via lazy `useState(prefersReducedMotion)` — avoids setState-in-effect lint error and avoids the brief flash of auto-rotation that would occur if initialised `false` then corrected in `useEffect`
- Stats dividers use `md:border-l md:first:border-l-0` (not `border-r last:border-r-0`) — more reliable across CSS grid in all browsers

### Verification
- `pnpm typecheck` ✅ zero errors
- `pnpm lint` ✅ zero errors, zero warnings
- `pnpm build` ✅ 38 routes, compiled in 5.2s
- Visual QA: carousel rotates, CTAs correct size, stats dividers clean, cookie banner regression OK, console clean

---

---

## Phase 3B — Homepage: Rooms Preview + Experiences Grid + Dining Preview ✅ COMPLETE (2026-04-25)

### What shipped

**Content files**
- `src/lib/content/rooms.ts` — typed `Room` + `RoomImage` registry; all 6 accommodations with slugs, prices, taglines, href, and per-slug R2 image paths (480/800/1280 widths, webp + jpg). R2_BASE warn-loud pattern mirrors `images.ts`.
- `src/lib/content/experiences.ts` — typed `Experience` registry; 3 experiences with verbatim live-site copy per §10.3; image paths pre-wired to R2 at `home/experiences/{slug}-{size}.{ext}` with TODO comment (files not yet uploaded — intentional, shows as 404 in DevTools).
- `src/lib/content/dining.ts` — `DINING_PREVIEW` const with heading, body, CTA, and image pre-wired to `home/dining/dining-hero-{size}.{ext}` with TODO comment.

**Schema**
- `src/lib/schema/item-list.ts` — `roomItemList(rooms)` → `ItemList` schema with 6 `ListItem` entries, each a `Product` with `name`, `url`, `image`, and `Offer` (price, INR, InStock)
- `src/lib/schema/index.ts` — barrel export updated to include `item-list`

**Utility**
- `src/lib/utils.ts` — `formatPrice(amount)` added; uses `en-IN` locale for Indian numbering (5000 → "5,000")

**Homepage sections** (`src/components/marketing/homepage/`)
- `rooms-preview.tsx` — server component; 3/2/1 col grid; `<ul role="list">` with `<article aria-labelledby>` per card; uses Phase 1 `Card` primitive (image wrapper div + CardHeader + CardContent + CardFooter); first image `loading="eager"`, rest lazy; price formatted via `formatPrice`; hover scale 1.02 + shadow-md via CSS transition; "View All Accommodations" CTA at bottom → `/stay`
- `experiences-grid.tsx` — server component; 3/1 col grid; same Card pattern; `line-clamp-4` description; "Ideal For" label; ChevronRight icon link; "Explore All Experiences" outline CTA → `/experiences`; heading uses `&#8217;` for Ratapani's apostrophe (avoids `react/no-unescaped-entities`)
- `dining-preview.tsx` — server component; 50/50 CSS grid layout (image left, text right); stacks on mobile; `aspect-video` image; `Heading` with left-align override via `[&>div]:justify-start`

**Homepage wiring**
- `src/app/(marketing)/page.tsx` — imports and renders `RoomsPreview`, `ExperiencesGrid`, `DiningPreview` after `StatsBar`; `roomItemList(ROOMS)` added to `Seo` schemas array

### Decisions made
- `formatPrice` in `src/lib/utils.ts` (not a new `src/lib/utils/` folder) — avoids premature folder split for a single 2-line utility
- Card image uses `<div className="relative aspect-[3/2] overflow-hidden">` + `<Image fill>` — not `CardTitle` wrapper (which is a div with no `as` prop); Card primitive left unchanged per Phase 1 freeze
- `CardTitle` skipped; room name rendered as `<h3>` directly in `CardHeader` — preserves heading semantics without modifying the Phase 1 Card primitive
- Experiences image alt text written for the new files (not yet on live site); dining image alt from spec
- URL slugs corrected from session prompt: `forest-walks-and-nature-trails`, `bird-watching-and-wilderness`, `recreational-facilities` — canonical §5 URLs, not the truncated slugs in the session prompt

### Verification
- `pnpm typecheck` ✅ zero errors
- `pnpm lint` ✅ zero errors, zero warnings
- `pnpm build` ✅ 38 routes, no regressions

### Known open items
- Experience + dining images not yet uploaded to R2 — 4 placeholder 404s intentional (TODO comments in content files)
- Room images at `home/rooms/{slug}-{480,800,1280}.{webp,jpg}` also need uploading to R2

---

---

## Phase 3C — Homepage: Nearby Attractions + Testimonials + Blog Preview ✅ COMPLETE (2026-04-25)

### What shipped

**Content files**
- `src/lib/content/nearby.ts` — typed `NearbyAttraction` registry; 4 attractions (Bhimbetka, Ratapani, Salkanpur Devi Temple, Bhojpur Temple); 2-size image type (mobile 480px, desktop 800px — no tablet, source images are small); R2 paths at `home/nearby/{slug}-{480|800}.{webp|jpg}`; TODO comment noting bhojpur-temple is a placeholder image
- `src/lib/content/testimonials.ts` — 6 verbatim live-site Google reviews per §10.3; no images; template literals used for strings containing apostrophes
- `src/lib/content/blog.ts` — 3 placeholder blog posts; 2-size image type; all image paths at `home/blog/{slug}-{480|800}` **do not exist in R2 yet** — intentional placeholder; TODO Phase 5 comment at top; hrefs use `/blogs/[slug]` per CLAUDE.md §5

**Homepage sections** (`src/components/marketing/homepage/`)
- `nearby-attractions.tsx` — server component; `bg-warm-beige/30` section; 4/2/1 col grid; `<ul role="list">` + `<article aria-labelledby>` per card; distance pill `absolute top-2 right-2` on image with `bg-earth-brown/90 text-ivory` pill; `line-clamp-2` description; no card links (TODO comment — no detail pages yet)
- `testimonials.tsx` — server component; `bg-cream` section; CSS `columns-1 md:columns-2 gap-6` layout (not CSS grid) to handle natural height variation across 6 reviews; `break-inside-avoid mb-6` on each article; decorative `&ldquo;` quote mark in display font at 20% earth-brown opacity; author + location in CardContent (not CardFooter — avoids forced `border-t bg-muted/50` override)
- `blog-preview.tsx` — server component; `bg-cream` section; 3/1 col grid; `date-fns` `format(parseISO(publishedAt), 'MMM d, yyyy')` for build-time date formatting; `<time dateTime>` for semantic HTML; `CardFooter` used for "Read more →" link; "View All Posts" CTA → `/blogs` using inline-styled Link (consistent with existing rooms-preview and dining-preview CTA pattern)

**Homepage wiring**
- `src/app/(marketing)/page.tsx` — 3 imports added; `NearbyAttractions`, `Testimonials`, `BlogPreview` inserted after `DiningPreview`; SESSION D comment preserved

### Decisions made
- CSS columns masonry layout for testimonials (Correction 3) — avoids empty space from grid + unequal card heights
- Blog hrefs use `/blogs/[slug]` (not `/blog/[slug]`) — CLAUDE.md §5 is URL source of truth; brief had a typo
- Blog images left without `unoptimized` prop (Correction 2) — terminal 404 noise acceptable, no tech debt
- "View All Posts" CTA uses inline-styled Link (not `Button variant="outline"`) — consistent with existing CTA pattern in rooms-preview.tsx and dining-preview.tsx; Button's `outline` variant uses shadcn semantic tokens (`border-border`) not brand tokens

### Verification
- `pnpm typecheck` ✅ zero errors
- `pnpm lint` ✅ zero errors, zero warnings
- `pnpm build` ✅ 40 routes (main already had 40 before this session — no new pages added in 3C)

### Known open items
- Nearby attraction images at `home/nearby/{slug}-{480,800}.{webp,jpg}` not yet uploaded to R2
- Blog images at `home/blog/{slug}-{480,800}.{webp,jpg}` not yet uploaded (Phase 5 + real posts)

---

## Phase 3D — Homepage: Newsletter CTA + Corporate Offsite Teaser + FAQ ✅ COMPLETE (2026-04-25)
Shipped in a prior session. See commit 38f0e83.

---

## Phase 4A — Room Detail Pages (Redesign) ✅ COMPLETE (2026-04-25)

### What shipped

**9 files written on branch `feat/phase-4a-redesign-room-detail-pages`:**

**Extended content** (`src/lib/content/rooms.ts`)
- Extended `Room` type with: `genre`, `longDescription: readonly string[]` (3 paragraphs), `occupancy`, `bedConfig`, `size`, `amenities: readonly string[]`, `highlights: readonly RoomHighlight[]` (4 per room), `gallery: readonly RoomGalleryImage[]` (5 per room), `faqs: readonly RoomFaq[]` (7 per room — 42 total)
- New types: `RoomGalleryImage` (webp + jpg at mobile/desktop sizes), `RoomFaq`
- `RoomHighlight.icon: string` — lucide-react icon name resolved at render time via `ICON_MAP` in `room-detail-page.tsx`
- `galleryImages(slug, alts)` helper builds R2 gallery paths at `home/rooms/{slug}-{n}-{800,1280}.{webp,jpg}`
- All 6 rooms fully populated with corrected prices: Safari Tent ₹12,000 · Mud House 1 ₹10,000 · Mud House 2 ₹9,000 · Pool Side Villa ₹12,000 · Glamping Tent ₹7,500 · Camping Tent ₹2,500
- `MUD_HOUSE_GALLERY_ALTS` shared between mud-house-1 and mud-house-2 (identical rooms visually, different R2 slugs)

**Schema** (`src/lib/schema/room.ts`)
- Renamed `room()` → `hotelRoom(room: Room)` — accepts full `Room` object, no separate input type
- Computes R2 image array (slots 1–3 at 1280px) internally from `room.slug`
- Uses `room.longDescription[0] ?? ''` as description (noUncheckedIndexedAccess guard)

**Globals** (`src/app/globals.css`)
- Added `--color-forest-green: #2D3B2D` to `@theme` block (new Tailwind utility)
- Added `.drop-cap > p:first-of-type::first-letter` CSS (display font, italic, floated, 3.5rem)
- Added `details > summary { list-style: none }` + `::-webkit-details-marker { display: none }` triangle removal

**Room detail components** (`src/components/marketing/room-detail/`)
- `room-detail-page.tsx` — server component; 8 sections: Hero (aspect-[4/3] md:aspect-[16/9], Image fill priority, gradient overlay, italic h1), Booking Band (60/40 grid, genre + meta left, booking card right), Description (drop-cap, 3 paragraphs), Highlights (4-col icon grid, `ICON_MAP[h.icon] ?? Sparkles`), Gallery (CSS grid, first image `lg:col-span-2 lg:aspect-[16/7]`), Amenities (2-col list, Check icons), FAQ (native `<details>`, first item open, ChevronDown rotate), CTA (`bg-forest-green` section, ivory buttons)
- `mobile-sticky-bar.tsx` — `'use client'`; `IntersectionObserver` on `#room-hero`; `h-[72px]` fixed bar; CSS `translate-y-full` → `translate-y-0` transition (replaces `if (!visible) return null` — avoids initial flash on fast scroll); `tabIndex={-1}` on link when hidden; `md:hidden`

**Room pages**
- `src/app/(marketing)/stay/[slug]/page.tsx` — replaced stub; `generateStaticParams` (6 slugs); `generateMetadata` (async params, R2 OG image); renders `Seo` (3 schemas: `hotelRoom`, `faqPage`, `breadcrumbListFromPath`), `RoomDetailPage`, `MobileStickyBar`
- `src/app/(marketing)/stay/page.tsx` — replaced stub; listing page with 4 sections: h1 Heading, description paragraph, 6-card grid (reuses Card primitive + genre eyebrow on each card), bottom CTA with WhatsApp + Book Now

**Other**
- `src/lib/content/faqs.ts` — updated `accommodations` FAQ answer with corrected prices matching rooms.ts
- `CLAUDE.md` §4 — added `--color-forest-green: #2D3B2D` to brand color token docs
- `CLAUDE.md` §19 — added Phase 5 scope addendum (Supabase migration, room CRUD, image upload, ISR refactor)

### Decisions made
- `ICON_MAP[h.icon] ?? Sparkles` — icon name encoded in data; resolved at render time. Keeps content/rendering cleanly separated without coupling `rooms.ts` to lucide imports
- Native `<details>`/`<summary>` for FAQ — zero JS, pure server component; `open={i === 0}` for initial state
- Mobile sticky bar uses CSS transform transition (not conditional render) — prevents 72px layout shift on slow scroll
- `[...r.faqs]` spread in page.tsx — converts `readonly RoomFaq[]` to mutable `FaqItem[]` for `faqPage()` without changing the schema types
- Gallery grid: `aspect-[3/2]` on all images; first image gets `lg:col-span-2 lg:aspect-[16/7]` at desktop only
- `<article className="pb-[72px] md:pb-0">` wrapper in `RoomDetailPage` — matches `h-[72px]` sticky bar exactly

### Verification
- `pnpm typecheck` ✅ zero errors
- `pnpm lint` ✅ zero errors, zero warnings
- `pnpm build` ✅ 44 routes (6 new SSG room detail pages, `/stay` listing page), compiled in 5.3s

### Known open items
- Gallery images at `home/rooms/{slug}-{n}-{800,1280}.{webp,jpg}` not yet on R2 (will 404 until uploaded)
- `hotelRoom` in schema/index.ts barrel: old `room` export removed; any existing callers of `room()` must be updated to `hotelRoom()` (no existing callers found — was only stubbed)

---

## Phase 5A — Admin Platform + Blog ✅ COMPLETE (2026-04-26)

### What shipped

**Dependencies added**
- `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-placeholder` — rich text editor
- `sharp` — server-side image resize to WebP before R2 upload
- `@aws-sdk/client-s3` — R2 upload via S3-compatible API
- `dotenv` (devDep) — seed script env loading

**Supabase infrastructure**
- `src/lib/supabase/browser.ts` — browser client (canonical name; `client.ts` preserved for backward compat)
- `src/lib/supabase/middleware.ts` — session refresh helper for Next middleware
- `middleware.ts` (project root) — refreshes Supabase session on every request
- `src/lib/supabase/database.types.ts` — updated from `Record<string, never>` stub to full typed `blog_posts` table definition (Insert/Update/Row)

**Blog types, queries, renderer**
- `src/lib/blog/types.ts` — `BlogPost`, `BlogPostSummary`, `TiptapDoc`, `TiptapNode`, `TiptapMark` types
- `src/lib/blog/queries.ts` — `getPublishedPosts()`, `getPublishedPost(slug)`, `getAllPublishedSlugs()`, `getRelatedPosts(slug)`
- `src/lib/blog/render-tiptap.tsx` — recursive React renderer for Tiptap JSON (no dangerouslySetInnerHTML); handles all StarterKit node types + Link + Image; exports `extractHeadings()` for TOC
- `src/lib/schema/blog-posting.ts` — `blogPosting()` JSON-LD schema generator

**Admin routes** (all dynamic, auth-gated)
- `src/app/admin/layout.tsx` — root (noindex robots)
- `src/app/admin/login/page.tsx` — split-screen login: forest hero left, form right
- `src/app/admin/login/login-form.tsx` — magic link submit with sent/error states
- `src/app/admin/auth/callback/route.ts` — exchange code for session, redirect to /admin
- `src/app/admin/(authed)/layout.tsx` — auth gate via server client; redirect to /admin/login if no session
- `src/app/admin/(authed)/admin-sidebar.tsx` — forest-green sidebar; nav, disabled items with tooltips, logout form
- `src/app/admin/(authed)/page.tsx` — dashboard with post count
- `src/app/admin/(authed)/posts/page.tsx` — posts list table (status, category, dates)
- `src/app/admin/(authed)/posts/new/page.tsx` — renders PostEditor (new)
- `src/app/admin/(authed)/posts/[id]/edit/page.tsx` — renders PostEditor (edit, pre-loaded from DB)
- `src/app/admin/(authed)/posts/post-editor.tsx` — Tiptap editor with cover upload, title, slug, toolbar, 30s auto-save, save draft, publish buttons
- `src/app/admin/(authed)/posts/post-toolbar.tsx` — floating forest-green pill toolbar (H1, H2, B, I, link, quote, image, more)
- `src/app/admin/(authed)/posts/post-sidebar.tsx` — right rail: status, category, tags, SEO title/desc with char counters, SEO checklist, social preview
- `src/app/admin/(authed)/logout/route.ts` — sign out, redirect to /admin/login

**API routes**
- `src/app/api/admin/upload/route.ts` — POST multipart; auth check; sharp resize to WebP 1200px; R2 PutObject; returns public URL
- `src/app/api/admin/posts/route.ts` — GET (list) + POST (create with slug uniqueness check)
- `src/app/api/admin/posts/[id]/route.ts` — GET + PATCH (auto-sets published_at; revalidates /blogs paths) + DELETE

**Public blog pages** (ISR, revalidate=60)
- `src/app/(marketing)/blogs/page.tsx` — hero, category filter bar, 3-col card grid, Newsletter CTA
- `src/app/(marketing)/blogs/[slug]/page.tsx` — hero, TOC sidebar, Tiptap renderer, Plan Your Retreat CTA, related posts; BlogPosting + BreadcrumbList JSON-LD
- `src/app/(marketing)/blogs/blog-card.tsx` — cover image, category badge, meta, title, excerpt, author
- `src/app/(marketing)/blogs/[slug]/toc.tsx` — client TOC with IntersectionObserver active-section highlight
- `src/app/(marketing)/blog/page.tsx` + `blog/[slug]/page.tsx` — redirect to canonical `/blogs` and `/blogs/[slug]`

**Seed script**
- `scripts/seed-launch-post.ts` — inserts "Eco Resort vs Luxury Resort" post via service role client; run once with `pnpm tsx scripts/seed-launch-post.ts`

### Decisions made
- Canonical blog URL: `/blogs` (matches CLAUDE.md §5 + existing nav). Phase 5A kickoff said `/blog` — overridden by CLAUDE.md "URLs are sacred". `/blog` and `/blog/[slug]` redirect to the plural form.
- Database types: defined typed stub for `blog_posts` table (no Supabase project ID for `gen types` yet). Update by running `pnpm supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts` once project ID is available.
- Slug derivation in PostEditor moved from `useEffect` to `title onChange` handler to satisfy react-hooks/set-state-in-effect lint rule.
- Admin auth: Supabase magic link (email OTP). Single authorized email: `madhubanecoretreat@gmail.com` checked server-side in every API route.

### Verification
- `pnpm typecheck` ✅ zero errors
- `pnpm lint` ✅ zero errors, zero warnings
- `pnpm build` ✅ 53 routes (16 new routes vs Phase 4A's 37), compiled cleanly

### Manual verification steps (user runs)
1. `pnpm dev` → visit `/admin/login` → split screen renders
2. Submit `madhubanecoretreat@gmail.com` → check inbox, click magic link → lands on `/admin`
3. `/admin/posts` → empty list → click "New Post"
4. Run `pnpm tsx scripts/seed-launch-post.ts` → ✅ output
5. `/blogs` → seed post card visible
6. `/blogs/eco-resort-vs-luxury-resort-real-difference` → renders with TOC, body, CTA
7. View source → `BlogPosting` JSON-LD present
8. Try `/admin` while logged out → redirect to `/admin/login`
9. Logout → returns to `/admin/login`

### Known open items
- No cover image on seed post (null) — upload via admin editor after login
- Database types stub: run `pnpm supabase gen types` once project ID is confirmed in Vercel env
- Filter bar category buttons are static/unwired (v1 — JS filtering deferred)
- Blog sitemap: `sitemap.ts` does not yet include blog posts — add in Phase 6 (blog post slugs from Supabase)

---

---

## Phase 5B — Room CMS ✅ COMPLETE (2026-04-26)

### What shipped

**Schema (ALTER, not CREATE)**
- Discovered: Supabase already had 16 tables from a prior booking-engine handoff. `rooms` table existed with 9 booking-engine columns. `CREATE TABLE IF NOT EXISTS` was a NO-OP.
- Applied: `ALTER TABLE rooms ADD COLUMN` for 11 new CMS columns (`tagline`, `genre`, `href`, `hero_image`, `long_description`, `bed_config`, `size_label`, `highlights`, `gallery`, `seo_title`, `seo_description`). Booking-engine columns untouched.
- New table: `room_faqs` (id, room_id, question, answer, display_order) with FK → rooms cascade delete. RLS: admin full access, public select on active rooms.

**Seed script** (`scripts/seed-rooms.ts`)
- Reads from `rooms.ts` (dynamic import after dotenv, so R2_BASE is loaded first), UPDATEs existing rows by slug, DELETEs + re-inserts FAQs per room. Idempotent / re-runnable.
- Output on first run: 6 rooms updated, 42 FAQs inserted (7 per room).

**Types** (`src/lib/types/rooms.ts`)
- `DbRoom`, `DbRoomFaq`, `GalleryItem`, `HeroImageItem`, `HighlightItem` — all snake_case, matching DB columns exactly.
- `database.types.ts` updated with full `rooms` + `room_faqs` table definitions (Insert type makes nullable fields optional; `slug`/`name` required at insert).

**Queries + mapper** (`src/lib/rooms/`)
- `queries.ts`: `getRooms()` (anon, `is_active=true`, ordered), `getRoomBySlug(slug)` (anon), `getRoomFaqs(roomId)` (anon, ordered by display_order), `getAllRoomSlugs()` (admin client, bypasses RLS for `generateStaticParams`).
- `mapper.ts`: `dbRoomToRoom(DbRoom, DbRoomFaq[])` → legacy `Room` type. `extractParagraphs()` converts Tiptap jsonb doc back to `string[]` for `RoomDetailPage`. `safeGallery/safeHighlights/safeHeroImage` guard nullable jsonb fields.

**API routes (10 total)**
- `GET/POST /api/admin/rooms` — list (admin, all rooms) + create (auto-slug from name, next sort_order)
- `GET/PATCH/DELETE /api/admin/rooms/[id]` — single room; PATCH checks slug uniqueness, revalidates `/stay` + `/stay/{slug}`; DELETE cascades FAQs via FK
- `POST /api/admin/rooms/reorder` — batch sort_order update
- `POST /api/admin/rooms/[id]/faqs` — add FAQ (auto display_order)
- `POST /api/admin/rooms/[id]/faqs/reorder` — batch FAQ order update
- `PATCH/DELETE /api/admin/faqs/[id]` — edit/delete single FAQ
- `/api/admin/upload` — extended with optional `folder` param (rooms pass `rooms/{slug}`)

**Admin UI**
- `/admin/rooms` — server component table; `RoomListClient` handles HTML5 drag-to-reorder (POST reorder on drop); thumbnail from hero_image → gallery[0] fallback; name, slug, price, active badge
- `/admin/rooms/new` — name-only form → POST → redirect to edit page
- `/admin/rooms/[id]/edit` — `RoomEditor` (600+ line `'use client'` component)
  - 9 collapsible `<details>` sections: Basics, Pricing & Specs, Long Description (Tiptap), Amenities (tag input + pill list), Highlights (up/down reorder), Hero Image (single upload + alt), Gallery (drag-to-reorder + upload + alt text), FAQs (direct API per action), SEO
  - Auto-save: 30s debounce + immediate save on `onBlur`
  - Slug change: inline warning (no browser confirm)
  - Status toggle: immediate PATCH on click
  - Gallery + hero: immediate save on upload/delete/reorder

**Public pages refactored**
- `/stay` — `export const revalidate = 60`; `getRooms()` → `dbRoomToRoom(r, [])` for each room; try/catch falls back to `[]`
- `/stay/[slug]` — `export const revalidate = 60`; `generateStaticParams` uses `getAllRoomSlugs()` with try/catch; `generateMetadata` reads `seo_title`/`seo_description` from DB; main render uses `getRoomBySlug` + `getRoomFaqs` → `dbRoomToRoom` → passes `Room` to existing components unchanged

**Admin sidebar** — "Rooms" moved from disabled items to live nav items

**`rooms.ts`** — deprecation comment added at top; retained for fallback reference until ~2026-05-03

### Schema-discovery story

The kickoff brief said the Supabase project was clean aside from 1 table. It wasn't — a prior booking-engine handoff had pre-seeded 16 tables. Discovered when the initial migration SQL produced NO-OP output. User ran `SELECT column_name FROM information_schema.columns WHERE table_name = 'rooms'` to surface the real shape, then ran a revised ALTER TABLE.

The pre-existing columns (`base_price_per_night`, `max_occupancy`, `gst_rate`, `peak_multiplier`, `min_nights`, `is_active`, `sort_order`, `images`) are load-bearing for Phase 7 booking engine. They were preserved untouched. See CLAUDE.md §24 for the authoritative gotcha doc.

### Key decisions

- **Extend, don't replace**: ALTER over the existing `rooms` table. All booking-engine columns preserved. The mapper translates between the two naming conventions.
- **Mapper pattern**: `dbRoomToRoom()` converts DB → legacy `Room` type. All existing public components work without changes.
- **FAQ as separate table** (not jsonb column): enables per-FAQ edit/delete/reorder API calls without re-sending the whole room payload.
- **Drag-to-reorder for rooms, up/down buttons for FAQs**: FAQs sit inside a room card already — a second drag context would conflict. Up/down is simpler and sufficient.
- **`body as unknown as RoomUpdate` cast**: Supabase typed client uses `RejectExcessProperties` which rejects `Record<string, unknown>` objects even when the fields are valid. The double cast is the correct escape hatch — used in all 3 PATCH routes.
- **Dynamic import in seed script**: `rooms.ts` reads `NEXT_PUBLIC_R2_BASE` at module init time. Import must happen inside the async `seed()` function, after `dotenv.config()` runs.

### Verification
- `pnpm typecheck` ✅ zero errors
- `pnpm lint` ✅ zero errors
- `pnpm build` ✅ 57 routes, compiled cleanly

---

## Next: Phase 6 — Policy pages, 404, Thank You, sitemap, robots, redirects
