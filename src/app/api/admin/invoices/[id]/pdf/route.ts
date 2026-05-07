import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { createAdminClient } from "@/lib/supabase/admin";
import { InvoicePDF } from "@/components/admin/invoice/InvoicePDF";
import type { InvoiceRow } from "@/lib/supabase/database.types";
import type { DocumentProps } from "@react-pdf/renderer";
import { assertAdmin } from "@/lib/admin/auth";


export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const invoice = data as InvoiceRow;

  const pdfStream = await renderToStream(
    React.createElement(InvoicePDF, { invoice }) as React.ReactElement<DocumentProps>,
  );

  const fileName = invoice.invoice_number.replace(/\//g, "-");

  const webStream = new ReadableStream({
    start(controller) {
      pdfStream.on("data", (chunk: Buffer) => controller.enqueue(chunk));
      pdfStream.on("end", () => controller.close());
      pdfStream.on("error", (err: Error) => controller.error(err));
    },
  });

  return new Response(webStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
    },
  });
}
