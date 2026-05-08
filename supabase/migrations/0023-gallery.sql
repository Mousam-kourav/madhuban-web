-- Migration 0023: gallery_items table + extend notifications type constraint

-- Gallery items: images and videos for the public /gallery page
create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  alt_text text not null,
  caption text,
  category text not null check (category in ('stays', 'dining', 'aranyashala', 'forest', 'events', 'behind-the-scenes')),
  type text not null check (type in ('image', 'video')),
  r2_key text not null unique,
  r2_url text not null,
  thumbnail_url text,
  width int,
  height int,
  file_size_bytes int not null,
  mime_type text not null,
  sort_order int not null default 0,
  status text not null default 'published' check (status in ('published', 'draft')),
  uploaded_by text not null,
  uploaded_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  view_count int not null default 0
);

create index if not exists gallery_items_category_status_idx on gallery_items(category, status, sort_order);
create index if not exists gallery_items_status_uploaded_idx on gallery_items(status, uploaded_at desc) where status = 'published';

-- Extend notifications type constraint to include gallery_uploaded
alter table notifications drop constraint if exists notifications_type_check;
alter table notifications add constraint notifications_type_check
  check (type in ('booking_created','payment_received','check_in_today','booking_cancelled','lead_received','newsletter_subscribed','gallery_uploaded'));
