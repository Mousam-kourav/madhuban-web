import Slidingbanner from "@/common-components/banner/Slidingbanner";

const storyImages = [
  {
    id: 1,
    src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/about/outdoor-adventure-obstacles-madhuban-eco-retreat-bhopal.webp",
    alt: "Early construction phase",
  },
  {
    id: 2,
    src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/about/mud-house-madhuban-eco-retreat-bhopal.webp",
    alt: "Early construction phase",
  },
  {
    id: 3,
    src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/about/madhuban-eco-retreat-best-restaurant-near-bhopal.webp",
    alt: "First guests enjoying the eco-camp",
  },
  {
    id: 4,
    src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/about/Safari_Tent_-_Madhuban_Eco_Retreat_Bhopal_pbpcgr.avif",
    alt: "The retreat as it looks today",
  },
  {
    id: 5,
    src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/about/pool-side-madhuban-eco-retreat-best-pool-resort-near-bhopal.webp",
    alt: "Community involvement event",
  },
];

const AboutBanner = () => {
  return (
    <Slidingbanner
      images={storyImages}
      heading={"About Madhuban Eco Retreat"}
      subHeading={
        "A serene eco-retreat where nature, comfort, and conscious travel come together"
      }
    />
  );
};

export default AboutBanner;
