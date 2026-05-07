import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { createAdminClient } from "@/lib/supabase/admin";
import { VoucherPDF } from "@/components/admin/voucher/VoucherPDF";
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

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      id, booking_ref, total_amount, checkin, checkout, num_adults, num_children,
      guests!guest_id ( name ),
      rooms!room_id ( name )
    `)
    .eq("id", id)
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const guest = Array.isArray(booking.guests) ? booking.guests[0] : booking.guests as unknown as { name: string } | null;
  const room = Array.isArray(booking.rooms) ? booking.rooms[0] : booking.rooms as unknown as { name: string } | null;

  const nights = Math.round(
    (new Date(booking.checkout).getTime() - new Date(booking.checkin).getTime()) / 86400000,
  );

  const pdfStream = await renderToStream(
    React.createElement(VoucherPDF, {
      data: {
        bookingRef: booking.booking_ref,
        guestName: guest?.name ?? "Guest",
        roomName: room?.name ?? "Room",
        checkIn: booking.checkin,
        checkOut: booking.checkout,
        nights,
        adults: booking.num_adults,
        children: booking.num_children,
        totalAmount: Number(booking.total_amount),
      },
    }) as React.ReactElement<DocumentProps>,
  );

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
      "Content-Disposition": `attachment; filename="Voucher-${booking.booking_ref}.pdf"`,
    },
  });
}
