import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { contactSchema } from "@/lib/forms/contact-schema";
import { contactEnquiryEmail } from "@/lib/email/templates/contact-enquiry";
import { sendEmail } from "@/lib/email/resend";

const RECIPIENT = process.env.CONTACT_FORM_TO ?? "madhubanecoretreat@gmail.com";

export async function POST(req: NextRequest) {
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

  return NextResponse.json({ ok: true });
}
