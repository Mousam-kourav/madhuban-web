"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error] route render failed:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] bg-cream flex items-center py-20">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p
            className="font-display text-[8rem] font-light leading-none text-earth-brown/10 select-none"
            aria-hidden="true"
          >
            500
          </p>

          <div className="-mt-8 relative z-10">
            <p className="mb-3 font-body text-xs uppercase tracking-[0.25em] text-earth-brown/60">
              Madhuban Eco Retreat
            </p>
            <h1 className="font-display text-4xl font-medium text-charcoal md:text-5xl">
              Something Went Wrong
            </h1>
            <p className="mt-5 font-body text-base leading-relaxed text-charcoal/70 max-w-md mx-auto">
              We hit an unexpected problem loading this page. Please try again — if it
              persists, our team has been notified.
            </p>
          </div>

          {/* The digest is the only handle on the server-side cause: production
              builds omit the message, but it correlates to the Vercel log entry. */}
          {error.digest && (
            <p className="mt-4 font-body text-xs text-charcoal/40">
              Reference: {error.digest}
            </p>
          )}

          <div
            className="my-8 mx-auto h-px w-16 bg-earth-brown/20"
            aria-hidden="true"
          />

          <nav
            aria-label="Recover from error"
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
          >
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-12 items-center justify-center rounded-md bg-earth-brown px-8 font-body text-sm font-medium text-ivory transition hover:opacity-90"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-md border border-earth-brown/40 px-8 font-body text-sm font-medium text-earth-brown transition hover:bg-earth-brown/5"
            >
              Back to Home
            </Link>
          </nav>
        </div>
      </Container>
    </main>
  );
}
