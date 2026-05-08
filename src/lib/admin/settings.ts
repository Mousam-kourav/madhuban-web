import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AppSettingsRow } from "@/lib/supabase/database.types";
import { ADMIN_EMAIL } from "@/lib/admin/constants";

const DEFAULTS: Omit<AppSettingsRow, "id" | "updated_at" | "updated_by"> = {
  contact_email: ADMIN_EMAIL,
  contact_phone: "+919770558419",
  whatsapp_number: "+919770558419",
  gstin: "23AAACT5004A1Z9",
  legal_entity_name: "Somaiya Properties And Investments Private Limited",
  trade_name: "Madhuban Eco Retreat",
  registered_address: "Narmada Farm Kheri, Rehti, Sehore, Madhya Pradesh, 466446",
  business_hours_open: "09:00",
  business_hours_close: "21:00",
  upi_id: null,
  upi_payee_name: null,
  email_signature: "Warm regards,\nMadhuban Eco Retreat Team",
  default_gst_rate_low: 12,
  default_gst_rate_high: 18,
  gst_rate_threshold: 7500,
};

export type AppSettings = Omit<AppSettingsRow, "id" | "updated_at" | "updated_by">;

export async function getSettings(): Promise<AppSettings> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("app_settings")
    .select("*")
    .eq("id", "singleton")
    .single();

  if (!data) return DEFAULTS;

  return {
    contact_email: data.contact_email,
    contact_phone: data.contact_phone,
    whatsapp_number: data.whatsapp_number,
    gstin: data.gstin,
    legal_entity_name: data.legal_entity_name,
    trade_name: data.trade_name,
    registered_address: data.registered_address,
    business_hours_open: data.business_hours_open,
    business_hours_close: data.business_hours_close,
    upi_id: data.upi_id,
    upi_payee_name: data.upi_payee_name,
    email_signature: data.email_signature,
    default_gst_rate_low: Number(data.default_gst_rate_low),
    default_gst_rate_high: Number(data.default_gst_rate_high),
    gst_rate_threshold: Number(data.gst_rate_threshold),
  };
}
