"use client";
import CommonFaqs from "@/common-components/faqs/CommonFaqs";

const faqs = [
  {
    question:
      "What experiences can I enjoy near Bhopal at Madhuban Eco Retreat?",
    answer:
      "You can enjoy forest walks, nature trails, bird watching, wilderness sessions, and eco-friendly recreational activities.",
  },
  {
    question: "Are the forest walks safe for families and seniors?",
    answer:
      "Yes, all trails are guided, well-marked, and suitable for children, seniors, and beginners.",
  },
  {
    question: "What birds can I expect to see during bird watching?",
    answer:
      "You may spot species like the Indian paradise flycatcher, golden oriole, kingfisher, peacocks, and several migratory birds.",
  },
  {
    question: "Are the experiences part of eco-tourism in Ratapani?",
    answer:
      "Yes, every activity follows eco-friendly, low-impact practices aligned with responsible tourism.",
  },
  {
    question: "Do I need to pre-book the experiences?",
    answer:
      "Pre-booking is recommended for forest walks and bird watching to ensure guide availability.",
  },
  {
    question: "Is Madhuban close to Satpura & Ratapani forest regions?",
    answer:
      "Yes, Madhuban is located in the Ratapani belt and is part of MP’s rich central Indian wilderness corridor.",
  },
];

export default function ExperiencesFAQs() {
  return (
   <CommonFaqs faqs={faqs} />
  );
}
