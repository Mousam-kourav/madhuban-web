"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CouponToggle({ couponId, isActive }: { couponId: string; isActive: boolean }) {
  const router = useRouter();
  const [active, setActive] = useState(isActive);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    setSaving(true);
    const next = !active;
    try {
      await fetch(`/api/admin/coupons/${couponId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: next }),
      });
      setActive(next);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={() => void toggle()}
      disabled={saving}
      aria-label={active ? "Deactivate coupon" : "Activate coupon"}
      className={`inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2 disabled:opacity-50 ${
        active ? "bg-earth-brown" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          active ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
