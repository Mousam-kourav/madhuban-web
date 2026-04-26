import { BUSINESS } from "@/lib/content/business";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.madhubanecoretreat.com";

export function contactPage(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact — ${BUSINESS.name}`,
    url: `${BASE_URL}/contact-us`,
    description:
      "Get in touch with Madhuban Eco Retreat. We respond within one working day.",
    mainEntity: {
      "@type": "Organization",
      name: BUSINESS.name,
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS.address.streetAddress,
        addressLocality: BUSINESS.address.locality,
        addressRegion: BUSINESS.address.region,
        postalCode: BUSINESS.address.postalCode,
        addressCountry: BUSINESS.address.country,
      },
    },
  };
}
