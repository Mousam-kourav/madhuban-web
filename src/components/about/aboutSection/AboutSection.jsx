"use client";

import React from "react";
import { motion } from "framer-motion";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

const standsFor = [
  "One of the best resorts near Ratapani",
  "A peaceful jungle resort near Bhopal",
  "A natural space for detox retreats and wellness",
  "A luxury eco-resort offering sustainable forest living",
];

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

const AboutSection = () => {
  return (
    <motion.div
      className="text-center pb-16 pt-12 bg-[#D1C8C1] overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className="max-w-7xl mx-auto ">
        <motion.div className="h-full" variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              className="h-full"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="max-w-4xl mx-auto px-4 py-10 text-lg text-gray-800">
                <div className="p-text-black p-text font-arial-narrow text-justify">
                  <p className="mb-4">
                    Madhuban Eco Retreat is a regenerative forest and experiential travel destination nestled across 20 acres of land that was once barren and degraded. Today it stands as one of the most thoughtfully built eco-luxury resorts near Bhopal — welcoming solo travelers, families, and conscious explorers alike. Our eco-conscious design blends rustic charm with comfort, inviting you to slow down and reconnect with the rhythms of nature.
                  </p>
                  <p>
                  Strategically located near Bhopal and in close proximity to both Ratapani and Satpura Tiger Reserves, Madhuban is an ideal base for those wishing to explore the stunning wildlife, rich cultural heritage, and natural beauty of central India. As a regenerative travel destination and Ratapani eco lodge, it invites you to be part of a growing movement toward meaningful, responsible tourism near Bhopal. Travelers can embark on thrilling wildlife safaris, discover the ancient rock shelters of Bhimbetka — a UNESCO World Heritage Site — or visit the serene ruins of Buddhist monasteries tucked away in the forested hills.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="h-full flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className=" rounded-2xl shadow-lg p-8 bg-[#6e6146]">
                <h2 className="font-primary text-lg md:text-xl text-white mb-4">
                  Today Madhuban stands As
                </h2>

                <div className="grid grid-cols-1  gap-4 mb-10 ">
                  {standsFor.map((item, i) => {
                    return (
                      <motion.div
                        key={i}
                        className="relative rounded-lg overflow-hidden shadow-lg group"
                        variants={itemVariants}
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="text-md block rounded-xl border border-[#6e6146ff]  p-4  font-medium bg-[#d1c8c1] transition">
                          {item}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
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
            <p className="p-text pt-12 p-text-black">
             Whether you're planning a forest escape, a cultural journey, or a nature retreat near Bhopal, Madhuban offers an unforgettable experience of Madhya Pradesh's wilderness and wonder.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutSection;
