export const dynamic = "force-static";

import ContactPage2 from "@/components/contact/Contact2";
import SEO from "@/components/seo/Seo";
import { generateMataDataForSEO } from "@/utills/helperFunctions";
const schema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Madhuban Eco Retreat",
  url: "https://www.madhubanecoretreat.com/contact",
  description:
    "Get in touch with Madhuban Eco Retreat, an eco-friendly jungle resort near Ratapani Wildlife Sanctuary, Madhya Pradesh.",
  mainEntity: {
    "@type": "LodgingBusiness",
    name: "Madhuban Eco Retreat",
    url: "https://www.madhubanecoretreat.com/",
    logo: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/madhuban-eco-retreat-bhopal-logo.png",
    telephone: "+91-9770558419",
    email: "madhubanresort@somaiya.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sarkanpur, Road, Dongri",
      addressLocality: "Dongri",
      addressRegion: "Madhya Pradesh",
      postalCode: "466446",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Ratapani Wildlife Sanctuary, Bhopal, Madhya Pradesh",
    },
    sameAs: ["https://maps.app.goo.gl/YBcoQ4owh71Ly4so6"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9770558419",
      contactType: "Customer Support",
      availableLanguage: ["English", "Hindi"],
      areaServed: "IN",
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <SEO schemas={[schema]} />
      <ContactPage2 />
    </>
  );
}

export async function generateMetadata() {
  return generateMataDataForSEO({
    title: "Contact Madhuban Eco Retreat | Jungle Retreat in Ratapani",
    description:
      "Contact with Madhuban Eco Retreat, a top eco tourism and detox jungle retreat in Ratapani. Get a response within 24 hrs for any bookings & inquiries. ",
    keywords:
      " Contact Madhuban Eco Retreat, Eco tourism, Nature resort near Ratapani, Detox retreat , Resorts near Bhopal for day outing, Contact jungle resort near Bhopal, Eco resort Bhopal , Eco resort India",
    canonicalEndpoint: `/contact-us`,
    robots: {
      index: true,
      follow: true,
    },
  });
}
