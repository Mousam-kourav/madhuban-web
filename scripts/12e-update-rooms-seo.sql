-- Phase 12.E.1 — Per-room subhead + meta refresh (corrected)
--
-- Background: Direction Document v1.1 (Soulful Premium Hybrid register) rewrites
-- the per-room tagline (rendered as the H1 subhead on /stay/[slug]), seo_title,
-- and seo_description for all six accommodations. Distance phrasing aligned to
-- the canonical "90 minutes from Bhopal" / "near Bhopal" pattern per Phase 12.E
-- Step 1 approval.
--
-- CORRECTION: Direction Document v1.1 had stale occupancy claims for mud-house-1
-- (sleeps 2-4), mud-house-2 (sleeps 4-6), and pool-side-villa (two-bedroom).
-- Verified against actual room data: all sleep 2-3 max, pool-side-villa is one
-- king bed. SQL strings corrected to reflect reality, not the doc.
--
-- Mud-house-2 "family" framing also reverted to "larger" / "roomier" —
-- "family" implies higher capacity than reality (same as mud-house-1).
--
-- Idempotent: re-running has no effect once data is set to the target values.

UPDATE rooms
SET
  tagline = 'A safari tent by the stream',
  seo_title = 'Safari Tent in Ratapani — Stream-side Tented Stay',
  seo_description = 'A canvas safari tent on teak decking by the stream, with an open-sky shower and infinity pool access. Sleeps two to three. Madhuban Eco Retreat, near Bhopal.'
WHERE slug = 'safari-tent';

UPDATE rooms
SET
  tagline = 'The mud house, set in the orchard',
  seo_title = 'Mud House in Ratapani — Gond-Inspired Eco Stay',
  seo_description = 'A Gond-inspired mud house set in the orchard, with a 360° rooftop terrace and modern eco amenities. Sleeps two to three. Madhuban Eco Retreat, near Bhopal.'
WHERE slug = 'mud-house-1';

UPDATE rooms
SET
  tagline = 'The larger mud house, with a private courtyard',
  seo_title = 'Larger Mud House in Ratapani — Madhuban Eco Retreat',
  seo_description = 'A roomier Gond-inspired mud house at Madhuban Eco Retreat with a private courtyard and orchard access. Sleeps two to three in more space. Near Bhopal.'
WHERE slug = 'mud-house-2';

UPDATE rooms
SET
  tagline = 'The pool-side villa',
  seo_title = 'Pool-Side Villa in Ratapani — Madhuban Eco Retreat',
  seo_description = 'A villa with a king bed and floor-to-ceiling glass facing the teak forest. Infinity pool access, premium eco amenities. Sleeps two. Near Bhopal.'
WHERE slug = 'pool-side-villa';

UPDATE rooms
SET
  tagline = 'Glamping tents on raised decks',
  seo_title = 'Glamping in Ratapani — Luxury Tented Stay near Bhopal',
  seo_description = 'Boutique glamping tents on raised decks at Madhuban Eco Retreat. Private sit-outs, forest views, infinity pool access. 90 minutes from Bhopal.'
WHERE slug = 'glamping-tents';

UPDATE rooms
SET
  tagline = 'Night camping at Ratapani',
  seo_title = 'Camping in Ratapani — Night Camping near Bhopal',
  seo_description = 'Night camping at the edge of Ratapani Tiger Reserve. Meals, pool access, bonfire, and a guided morning trail included. From ₹2,500 per person.'
WHERE slug = 'camping-tent';

-- Verification — eyeball the six rows match the spec above:
SELECT slug, tagline, seo_title, seo_description FROM rooms ORDER BY slug;
