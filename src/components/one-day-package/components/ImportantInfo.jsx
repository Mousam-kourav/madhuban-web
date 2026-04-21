import React from "react";
import { Briefcase, CircleDollarSign, Leaf, Ban, Calendar } from "lucide-react";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

export const ImportantInfo = () => {
  return (
    <section className=" py-16 md:py-24 px-6 bg-primary-gray">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <DecorativeHeading text={"Important Information"} as="h2" aria-label="important" />
        </div>

        {/* Info Card */}
        <div className="bg-primary-gray2 rounded-xl shadow-xl  overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3  py-2">
            {/* Column 1 */}
            <div className="px-10 py-4  space-y-8 md:space-y-12">
              <div className="flex items-center md:items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                  <Briefcase size={24} aria-label="briefcase"/>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase  text-gray-200 mb-1">
                    Package Type
                  </p>
                  <p className="text-sm md:text-xl font-bold text-white">
                    Day Outing (No Stay)
                  </p>
                </div>
              </div>

              <div className="flex items-center md:items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                  <Ban size={24} aria-label="ban"/>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase  text-gray-200 mb-1">
                    Alcohol
                  </p>
                  <p className="text-sm md:text-xl font-bold text-white">
                    Not served
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="px-10 py-4 space-y-8 md:space-y-12">
              <div className="flex items-center md:items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                  <span className="text-xl font-bold">₹</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase  text-gray-200 mb-1">
                    Price
                  </p>
                  <p className="text-sm md:text-xl font-bold text-white">
                    ₹1300 per person
                  </p>
                </div>
              </div>

              <div className="flex items-center md:items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                  <Calendar size={24} aria-label="calendar"/>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase  text-gray-200 mb-1">
                    Advance Booking
                  </p>
                  <p className="text-sm md:text-xl font-bold text-white">
                    Recommended for groups
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="px-10 py-4">
              <div className="flex items-center md:items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                  <Leaf size={24} aria-label="leaf" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase  text-gray-200 mb-1">
                    Food
                  </p>
                  <p className="text-sm md:text-xl font-bold text-white">
                    Pure Vegetarian
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
