import React from "react";

import { Hero } from "./components/Hero";
import { Experience } from "./components/Experience";
import { Packages } from "./components/Packages";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { Location } from "./components/Location";
import CommonFaqs from "@/common-components/faqs/CommonFaqs";
import OneDayDescription from "./components/Description";
import { TargetAudience } from "./components/TargetAudience";
import { ImportantInfo } from "./components/ImportantInfo";
import { BookingCTA } from "./components/BookingCTA";
import SlideIndecator from "@/common-components/slideIndicator/SlideIndicator";
const faqs = [
  {
    question: "Is Madhuban suitable for a one-day picnic near Bhopal?",
    answer:
      "Yes, Madhuban Eco Retreat is ideal for one-day outings with food, pool access, and nature activities included.",
  },
  {
    question: "Does the day outing package include pool access?",
    answer:
      "Yes, the package includes access to our eco-friendly swimming pool.",
  },
  {
    question: "Is this a family-friendly day outing resort?",
    answer:
      "Absolutely. The environment is safe, peaceful, and suitable for families and children.",
  },
  {
    question: "Do you serve non-vegetarian food or alcohol?",
    answer:
      "No. We serve only pure vegetarian food and maintain an alcohol-free environment.",
  },
  {
    question: "Is advance booking required?",
    answer:
      "Advance booking is recommended, especially for weekends and group visits.",
  },
];

export default function OneDayPackage() {
  return (
    <>
      <Hero />
      <OneDayDescription />
      <Experience />
      <Packages />
      <WhyChooseUs />
      <TargetAudience />
      <ImportantInfo />
      <Location />
      <BookingCTA />
      <CommonFaqs faqs={faqs} />
    </>
  );
}
