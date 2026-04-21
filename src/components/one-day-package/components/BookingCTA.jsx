"use client";
import React from "react";
import {
  Calendar,
  Phone,
  Sprout,
  UtensilsCrossed,
  TreePine,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { phone } from "@/utills/constants";
import Link from "next/link";

export const BookingCTA = () => {
  return (
    <section className="relative py-16 md:py-32 px-4 overflow-hidden min-h-[700px] flex items-center justify-center bg-primary-gray">
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl w-full">
        <div className="bg-primary-gray2  rounded-2xl md:rounded-[48px] p-10 md:p-20 text-center border-white/10 bg-white/[0.02] backdrop-blur-xl">
          <div className="space-y-4 mb-10">
            <h2 className=" font-extrabold leading-tight text-white heading1">
              Book Your Day Outing at{" "}
              <span className="text-white block md:inline">
                Madhuban Eco Retreat
              </span>
            </h2>
          </div>

          <p className="text-gray-200 p-text text-justify md:text-center  max-w-3xl mx-auto mb-12">
            If you're exploring resorts near Bhopal for a day outing that offers
            genuine nature, good food, open spaces, and meaningful activities —
            Madhuban Eco Retreat is the right choice. Spend a day surrounded by
            forests, enjoy mindful experiences, and return home relaxed and
            refreshed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <button
              onClick={() => {
                window.open(`https://wa.me/${phone}`, "_blank");
              }}
              className="cursor-pointer w-full sm:w-auto bg-[#22c55e] text-white px-10 py-5 rounded-2xl font-bold text-sm md:text-lg hover:bg-[#16a34a] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 "
            >
              <div>
                <FaWhatsapp size={22} aria-label="whatsapp" />
              </div>
              Contact us to book your Day Outing Package
            </button>
            <Link
              href={`tel:+${phone}`}
              className=" cursor-pointer w-full sm:w-auto bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <Phone size={22} aria-label="phone" />
              Call Now
            </Link>
          </div>

          {/* Footer Features */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            <div className="flex items-center gap-2 p-text   font-bold  text-white">
              <Sprout size={16} className="text-white" aria-label="sprout" />
              Mindful Nature
            </div>
            <div className="flex items-center gap-2 p-text   font-bold  text-white">
              <UtensilsCrossed size={16} className="text-white" aria-label="UtensilsCrossed"/>
              Organic Dining
            </div>
            <div className="flex items-center gap-2 p-text   font-bold  text-white">
              <TreePine size={16} className="text-white" aria-label="tree" />
              Eco-Friendly
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
