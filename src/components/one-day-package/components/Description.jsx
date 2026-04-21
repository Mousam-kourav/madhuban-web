import React from "react";
import HeadingAndParagraph from "@/common-components/headingAndParagraph/HeadingAndParagraph";

const p1 =
  "At Madhuban Eco Retreat, every stay blends natural serenity with eco-friendly comfort. From safari tents and mud houses to glamping, camping, and poolside villas, each space invites you to slow down and reconnect with nature. Located near the lush Ratapani Wildlife Sanctuary, Madhuban is one of the best eco stays near Bhopal for families, couples, adventure seekers, and wellness travelers.";

const OneDayDescription = () => {
  return (
    <div
      className={`text-justify md:text-center  pb-16 px-6 pt-12 overflow-hidden bg-primary-gray2 text-white`}
    >
      <div className="max-w-7xl mx-auto ">
        <div className="grid  gap-6">
          <p className={`p-text`}>
            Looking for the best resorts near Bhopal for day outing that offer
            nature, comfort, great food, and peaceful surroundings — all without
            an overnight stay? Welcome to Madhuban Eco Retreat, a forest-side
            eco-luxury destination near Ratapani Wildlife Sanctuary, designed
            for meaningful one-day experiences close to nature.
          </p>
          <p className={`p-text`}>
            Our thoughtfully curated Day Outing Package is perfect for families,
            corporate groups, friends, and travelers from Bhopal and Indore who
            want to escape the city, unwind in a natural setting, and return
            refreshed — all in a single day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OneDayDescription;
