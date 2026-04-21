"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading.jsx";
import Image from "next/image";
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

const accommodations = [
  {
    title: "Safari Tent",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/Safari_Tent_-_Madhuban_Eco_Retreat_Bhopal_pbpcgr.webp",
    alt: "Nature Tent",
    description:
      "Experience one of the most unique jungle stays near Bhopal with our eco-luxury safari tents featuring open-to-sky showers, forest views, and crafted cane interiors.",
  },
  {
    title: "Mud Houses",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/Mud_House_Image_2_-_Madhuban_Eco_Retreat_Bhopal_lbzlrg.webp",
    alt: "Mud Houses",
    description:
      "Inspired by the Gond tribes, these mud cottages offer rustic charm and sustainable comfort — making them one of the most loved eco stays in Madhya Pradesh.",
  },
  {
    title: "Pool Side Villa",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/Pool_Image_2_-_Madhuban_Eco_Retreat_Bhopal_yl1tbg.webp",
    alt: "Pool Side Room",
    description:
      "For travelers seeking leisure and calm, our poolside villas combine scenic views, wellness-friendly spaces, and forest-side luxury.",
  },
  {
    title: "Glamping Tents",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/madhuban-eco-retreat-glamping-tent-gallery-image-1.webp",
    alt: "Glamping Tent",
    description:
      "Enjoy boutique-style glamping with chic décor, ensuite bathrooms, and private sit-outs — perfect for a stylish forest experience.",
  },
  {
    title: "Camping Tents",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/accommodations/camping-tent-image-1-madhuban-eco-retreat-bhopal.webp",
    alt: "Camping Tent",
    description:
      "Ideal for adventure seekers looking for a pure nature experience, our camping tents offer a peaceful, off-grid stay under starry skies.",
  },
];

const Accommodations = () => {
  return (
    <section className="py-8 px-4 bg-cover bg-center bg-no-repeat bg-[rgb(110,97,70)]">
      <div className="container mx-auto">
        {/* --- Header Section --- */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <DecorativeHeading
            as="h2"
            text={"Our Accommodations"}
            color={"#fff"}
          />
          <h3 className="text-lg md:text-2xl font-primary text-white tracking-wider">
            Eco-Luxury Stays in the Heart of Ratapani
          </h3>
          <p className="mt-1 max-w-2xl text-justify md:text-center mx-auto text-sm md:text-lg text-white px-4 tracking-wide font-arial-narrow">
            Every stay at Madhuban Eco Retreat is designed...
          </p>
        </motion.div>

        {/* --- Cards Section --- */}
        <motion.div
          className="flex flex-wrap xl:flex-nowrap xl:gap-8 justify-center xl:justify-start gap-y-8 pb-4 -mt-10 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {accommodations.map((item, index) => (
            <motion.div
              key={index}
              className="w-full lg:w-[46%] xl:w-[calc(20%-12.8px)] 2xl:w-[calc(20%-12.8px)]
                bg-[#D1C8C1] rounded-lg overflow-hidden shadow-lg hover:shadow-xl h-[450px]
                flex flex-col will-change-transform" // OPTIMIZATION: Hardware acceleration
              variants={itemVariants}
              whileHover={{ scale: 1.03 }} // Reduced slightly for better performance
            >
              <div className="h-64 xl:h-[200px] overflow-hidden relative">
                <Image
                  src={item.image}
                  alt={getAltFromUrl(item.image)}
                  fill // Use fill for better aspect ratio management in cards
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  // OPTIMIZATION: Tell the browser exactly how small these images are
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 20vw"
                  // OPTIMIZATION: Lazy load by default, but prioritize the first card if it's high on the page
                  loading="lazy"
                  quality={75} // Lower quality for small thumbnails saves a lot of KB
                />
              </div>

              <div className="p-6 flex-grow">
                <h3 className="font-primary text-primary-gray2 mb-2 text-xl md:text-2xl">
                  {item.title}
                </h3>
                <p className="p-text p-text-black mb-4 text-justify">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* --- Explore Button --- */}
        <motion.div
          className="text-center mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Link
            href="/stay"
            className="font-arial-narrow text-primary-gray2 px-8 py-3 bg-[#D1C8C1] hover:font-bold rounded-md font-medium p-text inline-block transition-all"
          >
            Explore All Accommodations
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Accommodations;
