import React from "react";
import Link from "next/link";
import { phone } from "@/utills/constants";

export const BookingBanner = () => {
  return (
    <div className="border-2 border-primary-gray2 rounded-2xl p-4 md:px-12 md:mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
      
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h2 className="text-primary-gray2 text-lg md:text-xl font-semibold mb-2 md:mb-4">
          Call for Instant Booking
        </h2>

        <div className="flex items-center gap-3 text-primary-gray2 text-md font-bold">
         
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>

          <span>+{phone}</span>
        </div>
      </div>

      {/* Make Link the button directly */}
      <Link
        href={`tel:+${phone}`}
        title="Call Now"
        className="w-full md:w-auto bg-primary-gray2 text-white px-5 py-3 md:py-5 rounded-xl font-black text-sm md:text-md hover:bg-[#12b87f] transition-transform active:scale-95 flex items-center justify-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>

        CALL NOW
      </Link>
    </div>
  );
};