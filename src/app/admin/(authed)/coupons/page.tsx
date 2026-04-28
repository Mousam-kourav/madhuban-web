import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import type { Metadata } from "next";
import { CouponToggle } from "./coupon-toggle";

export const metadata: Metadata = { title: "Coupons — Madhuban Admin" };

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function CouponsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  const coupons = data ?? [];

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
            Admin · CMS
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium italic text-charcoal">
            Coupons
          </h1>
        </div>
        <Link
          href="/admin/coupons/new"
          className="inline-flex h-10 items-center rounded-xl bg-earth-brown px-5 font-body text-sm font-medium text-ivory transition-colors hover:bg-earth-brown/90"
        >
          + New Coupon
        </Link>
      </div>

      {coupons.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">
          No coupons yet.{" "}
          <Link href="/admin/coupons/new" className="text-earth-brown underline-offset-4 hover:underline">
            Create one
          </Link>
          .
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-border bg-cream text-xs">
                  <th className="px-4 py-3 text-left font-semibold text-charcoal/70">Code</th>
                  <th className="px-4 py-3 text-left font-semibold text-charcoal/70">Discount</th>
                  <th className="px-4 py-3 text-left font-semibold text-charcoal/70">Min Value</th>
                  <th className="px-4 py-3 text-left font-semibold text-charcoal/70">Valid From</th>
                  <th className="px-4 py-3 text-left font-semibold text-charcoal/70">Valid To</th>
                  <th className="px-4 py-3 text-center font-semibold text-charcoal/70">Usage</th>
                  <th className="px-4 py-3 text-center font-semibold text-charcoal/70">Active</th>
                  <th className="px-4 py-3 text-right font-semibold text-charcoal/70">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-cream/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold tracking-widest text-charcoal">
                      {c.code}
                    </td>
                    <td className="px-4 py-3 text-charcoal">
                      {c.discount_type === "percent"
                        ? `${c.discount_value}%`
                        : `₹${Number(c.discount_value).toLocaleString("en-IN")}`}
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">
                      {c.min_booking_value > 0 ? `₹${Number(c.min_booking_value).toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">{formatDate(c.valid_from)}</td>
                    <td className="px-4 py-3 text-charcoal/70">{formatDate(c.valid_to)}</td>
                    <td className="px-4 py-3 text-center text-charcoal/70">
                      {c.used_count} / {c.usage_limit ?? "∞"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <CouponToggle couponId={c.id} isActive={c.is_active} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/coupons/${c.id}/edit`}
                        className="font-body text-xs text-earth-brown hover:underline underline-offset-4"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
