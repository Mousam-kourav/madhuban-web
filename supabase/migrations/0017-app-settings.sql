-- Migration 0017: App settings singleton table
-- Run in Supabase SQL Editor. Apply before deploying Phase A8 code.

create table if not exists app_settings (
  id text primary key default 'singleton',
  contact_email text not null default 'madhubanecoretreat@gmail.com',
  contact_phone text not null default '+919770558419',
  whatsapp_number text not null default '+919770558419',
  gstin text not null default '23AAACT5004A1Z9',
  legal_entity_name text not null default 'Somaiya Properties And Investments Private Limited',
  trade_name text not null default 'Madhuban Eco Retreat',
  registered_address text not null default 'Narmada Farm Kheri, Rehti, Sehore, Madhya Pradesh, 466446',
  business_hours_open time not null default '09:00',
  business_hours_close time not null default '21:00',
  upi_id text,
  upi_payee_name text,
  email_signature text not null default 'Warm regards,
Madhuban Eco Retreat Team',
  default_gst_rate_low numeric(5,2) not null default 12.00,
  default_gst_rate_high numeric(5,2) not null default 18.00,
  gst_rate_threshold numeric(10,2) not null default 7500.00,
  updated_at timestamptz not null default now(),
  updated_by text,
  constraint singleton check (id = 'singleton')
);

insert into app_settings (id)
  values ('singleton')
  on conflict (id) do nothing;
