import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { DINING_PREVIEW } from '@/lib/content/dining';

export function DiningPreview() {
  const { heading, body, cta, image } = DINING_PREVIEW;

  return (
    <Section label="Dining at Madhuban" id="dining" className="bg-cream">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Image — full-width within its column, 16:9 */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-warm-beige/20">
            <Image
              src={image.webp.desktop}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              loading="lazy"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            <Heading
              as="h2"
              text={heading}
              className="text-left [&>div]:justify-start"
            />
            <p className="font-body text-base leading-relaxed text-charcoal/80">
              {body}
            </p>
            <div>
              <Link
                href={cta.href}
                className="inline-flex h-12 items-center justify-center rounded-md bg-earth-brown px-8 text-sm font-medium text-ivory transition-colors duration-200 hover:bg-earth-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-brown focus-visible:ring-offset-2"
              >
                {cta.label}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
