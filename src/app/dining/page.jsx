export const dynamic = "force-static";
import Dining from "@/components/dining/Dining";
import SEO from "@/components/seo/Seo";

const diningSchema = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: "Madhuban Eco Retreat Dining",
  url: "https://www.madhubanecoretreat.com/dining",
  servesCuisine: [
    "Vegetarian",
    "Farm-to-Table",
    "Organic Indian Cuisine",
    "Local Tribal Cuisine",
  ],
  description:
    "Farm-to-table dining at Madhuban Eco Retreat with pure vegetarian meals, organic produce, sustainable cuisine and clean eating near Ratapani.",
  priceRange: "₹₹",
  image: [
    "https://www.madhubanecoretreat.com/assets/images/dining-1.jpg",
    "https://www.madhubanecoretreat.com/assets/images/dining-2.jpg",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Village Bori, Salkanpur Road, Rehti, Sehore",
    addressLocality: "Bhopal",
    addressRegion: "Madhya Pradesh",
    postalCode: "466446",
    addressCountry: "IN",
  },
  telephone: "+91 9770 558 419",
  email: "madhubanresort@somaiya.com",
  founder: "Somaiya Group",
  menu: "https://www.madhubanecoretreat.com/dining",
  acceptsReservations: "Yes",
  isAccessibleForFree: true,
  specialty: "Farm-to-fork vegetarian meals",
  slogan: "Fresh from Our Farm to Your Plate",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you serve non-vegetarian food?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, Madhuban Eco Retreat serves only pure vegetarian meals made with fresh, local and organic produce.",
      },
    },
    {
      "@type": "Question",
      name: "Is alcohol available at the retreat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, the retreat maintains an alcohol-free environment to support wellness and peaceful living.",
      },
    },
    {
      "@type": "Question",
      name: "What kind of food is served at Madhuban?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We serve clean, homestyle vegetarian meals inspired by local and tribal flavors, using fresh, seasonal ingredients.",
      },
    },
    {
      "@type": "Question",
      name: "Is the food organic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, most vegetables and herbs come from our organic farm or local growers.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer buffet meals?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer set meals daily and buffet options on weekends or for group bookings.",
      },
    },
  ],
};

const DiningPage = () => {
  return (
    <>
      <SEO schemas={[diningSchema, faqSchema]} />
      <Dining />
    </>
  );
};

export default DiningPage;

export const metadata = {
  title: "Farm-to-Table Dining Ratapani | Pure Veg Buffet Near Bhopal",

  description:
    "Experience fresh farm-to-table dining at Madhuban Eco Retreat. Pure veg meals, organic produce, sustainable cuisine & clean eating near Ratapani.",

  keywords: [
    "veg food near ratapani",
    "buffet near ratapani",
    "madhuban eco retreat menu",
    "farm to table dining bhopal",
    "organic food retreat mp",
    "sustainable cuisine ratapani",
    "best dinner in ratapani",
  ],

  alternates: {
    canonical: "https://www.madhubanecoretreat.com/dining",
  },

  robots: {
    index: true,
    follow: true,
  },
};
