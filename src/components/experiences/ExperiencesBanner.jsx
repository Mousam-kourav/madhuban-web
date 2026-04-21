import { getAltFromUrl } from "@/utills/helperFunctions";
import Image from "next/image";

const ExperiencesBanner = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/banner/cultural-tribal-dance-madhuban-eco-retreat.avif"
          alt={getAltFromUrl(
            "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/banner/cultural-tribal-dance-madhuban-eco-retreat.avif",
          )}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-primary mb-4">
          Experience Life at Nature’s Rhythm
        </h1>

        <p className="max-w-2xl text-base sm:text-lg md:text-xl">
          Explore mindful, eco-friendly experiences designed around forests,
          wildlife, and peaceful living near Bhopal
        </p>
      </div>
    </section>
  );
};

export default ExperiencesBanner;
