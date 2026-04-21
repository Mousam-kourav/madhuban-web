// src/components/ExperienceCard.js
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { getAltFromUrl } from "@/utills/helperFunctions";

const ExperienceCard = ({ experience }) => {
  const { title, image, description, learnMoreBtn, path, idealFor } =
    experience;

  return (
    <div className="group relative rounded-lg overflow-hidden shadow-lg h-96 hover:shadow-xl transition-all duration-300 w-full">
      {/* Background Image Container */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={image}
          alt={getAltFromUrl(image)}
          // OPTIMIZATION: Use fill instead of fixed width/height
          fill
          // OPTIMIZATION: Tell the browser exactly how much space this takes
          // Mobile: 100vw, Tablet: 50vw, Desktop: 33vw
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          // OPTIMIZATION: Since this is 4th/5th section, lazy load is best
          loading="lazy"
          quality={80}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white h-full transition-all duration-500 transform translate-y-0 group-hover:-translate-y-2">
        <h3 className="text-white font-primary text-xl mb-2 md:text-2xl">
          {title}
        </h3>
        <p className="text-base md:text-lg text-[#f1f8e9]">{description}</p>
        {idealFor && (
          <p className="flex text-base md:text-lg text-[#f1f8e9] lg:mb-5 mb-0.5 mt-2">
            Ideal For : {idealFor}
          </p>
        )}

        <Link
          href={`/experiences/${path}`}
          className="inline-flex items-center text-white font-arial-narrow font-semibold tracking-wider absolute bottom-6"
        >
          {learnMoreBtn}
          <ChevronRight
            className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-1"
            aria-label="arrow"
          />
        </Link>
      </div>
    </div>
  );
};

export default ExperienceCard;
