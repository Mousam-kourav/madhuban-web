-- Phase A2: Add inventory_count to rooms for occupancy tracking.
-- Each existing room gets 1 unit (current booking engine assumption).
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS inventory_count int NOT NULL DEFAULT 1;

COMMENT ON COLUMN rooms.inventory_count IS
  'Number of physical units for this room type. Default 1 (one distinct accommodation per row).';
