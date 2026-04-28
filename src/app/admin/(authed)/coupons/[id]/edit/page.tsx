import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { CouponForm } from "@/components/admin/coupon-form";
import type { CouponFormValues } from "@/components/admin/coupon-form";

export const metadata: Metadata = { title: "Edit Coupon — Madhuban Admin" };

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .eq("id", id)
    .single();

  if (!coupon) notFound();

  const initial: CouponFormValues = {
    code: coupon.code,
    discount_type: coupon.discount_type as "percent" | "flat",
    discount_value: String(coupon.discount_value),
    min_booking_value: String(coupon.min_booking_value ?? 0),
    valid_from: coupon.valid_from ? coupon.valid_from.slice(0, 10) : "",
    valid_to: coupon.valid_to ? coupon.valid_to.slice(0, 10) : "",
    usage_limit: coupon.usage_limit != null ? String(coupon.usage_limit) : "",
    is_active: coupon.is_active,
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/coupons"
          className="font-body text-xs text-earth-brown hover:underline underline-offset-4"
        >
          ← Coupons
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium italic text-charcoal">
          Edit Coupon
        </h1>
        <p className="mt-1 font-mono text-sm font-semibold tracking-widest text-charcoal/60">
          {coupon.code}
        </p>
      </div>
      <div className="max-w-2xl">
        <CouponForm mode="edit" couponId={id} initial={initial} />
      </div>
    </div>
  );
}
