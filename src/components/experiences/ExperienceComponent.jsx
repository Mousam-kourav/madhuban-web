import HeadingAndParagraph from "@/common-components/headingAndParagraph/HeadingAndParagraph";

const p1 =
  " Madhuban Eco Retreat offers experiences that bring you closer to nature, silence, and the wild spirit of Ratapani. Whether you love slow forest walks, early-morning bird watching, or peaceful recreational activities, each moment here is designed to help you pause, breathe, and reconnect with the natural world.";

const p2 =
  "Set near Ratapani Wildlife Sanctuary, close to Bhopal, our experiences celebrate eco-tourism, mindful travel, and the untouched beauty of Madhya Pradesh. Explore the forest, listen to birdsong, cycle through green trails, or simply enjoy nature-inspired relaxation — each experience is crafted for families, nature enthusiasts, wildlife lovers, and slow-travel seekers.";

const ExperienceComponent = () => {
  return (
    <div className="px-2 bg-primary-gray2">
      <HeadingAndParagraph
        headingText={" Nature Moments at Madhuban"}
        headingType="h1"
        subHeadingText={"A journey into forests, wildlife, and mindful living"}
        paragraphs={[p1, p2]}
        textColor={"#fff"}
        paraClasses="text-justify"
      />
    </div>
  );
};

export default ExperienceComponent;
