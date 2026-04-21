import React from "react";
import { MessageSquare, Leaf, Users } from "lucide-react";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

const reasons = [
  {
    icon: <MessageSquare className="w-6 h-6" aria-label="experience" />,
    title: "Nature-Centered Experience",
    description:
      "Immerse yourself in authentic wilderness where the rustling leaves are the only soundtrack to your day.",
  },
  {
    icon: <Leaf className="w-6 h-6" aria-label="eco-friendly" />,
    title: "Eco-Friendly & Peaceful",
    description:
      "Sustainable practices and minimal disruption to the local ecosystem ensure a guilt-free luxury experience.",
  },
  {
    icon: <Users className="w-6 h-6" aria-label="groups" />,
    title: "Ideal for All Groups",
    description:
      "Tailored experiences for kids, families, corporate teams looking for offsites, and friends seeking adventure.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section id="why-us" className="py-16 md:py-24 px-6 bg-primary-gray">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <DecorativeHeading text={"Why Choose Us"} as="h2" />
          <p className="text-primary-gray2  md:text-lg">
            What sets Madhuban apart from typical day-visit resorts is the
            experience itself.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className=" p-10 rounded-[32px]  transition-all group text-center flex flex-col items-center bg-primary-gray2"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                {reason.icon}
              </div>
              <h4 className="text-xl  mb-4 text-white primary-font-family ">
                {reason.title}
              </h4>
              <p className="text-white/90 text-justify md:text-center ">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
