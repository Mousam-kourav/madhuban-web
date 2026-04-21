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
    title: "Eco-friendly accommodations near Ratapani",
  },
  {
    title: "Perfect for family trips or weekend getaways",
  },
  {
    title: "Instant confirmation for Ratapani resort booking",
  },
];
const WhyChoose = () => {
  return (
    <motion.div
      className="text-center md:pb-16 pt-20 "
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className="max-w-7xl mx-auto">
        <DecorativeHeading text={"Why Choose Us?"} />

        <motion.div className="h-full" variants={itemVariants}>
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className=" mx-auto px-4  text-lg text-gray-800">
              <div className="text-primary-gray2 font-arial-narrow">
                <div className=" rounded-2xl p-4 ">
                  <motion.div
                    className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4 font-poppins"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                  >
                    {coreValues.map((feature, index) => (
                      <motion.div key={index} variants={itemVariants}>
                        <div className="bg-primary-gray2 h-full flex flex-col justify-center bg-opacity-50 text-start item-center gap-2 rounded-lg p-6 backdrop-blur-sm">
                          <p className="text-sm md:text-lg text-white text-center text-opacity-90">
                            {feature.title}
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

export default WhyChoose;
