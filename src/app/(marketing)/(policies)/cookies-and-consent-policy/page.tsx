import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Seo } from "@/components/ui/seo";
import { breadcrumbListFromPath } from "@/lib/schema/breadcrumb-list";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export const metadata: Metadata = buildMetadata({
  title: "Cookies & Consent Policy",
  titleOverride: "Cookies & Consent Policy | Madhuban Eco Retreat, Ratapani",
  description:
    "Learn how Madhuban Eco Retreat uses cookies to improve website experience, analytics, functionality and how you can manage your cookie preferences.",
  path: "/cookies-and-consent-policy",
  keywords: [
    'cookies policy',
    'cookie consent',
    'website cookies',
    'Madhuban Eco Retreat',
    'privacy cookies',
    'resort cookie policy',
  ],
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.madhubanecoretreat.com";

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Cookies & Consent Policy — Madhuban Eco Retreat",
  url: `${BASE_URL}/cookies-and-consent-policy`,
  description:
    "Cookie and consent policy for Madhuban Eco Retreat — how we use cookies and how you can control your preferences.",
  isPartOf: { "@type": "WebSite", url: BASE_URL, name: "Madhuban Eco Retreat" },
};

export default function CookiesAndConsentPolicyPage() {
  return (
    <>
      <Seo schemas={[webPageSchema, breadcrumbListFromPath("/cookies-and-consent-policy")]} />

      <Section className="bg-cream" label="Cookies and Consent Policy hero">
        <Container>
          <Heading
            as="h1"
            text="Cookies &amp; Consent Policy"
            subheading="How we use cookies and your choices"
            className="mb-4"
          />
          <p className="mx-auto max-w-[640px] text-center font-body text-base leading-relaxed text-charcoal/70">
            This policy explains how Madhuban Eco Retreat uses cookies and similar technologies
            when you visit our website, and how you can control your preferences.
          </p>
        </Container>
      </Section>

      <Section className="bg-white" label="Cookies and Consent Policy content">
        <Container>
          <div className="mx-auto max-w-3xl">
            <PolicySection title="1. What Are Cookies?">
              <p>
                Cookies are small text files stored on your device (computer, tablet, or mobile)
                when you visit a website. They help us recognize your browser and remember certain
                information to improve your experience, such as your language preference,
                personalization settings, and pages you visit. Cookies do not give us access to
                your personal files or sensitive data on your device.
              </p>
            </PolicySection>

            <PolicySection title="2. Types of Cookies We Use">
              <div className="space-y-5">
                <div>
                  <h3 className="font-body text-sm font-semibold text-charcoal mb-1">
                    a. Essential Cookies
                  </h3>
                  <p>
                    These cookies are necessary for the website to function correctly. They enable
                    core features like secure navigation, session management, and booking
                    processes. Without these cookies, parts of the website may not work properly.
                  </p>
                </div>
                <div>
                  <h3 className="font-body text-sm font-semibold text-charcoal mb-1">
                    b. Performance &amp; Analytics Cookies
                  </h3>
                  <p>
                    We use cookies to understand how visitors interact with our site so we can
                    improve performance. These cookies collect anonymous data about page visits,
                    time spent on pages, and website behavior.
                  </p>
                </div>
                <div>
                  <h3 className="font-body text-sm font-semibold text-charcoal mb-1">
                    c. Functionality Cookies
                  </h3>
                  <p>
                    These cookies remember your preferences during visits, such as region, language,
                    or other display choices, so you don&apos;t have to reset them each time.
                  </p>
                </div>
                <div>
                  <h3 className="font-body text-sm font-semibold text-charcoal mb-1">
                    d. Advertising &amp; Third-Party Cookies
                  </h3>
                  <p>
                    Our site may include content and features from third parties (e.g., maps,
                    social media or analytics tools) that use their own cookies. These cookies may
                    track your activity across websites and help tailor marketing and content
                    offers. You can manage or disable these through your browser settings.
                  </p>
                </div>
              </div>
            </PolicySection>

            <PolicySection title="3. Your Consent">
              <p>
                By continuing to browse and use our website, you consent to the placement of
                cookies on your device as described in this policy. If you do not wish to accept
                cookies, you can change your browser settings to reject or block cookies.
                However, this may impact your ability to fully use certain features of the site.
              </p>
              <p>
                You can update your cookie preferences at any time using the cookie settings
                panel, accessible via the cookie notice shown when you first visit the site.
              </p>
            </PolicySection>

            <PolicySection title="4. How to Control Cookies">
              <p>Most web browsers allow you to:</p>
              <ul>
                <li>Accept or reject cookies</li>
                <li>Delete existing cookies</li>
                <li>Set preferences for specific websites</li>
              </ul>
              <p>
                You can usually find these controls in your browser&apos;s &ldquo;Settings&rdquo;
                or &ldquo;Preferences&rdquo; menu. Please refer to your browser provider&apos;s
                help section for detailed instructions.
              </p>
            </PolicySection>

            <PolicySection title="5. Third-Party Services">
              <p>
                Some services used by our website (e.g., analytics, social integrations or maps)
                may set cookies on your device. We do not control these cookies and recommend
                reviewing the privacy policies of those third parties to understand how they use
                cookies and other tracking technologies.
              </p>
            </PolicySection>

            <PolicySection title="6. Security &amp; Your Data">
              <p>
                Cookies used on our site are managed with appropriate security measures. However,
                no online method of transmitting or storing information is completely secure, and
                we cannot guarantee absolute protection.
              </p>
            </PolicySection>

            <PolicySection title="7. Changes to This Policy">
              <p>
                We may update this policy from time to time to reflect changes in technology,
                legal requirements, or our privacy practices. Updated versions will be posted on
                this page with a revised effective date.
              </p>
            </PolicySection>

            <PolicySection title="8. Contact Us">
              <p>
                If you have questions about cookies or privacy practices at Madhuban Eco Retreat,
                please{" "}
                <a href="/contact-us" className="text-earth-brown underline underline-offset-2 hover:no-underline">
                  contact us
                </a>{" "}
                or email{" "}
                <a href="mailto:madhubanresort@somaiya.com" className="text-earth-brown underline underline-offset-2 hover:no-underline">
                  madhubanresort@somaiya.com
                </a>
                .
              </p>
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
