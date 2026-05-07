import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateAdminPricing } from "@/lib/admin/calculate-admin-pricing";
import { checkAvailability } from "@/lib/booking/availability";
import { generateBookingReference } from "@/lib/booking/reference";
import { sendEmail } from "@/lib/email/resend";
import { bookingConfirmationGuestEmail } from "@/lib/email/templates/booking-confirmation-guest";
import { bookingConfirmationAdminEmail } from "@/lib/email/templates/booking-confirmation-admin";
import { createNotification } from "@/lib/admin/notifications";
import type { Json } from "@/lib/supabase/database.types";
import { z } from "zod";

const ADMIN_EMAIL = "madhubanecoretreat@gmail.com";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return user;
}

const addonSchema = z.object({
  id: z.string(),
  label: z.string(),
  price: z.number().nonnegative(),
  qty: z.number().int().min(1),
  unit: z.string(),
});

const createBookingBodySchema = z.object({
  checkIn:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  checkOut:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  roomId:          z.string().uuid("Invalid room ID"),
  numAdults:       z.number().int().min(1),
  numChildren:     z.number().int().min(0),
  extraMattress:   z.number().int().min(0),
  specialRequests: z.string().optional(),
  guest: z.object({
    name:    z.string().min(1),
    mobile:  z.string().regex(/^\d{10}$/, "Mobile must be 10 digits"),
    email:   z.string().email().optional().or(z.literal("")),
    idType:  z.string().optional(),
    idNumber: z.string().optional(),
  }),
  source: z.enum(["website", "walkin", "phone", "agent", "mmt", "goibibo", "airbnb", "other"]),
  corporate: z.object({
    gstin:       z.string().min(1),
    companyName: z.string().min(1),
    address:     z.string().optional(),
  }).nullable(),
  addons: z.array(addonSchema),
  internalNote: z.string().optional(),
  assignedUnit: z.string().optional(),
  advance: z.object({
    amount:        z.number().nonnegative(),
    paymentMethod: z.string().min(1),
  }).nullable(),
  sendEmail: z.boolean(),
});

export async function POST(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = createBookingBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const {
    checkIn, checkOut, roomId, numAdults, numChildren,
    specialRequests, guest, source, corporate, addons, internalNote, assignedUnit, advance, sendEmail: doSendEmail,
  } = parsed.data;

  if (checkIn >= checkOut) {
    return NextResponse.json({ error: "Check-out must be after check-in" }, { status: 400 });
  }

  try {
    // Server-side availability re-check (race condition protection)
    const avail = await checkAvailability({ roomId, checkIn, checkOut });
    if (!avail.available) {
      return NextResponse.json({ error: avail.reason ?? "Room unavailable for selected dates" }, { status: 409 });
    }

    // Authoritative server-side pricing
    const pricing = await calculateAdminPricing({
      roomId, checkIn, checkOut, adults: numAdults, children: numChildren, addons,
    });

    const bookingRef = await generateBookingReference();
    const supabase = createAdminClient();

    // Find or create guest (look up by mobile first since email is optional)
    let guestId: string;
    const normalizedEmail = guest.email?.trim().toLowerCase() || null;
    const normalizedMobile = guest.mobile.trim();

    // Try find by email if provided, then by mobile
    const { data: existingByEmail } = normalizedEmail
      ? await supabase.from("guests").select("id").eq("email", normalizedEmail).maybeSingle()
      : { data: null };
    const { data: existingByMobile } = !existingByEmail
      ? await supabase.from("guests").select("id").eq("mobile", normalizedMobile).maybeSingle()
      : { data: null };

    const existingGuest = existingByEmail ?? existingByMobile;

    if (existingGuest) {
      guestId = existingGuest.id;
      // Update guest with any new info provided
      await supabase.from("guests").update({
        name: guest.name.trim(),
        ...(guest.idType ? { id_type: guest.idType } : {}),
        ...(guest.idNumber ? { id_number: guest.idNumber } : {}),
        ...(normalizedEmail ? { email: normalizedEmail } : {}),
      }).eq("id", guestId);
    } else {
      const { data: newGuest, error: guestErr } = await supabase
        .from("guests")
        .insert({
          name: guest.name.trim(),
          mobile: normalizedMobile,
          email: normalizedEmail ?? "",
          id_type: guest.idType ?? null,
          id_number: guest.idNumber ?? null,
        })
        .select("id")
        .single();

      if (guestErr || !newGuest) {
        console.error("[admin/bookings/create] guest insert:", guestErr);
        return NextResponse.json({ error: "Failed to create guest record" }, { status: 500 });
      }
      guestId = newGuest.id;
    }

    // Determine booking status
    const hasAdvance = (advance?.amount ?? 0) > 0;
    const status = hasAdvance ? "CONFIRMED" : "PENDING_PAYMENT";
    const paymentStatus = hasAdvance ? "partial" : "pending";

    // Build initial staff_notes entry from internalNote
    const staffNotes: Json = internalNote?.trim()
      ? [{
          author: user.email,
          note: internalNote.trim(),
          created_at: new Date().toISOString(),
        }]
      : [];

    // Addons stored with historical price
    const addonsForStorage: Json = addons.map((a) => ({
      id: a.id,
      label: a.label,
      price: a.price,
      qty: a.qty,
      unit: a.unit,
    }));

    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .insert({
        booking_ref:            bookingRef,
        room_id:                roomId,
        guest_id:               guestId,
        checkin:                checkIn,
        checkout:               checkOut,
        num_adults:             numAdults,
        num_children:           numChildren,
        base_amount:            pricing.subtotalBeforeGst,
        gst_amount:             pricing.gstAmount,
        discount_amount:        0,
        total_amount:           pricing.totalAmount,
        special_requests:       specialRequests ?? null,
        status,
        payment_status:         paymentStatus,
        source,
        staff_notes:            staffNotes,
        corporate_gstin:        corporate?.gstin ?? null,
        corporate_company_name: corporate?.companyName ?? null,
        corporate_address:      corporate?.address ?? null,
        addons:                 addonsForStorage,
        assigned_unit:          assignedUnit?.trim() || null,
      })
      .select("id, booking_ref")
      .single();

    if (bookingErr || !booking) {
      console.error("[admin/bookings/create] booking insert:", bookingErr);
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

    // Insert offline payment record if advance collected
    if (hasAdvance && advance) {
      const { error: payErr } = await supabase.from("payments").insert({
        booking_id:   booking.id,
        amount:       advance.amount,
        status:       "captured",
        payment_type: "advance",
        method:       advance.paymentMethod,
        captured_at:  new Date().toISOString(),
        notes:        `Manual advance — recorded by ${user.email}`,
      });
      if (payErr) {
        console.error("[admin/bookings/create] payment insert:", payErr);
      }
    }

    // Audit log
    await supabase.from("audit_log").insert({
      admin_user_id: user.id,
      actor_email:   user.email ?? null,
      action:        "booking_created_manual",
      entity_type:   "booking",
      entity_id:     booking.id,
      details: {
        booking_ref: bookingRef,
        source,
        status,
        total_amount: pricing.totalAmount,
        advance_amount: advance?.amount ?? 0,
        payment_method: advance?.paymentMethod ?? null,
        send_email: doSendEmail,
      } as Json,
    });

    // Notification
    try {
      await createNotification({
        type: "booking_created",
        title: `New booking — ${booking.booking_ref}`,
        body: `${guest.name.trim()} · ${pricing.roomName} · ₹${pricing.totalAmount.toLocaleString("en-IN")} (manual)`,
        linkUrl: `/admin/bookings/${booking.id}`,
      });
    } catch (err) {
      console.error("[admin/bookings/create] notification failed:", err);
    }

    // Send confirmation emails if requested
    if (doSendEmail && normalizedEmail) {
      const nights = pricing.nights;
      const totalAmount = pricing.totalAmount;

      const confirmationData = {
        bookingRef:      booking.booking_ref,
        guestName:       guest.name.trim(),
        roomName:        pricing.roomName,
        checkIn,
        checkOut,
        nights,
        adults:          numAdults,
        children:        numChildren,
        totalAmount,
        specialRequests: specialRequests ?? null,
      };

      try {
        await sendEmail({ to: normalizedEmail, ...bookingConfirmationGuestEmail(confirmationData) });
      } catch (err) {
        console.error("[admin/bookings/create] guest email failed:", err);
      }

      try {
        await sendEmail({
          to: ADMIN_EMAIL,
          ...bookingConfirmationAdminEmail({
            ...confirmationData,
            guestEmail:  normalizedEmail,
            guestMobile: normalizedMobile,
            source,
            paidAmount: advance?.amount ?? 0,
          }),
        });
      } catch (err) {
        console.error("[admin/bookings/create] admin email failed:", err);
      }
    }

    return NextResponse.json({ bookingId: booking.id, bookingRef: booking.booking_ref });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create booking";
    console.error("[admin/bookings/create]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
