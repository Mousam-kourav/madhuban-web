import type { Metadata } from "next";
import { format, startOfMonth, endOfMonth, addDays, parseISO } from "date-fns";
import { getAvailabilityData } from "@/lib/admin/availability";
import { AvailabilityClient } from "./availability-client";

export const metadata: Metadata = { title: "Availability — Madhuban Admin" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ view?: string; start?: string }>;

export default async function AvailabilityPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const view = params.view === "week" ? "week" : "month";
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");

  // Determine the visible date range from URL params
  let fromDate: string;
  let toDate: string; // exclusive upper bound for queries

  if (view === "week") {
    const startRaw = params.start ?? todayStr;
    const start = parseISO(startRaw);
    fromDate = format(start, "yyyy-MM-dd");
    toDate = format(addDays(start, 7), "yyyy-MM-dd");
  } else {
    // Month view: normalize to first of month regardless of provided start
    const startRaw = params.start ?? todayStr;
    const start = parseISO(startRaw);
    const monthStart = startOfMonth(start);
    const monthEnd = endOfMonth(start);
    fromDate = format(monthStart, "yyyy-MM-dd");
    toDate = format(addDays(monthEnd, 1), "yyyy-MM-dd");
  }

  const { rooms, bookings, blocks } = await getAvailabilityData(fromDate, toDate);

  return (
    <AvailabilityClient
      rooms={rooms}
      bookings={bookings}
      blocks={blocks}
      view={view}
      fromDate={fromDate}
      toDate={toDate}
      today={todayStr}
    />
  );
}
