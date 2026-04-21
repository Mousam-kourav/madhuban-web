export const dynamic = "force-static";
import Gallery from "@/components/gallery/Gallery";
import SEO from "@/components/seo/Seo";

const GallerySchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Madhuban Eco Retreat Gallery",
  url: "https://www.madhubanecoretreat.com/gallery",
  description:
    "Explore the eco gallery of Madhuban Eco Retreat, showcasing nature, tribal culture, forest views, heritage sites and scenic experiences from Ratapani.",
  mainEntity: {
    "@type": "ImageGallery",
    name: "Eco Gallery",
    image: [
      "https://www.madhubanecoretreat.com/assets/images/gallery-1.jpg",
      "https://www.madhubanecoretreat.com/assets/images/gallery-2.jpg",
      "https://www.madhubanecoretreat.com/assets/images/gallery-3.jpg",
      "https://www.madhubanecoretreat.com/assets/images/gallery-4.jpg",
    ],
  },
};

const GalleryPage = () => {
  return (
    <>
      <SEO schemas={[GallerySchema]} />
      <Gallery />
    </>
  );
};

export default GalleryPage;

export const metadata = {
  title: "Madhuban Eco Gallery | Nature, Culture & Retreat Photo Collection",

  description:
    "Explore the eco gallery of Madhuban Eco Retreat—forest views, tribal culture, Bhimbetka, Saru Maru, Ginnorgarh Fort, and nature moments in Ratapani.",

  keywords: [
    "madhuban eco retreat gallery",
    "ratapani nature gallery",
    "bhimbetka photos",
    "tribal culture madhya pradesh",
    "eco retreat images",
    "ratapani forest images",
  ],

  alternates: {
    canonical: "https://www.madhubanecoretreat.com/gallery",
  },

  robots: {
    index: true,
    follow: true,
  },
};
