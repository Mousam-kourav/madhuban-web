export const dynamic = "force-static";
import ForestWalkAndNatureTrails from "@/components/experiences/Forest-Walk-And-Nature-Trails/ForestWalkAndNatureTrails";
import SEO from "@/components/seo/Seo";

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  name: "Forest Walks & Nature Trails",
  url: "https://www.madhubanecoretreat.com/experiences/forest-walks-and-nature-trails",
  description:
    "Guided forest walks and nature trails near Bhopal at Madhuban Eco Retreat. Explore flora, herbs, butterflies and Ratapani wilderness with naturalists.",
  provider: {
    "@type": "Resort",
    name: "Madhuban Eco Retreat",
    telephone: "+91 9770 558 419",
    email: "madhubanresort@somaiya.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Village Bori, Salkanpur Road, Rehti, Sehore",
      addressLocality: "Bhopal",
      addressRegion: "Madhya Pradesh",
      postalCode: "466446",
      addressCountry: "IN",
    },
  },
  offers: {
    "@type": "Offer",
    name: "Forest Walk Experience",
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: "https://www.madhubanecoretreat.com/experiences/forest-walks-and-nature-trails",
  },
  image: [
    "https://www.madhubanecoretreat.com/assets/images/forest-walk-1.jpg",
    "https://www.madhubanecoretreat.com/assets/images/forest-walk-2.jpg",
  ],
};

const FaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are the forest walks safe for beginners?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the guided nature trails are beginner-friendly, safe, and suitable for families and seniors.",
      },
    },
    {
      "@type": "Question",
      name: "What can I see during the nature trail?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can see native trees, medicinal plants, herbs, insects, butterflies and several bird species.",
      },
    },
    {
      "@type": "Question",
      name: "Is this the best forest walk near Bhopal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Madhuban Eco Retreat offers one of the most peaceful and eco-friendly forest walks near Bhopal in the Ratapani region.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to book forest walks in advance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pre-booking is recommended to ensure availability of naturalist guides.",
      },
    },
    {
      "@type": "Question",
      name: "Are nature trails suitable for kids?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, children enjoy the learning experience and the easy, safe walking trails.",
      },
    },
  ],
};

const ForestWalkAndNatureTrailsPage = () => {
  return (
    <>
      <SEO schemas={[pageSchema, FaqSchema]} />
      <ForestWalkAndNatureTrails />
    </>
  );
};

export default ForestWalkAndNatureTrailsPage;

export async function generateMetadata() {
  return {
    title: "Forest Walks Near Bhopal | Nature Trails in Ratapani",

    description:
      "Explore guided forest walks & nature trails near Bhopal at Madhuban Eco Retreat. Safe, scenic, eco-friendly trails in Ratapani. Ideal for families & nature lovers.",

    keywords: [
      "forest walks near bhopal",
      "nature trails bhopal",
      "ratapani forest walk",
      "eco nature trails ratapani",
      "offbeat nature trails bhopal",
      "forest trekking near bhopal",
      "eco tourism ratapani",
    ],

    alternates: {
      canonical:
        "https://www.madhubanecoretreat.com/experiences/forest-walks-and-nature-trails",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}
