export const dynamic = "force-static";
import SEO from "@/components/seo/Seo";
import TermsAndCondition from "@/components/termsAndCondition/termsAndCondition";
import { generateMataDataForSEO } from "@/utills/helperFunctions";

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.madhubanecoretreat.com/terms-and-conditions",
  url: "https://www.madhubanecoretreat.com/terms-and-conditions",
  name: "Terms & Conditions | Madhuban Eco Retreat Ratapani Bhopal",
  description:
    "Read the Terms & Conditions for Madhuban Eco Retreat covering reservations, safety, activities, cancellations, liability, and guest responsibilities.",
  inLanguage: "en-IN",
  isPartOf: {
    "@type": "WebSite",
    name: "Madhuban Eco Retreat",
    url: "https://www.madhubanecoretreat.com/",
  },
  about: {
    "@type": "Organization",
    name: "Madhuban Eco Retreat",
    url: "https://www.madhubanecoretreat.com/",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ratapani",
      addressRegion: "Madhya Pradesh",
      addressCountry: "IN",
    },
  },
  mainEntity: {
    "@type": "CreativeWork",
    name: "Terms and Conditions",
    text: "These Terms and Conditions govern reservations, payments, check-in and check-out, cancellations, guest conduct, health and outdoor activities, property liability, privacy, third-party services, intellectual property, and amendments applicable to Madhuban Eco Retreat.",
  },
};

export default function TermsAndConditionPage() {
  return (
    <>
      <SEO schemas={[schema]} />
      <TermsAndCondition />
    </>
  );
}

export async function generateMetadata() {
  return generateMataDataForSEO({
    title: "Terms & Conditions | Madhuban Eco Retreat Ratapani Bhopal",
    description:
      "Read the Terms & Conditions for Madhuban Eco Retreat covering reservations, safety, activities, cancellations, liability, and guest responsibilities.",
    keywords: ` terms and conditions, resort terms, booking terms, Madhuban Eco Retreat, Ratapani resort, Bhopal resort terms, guest policy,`,
    canonicalEndpoint: `/terms-and-condition`,
    robots: {
      index: true,
      follow: true,
    },
  });
}
