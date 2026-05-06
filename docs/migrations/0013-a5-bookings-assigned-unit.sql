-- Migration 0013: A5 — add assigned_unit to bookings
-- Run in Supabase SQL Editor before deploying A5 code.

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS assigned_unit text;

COMMENT ON COLUMN bookings.assigned_unit IS
  'Free-text unit identifier (e.g. ST-03, river-facing tent).
   Manual assignment by admin. Will migrate to proper room_units
   table post-launch.';
