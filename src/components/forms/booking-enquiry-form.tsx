"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { bookingSchema, ROOM_OPTIONS, type BookingFormValues } from "@/lib/forms/booking-schema";
import { zodV4Resolver } from "@/lib/forms/resolver";

const INPUT =
  "w-full font-body text-sm text-charcoal bg-cream border border-[#EAE5DC] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-earth-brown/30 placeholder:text-charcoal/40";

const ERROR = "mt-1.5 font-body text-xs text-[#B84A4A]";

function todayISO(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

export function BookingEnquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [checkIn, setCheckIn] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodV4Resolver(bookingSchema),
    defaultValues: { adults: 2, children: 0 },
  });

  const today = todayISO();

  async function onSubmit(values: BookingFormValues) {
    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch("/api/forms/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setStatus("success");
      } else {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[#EAE5DC] bg-cream px-8 py-12 text-center">
        <p className="font-display italic text-2xl text-earth-brown mb-3">Got it.</p>
        <p className="font-body text-sm text-charcoal/70 leading-relaxed">
          We&apos;ll reply within a working day with availability and next steps. For faster
          response, reach us on{" "}
          <a
            href="https://wa.me/919770558419"
            className="text-earth-brown underline underline-offset-2"
          >
            WhatsApp
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 overflow-hidden">
        <label htmlFor="bef-website">Leave this empty</label>
        <input
          id="bef-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {/* Guest details */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="bef-name" className="block font-body text-xs font-medium text-charcoal mb-1.5">
            Name <span className="text-[#B84A4A]">*</span>
          </label>
          <input
            id="bef-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className={INPUT}
            {...register("name")}
          />
          {errors.name && <p className={ERROR}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="bef-email" className="block font-body text-xs font-medium text-charcoal mb-1.5">
            Email <span className="text-[#B84A4A]">*</span>
          </label>
          <input
            id="bef-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={INPUT}
            {...register("email")}
          />
          {errors.email && <p className={ERROR}>{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="bef-phone" className="block font-body text-xs font-medium text-charcoal mb-1.5">
          Phone <span className="text-[#B84A4A]">*</span>
        </label>
        <input
          id="bef-phone"
          type="tel"
          autoComplete="tel"
          placeholder="+91 97705 58419"
          className={INPUT}
          {...register("phone")}
        />
        {errors.phone && <p className={ERROR}>{errors.phone.message}</p>}
      </div>

      {/* Room selection */}
      <div>
        <label htmlFor="bef-room" className="block font-body text-xs font-medium text-charcoal mb-1.5">
          Preferred room <span className="text-[#B84A4A]">*</span>
        </label>
        <select id="bef-room" className={`${INPUT} cursor-pointer`} {...register("roomType")}>
          <option value="">Select a room…</option>
          {ROOM_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.roomType && <p className={ERROR}>{errors.roomType.message}</p>}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="bef-checkin" className="block font-body text-xs font-medium text-charcoal mb-1.5">
            Check-in <span className="text-[#B84A4A]">*</span>
          </label>
          <input
            id="bef-checkin"
            type="date"
            min={today}
            className={INPUT}
            {...register("checkIn", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCheckIn(e.target.value) })}
          />
          {errors.checkIn && <p className={ERROR}>{errors.checkIn.message}</p>}
        </div>

        <div>
          <label htmlFor="bef-checkout" className="block font-body text-xs font-medium text-charcoal mb-1.5">
            Check-out <span className="text-[#B84A4A]">*</span>
          </label>
          <input
            id="bef-checkout"
            type="date"
            min={checkIn || today}
            className={INPUT}
            {...register("checkOut")}
          />
          {errors.checkOut && <p className={ERROR}>{errors.checkOut.message}</p>}
        </div>
      </div>

      {/* Guests */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="bef-adults" className="block font-body text-xs font-medium text-charcoal mb-1.5">
            Adults <span className="text-[#B84A4A]">*</span>
          </label>
          <input
            id="bef-adults"
            type="number"
            min={1}
            max={10}
            className={INPUT}
            {...register("adults", { valueAsNumber: true })}
          />
          {errors.adults && <p className={ERROR}>{errors.adults.message}</p>}
        </div>

        <div>
          <label htmlFor="bef-children" className="block font-body text-xs font-medium text-charcoal mb-1.5">
            Children
          </label>
          <input
            id="bef-children"
            type="number"
            min={0}
            max={10}
            className={INPUT}
            {...register("children", { valueAsNumber: true })}
          />
          {errors.children && <p className={ERROR}>{errors.children.message}</p>}
        </div>
      </div>

      {/* Special requests */}
      <div>
        <label htmlFor="bef-requests" className="block font-body text-xs font-medium text-charcoal mb-1.5">
          Special requests <span className="font-normal text-charcoal/50">(optional)</span>
        </label>
        <textarea
          id="bef-requests"
          rows={3}
          placeholder="Dietary requirements, celebration arrangements, accessibility needs…"
          className={`${INPUT} resize-y`}
          {...register("specialRequests")}
        />
        {errors.specialRequests && <p className={ERROR}>{errors.specialRequests.message}</p>}
      </div>

      {serverError && (
        <p className={`${ERROR} text-sm`} role="alert">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || status === "loading"}
        className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-xl bg-earth-brown px-8 font-body text-sm font-medium text-ivory transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting || status === "loading" ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
