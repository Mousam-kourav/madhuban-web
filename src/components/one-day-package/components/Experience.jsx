import React from "react";
import { ShieldCheck, Leaf } from "lucide-react";

export const Experience = () => {
  return (
    <section id="experience" className="py-10 md:py-24 px-6 bg-primary-gray">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 md:gap-16 items-center">
        <div className="space-y-10 order-2 md:order-1">
          <div className="space-y-6">
            <h2 className=" text-center md:text-left font-bold text-primary-gray2  heading1 ">
              A Perfect One-Day Escape into Nature Near Bhopal
            </h2>
            <p className=" text-justify md:text-left p-text  ">
              Madhuban Eco Retreat is among the few nature resorts near Bhopal
              for day outing that combine eco-conscious hospitality with
              immersive forest experiences. Set amidst lush greenery and calm
              forest landscapes, the retreat offers a rare opportunity to enjoy
              a complete day of relaxation, recreation, and mindful activities.
            </p>
            <p className=" p-text text-justify md:text-left  ">
              Whether you are planning a one-day picnic near Bhopal, a corporate
              outing, or a family get-together, Madhuban provides a peaceful
              alternative to crowded picnic spots and commercial resorts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="flex gap-4 items-center  glass-card rounded-xl border-white/30! p-4">
              <div className="shrink-0 w-12 h-12 bg-(--primary-gray2)/10 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-(--primary-gray2) w-6 h-6" />
              </div>
              <div className="">
                <h4 className="text-lg font-bold mb-2 text-primary-gray2">
                  Forest-Side Luxury
                </h4>
                <p className="text-sm text-gray-500">
                  Elegant spaces nestled right at the edge of the wilderness.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center  glass-card rounded-xl border-white/30! p-4">
              <div className="shrink-0 w-12 h-12 bg-(--primary-gray2)/10 rounded-xl flex items-center justify-center">
                <Leaf className="text-(--primary-gray2) w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-2 text-primary-gray2">
                  Tranquil Environment
                </h4>
                <p className="text-sm text-gray-500">
                  A peaceful escape from the noise and hustle of city life.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative order-1 md:order-2 rounded-md overflow-hidden aspect-[9/16] max-w-[420px] mx-auto lg:ml-auto group border border-white/5 shadow-2xl">
          <video
            id="about-video"
            src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/day-outing/day-outing-madhuban.mp4"
            className="rounded-lg shadow-xl w-full md:h-[70vh] object-cover aspect-[9/16]"
            loop
            muted
            playsInline
            controls
            autoPlay
          />
        </div>
      </div>
    </section>
  );
};
