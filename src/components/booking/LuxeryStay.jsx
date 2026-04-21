import React, { useMemo } from "react";
import Image from "next/image";
import { BookingBanner } from "./BookingBanner";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

// 1. Extracted Data to a constant to prevent re-creation on every render
const STAYS_DATA = [
  {
    title: "Mud House",
    subtitle: "Traditional Jungle Resort Mud House",
    imageUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/booking/luxery-stay/Mud_House_Image_2_-_Madhuban_Eco_Retreat_Bhopal_lbzlrg.webp",
  },
  {
    title: "Glamping Tent",
    subtitle: "Luxury Jungle Camp Glamping",
    imageUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/booking/luxery-stay/madhuban-eco-retreat-glamping-tent-gallery-image-1.webp",
  },
  {
    title: "Pool Side Villa",
    subtitle: " Resort with Swimming Pool Villa",
    imageUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/booking/luxery-stay/Pool_Image_2_-_Madhuban_Eco_Retreat_Bhopal_yl1tbg.webp",
  },
  {
    title: "Safari Tent",
    subtitle: "Ratapani Resort Safari Stay",
    imageUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/booking/luxery-stay/Safari Tent Customer Stay Madhuban Eco Retreat.avif",
  },
  {
    title: "Camping Tent",
    subtitle: "Nature Forest Resort Camping",
    imageUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/booking/luxery-stay/camping-tent-image-1-madhuban-eco-retreat-bhopal.webp",
  },
  {
    title: "Jungle Lodge",
    subtitle: "Jungle Lodge near Ratapani Sanctuary",
    imageUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/booking/luxery-stay/Safari_Tent_-_Madhuban_Eco_Retreat_Bhopal_pbpcgr.webp",
  },
  {
    title: "Eco Luxury Room",
    subtitle: "Eco Luxury Resort Stay Bhopal",
    imageUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/booking/luxery-stay/Rooms Interior Image Madhubuan Eco Retreat Bhopal.avif",
  },
  {
    title: "Group Stays",
    subtitle: "Best Resort Near Bhopal for family Getaways",
    imageUrl:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/booking/luxery-stay/group-stay-at-madhuban.jpg",
  },
];

// 2. Memoized Sub-component to prevent unnecessary re-renders
const StayCard = React.memo(({ title, subtitle, imageUrl, className = "" }) => (
  <div
    className={`group relative overflow-hidden rounded-3xl aspect-[3/4] md:aspect-auto md:h-[400px] ${className}`}
  >
    <Image
      fill // Use fill for absolute positioning inside a relative parent
      src={imageUrl}
      alt={title}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      className="object-cover transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <div className="absolute bottom-0 left-0 p-6 w-full">
      <h3 className="text-xl text-white primary-font-family mb-1">{title}</h3>
      <p className="text-gray-300 text-sm font-medium">{subtitle}</p>
    </div>
  </div>
));

StayCard.displayName = "StayCard";

const LuxeryStay = () => {
  // 3. Render list using map for cleaner JSX
  return (
    <main className="max-w-7xl mx-auto px-6 pb-12">
      <section className="mt-12 mb-12">
        <DecorativeHeading
          as="p"
          text="Luxury Stays"
          subheading="Experience the Eco-friendly Accommodations at Madhuban Eco Retreat"
          subheadingAs="h2"
        />
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
        {STAYS_DATA.map((stay) => (
          <StayCard
            key={stay.title} // Unique key for React reconciliation
            {...stay}
          />
        ))}
      </div>

      <BookingBanner />
    </main>
  );
};

export default LuxeryStay;
