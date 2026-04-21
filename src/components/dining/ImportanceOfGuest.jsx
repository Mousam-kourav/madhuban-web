"use client";
import React from "react";
import { motion } from "framer-motion";
import { Salad, BeerOff } from "lucide-react";
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

const GuestImportance = () => {
  return (
    <>
      <motion.div
        className="text-center pb-16 pt-12 bg-primary-gray overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-6xl mx-auto items-center flex flex-col">
          <DecorativeHeading text={"Important for Our Guests"} as="h2" />

          <motion.div
            className="flex flex-col gap-4 w-90 md:w-full  md:rounded-2xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* our vision */}
            <motion.div className="h-full" variants={containerVariants}>
              <div className="grid grid-cols-1 lg:grid-cols-2  gap-12">
                <motion.div
                  className="h-full bg-primary-gray2 rounded-2xl order-2 md:order-1"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className=" mx-auto px-4 py-10 text-lg ">
                    <div className="text-white flex flex-col items-center justify-center ">
                      <Salad size={40} />
                      <h3 className="cardHeading my-4">
                        100% Pure Vegetarian Menu
                      </h3>
                      <p className="mb-6 p-text  text-center">
                        We serve only pure veg meals, prepared with fresh,
                        local, and organic produce.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="h-full order-1 md:order-2 bg-primary-gray2 rounded-2xl"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className=" mx-auto px-4 py-10 text-lg ">
                    <div className="text-white flex flex-col items-center justify-center ">
                      <BeerOff size={40} />
                      <h3 className="cardHeading  my-4">No Alcohol Served</h3>
                      <p className="mb-6 p-text    text-center">
                        To maintain the peace and purity of the retreat
                        environment, we do not serve alcohol.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default GuestImportance;
