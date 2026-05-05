import type { Metadata } from "next";
import {
  getBookingsList,
  getBookingsStats,
  getRoomTypes,
  resolveGuestIdsByName,
  type BookingsQueryParams,
} from "@/lib/admin/bookings";
import { BookingsListClient } from "./bookings-list-client";

export const metadata: Metadata = { title: "All Reservations — Madhuban Admin" };

function formatTodayLong(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BookingsListPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  function str(key: string): string | undefined {
    const v = sp[key];
    return typeof v === "string" && v ? v : undefined;
  }

  const from   = str("from");
  const to     = str("to");
  const source = str("source");
  const status = str("status");
  const roomId = str("room");
  const q      = str("q");
  const sort   = str("sort");
  const page   = Math.max(1, parseInt(str("page") ?? "1", 10));

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]!;

  const params: BookingsQueryParams = { from, to, source, status, roomId, q, sort, page };

  // Resolve guest IDs for name-based search (shared across stats + list queries)
  const guestIds = q ? await resolveGuestIdsByName(q) : [];

  // Parallelize all three data queries
  const [bookings, stats, roomTypes] = await Promise.all([
    getBookingsList(params, guestIds),
    getBookingsStats(params, guestIds),
    getRoomTypes(),
  ]);

  return (
    <BookingsListClient
      bookings={bookings}
      stats={stats}
      roomTypes={roomTypes}
      initialParams={{
        from,
        to,
        source,
        status,
        roomId,
        q,
        sort,
        page,
      }}
      today={todayStr}
      todayFormatted={formatTodayLong(today)}
    />
  );
}
