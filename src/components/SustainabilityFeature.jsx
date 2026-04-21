// src/components/SustainabilityFeature.js
import React from "react";
import {
  Droplet,
  Sun,
  Leaf,
  RefreshCw,
  Trees,
  Users,
  Sprout,
} from "lucide-react";

const SustainabilityFeature = ({ feature }) => {
  const { icon, title, description } = feature;

  // Map icon names to Lucide React components
  const iconMap = {
    "water-drop": Droplet,
    sun: Sun,
    leaf: Leaf,
    recycle: RefreshCw,
    trees: Trees,
    community: Users,
    nature: Sprout,
  };

  // Get the appropriate icon component
  const IconComponent = iconMap[icon] || Leaf;

  return (
    <div className="bg-primary-gray bg-opacity-50 rounded-lg p-6 backdrop-blur-sm">
      <div className="mb-4">
        <IconComponent className="w-10 h-10 text-primary-gray2" />
      </div>
      <h3 className="font-primary card-herading text-primary-gray2  mb-2">
        {title}
      </h3>
      <p className=" text-primary-gray2 text-opacity-90">{description}</p>
    </div>
  );
};

export default SustainabilityFeature;
