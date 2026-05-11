import type { Metadata } from "next";
import { ReviewClient } from "./review-client";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Booking steps" className="mb-8">
          <ol className="flex items-center gap-2 font-body text-xs">
            <li className="text-muted-foreground">1. Your Details</li>
            <li aria-hidden="true" className="text-muted-foreground">→</li>
            <li className="font-semibold text-earth-brown">2. Review</li>
            <li aria-hidden="true" className="text-muted-foreground">→</li>
            <li className="text-muted-foreground">3. Payment</li>
          </ol>
        </nav>

        <div className="mb-8">
          <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
            Almost there
          </p>
          <h1 className="font-display text-3xl font-medium text-charcoal md:text-4xl">
            Review Your Booking
          </h1>
        </div>

        <ReviewClient slug={slug} />
      </div>
    </div>
  );
}
