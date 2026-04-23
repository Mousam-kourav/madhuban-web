# Madhuban Eco Retreat — Web Rebuild

Eco-luxury forest resort adjacent to Ratapani Tiger Reserve, 60 km from Bhopal, MP.
Live site: https://www.madhubanecoretreat.com

## Stack

Next.js 16 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui · Supabase · Razorpay · Resend

## Getting started

```bash
pnpm install
cp .env.local .env.local          # fill in values — see CLAUDE.md §17 for all vars
pnpm dev
```

## Commands

```bash
pnpm dev          # development server
pnpm build        # production build
pnpm typecheck    # TypeScript check (zero errors required to merge)
pnpm lint         # ESLint
pnpm test         # Vitest unit tests
```

## Architecture

See `CLAUDE.md` — complete spec: stack decisions, URL structure, brand system,
booking engine, admin panel, SEO requirements, and the 16-week build plan.

See `PROGRESS.md` — current phase status and per-session decisions.
