"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { BedDouble, Users, Leaf, Wifi, Sun, MountainSnow } from "lucide-react";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import { getAltFromUrl } from "@/utills/helperFunctions";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const imageHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
};

const buttonHoverVariants = {
  rest: { width: 0 },
  hover: { width: "100%" },
};

const accommodationsData = [
  {
    id: 1,
    name: "Safari Tent",
    slug: "safari-tent",
    image:
      "/images/stay/accommodations/safari-tent-madhuban-eco-retreat-bhopal.avif",
    altText: "Exterior view of a charming safari tent nestled in greenery",
    shortDescription:
      "Perched on raised platforms beside a gentle stream and facing forested mountains, our classic safari tent in Ratapani offers a true wilderness experience. Each tent is tastefully furnished with elegant cane furniture and features a vanity and dressing area, separate toilet and shower, and even an open-to-sky shower with a private relaxation space.",
    keyFeatures: [
      {
        icon: <Leaf size={18} className="text-white" aria-label="leaf" />,
        text: "Eco-Friendly Design",
      },
      {
        icon: <BedDouble size={18} className="text-white" />,
        text: "Queen Bed",
      },
      {
        icon: <Sun size={18} className="text-white" aria-label="sun" />,
        text: "Solar Powered",
      },
      {
        icon: <Wifi size={18} className="text-white" aria-label="wifi" />,
        text: "Wi-Fi Access",
      },
    ],
    capacity: "Sleeps 2",
  },
  {
    id: 2,
    name: "Mud Houses",
    slug: "mud-villa",
    image:
      "/images/stay/accommodations/mud-house-madhuban-eco-retreat-bhopal.avif",
    altText: "Exterior view of a charming mud villa nestled in greenery",
    shortDescription:
      "Our mud villa in Ratapani, inspired by the vernacular architecture of the Gond tribes, is nestled in a 5-acre organic orchard. Each Mud House features a spacious air-conditioned room, an annexed lobby, verandas, and a traditionally styled luxury bathroom. The rooftop offers breathtaking 360° views — perfect for stargazing or peaceful evenings.",
    keyFeatures: [
      {
        icon: <Leaf size={18} className="text-white" aria-label="leaf" />,
        text: "Eco-Friendly Design",
      },
      {
        icon: <BedDouble size={18} className="text-white" />,
        text: "Queen Bed",
      },
      {
        icon: <Sun size={18} className="text-white" aria-label="sun" />,
        text: "Solar Powered",
      },
      {
        icon: <Wifi size={18} className="text-white" aria-label="wifi" />,
        text: "Wi-Fi Access",
      },
    ],
    capacity: "Sleeps 2",
  },
  {
    id: 3,
    name: "Pool Side Villa",
    slug: "pool-side-room",
    image:
      "/images/stay/accommodations/madhuban-eco-retreat-pool-side-view.webp",
    altText: "Poolside room with beautiful garden views",
    shortDescription:
      "Wake up to sunlight dancing on the eco-pool and unwind to the soothing rhythm of nature. Our elegant poolside villa in Ratapani offers the perfect balance of sophistication and serenity. Ideal for couples, families, or anyone looking for a private villa near Bhopal with forest-side calm.",
    keyFeatures: [
      {
        icon: (
          <MountainSnow
            size={18}
            className="text-white"
            aria-label="mountain"
          />
        ),
        text: "Panoramic Forest Views",
      },
      {
        icon: <BedDouble size={18} className="text-white" aria-label="bed" />,
        text: "Comfortable Double Bed",
      },
      {
        icon: <Leaf size={18} className="text-white" aria-label="leaf" />,
        text: "Sustainably Built",
      },
      {
        icon: <Users size={18} className="text-white" aria-label="user" />,
        text: "Cozy Reading Nook",
      },
    ],
    capacity: "Sleeps 4",
  },
  {
    // glamping tents
    id: 4,
    name: "Glamping Tents",
    slug: "glamping-tents",
    image:
      "/images/stay/accommodations/glamping-tent-madhuban-eco-retreat-bhopal.avif",
    altText: "Boutique glamping tent with deck and lush lawn",
    shortDescription:
      "Enjoy comfort in the wild with our rustic mini-safari glamping tents. Featuring chic interiors, a private lawn sit-out, and ensuite bathrooms, our glamping tent in Ratapani offers boutique-style luxury with the charm of camping — ideal for couples, families, or weekend travelers looking for a unique stay in the wilderness.",
    keyFeatures: [
      {
        icon: <BedDouble size={18} className="text-white" aria-label="bed" />,
        text: "King Size Bed",
      },
      {
        icon: <Users size={18} className="text-white" aria-label="user" />,
        text: "Double Occupancy",
      },
      {
        icon: <Leaf size={18} className="text-white" aria-label="leaf" />,
        text: "Private Lawn Area",
      },
      {
        icon: <Wifi size={18} className="text-white" aria-label="wifi" />,
        text: "Wi-Fi & Workspace",
      },
    ],
    capacity: "Sleeps 2",
  },
  {
    id: 5,
    name: "Camping Tent",
    slug: "camping-tent",
    image:
      "/images/stay/accommodations/camping-tent-new-madhuban-eco-retreat-bhopal.avif",
    altText: "Scenic camping tent surrounded by nature",
    shortDescription:
      "Our eco-friendly camping tents offer a simple yet comfortable outdoor stay in Ratapani's lush wilderness. Perfect for travelers seeking digital detox, jungle adventure, or peaceful night camping — a truly authentic experience at this Ratapani eco resort.",
    keyFeatures: [
      {
        icon: (
          <MountainSnow
            size={18}
            className="text-white"
            aria-label="mountain"
          />
        ),
        text: "Panoramic Forest Views",
      },
      {
        icon: <BedDouble size={18} className="text-white" aria-label="bed" />,
        text: "Comfortable Double Bed",
      },
      {
        icon: <Leaf size={18} className="text-white" aria-label="leaf" />,
        text: "Sustainably Built",
      },
      {
        icon: <Users size={18} className="text-white" aria-label="user" />,
        text: "Cozy Reading Nook",
      },
    ],
    capacity: "Sleeps 2",
  },
];

const Accommodations = () => {
  return (
    <section className="accommodations-section  flex flex-col justify-center items-center">
      <div className="flex justify-center mt-8">
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <DecorativeHeading text="Our Accommodations" aria />
        </motion.div>
      </div>
      <motion.p
        className="max-w-5xl text-justify md:text-center p-text p-text-black mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        Experience soulful, sustainable living through our thoughtfully crafted
        eco-stay options — from rustic villas to stylish tents. Each retreat is
        built with love, earth-friendly materials, and a deep respect for the
        environment.
      </motion.p>

      {accommodationsData.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
        >
          {accommodationsData.map((accommodation) => (
            <motion.div
              key={accommodation.id}
              className="accommodation-card w-full md:w-[350px]  flex flex-col"
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
            >
              <motion.div
                className="image-wrapper"
                variants={imageHoverVariants}
              >
                <motion.img
                  src={accommodation.image}
                  alt={getAltFromUrl(accommodation.image)}
                  className="w-full h-full object-cover"
                  transition={{ duration: 0.5 }}
                />
              </motion.div>

              <div className="p-6 flex flex-col flex-grow bg-[#D1C8C1]">
                <h3 className=" heading1  font-primary text-primary-gray2  mb-2">
                  {accommodation.name}
                </h3>
                <p className="font-arial-narrow text-primary-gray2  p-text mb-4 flex-grow text-justify">
                  {accommodation.shortDescription}
                </p>

                <div className="mb-4">
                  <h4 className="text-base  text-primary-gray2 mb-3">
                    <strong> Key Features:</strong>
                  </h4>
                  <ul className="font-openSans grid grid-cols-4 max-[496px]:grid-cols-2 gap-6 justify-between">
                    {accommodation.keyFeatures.map((feature, index) => (
                      <motion.li
                        key={index}
                        className="flex flex-col items-center text-primary-gray2 text-xs"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[rgb(110,97,70)] group/icon mb-2">
                          {feature.icon}
                          <motion.span
                            className="absolute inset-0 rounded-full bg-[rgb(110,97,70)] opacity-0 group-hover/icon:opacity-30"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0, 0.3, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatDelay: 0.5,
                            }}
                          />
                        </span>
                        <span className="text-center font-medium ">
                          {feature.text}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <p className="text-base text-primary-gray2 mb-4">
                  <strong>Capacity:</strong> {accommodation.capacity}
                </p>

                <Link
                  href={`/stay/${accommodation.slug}`}
                  className="mt-auto relative inline-block w-full text-center bg-[rgb(110,97,70)] text-white font-medium py-3 px-6 rounded-md overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 bg-[rgb(117,105,83)] h-full"
                    variants={buttonHoverVariants}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10 tracking-widest font-medium p-text">
                    View Details & Book
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.p
          className="text-center text-gray-700 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          More details about our accommodations are coming soon. Please check
          back later!
        </motion.p>
      )}
    </section>
  );
};

export default Accommodations;
