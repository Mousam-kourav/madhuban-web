"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Card, Tabs, Button, Input, TextArea } from "@/components/admin/ui";
import type { AppSettings } from "@/lib/admin/settings";

const TABS = [
  { label: "Business Info", value: "business" },
  { label: "Operations", value: "operations" },
  { label: "Email", value: "email" },
  { label: "Pricing", value: "pricing" },
];

interface Props {
  initialSettings: AppSettings;
}

export function SettingsClient({ initialSettings }: Props) {
  const [tab, setTab] = useState("business");
  const [saving, setSaving] = useState(false);
  const [s, setS] = useState<AppSettings>(initialSettings);

  function field(key: keyof AppSettings) {
    return {
      value: (s[key] ?? "") as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setS((prev) => ({ ...prev, [key]: e.target.value })),
    };
  }

  async function save(keys: (keyof AppSettings)[]) {
    setSaving(true);
    const body: Record<string, unknown> = {};
    for (const k of keys) body[k] = s[k];
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-charcoal">Settings</h1>
        <p className="mt-1 font-body text-sm text-charcoal/60">
          Manage business configuration for Madhuban Eco Retreat.
        </p>
      </div>

      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === "business" && (
        <Card>
          <div className="space-y-5">
            <SectionHeading>Legal Entity</SectionHeading>
            <Input label="Legal Entity Name" required {...field("legal_entity_name")} />
            <Input label="Trade Name" required {...field("trade_name")} />
            <Input label="GSTIN" required {...field("gstin")} />

            <SectionHeading>Contact</SectionHeading>
            <Input label="Contact Email" type="email" required {...field("contact_email")} />
            <Input label="Contact Phone" type="tel" required {...field("contact_phone")} />
            <Input label="WhatsApp Number" type="tel" required {...field("whatsapp_number")} />

            <SectionHeading>Address</SectionHeading>
            <TextArea
              label="Registered Address"
              required
              rows={3}
              {...field("registered_address")}
            />

            <SaveBar keys={["legal_entity_name","trade_name","gstin","contact_email","contact_phone","whatsapp_number","registered_address"]} save={save} saving={saving} />
          </div>
        </Card>
      )}

      {tab === "operations" && (
        <Card>
          <div className="space-y-5">
            <SectionHeading>Business Hours</SectionHeading>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Opens" type="time" required {...field("business_hours_open")} />
              <Input label="Closes" type="time" required {...field("business_hours_close")} />
            </div>

            <SectionHeading>UPI Payment</SectionHeading>
            <Input label="UPI ID" placeholder="e.g. madhuban@upi" {...field("upi_id")} />
            <Input label="UPI Payee Name" placeholder="e.g. Madhuban Eco Retreat" {...field("upi_payee_name")} />

            <SaveBar keys={["business_hours_open","business_hours_close","upi_id","upi_payee_name"]} save={save} saving={saving} />
          </div>
        </Card>
      )}

      {tab === "email" && (
        <Card>
          <div className="space-y-5">
            <SectionHeading>Email Signature</SectionHeading>
            <TextArea
              label="Signature"
              helperText="Appended to all outgoing guest emails."
              rows={4}
              {...field("email_signature")}
            />

            <SaveBar keys={["email_signature"]} save={save} saving={saving} />
          </div>
        </Card>
      )}

      {tab === "pricing" && (
        <Card>
          <div className="space-y-5">
            <SectionHeading>GST Rate Defaults</SectionHeading>
            <p className="font-body text-sm text-charcoal/60">
              These are read-only fallback values. The actual GST rate applied to each booking is
              computed dynamically from the room's base price:
              rooms priced at or below ₹{s.gst_rate_threshold.toLocaleString("en-IN")} per night
              attract {s.default_gst_rate_low}% GST; above that threshold attract {s.default_gst_rate_high}% GST.
            </p>
            <dl className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-admin-card-border p-4 text-center">
                <dt className="font-body text-xs text-charcoal/60 uppercase tracking-wider">Low Rate</dt>
                <dd className="mt-1 font-display text-3xl text-charcoal">{s.default_gst_rate_low}%</dd>
              </div>
              <div className="rounded-xl border border-admin-card-border p-4 text-center">
                <dt className="font-body text-xs text-charcoal/60 uppercase tracking-wider">High Rate</dt>
                <dd className="mt-1 font-display text-3xl text-charcoal">{s.default_gst_rate_high}%</dd>
              </div>
              <div className="rounded-xl border border-admin-card-border p-4 text-center">
                <dt className="font-body text-xs text-charcoal/60 uppercase tracking-wider">Threshold</dt>
                <dd className="mt-1 font-display text-2xl text-charcoal">₹{s.gst_rate_threshold.toLocaleString("en-IN")}</dd>
              </div>
            </dl>
            <p className="font-body text-xs text-charcoal/50">
              To change these thresholds, update <code className="bg-warm-beige/60 px-1 rounded">src/lib/gst.ts</code> and re-deploy.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-charcoal/50 pt-2 border-t border-admin-card-border first:border-0 first:pt-0">
      {children}
    </h2>
  );
}

function SaveBar({
  keys,
  save,
  saving,
}: {
  keys: (keyof AppSettings)[];
  save: (keys: (keyof AppSettings)[]) => Promise<void>;
  saving: boolean;
}) {
  return (
    <div className="flex justify-end pt-2 border-t border-admin-card-border">
      <Button
        onClick={() => void save(keys)}
        loading={saving}
        size="md"
      >
        <Save className="w-4 h-4" />
        Save
      </Button>
    </div>
  );
}
