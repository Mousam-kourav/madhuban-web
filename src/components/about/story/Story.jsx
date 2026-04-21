"use client";

import React from "react";
import { color, motion } from "framer-motion";
import { FaAnglesRight } from "react-icons/fa6";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import { getAltFromUrl } from "@/utills/helperFunctions";

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

const storyPoints = [
  "Nature-based, eco-friendly tourism",
  "Community empowerment",
  "Local livelihood generation",
  "Environmental responsibility",
];

const Story = () => {
  return (
    <motion.div
      className="text-center pb-16 pt-12 bg-[rgb(110,97,70)] overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className="max-w-7xl mx-auto">
        <DecorativeHeading text={"The Madhuban Story"} color={"#fff"} />

        <motion.div className="h-full" variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 justify-center items-center">
            <motion.div
              className="h-full"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="max-w-4xl mx-auto px-4 py-10 text-lg text-gray-800">
                <div className="text-white font-arial-narrow">
                  <p className="mb-6 p-text text-justify">
                    The story of Madhuban began not with ambition, but with
                    emotion — a heartfelt response to a modern world moving too
                    fast and drifting away from nature. Over the years, the land
                    was revived with care, supported by local communities, and
                    shaped by a vision of mindful, responsible travel.
                  </p>
                  <p className="mb-6 p-text text-justify">
                    The Somaiya Group, an 80-year-old corporate house with
                    expertise in education, healthcare, agriculture, social
                    development, and sustainability, brought this dream to life.
                  </p>
                  <p className="mb-6 p-text text-justify">
                    Madhuban Eco Retreat is their first venture into hospitality
                    — a project built on:
                  </p>
                  <div className="bg-[#d1c8c1] rounded-lg overflow-hidden shadow-lg">
                    {storyPoints.map((item, i) => {
                      return (
                        <motion.div
                          key={i}
                          className="relative rounded-lg overflow-hidden  group text-start text-primary-gray2 "
                          variants={itemVariants}
                          whileHover={{ scale: 1.03 }}
                        >
                          <div className="block rounded-xl p-text flex gap-2 items-center    p-2  font-medium  transition">
                            <FaAnglesRight /> {item}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="w-full  flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className=" rounded-xl">
                <img
                  src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/somaiya-group-logo.png"
                  alt={getAltFromUrl(
                    "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/somaiya-group-logo.png",
                  )}
                  className="w-64 h-auto object-contain"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="flex items-center justify-center mb-4">
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="p-text pt-12 text-white">
              Families, solo travelers, artists, researchers, nature lovers, and
              spiritual seekers come to Madhuban to rediscover what truly
              matters — simplicity, serenity, and balance. For many, it has
              become the best weekend getaway near Bhopal, not just for its
              setting, but for the way it makes you feel.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Story;
