export const dynamic = "force-static";
import Disclaimer from "@/components/disclaimer/Disclaimer";
import SEO from "@/components/seo/Seo";
import { generateMataDataForSEO } from "@/utills/helperFunctions";

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.madhubanecoretreat.com/disclaimer",
  url: "https://www.madhubanecoretreat.com/disclaimer",
  name: "Disclaimer | Madhuban Eco Retreat Ratapani Near Bhopal",
  description:
    "Official disclaimer of Madhuban Eco Retreat covering website information, nature activities, wildlife experiences, liability and external links.",
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
    name: "Website Disclaimer",
    text: "This disclaimer explains the nature of information, wildlife and outdoor experiences, personal responsibility, third-party links, website availability, intellectual property, limitation of liability, and updates applicable to Madhuban Eco Retreat.",
  },
};

export default function DisclaimerPage() {
  return (
    <>
      <SEO schemas={[schema]} />
      <Disclaimer />
    </>
  );
}

export async function generateMetadata() {
  return generateMataDataForSEO({
    title: "Disclaimer | Madhuban Eco Retreat Ratapani Near Bhopal",
    description:
      "Read the official disclaimer of Madhuban Eco Retreat covering website information, nature activities, wildlife experiences, liability and external links.",
    keywords: ` disclaimer, madhuban eco retreat, resort disclaimer, eco retreat policy, nature resort, ratapani resort,resort near bhopal`,
    canonicalEndpoint: `/disclaimer`,
    robots: {
      index: true,
      follow: true,
    },
  });
}
