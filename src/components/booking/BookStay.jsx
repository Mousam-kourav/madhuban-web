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

const BookStay = () => {
  return (
    <motion.div
      className="text-center w-full  pb-8 pt-12  overflow-hidden px-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className="max-w-7xl mx-auto ">
        <DecorativeHeading
          text={"Book Your Stay at Madhuban Eco Retreat"}
          as="h1"
        />

        <motion.div className="h-full" variants={itemVariants}>
          <div className="grid  gap-12 px-2">
            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <p className="p-text text-justify md:text-center  text-primary-gray2 ">
                Experience the best hotel near Ratapani Wildlife Sanctuary at
                Madhuban Eco Retreat. Ideal for families, couples, and nature
                lovers, our resort offers eco-friendly stays, jungle views, and
                easy access to Ratapani wildlife.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookStay;
