# 01 — Page Inventory: OLD vs NEW

**Date:** 2026-05-18

Comparison of every marketing route between the OLD live site (https://www.madhubanecoretreat.com) and the NEW Vercel build (https://madhuban-web.vercel.app). Inventory excludes `/admin`, `/api`, auth, and `/book/*` flow pages (booking flow is audited separately in Step 8).

Sources:
- OLD: `sitemap.xml` (30 URLs) + homepage outbound internal links + direct HTTP fetch of `/day-outing` and `/dining`
- NEW: walk of `src/app/(marketing)/**/page.tsx` + live HTML scrape of listing pages for dynamic slugs

Legend: ✅ direct match · 🔁 covered by 301 in `next.config.ts` · ➕ NEW addition · 🚨 missing on NEW (SEO risk)

---

## 1. Top-level pages

| OLD URL | NEW URL | Status | NEW source | Notes |
|---|---|---|---|---|
| `/` | `/` | ✅ | `(marketing)/page.tsx` | Both SSR |
| `/about-us` | `/about-us` | ✅ | `(marketing)/about-us/page.tsx` | |
| `/stay` | `/stay` | ✅ | `(marketing)/stay/page.tsx` | ISR (revalidate 60) |
| `/experiences` | `/experiences` | ✅ | `(marketing)/experiences/page.tsx` | Static, content from `lib/content/experiences.ts` |
| `/dining` | `/dining` | ✅ | `(marketing)/dining/page.tsx` | OLD page reachable (200) but not in OLD sitemap |
| `/nearby-attractions` | `/nearby-attractions` | ✅ | `(marketing)/nearby-attractions/page.tsx` | NEW adds 9 sub-pages, OLD had none |
| `/gallery` | `/gallery` | ✅ | `(marketing)/gallery/page.tsx` | ISR (revalidate 300), Supabase |
| `/contact-us` | `/contact-us` | ✅ | `(marketing)/contact-us/page.tsx` | |
| `/booking` | `/booking` | ✅ | `(marketing)/booking/page.tsx` | Different intent on NEW — wires Supabase booking flow |
| `/blogs` | `/blogs` | ✅ | `(marketing)/blogs/page.tsx` | ISR; **content thin on NEW** — see §4 |
| `/day-outing` | `/day-outing` | ✅ | `(marketing)/day-outing/page.tsx` | OLD returns 200 — confirmed real page (decision #4) |
| `/privacy-policy` | `/privacy-policy` | ✅ | `(marketing)/(policies)/privacy-policy/page.tsx` | |
| `/terms-and-condition` | `/terms-and-condition` | ✅ | `(marketing)/(policies)/terms-and-condition/page.tsx` | |
| `/cookies-and-consent-policy` | `/cookies-and-consent-policy` | ✅ | `(marketing)/(policies)/cookies-and-consent-policy/page.tsx` | |
| `/disclaimer` | `/disclaimer` | ✅ | `(marketing)/(policies)/disclaimer/page.tsx` | |

**Top-level result: 15/15 OLD top-level pages have a matching NEW route. No top-level regressions.**

---

## 2. Experience detail pages

OLD sitemap lists 3 experience slugs; NEW renders the same 3 (verified via live scrape of `/experiences`).

| OLD slug | NEW slug | Status |
|---|---|---|
| `/experiences/bird-watching-and-wilderness` | same | ✅ |
| `/experiences/forest-walks-and-nature-trails` | same | ✅ |
| `/experiences/recreational-facilities` | same | ✅ |

NEW content for these comes from `lib/content/experiences.ts` (hardcoded, not Supabase). Slug parity is intact — keyword equity should transfer.

---

## 3. Stay slug equity map (decision #3)

Critical SEO-preservation subsection. Maps every OLD `/stay/*` URL to its NEW destination and confirms 301 coverage.

| OLD URL | NEW URL (live verified) | 301 in next.config? | Status | Risk |
|---|---|---|---|---|
| `/stay/camping-tent` | `/stay/camping-tent` | n/a (direct match) | ✅ Direct | None |
| `/stay/glamping-tents` | `/stay/glamping-tents` | n/a (direct match) | ✅ Direct | None |
| `/stay/safari-tent` | `/stay/safari-tent` | n/a (direct match) | ✅ Direct | None |
| `/stay/mud-villa` | `/stay/mud-house-1` | ✅ line 22 of `next.config.ts` | 🔁 Redirected | None |
| `/stay/pool-side-room` | `/stay/pool-side-villa` | ✅ line 21 of `next.config.ts` | 🔁 Redirected | None |

**All 5 OLD stay slugs are covered.** No HIGH-risk gaps on stay equity.

NEW additions on `/stay/*` (acceptable):
- `/stay/mud-house-2` — new accommodation type, no OLD equivalent

Live verification command used:
```bash
curl -sL https://madhuban-web.vercel.app/stay | grep -oE 'href="/stay/[a-z0-9-]+"' | sort -u
# returns: camping-tent, glamping-tents, mud-house-1, mud-house-2, pool-side-villa, safari-tent
```

⚠️ Follow-up for the polish arc: the redirected pages (`mud-villa`, `pool-side-room`) lose their OLD slug's keyword visibility in the URL itself. If GSC shows those OLD URLs ranking, the redirect preserves equity but the NEW URL doesn't contain the words "mud villa" or "pool side room" — confirm in Step 5 whether to recommend slug-tuning or accept the rename.

---

## 4. Blog slug parity — 🚨 HIGH SEO RISK 🚨

**This is the single biggest finding of Step 3.** All 8 blog slugs from the OLD sitemap return **404** on the NEW build.

| OLD slug | NEW response | 301 in next.config? | Risk |
|---|---|---|---|
| `/blogs/bhimbetika-india-s-ancient-rock-art-wonder-the-complete-guide-2026` | **404** | ❌ | 🚨 HIGH |
| `/blogs/birdwatching-central-india-ratapani-guide` | **404** | ❌ | 🚨 HIGH |
| `/blogs/day-outing-near-bhopal-perfect-nature-escape` | **404** | ❌ | 🚨 HIGH |
| `/blogs/featured-hindustan-times-bhopal-wildlife-secret` | **404** | ❌ | 🚨 HIGH |
| `/blogs/ginnourgarh-fort-forgotten-gond-citadel-ratapani` | **404** | ❌ | 🚨 HIGH |
| `/blogs/kathotiya-trek-bhopal-hidden-jungle-adventure` | **404** | ❌ | 🚨 HIGH |
| `/blogs/ratapani-tiger-reserve-slow-tourism-near-bhopal` | **404** | ❌ | 🚨 HIGH |
| `/blogs/trekking-near-bhopal-15-best-treks-for-nature-adventure` | **404** | ❌ | 🚨 HIGH |

NEW `/blogs` listing currently shows **1 post:** `/blogs/eco-resort-vs-luxury-resort-real-difference` (a brand-new post not present on OLD).

### Likely causes
- Blog posts on NEW are stored in Supabase and seeded individually. The 8 OLD posts have not been migrated yet.
- `/blogs/[slug]/page.tsx` uses `generateStaticParams` against Supabase + ISR — if the slug isn't in the DB, it 404s.

### Why this matters
Blog URLs are typically the longest-tail keyword surface on a small-business site. The OLD slugs target queries like "trekking near Bhopal", "birdwatching Ratapani", "Bhimbetka guide" — exactly the kind of high-intent search terms an eco-retreat needs to rank for. Verbatim 404s mean any link equity built up to these URLs is lost the moment NEW goes live.

### Remediation paths (decision belongs to architect, not this audit)
1. **Migrate the 8 posts to Supabase** so the slugs resolve. Preserves rankings.
2. **Add 301 redirects** in `next.config.ts` to a related new post or to `/blogs`. Preserves some equity but is weaker.
3. **Republish only the highest-traffic posts** (determined in Step 5 via GSC) and 301 the rest.

This is the lead item for `11-priority-recommendations.md` under SEO.

---

## 5. Nearby-attraction detail pages

OLD had no `/nearby-attractions/*` sub-pages in sitemap. NEW adds 9 sub-pages (all live, verified):

- `/nearby-attractions/bhimbetka-rock-shelters`
- `/nearby-attractions/bhojpur-temple`
- `/nearby-attractions/ginnaurgarh-fort`
- `/nearby-attractions/kathotiya-rock-paintings`
- `/nearby-attractions/kolar-dam`
- `/nearby-attractions/ratapani-tiger-reserve`
- `/nearby-attractions/salkanpur-devi-temple`
- `/nearby-attractions/saru-maru-caves`
- `/nearby-attractions/satpura-tiger-reserve`

All NEW additions (➕). No OLD equivalents to compare against. Step 5 will check whether these slugs target queries that the OLD `/blogs/*` posts also targeted (notably `ratapani-tiger-reserve` and `ginnaurgarh-fort` overlap thematically with OLD blog content — possible canonical conflict).

---

## 6. NEW-only top-level pages (acceptable additions)

These have no OLD equivalent and will be audited only on the NEW side in Step 4.

| NEW URL | Source | Purpose |
|---|---|---|
| `/aranyashala` | `(marketing)/aranyashala/page.tsx` | New brand sub-property page |
| `/corporate-offsite` | `(marketing)/corporate-offsite/page.tsx` | New conversion landing |
| `/enquire` | `(marketing)/enquire/page.tsx` | Lead-capture form page |
| `/packages/2-day-digital-detox` | `(marketing)/packages/2-day-digital-detox/page.tsx` | New packaged-offering landing |
| `/souvenir-shop` | `(marketing)/souvenir-shop/page.tsx` | New ecommerce surface |
| `/souvenir-shop/[slug]` | `(marketing)/souvenir-shop/[slug]/page.tsx` | Souvenir product details (ISR) |
| `/thank-you` | `(marketing)/thank-you/page.tsx` | Form / booking confirmation landing |

No SEO risk from additions. Step 9 will check OG metadata on each.

---

## 7. Slug mismatches

None at the URL-path level (no `/rooms` vs `/accommodations` style renames at top level). The only renames are at the stay-detail tier, and all are covered by 301 in `next.config.ts` — see §3.

---

## 8. Summary

| Category | Count | Status |
|---|---|---|
| OLD top-level pages with NEW match | 15 / 15 | ✅ |
| OLD stay detail slugs covered (direct or 301) | 5 / 5 | ✅ |
| OLD experience detail slugs covered | 3 / 3 | ✅ |
| **OLD blog slugs covered (direct or 301)** | **0 / 8** | 🚨 **HIGH RISK** |
| NEW-only top-level pages | 7 | ➕ acceptable |
| NEW-only nearby-attraction sub-pages | 9 | ➕ acceptable |

**Headline:** structural rebuild preserved every OLD top-level page and every stay/experience detail slug. Blog content has NOT been migrated and is the dominant SEO regression risk for the polish arc. Step 5 will quantify exactly how much traffic the missing blogs were carrying.
