import React from "react";
import { Sun, Users, UserRound, Trees, Waves, Calendar } from "lucide-react";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

const segments = [
  {
    icon: <Sun size={24} aria-label="day" />,
    title: "One Day Picnickers",
    description:
      "Perfect for those seeking a quick escape near Bhopal without the commitment of an overnight stay. Rejuvenate your spirit in a single day.",
  },
  {
    icon: <Users size={24}  aria-label="teams"/>,
    title: "Corporate Teams",
    description:
      "Boost morale with tailored corporate day outings designed for team bonding in the lap of nature. Professional yet profoundly refreshing.",
  },
  {
    icon: <UserRound size={24} aria-label="families"/>,
    title: "Families",
    description:
      "A safe, hygienic, and serene environment where children and elders alike can relax. Create memories that bridge generations.",
  },
  {
    icon: <Trees size={24} aria-label="lovers"/>,
    title: "Nature Lovers",
    description:
      "Immerse yourself in a short forest escape with lush greenery and tranquil vibes. Discover rare flora and fauna just outside the city.",
  },
];

export const TargetAudience = () => {
  return (
    <section className=" py-16 md:py-24 px-6 bg-primary-gray2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <DecorativeHeading
            text={"Who Should Choose This Day Outing Package"}
            as="h2"
            color="#fff"
          />
          <p className="text-gray-200 max-w-2xl mx-auto font-light p-text">
            Escape the bustle of Bhopal and reconnect with nature in a sanctuary
            designed for every kind of explorer.
          </p>
        </div>

        {/* Audience Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {segments.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-10 rounded-[32px] border-white/5 bg-white/[0.02] flex flex-col items-center md:items-start gap-6 hover:bg-white/[0.04] transition-all group"
            >
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:bg-(--primary-gray2) group-hover:text-white transition-all">
                {item.icon}
              </div>
              <div className="space-y-4 text-center md:text-left ">
                <h4 className=" text-white text-xl primary-font-family">
                  {item.title}
                </h4>
                <p className="text-gray-200 leading-relaxed font-light text-justify md:text-left">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-6 ">
          <div className="md:col-span-2 glass-card p-10 rounded-[32px] border-white/5 bg-white/[0.02] flex flex-col items-center md:items-start gap-6 hover:bg-white/[0.04] transition-all group">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:bg-(--primary-gray2) group-hover:text-white transition-all">
              {segments[3].icon}
            </div>
            <div className="space-y-4">
              <h4 className="text-xl primary-font-family   text-white text-center md:text-left">
                {segments[3].title}
              </h4>
              <p className="text-gray-200 leading-relaxed font-light text-justify md:text-left">
                {segments[3].description}
              </p>
            </div>
          </div>

          <div className="md:col-span-3 glass-card p-10 rounded-[32px] border-white/5 bg-white/[0.02] flex flex-col md:flex-row items-center md:items-center gap-8 hover:bg-white/[0.04] transition-all group">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-white shrink-0 group-hover:bg-(--primary-gray2) group-hover:text-white transition-all">
              <Waves size={32} aria-label="waves" />
            </div>
            <div className="space-y-4">
              <h4 className="text-xl primary-font-family   text-white text-center md:text-left">
                Pool & Lunch Seekers
              </h4>
              <p className="text-gray-200 leading-relaxed font-light text-justify md:text-left">
                Enjoy full access to our crystal-clear pool followed by a
                gourmet buffet lunch. The ultimate combination for a relaxing
                weekend or weekday break.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
      </div>
    </section>
  );
};
