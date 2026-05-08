import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Seo } from "@/components/ui/seo";
import { breadcrumbListFromPath } from "@/lib/schema/breadcrumb-list";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer",
  titleOverride: "Disclaimer | Madhuban Eco Retreat Ratapani Near Bhopal",
  description:
    "Read the official disclaimer of Madhuban Eco Retreat covering website information, nature activities, wildlife experiences, liability and external links.",
  path: "/disclaimer",
  keywords: [
    'disclaimer',
    'madhuban eco retreat',
    'resort disclaimer',
    'eco retreat policy',
    'nature resort',
    'ratapani resort',
    'resort near bhopal',
  ],
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.madhubanecoretreat.com";

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Disclaimer — Madhuban Eco Retreat",
  url: `${BASE_URL}/disclaimer`,
  description:
    "Disclaimer for Madhuban Eco Retreat covering limitations on liability, nature of website information, and outdoor activity participation.",
  isPartOf: { "@type": "WebSite", url: BASE_URL, name: "Madhuban Eco Retreat" },
};

export default function DisclaimerPage() {
  return (
    <>
      <Seo schemas={[webPageSchema, breadcrumbListFromPath("/disclaimer")]} />

      <Section className="bg-cream" label="Disclaimer hero">
        <Container>
          <Heading
            as="h1"
            text="Disclaimer"
            subheading="Important limitations on information and liability"
            className="mb-4"
          />
          <p className="mx-auto max-w-[640px] text-center font-body text-base leading-relaxed text-charcoal/70">
            The information on this website is provided in good faith. Please read this disclaimer
            carefully before relying on any content or participating in activities described here.
          </p>
        </Container>
      </Section>

      <Section className="bg-white" label="Disclaimer content">
        <Container>
          <div className="mx-auto max-w-3xl">
            <PolicySection title="1. Nature of Information">
              <p>
                The website content serves informational and promotional purposes only. While
                efforts are made to maintain accuracy, the retreat does not guarantee that pricing,
                availability, itineraries, amenities, activity schedules, wildlife sightings, or
                descriptions will always be complete, current, or error-free. Details may shift
                based on seasonal conditions, environmental factors, safety considerations,
                operational needs, or regulatory guidelines.
              </p>
            </PolicySection>

            <PolicySection title="2. Outdoor Activities &amp; Natural Conditions">
              <p>
                Nature-based experiences at the retreat involve variable outdoor conditions and
                wildlife encounters. Guest participation remains voluntary, and while safety
                protocols exist, the retreat disclaims liability for any injury, discomfort, or
                loss arising from these experiences, except as required by law.
              </p>
            </PolicySection>

            <PolicySection title="3. Health, Safety &amp; Personal Responsibility">
              <p>
                Visitors must evaluate their own physical fitness, medical status, and personal
                safety before participating in activities. Staff guidance is advisory only and
                does not substitute for individual responsibility or professional medical
                consultation.
              </p>
            </PolicySection>

            <PolicySection title="4. Images, Videos &amp; Visual Content">
              <p>
                Visual materials represent the property for promotional purposes. Actual
                accommodations, landscapes, amenities, and experiences may differ due to natural
                changes, seasonal variations, or facility upgrades.
              </p>
            </PolicySection>

            <PolicySection title="5. Third-Party Links &amp; Services">
              <p>
                The website may contain external links to maps, booking platforms, and social
                media. Madhuban Eco Retreat does not control or accept responsibility for
                third-party content, availability, or policies.
              </p>
            </PolicySection>

            <PolicySection title="6. Website Availability &amp; Technical Accuracy">
              <p>
                The retreat does not warrant continuous website availability or freedom from
                technical issues. It disclaims liability for temporary unavailability or
                technical errors.
              </p>
            </PolicySection>

            <PolicySection title="7. Intellectual Property">
              <p>
                Website content, including text, logos, images, and layout, belongs to Madhuban
                Eco Retreat unless otherwise noted. Unauthorized reproduction or commercial use
                is prohibited.
              </p>
            </PolicySection>

            <PolicySection title="8. Limitation of Liability">
              <p>
                Madhuban Eco Retreat is not liable for any direct, indirect, incidental, or
                consequential loss or damage arising from the use of this website, reliance on
                its content, or participation in experiences described herein.
              </p>
            </PolicySection>

            <PolicySection title="9. Updates to This Disclaimer">
              <p>
                Madhuban Eco Retreat reserves the right to modify this disclaimer at any time
                without notice. Continued website use implies acceptance of updated terms.
              </p>
            </PolicySection>

            <div className="mt-10 rounded-2xl border border-border bg-cream p-6">
              <p className="font-body text-sm text-charcoal/70 leading-relaxed">
                Questions? Contact us at{" "}
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
