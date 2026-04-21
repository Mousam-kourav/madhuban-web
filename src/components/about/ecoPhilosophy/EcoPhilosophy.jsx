"use client";

import React from "react";
import { motion } from "framer-motion";
import PhilosophyBenifit from "@/components/about/ecoPhilosophy/PhilosopyBenifit";
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

const sustainabilityFeatures = [
  {
    icon: "waste",
    title: "Efficient waste management and recycling",
  },
  {
    icon: "material",
    title:
      "Sustainable materials, eco-friendly products, and natural building choices",
  },
  {
    icon: "leaf",
    title: "Reduced carbon footprint through conscious operational practices",
  },
  {
    icon: "staff",
    title: "Local sourcing of staff, ingredients, and materials",
  },
  {
    icon: "ecosystem",
    title:
      "Responsible tourism principles to protect biodiversity and support Ratapani’s fragile ecosystem",
  },
];

const EcoPhilosophy = () => {
  return (
    <motion.div
      className="text-center pb-16 pt-14 bg-primary-gray overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className="max-w-7xl mx-auto">
        <DecorativeHeading text={"Eco Philosophy"} />

        <motion.div className="h-full" variants={itemVariants}>
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className=" mx-auto px-4 py-10 text-lg text-gray-800">
              <div className="text-primary-gray2 font-arial-narrow">
                <p className="mb-6 p-text p-text-black  text-justify">
                  At Madhuban Eco Retreat, nature is not a backdrop — it is the
                  foundation of everything we do. Our eco philosophy is simple:
                  Live lightly, protect consciously, and give back continuously.
                </p>

                <div className="bg-primary-gray2 rounded-2xl p-6 py-10">
                  <p className="heading1 text-white font-primary ">
                    Here’s how we bring this philosophy to life
                  </p>
                  <motion.div
                    className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4 font-poppins"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                  >
                    {sustainabilityFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.03 }}
                      >
                        <PhilosophyBenifit feature={feature} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <div className="flex items-center justify-center mb-4">
                  <motion.div
                    className="h-full  md:w-[80%]"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <p className="p-text p-text-black pt-12 p-text-black text-justify  md:text-center ">
                      Our commitment extends beyond the retreat. We actively
                      participate in community development, volunteering, and
                      conservation-based initiatives that benefit the land and
                      people around us.
                    </p>
                    <p className="p-text p-text-black pt-5 p-text-black text-justify md:text-center">
                      Eco-living at Madhuban is not a concept — it is a daily
                      practice that shapes how we grow, serve, and sustain
                    </p>
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

export default EcoPhilosophy;
