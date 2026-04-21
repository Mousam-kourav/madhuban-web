export const dynamic = "force-static";

import AboutUs from "@/components/about/about";
import SEO from "@/components/seo/Seo";

const schema = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Madhuban Eco Retreat",
  url: "https://www.madhubanecoretreat.com/about-us",
  image: "https://www.madhubanecoretreat.com/assets/images/madhuban.jpg",
  description:
    "Madhuban Eco Retreat is a nature-based eco resort near Bhopal offering sustainable tourism experiences, slow travel, and wellness-focused stays near Ratapani.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bhopal",
    addressRegion: "Madhya Pradesh",
    addressCountry: "India",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "23.2599",
    longitude: "77.4126",
  },
  amenityFeature: [
    {
      "@type": "LocationFeatureSpecification",
      name: "Eco-friendly Accommodation",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Organic Farm-to-Table Food",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Nature & Wellness Activities",
      value: true,
    },
  ],
  sameAs: [
    "https://www.facebook.com/madhubanecoretreat",
    "https://www.instagram.com/madhubanecoretreat",
  ],
};

const AboutUsPage = () => {
  return (
    <>
      <SEO schemas={[schema]} />
      <AboutUs />
    </>
  );
};

export default AboutUsPage;

export async function generateMetadata() {
  return {
    title:
      "About Madhuban Eco Retreat – Best Eco Resort Near Bhopal & Ratapani",
    description:
      "Discover Madhuban Eco Retreat near Bhopal—an eco-friendly jungle resort promoting slow tourism, sustainability, and meaningful nature-based experiences in Ratapani.",
    keywords: [
      "best resorts near ratapani",
      "jungle resort near bhopal",
      "eco tourism",
      "slow tourism",
      "detox retreat bhopal",
      "sustainable tourism india",
      "eco lodge near ratapani",
      "weekend getaway bhopal",
      "nature resort bhopal",
      "madhuban eco retreat",
    ],
    alternates: {
      canonical: "https://www.madhubanecoretreat.com/about-us",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}
