"use client";

import Image from "next/image";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import { motion } from "framer-motion";
import { getAltFromUrl } from "@/utills/helperFunctions";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const celebrities = [
  {
    img: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/celebs/vidhya-balan-at-madhuban-eco-retreat-bhopal.webp",
    name: "Vidya Balan",
    details: " Indian Actress",
  },
  {
    img: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/celebs/vijay-raaz-indian-actor-at-madhuban-eco-retreat.webp",
    name: " Vijay Raaz",
    details: "Indian Actor",
  },
  {
    img: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/celebs/samir-somaiya-madhuban-eco-retreat-bhopal.webp",
    name: "Samir Somaiya",
    details: "President, Somaiya Group",
  },
];

const GuestsSection = () => {
  return (
    <section className="py-8 px-4 md:px-8 bg-[#D1C8C1]">
      <div className="container mx-auto">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <DecorativeHeading text={"Loved by Guests Across India"} />

          <div className="p-text-black p-text text-sm md:text-xl">
            Recognized as one of the best resorts near Ratapani...
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {celebrities.map((celeb, i) => (
            <motion.div
              key={i}
              // OPTIMIZATION: added 'will-change-transform' for smoother GPU scaling
              className="relative h-80 rounded-lg overflow-hidden shadow-lg group bg-gray-300 will-change-transform"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <Image
                src={celeb.img}
                alt={getAltFromUrl(celeb.img)}
                fill
                // OPTIMIZATION: Tell Next.js these are smaller thumbnails
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                // OPTIMIZATION: Lower quality for guest photos to prioritize speed
                quality={75}
                loading="lazy"
              />

              {/* Gradient Overlay - Fixed background for better performance */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 pointer-events-none">
                <div className="ml-5">
                  <h3 className="font-primary text-[rgb(190,175,145)] tracking-widest text-lg md:text-xl">
                    {celeb.name}
                  </h3>
                  <p className="text-[rgb(204,180,120)] text-sm tracking-wider font-arial-narrow">
                    {celeb.details}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GuestsSection;
