"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { contactSchema, type ContactFormValues } from "@/lib/forms/contact-schema";
import { zodV4Resolver } from "@/lib/forms/resolver";

const INPUT =
  "w-full font-body text-sm text-charcoal bg-cream border border-[#EAE5DC] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-earth-brown/30 placeholder:text-charcoal/40";

const ERROR = "mt-1.5 font-body text-xs text-[#B84A4A]";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodV4Resolver(contactSchema),
  });

  async function onSubmit(values: ContactFormValues) {
    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch("/api/forms/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setStatus("success");
        reset();
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
        <p className="font-display italic text-2xl text-earth-brown mb-3">Message received.</p>
        <p className="font-body text-sm text-charcoal/70 leading-relaxed">
          We&apos;ll reply to your email within one working day. For urgent queries, reach us on{" "}
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
      {/* Honeypot — hidden from real users, traps bots */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 overflow-hidden">
        <label htmlFor="cf-website">Leave this empty</label>
        <input
          id="cf-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="block font-body text-xs font-medium text-charcoal mb-1.5">
            Name <span className="text-[#B84A4A]">*</span>
          </label>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className={INPUT}
            {...register("name")}
          />
          {errors.name && <p className={ERROR}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="cf-email" className="block font-body text-xs font-medium text-charcoal mb-1.5">
            Email <span className="text-[#B84A4A]">*</span>
          </label>
          <input
            id="cf-email"
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
        <label htmlFor="cf-phone" className="block font-body text-xs font-medium text-charcoal mb-1.5">
          Phone <span className="font-normal text-charcoal/50">(optional)</span>
        </label>
        <input
          id="cf-phone"
          type="tel"
          autoComplete="tel"
          placeholder="+91 97705 58419"
          className={INPUT}
          {...register("phone")}
        />
        {errors.phone && <p className={ERROR}>{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="cf-message" className="block font-body text-xs font-medium text-charcoal mb-1.5">
          Message <span className="text-[#B84A4A]">*</span>
        </label>
        <textarea
          id="cf-message"
          rows={5}
          placeholder="Tell us how we can help…"
          className={`${INPUT} resize-y`}
          {...register("message")}
        />
        {errors.message && <p className={ERROR}>{errors.message.message}</p>}
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
        {isSubmitting || status === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
