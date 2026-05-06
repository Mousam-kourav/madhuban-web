"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodV4Resolver } from "@/lib/forms/resolver";
import { toast } from "sonner";
import {
  Calendar, User, Sparkles, FileText, ChevronLeft,
  Info, Minus, Plus, Circle,
} from "lucide-react";
import {
  Card, Button, Input, Select, Toggle, DatePicker, TextArea,
} from "@/components/admin/ui";
import { BOOKING_ADDONS } from "@/lib/admin/booking-addons";
import type { RoomAvailability } from "@/app/api/admin/bookings/availability/route";
import { cn } from "@/lib/utils";

// ─── Draft ────────────────────────────────────────────────────────────────────

const DRAFT_KEY = "madhuban-admin-booking-draft";
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// ─── Form schema ─────────────────────────────────────────────────────────────

const addonItemSchema = z.object({
  enabled: z.boolean(),
  qty: z.number().int().min(1).max(99),
});

const schema = z
  .object({
    checkIn:              z.string().min(1, "Check-in date required"),
    checkOut:             z.string().min(1, "Check-out date required"),
    roomId:               z.string().min(1, "Room type required"),
    numAdults:            z.number().int().min(1, "At least 1 adult"),
    numChildren:          z.number().int().min(0),
    extraMattress:        z.number().int().min(0),
    specialRequests:      z.string().optional(),
    guestName:            z.string().min(1, "Guest name required"),
    guestMobile:          z.string().regex(/^\d{10}$/, "Enter 10-digit mobile"),
    guestEmail:           z.string().email("Invalid email").or(z.literal("")).optional(),
    idType:               z.string().optional(),
    idNumber:             z.string().optional(),
    source:               z.string().min(1, "Source required"),
    isCorporate:          z.boolean(),
    corporateGstin:       z.string().optional(),
    corporateCompanyName: z.string().optional(),
    corporateAddress:     z.string().optional(),
    addons:               z.array(addonItemSchema),
    internalNote:         z.string().optional(),
    assignedUnit:         z.string().optional(),
    advanceAmount:        z.number().min(0),
    paymentMethod:        z.string().optional(),
    sendEmail:            z.boolean(),
  })
  .superRefine((d, ctx) => {
    if (d.checkIn && d.checkOut && d.checkIn >= d.checkOut) {
      ctx.addIssue({ code: "custom", path: ["checkOut"], message: "Check-out must be after check-in" });
    }
    if (d.isCorporate) {
      if (!d.corporateGstin?.trim()) {
        ctx.addIssue({ code: "custom", path: ["corporateGstin"], message: "GSTIN required" });
      } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(d.corporateGstin.trim())) {
        ctx.addIssue({ code: "custom", path: ["corporateGstin"], message: "Invalid GSTIN (e.g. 23AAACT5004A1Z9)" });
      }
      if (!d.corporateCompanyName?.trim()) {
        ctx.addIssue({ code: "custom", path: ["corporateCompanyName"], message: "Company name required" });
      }
    }
    if (d.advanceAmount > 0 && !d.paymentMethod) {
      ctx.addIssue({ code: "custom", path: ["paymentMethod"], message: "Payment method required" });
    }
  });

type FormData = z.infer<typeof schema>;

const defaultValues: FormData = {
  checkIn: "", checkOut: "", roomId: "",
  numAdults: 2, numChildren: 0, extraMattress: 0,
  specialRequests: "",
  guestName: "", guestMobile: "", guestEmail: "",
  idType: "", idNumber: "",
  source: "walkin",
  isCorporate: false,
  corporateGstin: "", corporateCompanyName: "", corporateAddress: "",
  addons: BOOKING_ADDONS.map(() => ({ enabled: false, qty: 1 })),
  internalNote: "",
  assignedUnit: "",
  advanceAmount: 0,
  paymentMethod: "",
  sendEmail: true,
};

// ─── Client-side pricing ──────────────────────────────────────────────────────

interface ClientPricing {
  nights: number;
  roomTotal: number;
  addonsBreakdown: Array<{ label: string; amount: number; qty: number }>;
  addonsTotal: number;
  subtotalInclusive: number;
  gstRatePct: number;
  subtotalBeforeGst: number;
  gstAmount: number;
  totalAmount: number;
}

function computeClientPricing(
  basePricePerNight: number,
  checkIn: string,
  checkOut: string,
  enabledAddons: Array<{ label: string; price: number; qty: number; unit: string }>,
): ClientPricing | null {
  if (!checkIn || !checkOut || checkIn >= checkOut) return null;
  const nights = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000,
  );
  if (nights < 1) return null;

  const roomTotal = +(basePricePerNight * nights).toFixed(2);

  const addonsBreakdown = enabledAddons.map(({ label, price, qty, unit }) => {
    const multiplier = unit === "per night" ? nights : 1;
    return { label, qty, amount: +(price * qty * multiplier).toFixed(2) };
  });
  const addonsTotal = +addonsBreakdown.reduce((s, a) => s + a.amount, 0).toFixed(2);
  const subtotalInclusive = +(roomTotal + addonsTotal).toFixed(2);
  const gstRatePct = basePricePerNight >= 7500 ? 18 : 12;
  const subtotalBeforeGst = +(subtotalInclusive / (1 + gstRatePct / 100)).toFixed(2);
  const gstAmount = +(subtotalInclusive - subtotalBeforeGst).toFixed(2);

  return {
    nights, roomTotal, addonsBreakdown, addonsTotal, subtotalInclusive,
    gstRatePct, subtotalBeforeGst, gstAmount, totalAmount: subtotalInclusive,
  };
}

function formatINR(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

// ─── Options ──────────────────────────────────────────────────────────────────

const SOURCE_OPTIONS = [
  { value: "walkin",  label: "Walk-in" },
  { value: "phone",   label: "Phone" },
  { value: "agent",   label: "Agent" },
  { value: "website", label: "Direct — Website" },
  { value: "mmt",     label: "MakeMyTrip" },
  { value: "goibibo", label: "Goibibo" },
  { value: "airbnb",  label: "Airbnb" },
  { value: "other",   label: "Other" },
];

const ID_TYPE_OPTIONS = [
  { value: "aadhaar",  label: "Aadhaar Card" },
  { value: "passport", label: "Passport" },
  { value: "dl",       label: "Driving License" },
  { value: "voter",    label: "Voter ID" },
  { value: "other",    label: "Other" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "cash",             label: "Cash" },
  { value: "upi",              label: "UPI" },
  { value: "bank_transfer",    label: "Bank Transfer" },
  { value: "razorpay",         label: "Razorpay (Online)" },
  { value: "card_on_arrival",  label: "Card on Arrival" },
  { value: "cheque",           label: "Cheque" },
  { value: "pay_on_arrival",   label: "Pay on Arrival" },
];

// ─── Main component ───────────────────────────────────────────────────────────

export function BookingNewForm() {
  const router = useRouter();

  // Availability state
  const [availRooms, setAvailRooms] = useState<RoomAvailability[]>([]);
  const [isCheckingAvail, setIsCheckingAvail] = useState(false);
  const [availError, setAvailError] = useState<string | null>(null);
  const [availChecked, setAvailChecked] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Draft state
  const [hasDraft, setHasDraft] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodV4Resolver(schema),
    defaultValues,
  });

  const { fields: addonFields } = useFieldArray({
    control: form.control,
    name: "addons",
  });

  const watched = form.watch();

  // ── Draft: check on mount ──────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const { saved_at } = JSON.parse(raw) as { saved_at: string };
      if (Date.now() - new Date(saved_at).getTime() > DRAFT_TTL_MS) {
        localStorage.removeItem(DRAFT_KEY);
        return;
      }
      setHasDraft(true);
    } catch { /* ignore */ }
  }, []);

  const saveDraft = useCallback((values: FormData) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form_state: values, saved_at: new Date().toISOString() }));
      setDraftSavedAt(new Date());
    } catch { /* ignore */ }
  }, []);

  const restoreDraft = useCallback(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const { form_state } = JSON.parse(raw) as { form_state: FormData };
      form.reset(form_state);
      setHasDraft(false);
      toast.success("Draft restored");
    } catch { /* ignore */ }
  }, [form]);

  const discardDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
  }, []);

  // ── Auto-save every 30s ────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const values = form.getValues();
      const hasAnyData = values.guestName || values.checkIn || values.roomId;
      if (hasAnyData) saveDraft(values);
    }, 30000);
    return () => clearInterval(interval);
  }, [form, saveDraft]);

  // ── Availability check (debounced 500ms) ────────────────────────────────────
  const triggerAvailabilityCheck = useCallback((from: string, to: string) => {
    if (!from || !to || from >= to) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsCheckingAvail(true);
      setAvailError(null);
      try {
        const res = await fetch(`/api/admin/bookings/availability?from=${from}&to=${to}`);
        if (!res.ok) throw new Error("Failed to check availability");
        const data = (await res.json()) as { rooms: RoomAvailability[] };
        setAvailRooms(data.rooms);
        setAvailChecked(true);
        // Reset roomId if the currently selected room is now sold out
        const currentRoom = form.getValues("roomId");
        if (currentRoom) {
          const found = data.rooms.find((r) => r.id === currentRoom);
          if (found && found.available_units === 0) {
            form.setValue("roomId", "");
            toast.warning("Selected room is sold out for these dates");
          }
        }
      } catch {
        setAvailError("Could not check availability. Try again.");
      } finally {
        setIsCheckingAvail(false);
      }
    }, 500);
  }, [form]);

  // Watch dates for auto-trigger
  useEffect(() => {
    const sub = form.watch((values, { name }) => {
      if (name === "checkIn" || name === "checkOut") {
        const ci = values.checkIn ?? "";
        const co = values.checkOut ?? "";
        if (ci && co && ci < co) triggerAvailabilityCheck(ci, co);
      }
    });
    return () => sub.unsubscribe();
  }, [form, triggerAvailabilityCheck]);

  // ── Derived: selected room details ────────────────────────────────────────
  const selectedRoom = availRooms.find((r) => r.id === watched.roomId) ?? null;

  // ── Derived: enabled add-ons for pricing ─────────────────────────────────
  const enabledAddons = useMemo(() => {
    return BOOKING_ADDONS.flatMap((addon, i) => {
      const state = watched.addons[i];
      if (!state?.enabled) return [];
      return [{ label: addon.label, price: addon.price, qty: state.qty, unit: addon.unit }];
    });
  }, [watched.addons]);

  // ── Client-side pricing ───────────────────────────────────────────────────
  const pricing = useMemo(() => {
    if (!selectedRoom || !watched.checkIn || !watched.checkOut) return null;
    return computeClientPricing(
      selectedRoom.base_price_per_night,
      watched.checkIn,
      watched.checkOut,
      enabledAddons,
    );
  }, [selectedRoom, watched.checkIn, watched.checkOut, enabledAddons]);

  // ── Date helpers ──────────────────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0]!;
  const minCheckout = watched.checkIn
    ? new Date(new Date(watched.checkIn).getTime() + 86400000).toISOString().split("T")[0]!
    : today;

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      const selectedAddons = BOOKING_ADDONS.flatMap((addon, i) => {
        const state = data.addons[i];
        if (!state?.enabled) return [];
        return [{ id: addon.id, label: addon.label, price: addon.price, qty: state.qty, unit: addon.unit }];
      });

      const payload = {
        checkIn:         data.checkIn,
        checkOut:        data.checkOut,
        roomId:          data.roomId,
        numAdults:       data.numAdults,
        numChildren:     data.numChildren,
        extraMattress:   data.extraMattress,
        specialRequests: data.specialRequests || undefined,
        guest: {
          name:     data.guestName,
          mobile:   data.guestMobile,
          email:    data.guestEmail || undefined,
          idType:   data.idType || undefined,
          idNumber: data.idNumber || undefined,
        },
        source: data.source,
        corporate: data.isCorporate ? {
          gstin:       data.corporateGstin ?? "",
          companyName: data.corporateCompanyName ?? "",
          address:     data.corporateAddress || undefined,
        } : null,
        addons: selectedAddons,
        internalNote: data.internalNote || undefined,
        assignedUnit: data.assignedUnit?.trim() || undefined,
        advance: (data.advanceAmount > 0 && data.paymentMethod)
          ? { amount: data.advanceAmount, paymentMethod: data.paymentMethod }
          : null,
        sendEmail: data.sendEmail,
      };

      const res = await fetch("/api/admin/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await res.json()) as { bookingId?: string; bookingRef?: string; error?: string };

      if (!res.ok) {
        toast.error(result.error ?? "Failed to create booking");
        return;
      }

      localStorage.removeItem(DRAFT_KEY);
      toast.success(`Booking confirmed — ${result.bookingRef}`);
      router.push(`/admin/bookings/${result.bookingId}`);
    } finally {
      setIsSubmitting(false);
    }
  });

  const nightsLabel = useMemo(() => {
    if (!watched.checkIn || !watched.checkOut || watched.checkIn >= watched.checkOut) return null;
    const n = Math.round(
      (new Date(watched.checkOut).getTime() - new Date(watched.checkIn).getTime()) / 86400000,
    );
    return `${n} night${n !== 1 ? "s" : ""}`;
  }, [watched.checkIn, watched.checkOut]);

  const roomOptions = availRooms.map((r) => ({
    value: r.id,
    label: r.available_units === 0
      ? `${r.name} (Sold out)`
      : `${r.name} — ${r.available_units} available`,
  }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-admin-bg">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center border-b border-admin-card-border bg-admin-sidebar-bg px-6 gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/bookings")}
          className="flex items-center gap-1.5 text-sm text-ivory/60 hover:text-ivory transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          All Reservations
        </button>
        <span className="text-ivory/30">/</span>
        <span className="text-sm font-semibold text-ivory">New Booking</span>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-charcoal">Manual Booking Entry</h1>
          <p className="mt-1 font-body text-sm text-muted">Walk-in, phone, or agent booking</p>
        </div>

        {/* Draft banner */}
        {hasDraft && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-warning/30 bg-warning/10 px-4 py-3">
            <p className="font-body text-sm text-charcoal">
              An unsaved draft was found. Restore it to continue where you left off.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={restoreDraft}>Restore</Button>
              <Button variant="ghost" size="sm" onClick={discardDraft}>Discard</Button>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* ── LEFT: Form cards ── */}
            <div className="space-y-6 lg:col-span-2">

              {/* Stay Details */}
              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-forest-green" />
                  <h2 className="font-body text-sm font-semibold uppercase tracking-wider text-charcoal">
                    Stay Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <DatePicker
                      {...form.register("checkIn")}
                      label="Check-in Date"
                      required
                      min={today}
                      error={form.formState.errors.checkIn?.message}
                    />
                  </div>
                  <div>
                    <DatePicker
                      {...form.register("checkOut")}
                      label="Check-out Date"
                      required
                      min={minCheckout}
                      error={form.formState.errors.checkOut?.message}
                    />
                  </div>
                </div>

                {/* Nights + availability status */}
                <div className="mt-2 flex items-center gap-3">
                  {nightsLabel && (
                    <span className="font-body text-sm font-medium text-charcoal">{nightsLabel}</span>
                  )}
                  {isCheckingAvail && (
                    <span className="font-body text-xs text-muted">Checking availability…</span>
                  )}
                  {!isCheckingAvail && availChecked && !availError && (
                    <span className="font-body text-xs text-success">
                      {availRooms.filter((r) => r.available_units > 0).length} room types available
                    </span>
                  )}
                  {availError && (
                    <span className="font-body text-xs text-error">{availError}</span>
                  )}
                  {watched.checkIn && watched.checkOut && watched.checkIn < watched.checkOut && !availChecked && (
                    <button
                      type="button"
                      onClick={() => triggerAvailabilityCheck(watched.checkIn, watched.checkOut)}
                      className="font-body text-xs text-forest-green hover:underline"
                    >
                      Check availability →
                    </button>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Select
                    label="Room Type"
                    required
                    placeholder={availChecked ? "Select room" : "Set dates first"}
                    options={availChecked ? roomOptions : []}
                    disabled={!availChecked || isCheckingAvail}
                    {...form.register("roomId")}
                    error={form.formState.errors.roomId?.message}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
                        Adults <span className="text-error">*</span>
                      </label>
                      <div className="flex h-10 items-center rounded-xl border border-admin-card-border bg-admin-card-bg">
                        <button
                          type="button"
                          onClick={() => form.setValue("numAdults", Math.max(1, watched.numAdults - 1))}
                          className="flex h-full w-9 items-center justify-center rounded-l-xl text-muted hover:text-charcoal"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="flex-1 text-center font-body text-sm font-medium text-charcoal">
                          {watched.numAdults}
                        </span>
                        <button
                          type="button"
                          onClick={() => form.setValue("numAdults", Math.min(20, watched.numAdults + 1))}
                          className="flex h-full w-9 items-center justify-center rounded-r-xl text-muted hover:text-charcoal"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {form.formState.errors.numAdults && (
                        <p className="font-body text-xs text-error">{form.formState.errors.numAdults.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
                        Children
                      </label>
                      <div className="flex h-10 items-center rounded-xl border border-admin-card-border bg-admin-card-bg">
                        <button
                          type="button"
                          onClick={() => form.setValue("numChildren", Math.max(0, watched.numChildren - 1))}
                          className="flex h-full w-9 items-center justify-center rounded-l-xl text-muted hover:text-charcoal"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="flex-1 text-center font-body text-sm font-medium text-charcoal">
                          {watched.numChildren}
                        </span>
                        <button
                          type="button"
                          onClick={() => form.setValue("numChildren", Math.min(20, watched.numChildren + 1))}
                          className="flex h-full w-9 items-center justify-center rounded-r-xl text-muted hover:text-charcoal"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Assigned Unit"
                    placeholder="e.g. ST-03, River-facing tent"
                    helperText="Optional — physical unit identifier"
                    {...form.register("assignedUnit")}
                  />
                </div>

                <div className="mt-4">
                  <TextArea
                    label="Special Requests"
                    rows={2}
                    placeholder="Visible to guest in confirmation email…"
                    helperText="Will be included in guest confirmation email"
                    {...form.register("specialRequests")}
                  />
                </div>
              </Card>

              {/* Guest Information */}
              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-forest-green" />
                  <h2 className="font-body text-sm font-semibold uppercase tracking-wider text-charcoal">
                    Guest Information
                  </h2>
                </div>

                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-forest-green/20 bg-forest-green/5 px-4 py-3">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-forest-green" />
                  <p className="font-body text-xs text-charcoal">
                    Government ID Collection — Please ensure a clear photo or scan of the Primary
                    Guest&apos;s ID is uploaded at check-in for local forest regulation compliance.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Full Name"
                    required
                    placeholder="Primary guest's full name"
                    {...form.register("guestName")}
                    error={form.formState.errors.guestName?.message}
                  />
                  <div className="flex flex-col gap-1">
                    <label className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
                      Mobile Number <span className="text-error">*</span>
                    </label>
                    <div className="flex h-10 overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg focus-within:border-forest-green focus-within:ring-2 focus-within:ring-forest-green/30">
                      <span className="flex items-center border-r border-admin-card-border bg-admin-card-bg px-3 font-body text-sm text-muted">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit number"
                        className="flex-1 bg-transparent px-3 font-body text-sm text-charcoal placeholder:text-muted focus:outline-none"
                        {...form.register("guestMobile")}
                      />
                    </div>
                    {form.formState.errors.guestMobile && (
                      <p className="font-body text-xs text-error">{form.formState.errors.guestMobile.message}</p>
                    )}
                  </div>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Optional — needed for confirmation email"
                    helperText="Required if 'Send confirmation email' is enabled"
                    {...form.register("guestEmail")}
                    error={form.formState.errors.guestEmail?.message}
                  />
                  <Select
                    label="ID Type"
                    placeholder="Select ID type"
                    options={ID_TYPE_OPTIONS}
                    {...form.register("idType")}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="ID Number"
                    placeholder="Required at check-in, optional here"
                    helperText="Can be captured at check-in"
                    {...form.register("idNumber")}
                  />
                  <Select
                    label="Booking Source"
                    required
                    options={SOURCE_OPTIONS}
                    {...form.register("source")}
                    error={form.formState.errors.source?.message}
                  />
                </div>

                {/* Corporate/GST toggle */}
                <div className="mt-5 border-t border-admin-card-border pt-4">
                  <Toggle
                    checked={watched.isCorporate}
                    onChange={(v) => form.setValue("isCorporate", v)}
                    label="Corporate / GST Booking"
                    description="Reveal GSTIN and company details"
                  />

                  {watched.isCorporate && (
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input
                        label="GSTIN"
                        required
                        placeholder="e.g. 23AAACT5004A1Z9"
                        helperText="15-character GST identification number"
                        {...form.register("corporateGstin", { onChange: (e) => form.setValue("corporateGstin", e.target.value.toUpperCase()) })}
                        error={form.formState.errors.corporateGstin?.message}
                      />
                      <Input
                        label="Company Name"
                        required
                        placeholder="Legal company name"
                        {...form.register("corporateCompanyName")}
                        error={form.formState.errors.corporateCompanyName?.message}
                      />
                      <div className="sm:col-span-2">
                        <TextArea
                          label="GST Address (Optional)"
                          rows={2}
                          placeholder="Registered address for GST invoice"
                          {...form.register("corporateAddress")}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Experience Add-ons */}
              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-forest-green" />
                  <h2 className="font-body text-sm font-semibold uppercase tracking-wider text-charcoal">
                    Experience Add-ons
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {BOOKING_ADDONS.map((addon, i) => {
                    const state = addonFields[i];
                    if (!state) return null;
                    const enabled = watched.addons[i]?.enabled ?? false;
                    const qty = watched.addons[i]?.qty ?? 1;

                    return (
                      <div
                        key={addon.id}
                        className={cn(
                          "rounded-xl border p-4 transition-all cursor-pointer",
                          enabled
                            ? "border-forest-green bg-forest-green/5"
                            : "border-admin-card-border bg-admin-card-bg hover:border-forest-green/40"
                        )}
                        onClick={() => form.setValue(`addons.${i}.enabled`, !enabled)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-body text-sm font-semibold text-charcoal">{addon.label}</p>
                            <p className="font-body text-xs text-muted">
                              {formatINR(addon.price)} / {addon.unit}
                            </p>
                          </div>
                          <div
                            className={cn(
                              "mt-0.5 h-4 w-4 shrink-0 rounded border transition-colors",
                              enabled
                                ? "border-forest-green bg-forest-green"
                                : "border-muted/40 bg-white"
                            )}
                          />
                        </div>

                        {enabled && (
                          <div
                            className="mt-3 flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="font-body text-xs text-muted">Qty</span>
                            <div className="flex items-center rounded-lg border border-admin-card-border bg-white">
                              <button
                                type="button"
                                onClick={() => form.setValue(`addons.${i}.qty`, Math.max(1, qty - 1))}
                                className="flex h-7 w-7 items-center justify-center text-muted hover:text-charcoal"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center font-body text-sm font-medium text-charcoal">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => form.setValue(`addons.${i}.qty`, Math.min(99, qty + 1))}
                                className="flex h-7 w-7 items-center justify-center text-muted hover:text-charcoal"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Internal Notes */}
              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-forest-green" />
                  <h2 className="font-body text-sm font-semibold uppercase tracking-wider text-charcoal">
                    Internal Notes
                  </h2>
                </div>
                <TextArea
                  rows={3}
                  placeholder="Operations team only — e.g. preference for specific server or dietary restrictions…"
                  helperText="Never visible to the guest via email or invoices"
                  {...form.register("internalNote")}
                />
              </Card>
            </div>

            {/* ── RIGHT: Sticky pricing + actions ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">

                {/* Pricing Summary */}
                <Card>
                  <h2 className="mb-4 font-body text-sm font-semibold uppercase tracking-wider text-charcoal">
                    Booking Summary
                  </h2>

                  {!pricing ? (
                    <p className="font-body text-sm text-muted">
                      Fill in dates and select a room to see pricing breakdown.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {/* Stay details summary */}
                      <div className="space-y-1">
                        {selectedRoom && (
                          <p className="font-body text-sm font-semibold text-charcoal">{selectedRoom.name}</p>
                        )}
                        {watched.checkIn && watched.checkOut && (
                          <p className="font-body text-xs text-muted">
                            {watched.checkIn} → {watched.checkOut} · {pricing.nights} night{pricing.nights !== 1 ? "s" : ""}
                          </p>
                        )}
                        <p className="font-body text-xs text-muted">
                          {watched.numAdults} adult{watched.numAdults !== 1 ? "s" : ""}
                          {watched.numChildren > 0 ? ` · ${watched.numChildren} children` : ""}
                          {watched.extraMattress > 0 ? ` · ${watched.extraMattress} extra mattress` : ""}
                        </p>
                      </div>

                      <div className="border-t border-admin-card-border" />

                      {/* Charges */}
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="font-body text-sm text-charcoal">
                            Room Rent ({pricing.nights} night{pricing.nights !== 1 ? "s" : ""})
                          </span>
                          <span className="font-body text-sm font-medium text-charcoal">
                            {formatINR(pricing.roomTotal)}
                          </span>
                        </div>

                        {pricing.addonsBreakdown.map((a, i) => (
                          <div key={i} className="flex items-baseline justify-between">
                            <span className="font-body text-xs text-muted">
                              {a.label} ×{a.qty}
                            </span>
                            <span className="font-body text-xs text-charcoal">{formatINR(a.amount)}</span>
                          </div>
                        ))}

                        <div className="border-t border-admin-card-border pt-2">
                          <div className="flex items-baseline justify-between">
                            <span className="font-body text-xs text-muted">Subtotal (excl. GST)</span>
                            <span className="font-body text-xs text-charcoal">{formatINR(pricing.subtotalBeforeGst)}</span>
                          </div>
                          <div className="flex items-baseline justify-between mt-1">
                            <span className="font-body text-xs text-muted">GST ({pricing.gstRatePct}%)</span>
                            <span className="font-body text-xs text-charcoal">{formatINR(pricing.gstAmount)}</span>
                          </div>
                        </div>

                        <div className="border-t border-admin-card-border pt-2">
                          <div className="flex items-center justify-between">
                            <span className="font-body text-sm font-bold text-charcoal">Total</span>
                            <span className="font-display text-xl font-semibold text-charcoal">
                              {formatINR(pricing.totalAmount)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-admin-card-border" />

                      {/* Payment */}
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal">
                            Advance Collected
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={100}
                            className="h-10 w-full rounded-xl border border-admin-card-border bg-admin-card-bg px-3 font-body text-sm text-charcoal focus:border-forest-green focus:outline-none focus:ring-2 focus:ring-forest-green/30"
                            {...form.register("advanceAmount", { valueAsNumber: true })}
                          />
                        </div>

                        {watched.advanceAmount > 0 && (
                          <Select
                            label="Payment Method"
                            required
                            placeholder="Select method"
                            options={PAYMENT_METHOD_OPTIONS}
                            {...form.register("paymentMethod")}
                            error={form.formState.errors.paymentMethod?.message}
                          />
                        )}

                        {pricing && (
                          <div className={cn(
                            "rounded-xl px-4 py-3",
                            (pricing.totalAmount - (watched.advanceAmount || 0)) > 0
                              ? "bg-warning/10 border border-warning/30"
                              : "bg-success/10 border border-success/20"
                          )}>
                            <div className="flex items-center justify-between">
                              <span className="font-body text-sm text-charcoal">Balance Due</span>
                              <span className="font-body text-base font-bold text-charcoal">
                                {formatINR(Math.max(0, pricing.totalAmount - (watched.advanceAmount || 0)))}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Source tag */}
                      <div className="border-t border-admin-card-border pt-3">
                        <div className="flex items-center gap-2">
                          <span className="font-body text-xs text-muted">Source:</span>
                          <span className="rounded-md bg-forest-green/10 px-2 py-0.5 font-body text-xs font-medium text-forest-green">
                            {SOURCE_OPTIONS.find((s) => s.value === watched.source)?.label ?? watched.source}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Actions */}
                <Card variant="compact">
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating booking…" : "Save & Confirm Booking"}
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        saveDraft(form.getValues());
                        toast.success("Draft saved");
                      }}
                    >
                      Save as Draft
                    </Button>

                    <label className="flex cursor-pointer items-start gap-2.5">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded accent-forest-green"
                        {...form.register("sendEmail")}
                      />
                      <div>
                        <span className="font-body text-sm text-charcoal">Send confirmation email</span>
                        <p className="font-body text-xs text-muted">
                          {watched.guestEmail
                            ? `Will send to ${watched.guestEmail}`
                            : "Requires guest email address"}
                        </p>
                      </div>
                    </label>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </form>

        {/* Auto-save indicator */}
        <div className="mt-6 flex items-center gap-1.5 text-xs text-muted">
          <Circle
            className={cn("h-2 w-2 fill-current", draftSavedAt ? "text-success" : "text-muted/40")}
          />
          {draftSavedAt
            ? `Draft auto-saved at ${draftSavedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
            : "Not yet auto-saved"}
        </div>
      </div>
    </div>
  );
}
