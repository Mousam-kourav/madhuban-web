"use client";

import React from "react";
import { phone } from "@/utills/constants";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with forest pattern overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110"
        style={{
          backgroundImage:
            "url(https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/day-outing/madhuban-eco-retreat-forest-view-hero-section-1.avif)",
        }}
      />
      <div className="absolute inset-0 forest-gradient" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="bannerHeading   mb-8 leading-[1.1] text-white  primary-font-family ">
          Experience a Nature-Filled Day at Madhuban Eco Retreat
        </h1>

        <p className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-10 leading-relaxed ">
          Escape the city and immerse yourself in forest-side luxury. A day of
          rejuvenation awaits just outside Bhopal.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            title=" Book Your Day Outing"
            onClick={() => {
              window.open(`https://wa.me/${phone}`, "_blank");
            }}
            className=" sm:w-auto bg-primary-gray2 text-white px-8 py-4 rounded-full font-bold text-sm md:text-lg hover:bg-(--primary-gray2) cursor-pointer transition-all transform hover:scale-105 active:scale-95 "
          >
            Book Your Day Outing
          </button>
        </div>
      </div>
    </section>
  );
};
