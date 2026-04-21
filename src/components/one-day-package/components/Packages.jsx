"use client";

import React, { useEffect, useState } from "react";
import {
  Coffee,
  Utensils,
  Waves,
  Footprints,
  ShieldCheck,
  Gamepad2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import { phone } from "@/utills/constants";
import { motion } from "framer-motion";
import SlideIndecator from "@/common-components/slideIndicator/SlideIndicator";

const inclusions = [
  { icon: <Utensils size={20} />, label: "Breakfast & Lunch" },
  { icon: <Coffee size={20} />, label: "High Tea & Snacks" },
  { icon: <Waves size={20} />, label: "Swimming Pool Access" },
  { icon: <Footprints size={20} />, label: "Nature Walk & Trails" },
  { icon: <ShieldCheck size={20} />, label: "Obstacle Course" },
  { icon: <Gamepad2 size={20} />, label: "Outdoor Games" },
];

const heroSlides = [
  {
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/day-outing/package/adventure-activities-in-madhuban-eco-retreat-bhopal.avif",
  },
  {
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/day-outing/package/birds-in-madhuban-retreat.jpg",
  },
  {
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/day-outing/package/explore-caves.JPG",
  },
  {
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/day-outing/package/pool-side-image-madhuban-eco-retreat-bhopal.avif",
  },
];

export const Packages = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <section id="packages" className=" py-16 md:py-24 px-6 bg-primary-gray2">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <DecorativeHeading text={"Day Outing Package"} color="#fff" as="h2" />

          <p className="text-white font-light md:text-lg">
            One price. All-inclusive luxury. Memories for a lifetime.
          </p>
        </div>

        <div className=" rounded md:rounded-[40px] overflow-hidden grid lg:grid-cols-2 bg-primary-gray  shadow-2xl">
          <div className=" relative aspect-square lg:aspect-auto h-full w-full">
            {heroSlides.map((slide, index) => (
              <motion.div
                key={index}
                className={` absolute aspect-square lg:aspect-auto h-full w-full inset-0 transition-opacity duration-3000 ease-in-out ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentSlide ? 1 : 0 }}
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></motion.div>
            ))}
            <div className="absolute z-2 left-4 top-4 md:top-8 md:left-8 bg-(--primary-gray2) text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-xl">
              <span className="text-sm md:text-xl">₹1300</span>
              <span className="text-xs uppercase opacity-80">/ PERSON</span>
            </div>
            <div className="absolute z-2 bottom-0 w-full  ">
              <SlideIndecator
                SLIDE_DURATION={6000}
                slidesCount={heroSlides.length}
              />
            </div>
          </div>

          <div className="px-10 py-6 md:pt-0 lg:p-12 flex flex-col justify-center  ">
            <h3 className="heading1 font-bold mb-10 text-primary-gray2">
              Complete Day Outing Inclusions
            </h3>

            <div className="grid sm:grid-cols-2 gap-y-4 md:gap-y-8 gap-x-12 mb-6 md:mb-16">
              {inclusions.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-(--primary-gray2)/10 flex items-center justify-center text-(--primary-gray2) transition-colors group-hover:bg-(--primary-gray2) group-hover:text-white">
                    {item.icon}
                  </div>
                  <span className="font-medium text-primary-gray2">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6  pt-4 md:pt-10 border-t border-primary-gray2">
              <div></div>
              <button
                title="Contact Us"
                className="w-full sm:w-auto cursor-pointer bg-primary-gray2 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-[#16a34a] transition-all transform hover:translate-x-1"
                onClick={() => {
                  window.open(`https://wa.me/${phone}`, "_blank");
                }}
              >
                Contact Us
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto text-center">
        <p className="mt-10 text-white font-light md:text-lg">
          This makes Madhuban one of the most complete resorts near Bhopal for
          day outing with lunch and pool access.
        </p>
      </div>
    </section>
  );
};
