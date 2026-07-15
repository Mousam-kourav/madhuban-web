import Link from "next/link";
import { Container } from "@/components/ui/container";

/**
 * Shown when a page's content cannot be loaded from the database — an outage,
 * not a missing page. Deliberately distinct from `not-found.tsx`: this URL is
 * real and should be retried, so we never tell the visitor (or a crawler) that
 * it does not exist.
 */
export function DataUnavailable({
  title = "Temporarily Unavailable",
  message = "We couldn't load this page just now. This is a problem on our side, not yours — please try again in a few moments.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <main className="min-h-[70vh] bg-cream flex items-center py-20">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <div className="relative z-10">
            <p className="mb-3 font-body text-xs uppercase tracking-[0.25em] text-earth-brown/60">
              Madhuban Eco Retreat
            </p>
            <h1 className="font-display text-4xl font-medium text-charcoal md:text-5xl">
              {title}
            </h1>
            <p className="mt-5 font-body text-base leading-relaxed text-charcoal/70 max-w-md mx-auto">
              {message}
            </p>
          </div>

          <div className="my-8 mx-auto h-px w-16 bg-earth-brown/20" aria-hidden="true" />

          <nav
            aria-label="Continue browsing"
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
          >
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-md bg-earth-brown px-8 font-body text-sm font-medium text-ivory transition hover:opacity-90"
            >
              Back to Home
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex h-12 items-center justify-center rounded-md border border-earth-brown/40 px-8 font-body text-sm font-medium text-earth-brown transition hover:bg-earth-brown/5"
            >
              Contact Us
            </Link>
          </nav>

          <p className="mt-6 font-body text-sm text-charcoal/60">
            To book or enquire right away, call{" "}
            <a href="tel:+919770558419" className="underline underline-offset-2 hover:text-earth-brown">
              +91 97705 58419
            </a>
            .
          </p>
        </div>
      </Container>
    </main>
  );
}
