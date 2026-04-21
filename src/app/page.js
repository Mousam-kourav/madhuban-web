export const dynamic = "force-static";
import SEO from "@/components/seo/Seo";
import Home from "./home/home";

const HomeSchema = {
  "@context": "https://schema.org",
  "@type": "Resort",
  name: "Madhuban Eco Retreat",
  alternateName: "Madhuban Eco Retreat Bhopal",
  url: "https://www.madhubanecoretreat.com/",
  description:
    "Madhuban Eco Retreat is an eco-luxury resort near Ratapani Wildlife Sanctuary in Bhopal, offering sustainable stays, nature walks, bird watching, and farm-to-table dining.",
  image: "https://www.madhubanecoretreat.com/assets/images/hero.jpg",
  telephone: "+91 9770 558 419",
  email: "madhubanresort@somaiya.com",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Near Ratapani Wildlife Sanctuary, Village Bori, Salkanpur Road, Rehti",
    addressLocality: "Bhopal",
    addressRegion: "Madhya Pradesh",
    postalCode: "466446",
    addressCountry: "IN",
  },
  amenityFeature: [
    {
      "@type": "LocationFeatureSpecification",
      name: "Eco-Friendly Stays",
      value: "true",
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Farm-to-Table Dining",
      value: "true",
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Forest Walks",
      value: "true",
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Bird Watching",
      value: "true",
    },
  ],
  sameAs: [
    "https://www.instagram.com/",
    "https://www.facebook.com/",
    "https://wa.me/919770558419",
  ],
};

export default function main() {
  return (
    <>
      <SEO schemas={[HomeSchema]} />
      <Home />
    </>
  );
}

export const metadata = {
  title: " Madhuban Eco Retreat | Best Eco Resort Near Bhopal",

  description:
    "Discover Madhuban Eco Retreat, a premier eco resort near Bhopal & Ratapani. Enjoy safari tents, mud villas, forest walks & sustainable luxury. Book your stay!",

  keywords: [
    " eco resort near Bhopal",
    "forest resort Ratapani",
    " nature resort Madhya Pradesh",
    "Ratapani eco lodge",
    "best weekend getaway near Bhopal",
  ],

  alternates: {
    canonical: "https://www.madhubanecoretreat.com",
  },

  robots: {
    index: true,
    follow: true,
  },
};
