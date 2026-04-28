import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  process.stderr.write(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local\n",
  );
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const coupon = {
  code: "FOREST20",
  discount_type: "percent",
  discount_value: 20,
  min_booking_value: 5000,
  valid_from: null,
  valid_to: null,
  usage_limit: null,
  is_active: true,
};

const { data: existing } = await supabase
  .from("coupons")
  .select("id, code")
  .eq("code", "FOREST20")
  .maybeSingle();

if (existing) {
  const { error } = await supabase
    .from("coupons")
    .update(coupon)
    .eq("id", existing.id);

  if (error) {
    process.stderr.write(`❌ Failed to update FOREST20: ${error.message}\n`);
    process.exit(1);
  }
  process.stdout.write(`✅ FOREST20 updated (id: ${existing.id})\n`);
} else {
  const { data, error } = await supabase
    .from("coupons")
    .insert(coupon)
    .select("id")
    .single();

  if (error) {
    process.stderr.write(`❌ Failed to insert FOREST20: ${error.message}\n`);
    process.exit(1);
  }
  process.stdout.write(`✅ FOREST20 created (id: ${data.id})\n`);
}
