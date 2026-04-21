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

const NaturesStory = () => {
  return (
    <motion.div
      className="text-center pb-16 pt-12 bg-primary-gray2 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className="max-w-7xl mx-auto ">
        <DecorativeHeading
          text={"  Stories From Nature, Wellness & Wilderness"}
          as="h2"
          color="#fff"
        />

        <motion.div className="h-full" variants={itemVariants}>
          <div className="grid gap-6 md:gap-12 px-4">
            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <p className="p-text text-justify md:text-center text-white">
                Discover thoughtful stories inspired by the forests of Ratapani,
                the culture of Madhya Pradesh, and the slow-living philosophy
                behind Madhuban Eco Retreat. Our blog brings you nature guides,
                travel insights, sustainable living tips, wildlife experiences,
                and nearby attraction highlights — curated for conscious
                travelers and nature lovers.
              </p>
            </motion.div>

            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <p className="p-text text-justify md:text-center text-white">
                Explore handpicked articles that help you plan your trip,
                understand the region better, and experience eco-travel in its
                purest form.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NaturesStory;
