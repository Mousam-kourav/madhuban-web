import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Seo } from "@/components/ui/seo";
import { breadcrumbListFromPath } from "@/lib/schema/breadcrumb-list";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Learn how Madhuban Eco Retreat collects, uses, and protects your personal information when you visit our website or make a reservation.",
  path: "/privacy-policy",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.madhubanecoretreat.com";

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy — Madhuban Eco Retreat",
  url: `${BASE_URL}/privacy-policy`,
  description:
    "Privacy Policy for Madhuban Eco Retreat — how we collect, use, and protect your personal information.",
  isPartOf: { "@type": "WebSite", url: BASE_URL, name: "Madhuban Eco Retreat" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Seo schemas={[webPageSchema, breadcrumbListFromPath("/privacy-policy")]} />

      <Section className="bg-cream" label="Privacy Policy hero">
        <Container>
          <Heading
            as="h1"
            text="Privacy Policy"
            subheading="How we handle your information"
            className="mb-4"
          />
          <p className="mx-auto max-w-[640px] text-center font-body text-base leading-relaxed text-charcoal/70">
            At Madhuban Eco Retreat, your privacy is important to us. This policy explains what
            information we collect and how we use it.
          </p>
        </Container>
      </Section>

      <Section className="bg-white" label="Privacy Policy content">
        <Container>
          <div className="mx-auto max-w-3xl prose-policy">
            <PolicySection title="1. Introduction — Personal Information You Provide">
              <p>
                When you use the website — for example to sign up, make an inquiry, book a stay,
                subscribe to newsletters or contact us — you may voluntarily share personal
                information such as:
              </p>
              <ul>
                <li>Your name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Postal address (if provided)</li>
                <li>Message or inquiry details</li>
              </ul>
              <p>We collect this information only when you provide it directly via forms or email.</p>
            </PolicySection>

            <PolicySection title="2. How We Use Your Information">
              <p>We may use your personal data for the following purposes:</p>
              <ul>
                <li>To respond to your inquiries, bookings, messages or requests</li>
                <li>To process and confirm reservations or other services</li>
                <li>
                  To send you updates about special offers, packages or promotions (only with your
                  consent)
                </li>
                <li>To improve our website, services and communication</li>
              </ul>
              <p>We do not sell or rent your personal information to third parties.</p>
            </PolicySection>

            <PolicySection title="3. Cookies and Tracking Technologies">
              <p>
                The website may use standard tracking technologies like cookies or web beacons to
                collect anonymous information about your interactions with the site (e.g., pages
                visited, time spent, referring URL). This helps improve user experience. You may
                choose to disable cookies in your browser settings, but some features of the site
                may not work correctly without them.
              </p>
              <p>
                For full details, please see our{" "}
                <a href="/cookies-and-consent-policy" className="text-earth-brown underline underline-offset-2 hover:no-underline">
                  Cookies &amp; Consent Policy
                </a>
                .
              </p>
            </PolicySection>

            <PolicySection title="4. How We Protect Your Data">
              <p>
                We take reasonable security measures to protect your personal information from
                unauthorized access, loss, or misuse. Please note that no method of transmission
                over the Internet is 100% secure, and while efforts are made to protect
                information, absolute security cannot be guaranteed.
              </p>
            </PolicySection>

            <PolicySection title="5. Third-Party Services">
              <p>
                The site may use trusted third-party service providers (e.g., email services,
                analytics tools) to support website functions, bookings or communication systems.
                These services are bound to protect your information.
              </p>
            </PolicySection>

            <PolicySection title="6. Your Rights">
              <p>You have the right to:</p>
              <ul>
                <li>Access the personal information held about you</li>
                <li>Request corrections or updates to your data</li>
                <li>Unsubscribe from future communications</li>
              </ul>
              <p>
                To exercise these rights, contact us at{" "}
                <a href="mailto:madhubanresort@somaiya.com" className="text-earth-brown underline underline-offset-2 hover:no-underline">
                  madhubanresort@somaiya.com
                </a>{" "}
                or call{" "}
                <a href="tel:+919770558419" className="text-earth-brown underline underline-offset-2 hover:no-underline">
                  +91 9770558419
                </a>
                .
              </p>
            </PolicySection>

            <PolicySection title="7. Children&#39;s Privacy">
              <p>
                Our website and services are not intended for children under the age of 13. We do
                not knowingly collect personal information from children.
              </p>
            </PolicySection>

            <PolicySection title="8. Changes to This Policy">
              <p>
                Updates to this Privacy Policy will be posted here with a revised date. Continued
                use of the website after changes constitutes acceptance of the updated policy.
              </p>
            </PolicySection>

            <PolicySection title="9. Contact Us">
              <address className="not-italic font-body text-sm leading-relaxed text-charcoal/80">
                <strong className="text-charcoal">Madhuban Eco Retreat</strong>
                <br />
                Near Ratapani Wildlife Sanctuary, Village Bori, Salkanpur Road
                <br />
                Rehti, Sehore, Madhya Pradesh — 466446
                <br />
                <a href="tel:+919770558419" className="text-earth-brown underline underline-offset-2 hover:no-underline">
                  +91 9770558419
                </a>
                <br />
                <a href="mailto:madhubanresort@somaiya.com" className="text-earth-brown underline underline-offset-2 hover:no-underline">
                  madhubanresort@somaiya.com
                </a>
              </address>
            </PolicySection>
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
