"use server";

import {
  getAllBookingsForExport,
  resolveGuestIdsByName,
  type BookingsQueryParams,
  type BookingListItem,
} from "@/lib/admin/bookings";

export async function fetchBookingsForExport(
  params: BookingsQueryParams
): Promise<BookingListItem[]> {
  const guestIds = params.q ? await resolveGuestIdsByName(params.q) : [];
  return getAllBookingsForExport(params, guestIds);
}
