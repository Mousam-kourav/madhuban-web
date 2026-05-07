import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getFinancialYear } from "@/lib/gst";

export async function generateNextInvoiceNumber(): Promise<{
  fy: string;
  serial: number;
  invoiceNumber: string;
}> {
  const fy = getFinancialYear();
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("increment_invoice_counter", {
    p_fy: fy,
  });

  if (error) throw new Error(`Counter increment failed: ${error.message}`);

  const serial = data as number;
  const invoiceNumber = `MADH/INV/${fy}/${serial.toString().padStart(4, "0")}`;
  return { fy, serial, invoiceNumber };
}
