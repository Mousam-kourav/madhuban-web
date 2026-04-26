# Supabase Setup

## blog_posts table

Run in Supabase SQL editor (Dashboard → SQL Editor → New query):

```sql
create table if not exists public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text,
  body            jsonb,
  cover_image_url text,
  cover_image_alt text,
  category        text,
  tags            text[],
  seo_title       text,
  meta_description text,
  status          text not null default 'draft' check (status in ('draft', 'published')),
  published_at    timestamptz,
  read_time_minutes integer,
  author_name     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- RLS
alter table public.blog_posts enable row level security;

-- Public: read published posts only
create policy "Public can read published posts"
  on public.blog_posts for select
  using (status = 'published');

-- Admin: full access for the single admin user
create policy "Admin full access"
  on public.blog_posts for all
  using (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com')
  with check (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com');
```

## Auth setup

1. Dashboard → Authentication → Providers → Email → Enable "Email OTP / Magic Link"
2. Disable "Confirm email" (admin-only login, no public sign-up)
3. Dashboard → Authentication → URL Configuration:
   - Site URL: `https://www.madhubanecoretreat.com`
   - Redirect URLs: add all of:
     - `http://localhost:3000/admin/auth/callback`
     - `https://www.madhubanecoretreat.com/admin/auth/callback`
     - `https://*.vercel.app/admin/auth/callback`

## Generate TypeScript types

Once you have the Supabase project ID (Dashboard → Settings → General):

```bash
pnpm supabase gen types typescript --project-id <your-project-id> > src/lib/supabase/database.types.ts
```

This replaces the hand-written stub in `src/lib/supabase/database.types.ts`.

## Seed launch post

After auth is working and you can reach `/admin`:

```bash
pnpm tsx scripts/seed-launch-post.ts
```

Uses `upsert` with `onConflict: 'slug'` — safe to re-run.
