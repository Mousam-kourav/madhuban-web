export const dynamic = "force-static";
import Cookie from "@/components/cookie/Cookie";
import SEO from "@/components/seo/Seo";
import { generateMataDataForSEO } from "@/utills/helperFunctions";

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.madhubanecoretreat.com/cookies-and-consent-policy",
  url: "https://www.madhubanecoretreat.com/cookies-and-consent-policy",
  name: "Cookies & Consent Policy | Madhuban Eco Retreat, Ratapani",
  description:
    "Learn how Madhuban Eco Retreat uses cookies to improve website experience, analytics, functionality and how you can manage your cookie preferences.",
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
    name: "Cookies and Consent Policy",
    text: "This Cookies and Consent Policy explains what cookies are, the types of cookies used, user consent, cookie controls, third-party services, data security measures, and policy updates applicable to Madhuban Eco Retreat.",
  },
};

export default function PrivacyPolicy() {
  return (
    <>
      <SEO schemas={[schema]} />
      <Cookie />
    </>
  );
}

export async function generateMetadata() {
  return generateMataDataForSEO({
    title: "Cookies & Consent Policy | Madhuban Eco Retreat, Ratapani",
    description:
      "Learn how Madhuban Eco Retreat uses cookies to improve website experience, analytics, functionality and how you can manage your cookie preferences.",
    keywords: ` cookies policy, cookie consent,website cookies, Madhuban Eco Retreat, privacy cookies, resort cookie policy`,
    canonicalEndpoint: `/cookies-and-consent-policy`,
    robots: {
      index: true,
      follow: true,
    },
  });
}
