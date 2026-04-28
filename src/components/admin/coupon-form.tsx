"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface CouponFormValues {
  code: string;
  discount_type: "percentage" | "flat";
  discount_value: string;
  min_booking_value: string;
  valid_from: string;
  valid_to: string;
  usage_limit: string;
  is_active: boolean;
}

interface Props {
  initial?: Partial<CouponFormValues>;
  couponId?: string;
  mode: "new" | "edit";
}

const INPUT = "w-full rounded-lg border border-border bg-white px-3 py-2.5 font-body text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-earth-brown";
const LABEL = "mb-1 block font-body text-xs font-medium text-charcoal/70";

export function CouponForm({ initial, couponId, mode }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<CouponFormValues>({
    code: initial?.code ?? "",
    discount_type: initial?.discount_type ?? "percentage",
    discount_value: initial?.discount_value ?? "",
    min_booking_value: initial?.min_booking_value ?? "0",
    valid_from: initial?.valid_from ?? "",
    valid_to: initial?.valid_to ?? "",
    usage_limit: initial?.usage_limit ?? "",
    is_active: initial?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof CouponFormValues, value: string | boolean) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      code: values.code.trim().toUpperCase(),
      discount_type: values.discount_type,
      discount_value: Number(values.discount_value),
      min_booking_value: Number(values.min_booking_value) || 0,
      valid_from: values.valid_from || null,
      valid_to: values.valid_to || null,
      usage_limit: values.usage_limit ? Number(values.usage_limit) : null,
      is_active: values.is_active,
    };

    try {
      const url = mode === "new"
        ? "/api/admin/coupons"
        : `/api/admin/coupons/${couponId}`;
      const method = mode === "new" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { id?: string; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Failed to save coupon");
        setSaving(false);
        return;
      }

      router.push("/admin/coupons");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 font-body text-sm text-red-600">{error}</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Coupon Code *</label>
          <input
            type="text"
            value={values.code}
            onChange={(e) => set("code", e.target.value.toUpperCase())}
            placeholder="FOREST20"
            className={INPUT}
            required
          />
        </div>

        <div>
          <label className={LABEL}>Discount Type *</label>
          <select
            value={values.discount_type}
            onChange={(e) => set("discount_type", e.target.value as "percentage" | "flat")}
            className={INPUT}
          >
            <option value="percentage">Percentage (%)</option>
            <option value="flat">Flat Amount (₹)</option>
          </select>
        </div>

        <div>
          <label className={LABEL}>
            Discount Value * {values.discount_type === "percentage" ? "(%)" : "(₹)"}
          </label>
          <input
            type="number"
            min="0"
            max={values.discount_type === "percentage" ? "100" : undefined}
            value={values.discount_value}
            onChange={(e) => set("discount_value", e.target.value)}
            placeholder={values.discount_type === "percentage" ? "20" : "500"}
            className={INPUT}
            required
          />
        </div>

        <div>
          <label className={LABEL}>Min Booking Value (₹)</label>
          <input
            type="number"
            min="0"
            value={values.min_booking_value}
            onChange={(e) => set("min_booking_value", e.target.value)}
            placeholder="5000"
            className={INPUT}
          />
        </div>

        <div>
          <label className={LABEL}>Valid From</label>
          <input
            type="date"
            value={values.valid_from}
            onChange={(e) => set("valid_from", e.target.value)}
            className={INPUT}
          />
        </div>

        <div>
          <label className={LABEL}>Valid To</label>
          <input
            type="date"
            value={values.valid_to}
            onChange={(e) => set("valid_to", e.target.value)}
            className={INPUT}
          />
        </div>

        <div>
          <label className={LABEL}>Usage Limit (blank = unlimited)</label>
          <input
            type="number"
            min="1"
            value={values.usage_limit}
            onChange={(e) => set("usage_limit", e.target.value)}
            placeholder="Unlimited"
            className={INPUT}
          />
        </div>

        <div className="flex items-center gap-3 pt-5">
          <input
            type="checkbox"
            id="is_active"
            checked={values.is_active}
            onChange={(e) => set("is_active", e.target.checked)}
            className="h-4 w-4 rounded border-border text-earth-brown focus:ring-earth-brown"
          />
          <label htmlFor="is_active" className="font-body text-sm text-charcoal">
            Active (visible in booking flow)
          </label>
        </div>
      </div>

      <div className="flex gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center rounded-xl bg-earth-brown px-6 font-body text-sm font-medium text-ivory transition-colors hover:bg-earth-brown/90 disabled:opacity-50"
        >
          {saving ? "Saving…" : mode === "new" ? "Create Coupon" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/coupons")}
          className="inline-flex h-11 items-center rounded-xl border border-border px-6 font-body text-sm font-medium text-charcoal transition-colors hover:bg-cream"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
