import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Seo } from "@/components/ui/seo";
import { breadcrumbListFromPath } from "@/lib/schema/breadcrumb-list";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  titleOverride: "Terms & Conditions | Madhuban Eco Retreat Ratapani Bhopal",
  description:
    "Read the Terms & Conditions for Madhuban Eco Retreat covering reservations, safety, activities, cancellations, liability, and guest responsibilities.",
  path: "/terms-and-condition",
  keywords: [
    'terms and conditions',
    'resort terms',
    'booking terms',
    'Madhuban Eco Retreat',
    'Ratapani resort',
    'Bhopal resort terms',
    'guest policy',
  ],
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.madhubanecoretreat.com";

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms and Conditions — Madhuban Eco Retreat",
  url: `${BASE_URL}/terms-and-condition`,
  description:
    "Terms and conditions for reservations, cancellations, guest conduct, and services at Madhuban Eco Retreat.",
  isPartOf: { "@type": "WebSite", url: BASE_URL, name: "Madhuban Eco Retreat" },
};

export default function TermsAndConditionPage() {
  return (
    <>
      <Seo schemas={[webPageSchema, breadcrumbListFromPath("/terms-and-condition")]} />

      <Section className="bg-cream" label="Terms and Conditions hero">
        <Container>
          <Heading
            as="h1"
            text="Terms &amp; Conditions"
            subheading="Governing your stay and use of our services"
            className="mb-4"
          />
          <p className="mx-auto max-w-[640px] text-center font-body text-base leading-relaxed text-charcoal/70">
            Please read these terms carefully before booking or using any services at Madhuban Eco
            Retreat.
          </p>
        </Container>
      </Section>

      <Section className="bg-white" label="Terms and Conditions content">
        <Container>
          <div className="mx-auto max-w-3xl">
            <PolicySection title="1. Reservations &amp; Payments">
              <ul>
                <li>All reservations depend on availability.</li>
                <li>
                  Valid confirmations occur through online booking, phone, or email.
                </li>
                <li>
                  Advance payment or security deposit may be required as per the booking terms.
                </li>
                <li>
                  Pricing and packages can change without notice unless confirmed in writing.
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="2. Check-In &amp; Check-Out">
              <p>
                Arrival and departure times require final confirmation. Early arrival or extended
                stay may be available with potential extra fees, subject to room availability.
              </p>
            </PolicySection>

            <PolicySection title="3. Cancellation &amp; Refund">
              <ul>
                <li>Written notice is required to cancel bookings.</li>
                <li>
                  Refunds, when eligible, are processed to the original payment method within
                  5&ndash;7 business days of cancellation.
                </li>
              </ul>
              <p>Refund schedule by notice period:</p>
              <ul>
                <li>
                  <strong>7 or more days before check-in:</strong> Full refund (100%, free
                  cancellation)
                </li>
                <li>
                  <strong>3 to 7 days before check-in:</strong> 50% refund
                </li>
                <li>
                  <strong>Less than 3 days before check-in or no-show:</strong> No refund
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="4. Guest Conduct &amp; Safety">
              <ul>
                <li>
                  Visitors must respect the property, team members, and fellow guests.
                </li>
                <li>Smoking is restricted to designated zones only.</li>
                <li>
                  Use of alcohol, recreational substances, or behavior which endangers others is
                  strictly prohibited.
                </li>
                <li>
                  Management may deny service to those violating policies or posing safety risks.
                </li>
              </ul>
            </PolicySection>

            <PolicySection title="5. Health &amp; Outdoor Activities">
              <p>
                Participation in outdoor experiences, forest walks, bird watching, nature trails,
                and leisure activities is voluntary and at your own risk. Guests should assess
                their fitness before activities. The retreat disclaims responsibility for injuries
                arising from guest participation in these activities.
              </p>
            </PolicySection>

            <PolicySection title="6. Property, Liability &amp; Damages">
              <p>
                Guests bear responsibility for damage to accommodations or facilities. Repair,
                replacement, and cleaning costs may be charged by management.
              </p>
            </PolicySection>

            <PolicySection title="7. Privacy &amp; Personal Information">
              <p>
                Guest data handling follows our{" "}
                <a href="/privacy-policy" className="text-earth-brown underline underline-offset-2 hover:no-underline">
                  Privacy Policy
                </a>
                . The retreat attempts reasonable security measures but is not liable for
                unauthorized third-party breaches.
              </p>
            </PolicySection>

            <PolicySection title="8. Third-Party Links &amp; Services">
              <p>
                External website links do not reflect retreat responsibility. Third-party content,
                transactions, and policies remain independent of Madhuban Eco Retreat.
              </p>
            </PolicySection>

            <PolicySection title="9. Intellectual Property">
              <p>
                All content, branding elements, images, text, and digital assets on this site are
                owned by Madhuban Eco Retreat. Unauthorized copying, reproduction, or sharing is
                prohibited.
              </p>
            </PolicySection>

            <PolicySection title="10. Amendments">
              <p>
                Terms may be updated at any time without prior notification. Continued use of the
                website or services implies acceptance of any modifications.
              </p>
            </PolicySection>

            <div className="mt-10 rounded-2xl border border-border bg-cream p-6">
              <p className="font-body text-sm text-charcoal/70 leading-relaxed">
                Questions about these terms? Contact us at{" "}
                <a href="mailto:madhubanresort@somaiya.com" className="text-earth-brown underline underline-offset-2 hover:no-underline">
                  madhubanresort@somaiya.com
                </a>{" "}
                or{" "}
                <a href="tel:+919770558419" className="text-earth-brown underline underline-offset-2 hover:no-underline">
                  +91 9770558419
                </a>
                .
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-xl font-medium text-charcoal mb-4">{title}</h2>
      <div className="space-y-3 font-body text-sm leading-relaxed text-charcoal/80 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_p]:leading-7">
        {children}
      </div>
    </section>
  );
}
