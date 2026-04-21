"use client";

import React from "react";
import { motion } from "framer-motion";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CompostIcon from "@mui/icons-material/Compost";
import { CookingPot } from "lucide-react";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import GuestImportance from "./ImportanceOfGuest";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

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

const WhyChoosePoints = [
  {
    title: "Freshly sourced organic & seasonal ingredients",
    icon: CompostIcon,
  },
  {
    title: "Simple, earthy, clean, and nourishing menu",
    icon: RestaurantMenuIcon,
  },
  {
    title: "Recipes inspired by local & tribal culinary traditions",
    icon: MenuBookIcon,
  },
  {
    title: "Zero processed foods & mindful cooking techniques",
    icon: CookingPot,
  },
  {
    title: "A true farm-to-fork dining experience near Bhopal",
    icon: RamenDiningIcon,
  },
];

const DiningSpacial = () => {
  return (
    <>
      <section className="py-8 px-4 md:px-8 bg-primary-gray2 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-8 "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <DecorativeHeading
              text={"What Makes Dining at Madhuban Special?"}
              as="h2"
              color="#fff"
              textClasses={"w-[70%] md:w-fit"}
            />
          </motion.div>

          <motion.div className="grid grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-2 gap-6  ">
            <motion.div
              className="grid   gap-4 order-2 md:order-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              {WhyChoosePoints.map((item, i) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    key={i}
                  >
                    <div className="block flex items-center gap-4 rounded-xl border border-primary-gray bg-primary-gray  p-4 text-primary-gray2 transition">
                      <IconComponent /> {item.title}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
            <motion.div
              className="grid   gap-6 rounded-2xl order-1 md:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              style={{
                backgroundImage: `url(https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/dinning-area-image-5-madhuban-eco-retreat.avif)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></motion.div>
          </motion.div>
        </div>
      </section>
      <GuestImportance />
    </>
  );
};

export default DiningSpacial;
