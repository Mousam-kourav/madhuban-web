"use client";

import React from "react";
import { motion } from "framer-motion";
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

const coreValues = [
  {
    title: "Sustainability",
    description:
      "Every decision we make, from construction to cuisine, puts the planet first.",
  },
  {
    title: "Community",
    description:
      "We work hand-in-hand with local artisans, farmers, and tribal communities to ensure everyone grows together.",
  },
  {
    title: "Simplicity",
    description:
      "We believe the most profound experiences often come from the simplest moments …a morning walk, a fresh meal, a quiet sunset.",
  },
  {
    title: "Authenticity",
    description:
      "Nothing here is artificial. Not the food, not the architecture, not the stories we share.",
  },
  {
    title: "Learning",
    description:
      "Every guest becomes a part of our learning ecosystem whether it's through organic farming, birdwatching, or cultural exchange.",
  },
];
const CoreValues = () => {
  return (
    <motion.div
      className="text-center pb-16 pt-14 md:pt-20 bg-[#D1C8C1]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className="max-w-7xl mx-auto">
        <DecorativeHeading text={"Our Core Values"} />

        <motion.div className="h-full" variants={itemVariants}>
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className=" mx-auto px-4  text-lg text-gray-800">
              <div className="text-primary-gray2 font-arial-narrow">
                <p className="mb-4 p-text">
                  Our values shape every choice—from how we build, to how we
                  share life with nature.
                </p>

                <div className=" rounded-2xl p-6 py-10">
                  <motion.div
                    className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4 font-poppins"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                  >
                    {coreValues.map((feature, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="bg-primary-gray2 h-full flex flex-col justify-center bg-opacity-50 text-start item-center gap-2 rounded-lg p-6 backdrop-blur-sm">
                          <p className="font-primary card-heading tracking-wider  text-white text-center text-opacity-90">
                            {feature.title}
                          </p>
                          <p className="p-text   text-white text-center text-opacity-90">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CoreValues;
