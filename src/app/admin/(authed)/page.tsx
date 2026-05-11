import type { Metadata } from "next";
import Link from "next/link";
import {
  UserCheck,
  TrendingUp,
  Bed,
  Clock,
  CalendarDays,
  Hotel,
} from "lucide-react";

import { fetchDashboardData, formatIndianCurrency, revenueDirection, bookingStatusVariant, bookingStatusLabel, initialsFromName, avatarColor, formatCheckinDate } from "@/lib/admin/dashboard";
import { Card, StatCard, Badge, EmptyState } from "@/components/admin/ui";
import { QuickActions, WeekendOccupancyAlert } from "./dashboard-client";

export const metadata: Metadata = { title: "Dashboard — Madhuban Admin" };

// Disable static caching — dashboard must show live data
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const {
    stats,
    recentBookings,
    roomAvailability,
    calendarDays,
    weekendAlert,
    currentMonth,
    calendarStartDow,
  } = await fetchDashboardData();

  const revDelta = revenueDirection(stats.thisMonthRevenue, stats.lastMonthRevenue);

  return (
    <div className="space-y-6">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div>
        <h1 className="font-display text-3xl text-charcoal">Dashboard</h1>
        <p className="mt-0.5 font-body text-sm text-charcoal/60">
          Live estate overview
        </p>
      </div>

      {/* ── Stat cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Tonight's Check-ins"
          value={stats.tonightCheckins}
          delta={{ value: `${stats.inHouseCount} rooms in-house`, direction: "neutral" }}
          icon={<UserCheck className="h-4 w-4" />}
        />
        <StatCard
          label="This Month Revenue"
          value={formatIndianCurrency(stats.thisMonthRevenue)}
          delta={
            stats.lastMonthRevenue === 0
              ? { value: "No prior month data", direction: "neutral" }
              : {
                  value: `${revDelta.pct}% vs last month`,
                  direction: revDelta.direction,
                }
          }
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="This Month Occupancy"
          value={`${stats.monthlyOccupancyPct}%`}
          delta={{ value: `${stats.todayFreeRooms} rooms free today`, direction: "neutral" }}
          icon={<Bed className="h-4 w-4" />}
        />
        <StatCard
          label="Pending Confirmations"
          value={stats.pendingCount}
          delta={{ value: "Awaiting verify", direction: "neutral" }}
          icon={<Clock className="h-4 w-4" />}
          href="/admin/bookings"
        />
      </div>

      {/* ── Row 2: Recent bookings + Calendar heatmap ────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Recent Bookings — 3/5 width */}
        <div className="lg:col-span-3">
          <RecentBookingsPanel bookings={recentBookings} />
        </div>

        {/* Calendar Heatmap — 2/5 width */}
        <div className="lg:col-span-2">
          <CalendarHeatmap
            days={calendarDays}
            monthLabel={currentMonth}
            startDow={calendarStartDow}
          />
        </div>
      </div>

      {/* ── Row 3: Room availability + Quick actions ─────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Room Availability — 3/5 */}
        <div className="lg:col-span-3">
          <RoomAvailabilityPanel rooms={roomAvailability} />
        </div>

        {/* Quick Actions — 2/5 */}
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
      </div>

      {/* ── Weekend alert (conditional) ──────────────────────────────────── */}
      {weekendAlert && (
        <WeekendOccupancyAlert
          saturday={weekendAlert.saturday}
          sunday={weekendAlert.sunday}
          pct={weekendAlert.pct}
        />
      )}
    </div>
  );
}

// ─── Recent Bookings Panel ────────────────────────────────────────────────────

function RecentBookingsPanel({
  bookings,
}: {
  bookings: Awaited<ReturnType<typeof fetchDashboardData>>["recentBookings"];
}) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-medium text-charcoal">Recent Bookings</h2>
        <Link
          href="/admin/bookings"
          className="font-body text-xs text-earth-brown hover:underline underline-offset-4"
        >
          View all →
        </Link>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="h-6 w-6" />}
          title="No bookings yet"
          description="When your first guest books, they'll appear here."
        />
      ) : (
        <ul className="divide-y divide-border">
          {bookings.map((booking) => {
            const guestName = booking.guest?.name ?? "Unknown Guest";
            const roomName = booking.room?.name ?? "—";
            const initials = initialsFromName(guestName);
            const avatarCls = avatarColor(guestName);
            const guests = booking.num_adults + booking.num_children;

            return (
              <li key={booking.id}>
                <Link
                  href={`/admin/bookings/${booking.id}`}
                  className="flex items-center gap-3 py-3 transition-colors hover:bg-admin-canvas-bg -mx-6 px-6 first:rounded-t-none"
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-body text-xs font-semibold ${avatarCls}`}
                  >
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body text-sm font-medium text-charcoal">
                      {guestName}
                    </p>
                    <p className="truncate font-body text-xs text-charcoal/60">
                      {roomName} · {formatCheckinDate(booking.checkin)} · {guests}{" "}
                      {guests === 1 ? "guest" : "guests"}
                    </p>
                  </div>

                  {/* Amount + Badge */}
                  <div className="flex flex-shrink-0 flex-col items-end gap-1">
                    <span className="font-body text-sm font-semibold text-charcoal">
                      {formatIndianCurrency(Number(booking.total_amount))}
                    </span>
                    <Badge variant={bookingStatusVariant(booking.status)}>
                      {bookingStatusLabel(booking.status)}
                    </Badge>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

// ─── Room Availability Panel ──────────────────────────────────────────────────

function RoomAvailabilityPanel({
  rooms,
}: {
  rooms: Awaited<ReturnType<typeof fetchDashboardData>>["roomAvailability"];
}) {
  return (
    <Card>
      <h2 className="mb-4 font-display text-lg font-medium text-charcoal">
        Room Availability — Tonight
      </h2>

      {rooms.length === 0 ? (
        <EmptyState
          icon={<Hotel className="h-6 w-6" />}
          title="No rooms configured"
          description="Add rooms in the rooms manager to see availability."
          action={{ label: "Manage Rooms →", href: "/admin/rooms" }}
        />
      ) : (
        <ul className="space-y-4">
          {rooms.map((room) => {
            const isFull = room.occupied >= room.inventory;
            const isAvailable = room.occupied === 0;
            const pct = room.inventory > 0 ? (room.occupied / room.inventory) * 100 : 0;

            const barColor = isFull
              ? "bg-gold-accent"
              : isAvailable
              ? "bg-warm-beige"
              : "bg-forest-green";

            return (
              <li key={room.id}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="font-body text-sm font-medium text-charcoal">{room.name}</span>
                  {isFull ? (
                    <Badge variant="pending">FULL</Badge>
                  ) : isAvailable ? (
                    <span className="font-body text-xs font-medium text-forest-green">
                      AVAILABLE
                    </span>
                  ) : (
                    <span className="font-body text-xs text-charcoal/60">
                      {room.occupied}/{room.inventory} Occupied
                    </span>
                  )}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${Math.max(pct, isAvailable ? 0 : 4)}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

// ─── Calendar Heatmap ─────────────────────────────────────────────────────────

const DOW_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function occupancyClass(pct: number): string {
  if (pct === 0)   return "bg-transparent border border-border text-charcoal/40";
  if (pct < 50)    return "bg-warm-beige text-charcoal";
  if (pct < 90)    return "bg-gold-accent/70 text-charcoal";
  return "bg-forest-green text-ivory";
}

function CalendarHeatmap({
  days,
  monthLabel,
  startDow,
}: {
  days: Awaited<ReturnType<typeof fetchDashboardData>>["calendarDays"];
  monthLabel: string;
  startDow: number;
}) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-medium text-charcoal">{monthLabel}</h2>
        <Link
          href="/admin/bookings"
          className="font-body text-xs text-earth-brown hover:underline underline-offset-4"
        >
          View availability →
        </Link>
      </div>

      {/* Day-of-week header */}
      <div className="mb-1 grid grid-cols-7 gap-1">
        {DOW_LABELS.map((d, i) => (
          <div
            key={i}
            className="text-center font-body text-[10px] font-semibold uppercase tracking-wider text-charcoal/40"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Offset blanks */}
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {days.map((day) => {
          const dayNum = parseInt(day.date.slice(8), 10);
          return (
            <div
              key={day.date}
              title={`${day.date}: ${day.occupancyPct}% occupied`}
              className={`
                relative flex h-8 w-full items-center justify-center rounded-md
                font-body text-xs transition-colors
                ${occupancyClass(day.occupancyPct)}
                ${day.isToday ? "ring-2 ring-gold-accent ring-offset-1" : ""}
              `}
            >
              {dayNum}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        {[
          { cls: "bg-transparent border border-border", label: "Available" },
          { cls: "bg-warm-beige", label: "Partial" },
          { cls: "bg-gold-accent/70", label: "Busy" },
          { cls: "bg-forest-green", label: "Full" },
        ].map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className={`h-3 w-3 rounded-sm ${cls}`} />
            <span className="font-body text-[10px] text-charcoal/50">{label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
