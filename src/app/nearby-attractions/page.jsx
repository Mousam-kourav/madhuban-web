export const dynamic = "force-static";
import NearbyAttractions from "@/components/nearbyAttractions/NearbyAttractions";
import SEO from "@/components/seo/Seo";

const attractionsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Nearby Attractions Around Madhuban Eco Retreat",
  url: "https://www.madhubanecoretreat.com/nearby-attractions",
  itemListElement: [
    {
      "@type": "TouristAttraction",
      position: 1,
      name: "Ratapani Wildlife Sanctuary",
      description:
        "688 sq.km teak forest with tigers, leopards, wild dogs and rich biodiversity near Madhuban Eco Retreat.",
    },
    {
      "@type": "TouristAttraction",
      position: 2,
      name: "Ginnorgarh Tribal Fort",
      description:
        "1200 BC tribal hill fort located inside Ratapani Tiger Reserve with ancient structures and water bodies.",
    },
    {
      "@type": "TouristAttraction",
      position: 3,
      name: "Bhimbetka Rock Shelters",
      description:
        "UNESCO World Heritage prehistoric rock shelter site showcasing Paleolithic and Mesolithic era art.",
    },
    {
      "@type": "TouristAttraction",
      position: 4,
      name: "Satpura Tiger Reserve",
      description:
        "Prime wildlife reserve known for tigers, safaris, deep forests and rugged landscapes.",
    },
    {
      "@type": "TouristAttraction",
      position: 5,
      name: "Saru Maru Caves",
      description:
        "Ancient Buddhist caves and monastic site with Ashokan-era inscriptions.",
    },
    {
      "@type": "TouristAttraction",
      position: 6,
      name: "Narmada River Darshan",
      description:
        "Sethani Ghat, a historic 19th-century riverfront structure along the Narmada River.",
    },
    {
      "@type": "TouristAttraction",
      position: 7,
      name: "Salkanpur Devi Temple",
      description:
        "800-foot hilltop temple dedicated to Goddess Vindhyavasni Beejasan Devi.",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best attractions near Madhuban Eco Retreat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top attractions include Ratapani Wildlife Sanctuary, Bhimbetka Rock Shelters, Ginnorgarh Fort, Saru Maru Caves, Salkanpur Temple and Satpura National Park.",
      },
    },
    {
      "@type": "Question",
      name: "Is Ratapani Wildlife Sanctuary worth visiting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Ratapani is known for rich biodiversity including tigers, leopards, hyenas and unique bird species.",
      },
    },
    {
      "@type": "Question",
      name: "Is Bhimbetka close to Madhuban Eco Retreat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Bhimbetka Rock Shelters are easily accessible and among the most recommended attractions nearby.",
      },
    },
  ],
};

const NearbyAttractionsPage = () => {
  return (
    <>
      <SEO schemas={[faqSchema, attractionsSchema]} />
      <NearbyAttractions />
    </>
  );
};

export default NearbyAttractionsPage;

export const metadata = {
  title:
    "Nearby Attractions Ratapani | Places to Visit Near Madhuban Eco Retreat",

  description:
    "Explore Ratapani Wildlife Sanctuary, Bhimbetka, Ginnorgarh Fort, Saru Maru Caves, Salkanpur Temple & Satpura attractions near Madhuban Eco Retreat.",

  keywords: [
    "nearby attractions ratapani",
    "places to visit near bhopal",
    "attractions near madhuban eco retreat",
    "satpura nearby places",
    "bhimbetka near ratapani",
    "ginnorgarh fort trek",
    "saru maru caves mp",
    "narmada darshan mp",
  ],

  alternates: {
    canonical: "https://www.madhubanecoretreat.com/nearby-attractions",
  },

  robots: {
    index: true,
    follow: true,
  },
};
