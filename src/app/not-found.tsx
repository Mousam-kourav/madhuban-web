import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-cream flex items-center py-20">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          {/* Brand visual — decorative forest motif */}
          <p
            className="font-display text-[8rem] font-light leading-none text-earth-brown/10 select-none"
            aria-hidden="true"
          >
            404
          </p>

          <div className="-mt-8 relative z-10">
            <p className="mb-3 font-body text-xs uppercase tracking-[0.25em] text-earth-brown/60">
              Madhuban Eco Retreat
            </p>
            <h1 className="font-display text-4xl font-medium italic text-charcoal md:text-5xl">
              Page Not Found
            </h1>
            <p className="mt-5 font-body text-base leading-relaxed text-charcoal/70 max-w-md mx-auto">
              The path you followed may have moved, or perhaps the forest claimed it. Let us guide
              you back to where the journey begins.
            </p>
          </div>

          {/* Divider */}
          <div
            className="my-8 mx-auto h-px w-16 bg-earth-brown/20"
            aria-hidden="true"
          />

          {/* Navigation links */}
          <nav aria-label="Return to site" className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-md bg-earth-brown px-8 font-body text-sm font-medium text-ivory transition hover:opacity-90"
            >
              Back to Home
            </Link>
            <Link
              href="/stay"
              className="inline-flex h-12 items-center justify-center rounded-md border border-earth-brown/40 px-8 font-body text-sm font-medium text-earth-brown transition hover:bg-earth-brown/5"
            >
              View Accommodations
            </Link>
          </nav>

          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/experiences"
              className="font-body text-sm text-charcoal/60 underline underline-offset-2 hover:text-earth-brown transition-colors"
            >
              Experiences
            </Link>
            <Link
              href="/contact-us"
              className="font-body text-sm text-charcoal/60 underline underline-offset-2 hover:text-earth-brown transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
