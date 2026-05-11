import { Quote, Star, ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { initials } from '@/lib/utils';
import {
  FEATURED_REVIEW,
  SUPPORTING_REVIEWS,
  GOOGLE_REVIEWS_URL,
  type Review,
} from '@/lib/testimonials/data';

interface VoicesFromMadhubanProps {
  /** Defaults to the bundled Google reviews. Pass to override (e.g. live API data). */
  featured?: Review;
  /** Defaults to the bundled Google reviews. */
  supporting?: readonly Review[];
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export function VoicesFromMadhuban({
  featured = FEATURED_REVIEW,
  supporting = SUPPORTING_REVIEWS,
}: VoicesFromMadhubanProps = {}) {
  return (
    <Section
      label="Voices from Madhuban"
      id="voices-from-madhuban"
      className="bg-warm-beige/30 py-24 md:py-32"
    >
      <Container>
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-gold-accent">
          Google Reviews
        </p>

        <Heading
          as="h2"
          text="Voices from Madhuban"
          subheading="Real reviews from real stays. Verified by Google."
          className="mb-12"
        />

        {/* Featured review */}
        <article className="relative mx-auto max-w-4xl rounded-3xl border border-warm-beige bg-ivory p-8 shadow-sm md:p-12">
          <Quote
            aria-hidden="true"
            className="absolute left-6 top-6 h-12 w-12 text-gold-accent/30"
          />

          <div
            aria-label={`Rated ${featured.rating} out of 5`}
            className="absolute right-6 top-6 flex gap-1"
          >
            {Array.from({ length: featured.rating }).map((_, i) => (
              <Star
                key={i}
                aria-hidden="true"
                className="h-4 w-4 fill-gold-accent text-gold-accent"
              />
            ))}
          </div>

          <blockquote className="mb-8 mt-8 font-body text-lg leading-relaxed text-charcoal md:text-xl">
            {featured.text}
          </blockquote>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-warm-beige font-bold text-earth-brown"
              >
                {initials(featured.author)}
              </div>
              <div>
                <p className="font-bold text-charcoal">{featured.author}</p>
                <p className="text-sm text-earth-brown/70">{featured.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-earth-brown/60">
              <GoogleIcon className="h-4 w-4" />
              <span>Verified Google Review</span>
            </div>
          </div>
        </article>

        {/* Supporting cards — horizontal scroll rail with edge gradients */}
        <div className="relative mt-12">
          {/* Left edge gradient mask */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-warm-beige/30 to-transparent"
          />
          {/* Right edge gradient mask */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-warm-beige/30 to-transparent"
          />

          <div className="scrollbar-hide -mx-4 overflow-x-auto px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
            <ul
              role="list"
              className="flex snap-x snap-mandatory gap-6 pb-2"
            >
              {supporting.map((review) => (
                <li
                  key={review.id}
                  className="w-[320px] shrink-0 snap-start md:w-[360px]"
                >
                  <article className="flex h-full flex-col rounded-2xl border border-warm-beige/60 bg-ivory p-6">
                    <div
                      aria-label={`Rated ${review.rating} out of 5`}
                      className="mb-3 flex gap-1"
                    >
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          aria-hidden="true"
                          className="h-3.5 w-3.5 fill-gold-accent text-gold-accent"
                        />
                      ))}
                    </div>

                    <p className="mb-4 line-clamp-5 flex-1 text-sm leading-relaxed text-charcoal">
                      {review.text}
                    </p>

                    <div className="flex items-center justify-between border-t border-warm-beige/50 pt-4">
                      <div className="flex items-center gap-3">
                        <div
                          aria-hidden="true"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-warm-beige text-xs font-bold text-earth-brown"
                        >
                          {initials(review.author)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-charcoal">
                            {review.author}
                          </p>
                          <p className="text-xs text-earth-brown/70">{review.location}</p>
                        </div>
                      </div>
                      <GoogleIcon className="h-4 w-4 opacity-60" />
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-charcoal px-6 py-3 text-cream transition-colors duration-200 hover:bg-forest-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
          >
            <GoogleIcon className="h-5 w-5" />
            <span className="font-semibold">Read all reviews on Google</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </Container>
    </Section>
  );
}
