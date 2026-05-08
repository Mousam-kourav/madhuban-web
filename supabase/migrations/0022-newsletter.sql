-- Migration 0022: newsletter_subscribers table

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  source text default 'homepage'
);

create index newsletter_active_idx on newsletter_subscribers(subscribed_at desc)
  where unsubscribed_at is null;
