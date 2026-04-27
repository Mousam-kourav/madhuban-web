import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

interface AvailabilityParams {
  roomId: string;
  checkIn: string;  // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
}

interface AvailabilityResult {
  available: boolean;
  reason?: string;
}

// Two date ranges [A,B) and [C,D) overlap when A < D AND B > C.
export async function checkAvailability({
  roomId,
  checkIn,
  checkOut,
}: AvailabilityParams): Promise<AvailabilityResult> {
  const supabase = createAdminClient();

  // Check confirmed/in-house bookings that overlap requested range
  const { data: conflictingBookings, error: bookingError } = await supabase
    .from("bookings")
    .select("id, reference_number, check_in, check_out, status")
    .eq("room_id", roomId)
    .in("status", ["CONFIRMED", "CHECKED_IN"])
    .lt("check_in", checkOut)
    .gt("check_out", checkIn)
    .limit(1);

  if (bookingError) throw new Error(bookingError.message);

  if (conflictingBookings && conflictingBookings.length > 0) {
    return {
      available: false,
      reason: "These dates are already booked. Please choose different dates.",
    };
  }

  // Check manual blocks
  const { data: blocks, error: blockError } = await supabase
    .from("manual_blocks")
    .select("id, start_date, end_date, reason")
    .eq("room_id", roomId)
    .lt("start_date", checkOut)
    .gt("end_date", checkIn)
    .limit(1);

  if (blockError) throw new Error(blockError.message);

  if (blocks && blocks.length > 0) {
    return {
      available: false,
      reason: "These dates are not available. Please contact us to check alternatives.",
    };
  }

  return { available: true };
}
