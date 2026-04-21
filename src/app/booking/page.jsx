export const dynamic = "force-static";

import NewBooking from "@/components/booking/NewBooking";
import SEO from "@/components/seo/Seo";
import { generateMataDataForSEO } from "@/utills/helperFunctions";

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Book Madhuban Eco Retreat | Hotel Near Ratapani Jungle",
  url: "https://www.madhubanecoretreat.com/booking",
  description:
    "Book Madhuban Eco Retreat near Ratapani Wildlife Sanctuary. Check resort price, availability & secure your eco-friendly jungle stay today!",
  inLanguage: "en-IN",
  mainEntity: {
    "@type": "LodgingBusiness",
    name: "Madhuban Eco Retreat",
    url: "https://www.madhubanecoretreat.com/",
    logo: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/madhuban-eco-retreat-bhopal-logo.png",
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
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Eco-friendly accommodations",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Family-friendly rooms",
      },
      { "@type": "LocationFeatureSpecification", name: "Jungle views" },
    ],
  },
  potentialAction: {
    "@type": "ReserveAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.madhubanecoretreat.com/booking",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: {
      "@type": "LodgingReservation",
      name: "Madhuban Eco Retreat Booking",
    },
  },
  mainEntityOfPage: [
    {
      "@type": "Question",
      name: "How can I book a resort near Ratapani jungle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use our online booking portal for instant hotel in Ratapani online booking and secure your preferred dates.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Madhuban Eco Retreat price?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prices vary by room type. Check the portal for Ratapani resort price and seasonal offers.",
      },
    },
    {
      "@type": "Question",
      name: "Can I book a hotel near Ratapani for family stays?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our family-friendly rooms are perfect for group stays and digital detox getaways.",
      },
    },
    {
      "@type": "Question",
      name: "Are there hotels near Ratapani Wildlife Sanctuary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Madhuban Eco Retreat is a top-rated eco-resort close to Ratapani, ideal for wildlife and nature enthusiasts.",
      },
    },
  ],
};

const BookingModal = () => {
  return (
    <>
      <SEO schemas={[schema]} />
      <NewBooking />
    </>
  );
};

export async function generateMetadata() {
  return generateMataDataForSEO({
    title: "Book Madhuban Eco Retreat | Hotel Near Ratapani Jungle",
    description:
      "Book Madhuban Eco Retreat near Ratapani Wildlife Sanctuary. Check resort price, availability & secure your eco-friendly jungle stay today!",
    keywords:
      "Book resort near ratapani jungle, Ratapani resort price, Madhuban Eco Retreat price, Ratapani resort booking, Book hotel near ratapani jungle lodge, Hotels near Ratapani Wildlife Sanctuary, Book hotel near ratapani for family, Hotel in Ratapani online booking",
    canonicalEndpoint: `/booking`,
    robots: {
      index: true,
      follow: true,
    },
  });
}

export default BookingModal;
