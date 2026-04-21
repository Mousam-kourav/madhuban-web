export const dynamic = "force-static";
import PrivacyPolicy from "@/components/privacyAndPolicy/page";
import SEO from "@/components/seo/Seo";
import { generateMataDataForSEO } from "@/utills/helperFunctions";

const schema = {
  "@context": "https://schema.org",
  "@type": "PrivacyPolicy",
  name: "Privacy Policy - Madhuban Eco Retreat, Near Bhopal",
  url: "https://www.madhubanecoretreat.com/privacy-policy",
  description:
    "Read Madhuban Eco Retreat’s privacy policy to understand how personal information is collected, used and protected.",
  inLanguage: "en-IN",
  publisher: {
    "@type": "LodgingBusiness",
    name: "Madhuban Eco Retreat",
    url: "https://www.madhubanecoretreat.com/",
    logo: "https://www.madhubanecoretreat.com/images/logo/logo-4.png",
    telephone: "+91-9770558419",
    email: "madhubanresort@somaiya.com",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Sarkanpur, Road, Dongri, Near Ratapani Wildlife Sanctuary",
      addressLocality: "Bhopal",
      addressRegion: "Madhya Pradesh",
      postalCode: "466446",
      addressCountry: "IN",
    },
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <SEO schemas={[schema]} />
      <PrivacyPolicy />
    </>
  );
}

export async function generateMetadata() {
  return generateMataDataForSEO({
    title: "Privacy Policy - Madhuban Eco Retreat, Near Bhopal",
    description:
      "Read Madhuban Eco Retreat’s privacy policy to learn how we collect, use and protect your personal information when you visit or contact us.",
    keywords: `Madhuban Eco Retreat privacy policy, resort privacy policy", lodge data protection", eco tourism website policy", guest data protection`,
    canonicalEndpoint: `/privacy-policy`,
    robots: {
      index: true,
      follow: true,
    },
  });
}
