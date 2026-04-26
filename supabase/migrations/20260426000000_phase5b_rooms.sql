-- Phase 5B: rooms + room_faqs tables
-- Apply via Supabase Dashboard → SQL Editor

-- Reuse updated_at trigger function from blog_posts (already exists in production).
-- create or replace is safe to re-run.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── rooms ────────────────────────────────────────────────────────────────────

create table if not exists public.rooms (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  name             text not null,
  tagline          text,
  short_description text,
  long_description jsonb not null default '{}'::jsonb,
  price_per_night  integer not null,
  occupancy_adults  integer not null default 2,
  occupancy_children integer not null default 0,
  bed_config       text,
  size_sqft        integer,
  amenities        text[] not null default '{}',
  highlights       text[] not null default '{}',
  gallery          jsonb not null default '[]'::jsonb,
  hero_image_url   text,
  seo_title        text,
  seo_description  text,
  display_order    integer not null default 0,
  status           text not null default 'draft'
                     check (status in ('draft', 'published')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists rooms_status_order_idx
  on public.rooms (status, display_order);

create trigger rooms_updated_at
  before update on public.rooms
  for each row execute function public.set_updated_at();

-- RLS
alter table public.rooms enable row level security;

create policy "Public can read published rooms"
  on public.rooms for select
  using (status = 'published');

create policy "Admin full access on rooms"
  on public.rooms for all
  using  (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com')
  with check (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com');

-- ─── room_faqs ────────────────────────────────────────────────────────────────

create table if not exists public.room_faqs (
  id            uuid primary key default gen_random_uuid(),
  room_id       uuid not null references public.rooms(id) on delete cascade,
  question      text not null,
  answer        text not null,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists room_faqs_room_order_idx
  on public.room_faqs (room_id, display_order);

create trigger room_faqs_updated_at
  before update on public.room_faqs
  for each row execute function public.set_updated_at();

-- RLS: public can read FAQs for published rooms only
alter table public.room_faqs enable row level security;

create policy "Public can read faqs for published rooms"
  on public.room_faqs for select
  using (
    exists (
      select 1 from public.rooms r
      where r.id = room_id and r.status = 'published'
    )
  );

create policy "Admin full access on room_faqs"
  on public.room_faqs for all
  using  (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com')
  with check (auth.jwt() ->> 'email' = 'madhubanecoretreat@gmail.com');
