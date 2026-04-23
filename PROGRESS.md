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

### Pending
- Supabase `database.types.ts` stub — needs project ID to generate real types (`pnpm supabase gen types`)
- Vitest config file (`vitest.config.ts`) — to be added in Phase 1 when first tests are written
- Steps 15–28 of Phase 0 plan (Supabase lib stubs ✅ done above, still pending: PROGRESS.md ← this file, README rewrite, branch + push, Vercel preview verify)

---

## Next: Phase 1 — Design System
Button, Input, Card, Container, Heading, Section, Image wrapper, SEO component, FAQ component with JSON-LD
