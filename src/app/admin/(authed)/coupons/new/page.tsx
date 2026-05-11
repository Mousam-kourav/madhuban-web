import type { Metadata } from "next";
import Link from "next/link";
import { CouponForm } from "@/components/admin/coupon-form";

export const metadata: Metadata = { title: "New Coupon — Madhuban Admin" };

export default function NewCouponPage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/coupons"
          className="font-body text-xs text-earth-brown hover:underline underline-offset-4"
        >
          ← Coupons
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium text-charcoal">
          New Coupon
        </h1>
      </div>
      <div className="max-w-2xl">
        <CouponForm mode="new" />
      </div>
    </div>
  );
}
