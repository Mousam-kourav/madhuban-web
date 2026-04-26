import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Seo } from "@/components/ui/seo";
import { contactPage } from "@/lib/schema/contact-page";
import { breadcrumbListFromPath } from "@/lib/schema/breadcrumb-list";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { BUSINESS } from "@/lib/content/business";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Madhuban Eco Retreat, 60 km from Bhopal near Ratapani Tiger Reserve. We reply within one working day.",
  path: "/contact-us",
});

export default function ContactPage() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${BUSINESS.geo.latitude},${BUSINESS.geo.longitude}`;

  return (
    <>
      <Seo schemas={[contactPage(), breadcrumbListFromPath("/contact-us")]} />

      {/* Hero */}
      <Section className="bg-cream" label="Contact page hero">
        <Container>
          <Heading
            as="h1"
            text="Get in Touch"
            subheading="We reply within one working day. For faster response, WhatsApp us."
            className="mb-4"
          />
          <p className="mx-auto max-w-[640px] text-center font-body text-base leading-relaxed text-charcoal/70">
            Whether you&apos;re planning a stay, arranging a day outing, or simply curious about
            the forest — we&apos;d love to hear from you.
          </p>
        </Container>
      </Section>

      {/* Two-column: form + info */}
      <Section className="bg-cream pt-0" label="Contact form and details">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_340px]">

            {/* Form */}
            <div>
              <h2 className="font-display text-2xl font-medium text-charcoal mb-6">
                Send a message
              </h2>
              <ContactForm />
            </div>

            {/* Info sidebar */}
            <aside>
              <h2 className="font-display text-2xl font-medium text-charcoal mb-6">
                Find us
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-earth-brown/10">
                    <Phone className="h-4 w-4 text-earth-brown" />
                  </span>
                  <div>
                    <p className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${BUSINESS.phone}`}
                      className="font-body text-sm text-charcoal hover:text-earth-brown transition-colors"
                    >
                      {BUSINESS.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-earth-brown/10">
                    <Mail className="h-4 w-4 text-earth-brown" />
                  </span>
                  <div>
                    <p className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="font-body text-sm text-charcoal hover:text-earth-brown transition-colors"
                    >
                      {BUSINESS.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-earth-brown/10">
                    <MapPin className="h-4 w-4 text-earth-brown" />
                  </span>
                  <div>
                    <p className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-1">
                      Address
                    </p>
                    <p className="font-body text-sm text-charcoal leading-relaxed">
                      {BUSINESS.address.streetAddress},<br />
                      {BUSINESS.address.locality}, {BUSINESS.address.region} —{" "}
                      {BUSINESS.address.postalCode}
                    </p>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block font-body text-xs text-earth-brown underline underline-offset-2 hover:no-underline"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#EAE5DC] bg-warm-beige/20 p-5">
                  <p className="font-body text-sm font-medium text-charcoal mb-2">
                    Need a quick answer?
                  </p>
                  <p className="font-body text-xs text-charcoal/60 leading-relaxed mb-4">
                    WhatsApp is the fastest way to reach Shibajee and the team on the ground.
                  </p>
                  <a
                    href={`https://wa.me/${BUSINESS.whatsapp.replace(/\D/g, "")}?text=Hi, I have a question about Madhuban Eco Retreat.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-earth-brown px-5 font-body text-xs font-medium text-ivory hover:opacity-90 transition-opacity"
                  >
                    Chat on WhatsApp
                  </a>
                </div>

                <div className="pt-2">
                  <p className="font-body text-xs text-charcoal/50 leading-relaxed">
                    Planning a retreat?{" "}
                    <Link href="/enquire" className="text-earth-brown underline underline-offset-2">
                      Use our booking enquiry form
                    </Link>{" "}
                    for dates, room preferences, and group size.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
