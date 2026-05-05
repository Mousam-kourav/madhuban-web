-- Migration 0009: souvenirs table
-- Run in Supabase SQL Editor before deploying Phase 9d-4.

create table souvenirs (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  category        text not null,
  short_description text,
  long_description  text,
  price           integer,
  show_price      boolean not null default true,
  cover_image     text,
  detail_image_2  text,
  detail_image_3  text,
  artisan_credit  text,
  is_active       boolean not null default true,
  deleted_at      timestamptz,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Indexes
create index souvenirs_category_active_idx on souvenirs (category, is_active) where deleted_at is null;
create index souvenirs_sort_idx on souvenirs (sort_order) where deleted_at is null and is_active = true;
create index souvenirs_slug_idx on souvenirs (slug) where deleted_at is null;
create index souvenirs_search_idx on souvenirs
  using gin (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(short_description, '') || ' ' || coalesce(long_description, '')))
  where deleted_at is null and is_active = true;

-- RLS
alter table souvenirs enable row level security;

create policy "Public reads active souvenirs"
  on souvenirs for select
  using (is_active = true and deleted_at is null);
