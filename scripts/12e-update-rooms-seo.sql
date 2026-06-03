-- Phase 12.E.1 — Per-room subhead + meta refresh
--
-- Background: Direction Document v1.1 (Soulful Premium Hybrid register) rewrites
-- the per-room tagline (rendered as the H1 subhead on /stay/[slug]), seo_title,
-- and seo_description for all six accommodations. Distance phrasing aligned to
-- the canonical "90 minutes from Bhopal" / "near Bhopal" pattern per Phase 12.E
-- Step 1 approval (not "two hours from Bhopal").
--
-- Mapping confirmed:
--   - rooms.tagline → rendered as the room hero subhead via room.tagline in
--     src/components/marketing/room-detail/room-detail-page.tsx:83
--   - rooms.seo_title and rooms.seo_description → consumed by buildMetadata in
--     src/app/(marketing)/stay/[slug]/page.tsx (generateMetadata)
--
-- Idempotent: re-running has no effect once data is set to the target values.
--
-- HOW TO RUN:
--   1. Supabase dashboard → SQL Editor → New Query
--   2. Paste this entire file
--   3. Run
--   4. Eyeball the verification SELECT at the bottom — every row should show
--      the new tagline / seo_title / seo_description
--   5. Run BEFORE merging the Phase 12.E PR so production reflects the new
--      copy as soon as deployment completes
--
-- Note on glamping slug: rooms.ts uses slug 'glamping-tents' (plural). If the
-- DB row uses a different slug (e.g. singular 'glamping-tent'), the UPDATE
-- below will simply affect zero rows — adjust the WHERE clause to match the
-- actual DB slug before re-running.

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
  seo_description = 'A Gond-inspired mud house set in the orchard, with a 360° rooftop terrace and modern eco amenities. Sleeps two to four. Madhuban Eco Retreat, near Bhopal.'
WHERE slug = 'mud-house-1';

UPDATE rooms
SET
  tagline = 'A larger mud house, for the whole family',
  seo_title = 'Family Mud House in Ratapani — Madhuban Eco Retreat',
  seo_description = 'A family-sized mud house at Madhuban Eco Retreat with a private courtyard and orchard access. Sleeps four to six. Gond-inspired build, near Bhopal.'
WHERE slug = 'mud-house-2';

UPDATE rooms
SET
  tagline = 'The pool-side villa',
  seo_title = 'Pool-Side Villa in Ratapani — Madhuban Eco Retreat',
  seo_description = 'A two-bedroom pool-side villa with floor-to-ceiling glass facing the teak forest. Infinity pool access, premium eco amenities. Near Bhopal.'
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
