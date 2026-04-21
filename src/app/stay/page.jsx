export const dynamic = "force-static";
import SEO from "@/components/seo/Seo";
import Stay from "@/components/stay/Stay";

const staySchema = {
  "@context": "https://schema.org",
  "@type": "Resort",
  name: "Madhuban Eco Retreat",
  url: "https://www.madhubanecoretreat.com/stay",
  description:
    "Eco-friendly resort stay near Bhopal offering safari tents, mud houses, poolside villas, glamping tents, and jungle camping near Ratapani.",
  image: "https://www.madhubanecoretreat.com/assets/images/madhuban-stay.jpg",
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
  geo: {
    "@type": "GeoCoordinates",
    latitude: "23.2599",
    longitude: "77.4126",
  },
  amenityFeature: [
    {
      "@type": "LocationFeatureSpecification",
      name: "Eco-Friendly Accommodation",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Safari Tents",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Mud Houses",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Poolside Villas",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Glamping Tents",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Camping Experience",
      value: true,
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Accommodation Options",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Safari Tent",
        description:
          "Eco-friendly safari tent stay near Bhopal with forest views, cane furniture, vanity, open-sky shower, and peaceful wilderness setting.",
        url: "https://www.madhubanecoretreat.com/stay/safari-tent",
      },
      {
        "@type": "Offer",
        name: "Mud House",
        description:
          "Traditional Gond-inspired mud house stay in Ratapani with air-conditioned rooms, large verandas, and 360-degree rooftop views.",
        url: "https://www.madhubanecoretreat.com/stay/mud-house",
      },
      {
        "@type": "Offer",
        name: "Pool Side Villa",
        description:
          "Private poolside villa near Bhopal offering serene eco-pool views, sustainable interiors, and forest-side ambiance.",
        url: "https://www.madhubanecoretreat.com/stay/poolside-villa",
      },
      {
        "@type": "Offer",
        name: "Glamping Tent",
        description:
          "Boutique glamping stay near Bhopal with chic interiors, ensuite bathroom, private lawn area, and curated eco-amenities.",
        url: "https://www.madhubanecoretreat.com/stay/glamping-tent",
      },
      {
        "@type": "Offer",
        name: "Camping Tent",
        description:
          "Eco-conscious camping experience in Ratapani with forest views, comfortable bedding, and a nature-immersive environment.",
        url: "https://www.madhubanecoretreat.com/stay/camping",
      },
    ],
  },
  sameAs: [
    "https://www.facebook.com/madhubanecoretreat",
    "https://www.instagram.com/madhubanecoretreat",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which is the best eco-friendly resort near Bhopal for a weekend stay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Madhuban Eco Retreat is one of the top-rated eco-resorts near Bhopal, offering safari tents, mud houses, glamping tents, poolside villas and camping stays near Ratapani.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer safari tent stays near Bhopal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our eco-friendly Safari Tents near Ratapani offer forest views, queen beds, Wi-Fi, solar-powered amenities, and open-sky showers for a true wilderness experience.",
      },
    },
    {
      "@type": "Question",
      name: "Are mud houses available for booking in Ratapani?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our Gond-inspired Mud Houses offer authentic architecture with modern amenities, organic orchard surroundings, and beautiful rooftop views.",
      },
    },
    {
      "@type": "Question",
      name: "Do you have private poolside villas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our Pool Side Villas feature eco-pool views, sustainable interiors, and peaceful surroundings—ideal for couples and families seeking a relaxing getaway near Bhopal.",
      },
    },
    {
      "@type": "Question",
      name: "Is camping allowed inside Ratapani Wildlife area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer safe, managed camping experiences in the Ratapani region with eco-friendly tents, forest views, and comfortable bedding.",
      },
    },
    {
      "@type": "Question",
      name: "Are your stays suitable for families?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our Pool Side Villas, Glamping Tents, and Mud Houses are family-friendly with ample space, peaceful surroundings, and natural experiences.",
      },
    },
    {
      "@type": "Question",
      name: "How far is Madhuban Eco Retreat from Bhopal city?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The retreat is conveniently located near Bhopal, offering quick access while immersing guests in the serene Ratapani forest region.",
      },
    },
  ],
};

const StayPage = () => {
  return (
    <>
      <SEO schemas={[staySchema, faqSchema]} />
      <Stay />
    </>
  );
};

export default StayPage;

export const metadata = {
  title:
    " Eco Stays at Ratapani | Safari Tents, Villas & More",

  description:
    "Explore eco-luxury stays at Madhuban Ratapani — safari tents, mud villas, glamping tents & poolside villas. Book your perfect nature retreat near Bhopal today!",

  keywords: [
    " safari tent Ratapani",
    "glamping tent Ratapani",
    "mud villa Ratapani",
    "poolside villa near Bhopal",
    " Ratapani jungle lodge"

  ],

  alternates: {
    canonical: "https://www.madhubanecoretreat.com/stay",
  },

  robots: {
    index: true,
    follow: true,
  },
};
