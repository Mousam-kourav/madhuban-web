import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { contactSchema } from "@/lib/forms/contact-schema";
import { contactEnquiryEmail } from "@/lib/email/templates/contact-enquiry";
import { sendEmail } from "@/lib/email/resend";
import { checkRateLimit } from "@/lib/ratelimit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createNotification } from "@/lib/admin/notifications";
import { ADMIN_EMAIL } from "@/lib/admin/constants";

const RECIPIENT = ADMIN_EMAIL;

export async function POST(req: NextRequest) {
  const rl = await checkRateLimit(req);
  if (rl.limited) {
    return NextResponse.json(
      { error: "rate_limited", retry_after: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 422 },
    );
  }

  // Honeypot: if the hidden "website" field is filled, silently succeed
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, phone, message } = parsed.data;
  const { subject, html } = contactEnquiryEmail({
    name,
    email,
    phone: phone || undefined,
    message,
  });

  try {
    await sendEmail({ to: RECIPIENT, subject, html, replyTo: email });
  } catch (err) {
    console.error("[contact form] send failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send message. Please try again or email us directly." },
      { status: 500 },
    );
  }

  // Best-effort lead capture — non-fatal if DB fails
  try {
    const supabase = createAdminClient();
    const { data: lead } = await supabase
      .from("leads")
      .insert({ name, email, phone: phone || null, message, source: "contact_form" })
      .select("id")
      .single();
    if (lead?.id) {
      await createNotification({
        type: "lead_received",
        title: "New Contact Lead",
        body: `${name} (${email}) submitted the contact form.`,
        linkUrl: "/admin/leads",
      });
    }
  } catch (err) {
    console.error("[contact form] lead insert failed:", err);
  }

  return NextResponse.json({ ok: true });
}
