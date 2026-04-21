"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaAnglesRight } from "react-icons/fa6";
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

const StayWhyChooseUs = ({ points = [], title = "", imageUrl = "" }) => {
  if (!points.length) return <></>;
  return (
    <section className="py-8 px-4 md:px-8 bg-primary-gray2">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <DecorativeHeading text={title} as="h2" color="#fff" />
        </motion.div>

        <motion.div className="grid grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-2 gap-6  ">
          <motion.div
            className="grid   gap-4 order-2 md:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {points?.map((item, i) => {
              return (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  key={i}
                >
                  <div className=" flex items-center p-text gap-4 rounded-xl border border-primary-gray bg-primary-gray  p-4 text-primary-gray2 transition">
                    <FaAnglesRight className="shrink-0" aria-label="right angles" /> {item}
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
            viewport={{ once: true }}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
            }}
          ></motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StayWhyChooseUs;
