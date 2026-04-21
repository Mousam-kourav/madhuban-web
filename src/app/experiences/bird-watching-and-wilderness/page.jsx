export const dynamic = "force-static";
import BirdWatchingAndWilderness from "@/components/experiences/Bird-Watching-And-Wilderness/BirdWatchingAndWilderness";
import SEO from "@/components/seo/Seo";

const PageSchema = {
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  name: "Bird Watching & Wilderness",
  url: "https://www.madhubanecoretreat.com/experiences/bird-watching-and-wilderness",
  description:
    "Peaceful bird watching and wilderness sessions near Bhopal at Madhuban Eco Retreat. Spot 70+ bird species in the untouched forests of Ratapani.",
  image: [
    "https://www.madhubanecoretreat.com/assets/images/bird-watching-1.jpg",
    "https://www.madhubanecoretreat.com/assets/images/bird-watching-2.jpg",
  ],
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
    name: "Bird Watching Experience",
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: "https://www.madhubanecoretreat.com/experiences/bird-watching-and-wilderness",
  },
};

const FaqsSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What birds can I spot in Ratapani during bird watching?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can spot paradise flycatchers, golden orioles, kingfishers, drongos, peacocks, woodpeckers and various migratory birds.",
      },
    },
    {
      "@type": "Question",
      name: "Is this the best bird watching spot near Bhopal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Madhuban Eco Retreat is one of the top bird watching locations near Bhopal with over 70 species recorded.",
      },
    },
    {
      "@type": "Question",
      name: "Are bird watching sessions guided?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all bird watching sessions are guided by expert naturalists.",
      },
    },
    {
      "@type": "Question",
      name: "What time is ideal for bird watching?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Early mornings and sunset hours are the most active for bird sightings.",
      },
    },
    {
      "@type": "Question",
      name: "Is bird watching suitable for kids and beginners?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the sessions are safe and ideal for beginners, children, and families.",
      },
    },
  ],
};

const BirdWildernessPage = () => {
  return (
    <>
      <SEO schemas={[PageSchema, FaqsSchema]} />
      <BirdWatchingAndWilderness />
    </>
  );
};

export default BirdWildernessPage;

export async function generateMetadata() {
  return {
    title: "Bird Watching in Ratapani | Wilderness Experience Near Bhopal",

    description:
      "Experience bird watching in Ratapani near Bhopal. Spot 70+ native & migratory species during peaceful guided wilderness sessions at Madhuban Eco Retreat.",

    keywords: [
      "bird watching near bhopal",
      "ratapani bird watching",
      "wilderness near bhopal",
      "forest birding mp",
      "migratory birds ratapani",
      "wildlife trails bhopal",
      "eco tourism ratapani",
    ],

    alternates: {
      canonical:
        "https://www.madhubanecoretreat.com/experiences/bird-watching-and-wilderness",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}
