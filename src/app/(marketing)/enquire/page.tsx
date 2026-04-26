import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Seo } from "@/components/ui/seo";
import { breadcrumbListFromPath } from "@/lib/schema/breadcrumb-list";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { BookingEnquiryForm } from "@/components/forms/booking-enquiry-form";

export const metadata: Metadata = buildMetadata({
  title: "Plan Your Retreat",
  description:
    "Tell us your dates, preferred room, and group size. We'll confirm availability and send personalised details within one working day.",
  path: "/enquire",
});

export default function EnquirePage() {
  return (
    <>
      <Seo schemas={[breadcrumbListFromPath("/enquire")]} />

      {/* Hero */}
      <Section className="bg-cream" label="Enquiry page hero">
        <Container>
          <Heading
            as="h1"
            text="Plan Your Retreat"
            subheading="Tell us your dates and we'll confirm availability within one working day."
            className="mb-4"
          />
          <p className="mx-auto max-w-[620px] text-center font-body text-base leading-relaxed text-charcoal/70">
            Share your travel dates, room preference, and party size below. This is an enquiry —
            not a booking — so there&apos;s no payment at this stage.
          </p>
        </Container>
      </Section>

      {/* Form */}
      <Section className="bg-cream pt-0" label="Booking enquiry form">
        <Container>
          <div className="mx-auto max-w-[640px]">
            <BookingEnquiryForm />

            <p className="mt-6 font-body text-xs text-charcoal/40 text-center leading-relaxed">
              Prefer to talk?{" "}
              <a
                href="https://wa.me/919770558419?text=Hi, I'd like to plan a retreat at Madhuban."
                target="_blank"
                rel="noopener noreferrer"
                className="text-earth-brown underline underline-offset-2"
              >
                WhatsApp us
              </a>{" "}
              or{" "}
              <Link href="/contact-us" className="text-earth-brown underline underline-offset-2">
                send a general message
              </Link>
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
