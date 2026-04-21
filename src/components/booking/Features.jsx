import React from "react";
import { Trees, Binoculars, Utensils } from "lucide-react";
import FeatureCard from "./FeatureCard";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

const Features = () => {
  return (
    <section className="py-16 bg-[#f7f5f0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="space-y-4 mb-8">
          <DecorativeHeading text={"Reconnect with Wilderness"} as="h2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Trees}
            title="Teak Forest Views"
            description="Wake up to the sounds of the jungle in our premium cottages nestled within ancient teak trees."
          />
          <FeatureCard
            icon={Binoculars}
            title="Wildlife Safaris"
            description="Guided excursions into the Ratapani Tiger Reserve led by expert naturalists and forest guards."
          />
          <FeatureCard
            icon={Utensils}
            title="Farm-to-Table"
            description="Authentic local flavors prepared with organic ingredients sourced from nearby tribal villages."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
