export const dynamic = "force-static";
import ExperienceComponent from "@/components/experiences/ExperienceComponent";
import OurExperiences from "@/components/experiences/OurExperiences";
import WhyChooseUs from "@/components/experiences/WhyChooseUs";
import ExperiencesFAQs from "@/components/experiences/ExperiencesFAQs";
import ExperiencesBanner from "@/components/experiences/ExperiencesBanner";
import SEO from "@/components/seo/Seo";

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Experiences at Madhuban Eco Retreat",
  url: "https://www.madhubanecoretreat.com/experiences",
  description:
    "Explore nature experiences at Madhuban Eco Retreat including forest walks, bird watching, wilderness trails, and eco-friendly recreational activities near Bhopal.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Forest Walks & Nature Trails",
      url: "https://www.madhubanecoretreat.com/experiences/forest-walks-&-nature-trails",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Bird Watching & Wilderness",
      url: "https://www.madhubanecoretreat.com/experiences/bird-watching-&-wilderness",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Recreational Facilities",
      url: "https://www.madhubanecoretreat.com/experiences/recreational-facilities",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What experiences can I enjoy near Bhopal at Madhuban Eco Retreat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Guests can enjoy forest walks, nature trails, bird watching, wilderness experiences, and eco-friendly recreational activities inside the Ratapani region.",
      },
    },
    {
      "@type": "Question",
      name: "Are the forest walks safe for families and seniors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all trails are guided, well-marked, and suitable for kids, senior guests, and beginners.",
      },
    },
    {
      "@type": "Question",
      name: "What birds can I expect to see during bird watching?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can spot species such as paradise flycatcher, kingfisher, golden oriole, peacocks, and several migratory birds.",
      },
    },
    {
      "@type": "Question",
      name: "Is the experience part of eco-tourism in Ratapani?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all activities follow low-impact, eco-friendly practices aligned with responsible tourism in Ratapani Wildlife Sanctuary.",
      },
    },
    {
      "@type": "Question",
      name: "Is Madhuban close to Satpura and Ratapani forests?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Madhuban Eco Retreat lies in the Ratapani forest belt, part of Madhya Pradesh’s wilderness corridor connecting to Satpura.",
      },
    },
  ],
};

const ExperiencesPage = () => {
  return (
    <>
      <SEO schemas={[pageSchema, faqSchema]} />
      <ExperiencesBanner />
      <ExperienceComponent />
      <OurExperiences />
      <WhyChooseUs />
      <ExperiencesFAQs />
    </>
  );
};

export default ExperiencesPage;

export async function generateMetadata() {
  return {
    title:
      "Nature Experiences Ratapani | Forest Walks, Bird Watching & Activities",

    description:
      "Explore nature trails, bird watching, and recreational activities at Madhuban Eco Retreat near Bhopal. Eco-friendly experiences in Ratapani Wildlife Sanctuary.",

    keywords: [
      "experiences near bhopal",
      "forest walks ratapani",
      "nature trails bhopal",
      "bird watching ratapani",
      "wilderness bhopal",
      "recreational activities bhopal",
      "eco tourism ratapani",
      "satpura nature experiences",
    ],

    alternates: {
      canonical: "https://www.madhubanecoretreat.com/experiences",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}
