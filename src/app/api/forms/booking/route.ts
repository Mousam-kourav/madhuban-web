import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { bookingSchema } from "@/lib/forms/booking-schema";
import { bookingEnquiryEmail } from "@/lib/email/templates/booking-enquiry";
import { sendEmail } from "@/lib/email/resend";

const RECIPIENT = process.env.CONTACT_FORM_TO ?? "madhubanecoretreat@gmail.com";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
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

  const { name, email, phone, checkIn, checkOut, adults, children, roomType, specialRequests } =
    parsed.data;

  const { subject, html } = bookingEnquiryEmail({
    name,
    email,
    phone,
    checkIn,
    checkOut,
    adults,
    children,
    roomType,
    specialRequests,
  });

  try {
    await sendEmail({ to: RECIPIENT, subject, html, replyTo: email });
  } catch (err) {
    console.error("[booking enquiry] send failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send enquiry. Please try again or WhatsApp us directly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
