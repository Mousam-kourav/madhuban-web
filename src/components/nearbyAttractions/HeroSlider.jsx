"use client";

import { getAltFromUrl } from "@/utills/helperFunctions";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroSlider({ heroSlides }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <section className="relative h-[85vh] md:h-[85vh] min-h-[60vh] overflow-hidden">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-0" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={getAltFromUrl(slide.image)}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center text-white text-center px-4">
        <div className="max-w-7xl animate-fadeInUp">
          <h1 className="bannerHeading font-primary">Nearby Attractions</h1>

          <h2 className="bannerSubHeading">
            Experience the Soul of Madhya Pradesh!!
          </h2>
        </div>
      </div>
    </section>
  );
}
