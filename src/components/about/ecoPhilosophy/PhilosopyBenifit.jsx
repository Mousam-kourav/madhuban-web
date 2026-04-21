// src/components/SustainabilityFeature.js
import React from "react";
import {
  Droplet,
  Sun,
  Leaf,
  RefreshCw,
  CirclePile,
  Recycle,
} from "lucide-react";
import { GiNuclearWaste } from "react-icons/gi";
import { RiTeamLine } from "react-icons/ri";

const PhilosophyBenifit = ({ feature }) => {
  const { icon, title, description } = feature;

  // Map icon names to Lucide React components
  const iconMap = {
    "water-drop": Droplet,
    sun: Sun,
    leaf: Leaf,
    recycle: RefreshCw,
    waste: GiNuclearWaste,
    material: CirclePile,
    staff: RiTeamLine,
    ecosystem: Recycle,
  };

  // Get the appropriate icon component
  const IconComponent = iconMap[icon] || Leaf;

  return (
    <div className="bg-primary-gray h-full flex flex-col justify-center bg-opacity-50 text-start item-center gap-2 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-center justify-center">
        <IconComponent className="w-10 h-10" />
      </div>
      <p className="p-text text-primary-gray2 text-center text-opacity-90">
        {title}
      </p>
    </div>
  );
};

export default PhilosophyBenifit;
