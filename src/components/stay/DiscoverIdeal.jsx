"use client";

import React from "react";
import { motion } from "framer-motion";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import HeadingAndParagraph from "@/common-components/headingAndParagraph/HeadingAndParagraph";

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

const p1 =
  "At Madhuban Eco Retreat, every stay blends natural serenity with eco-friendly comfort. From safari tents and mud houses to glamping, camping, and poolside villas, each space invites you to slow down and reconnect with nature. Located beside the lush Ratapani Wildlife Sanctuary, Madhuban is a premier Ratapani jungle lodge and one of the best eco-luxury stays in Ratapani for families, couples, adventure seekers, and wellness travelers seeking a true nature resort near Bhopal.";

const DiscoverIdeal = () => {
  return (
    <motion.div
      className="text-center   bg-primary-gray2 overflow-hidden px-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className="max-w-7xl mx-auto ">
        <HeadingAndParagraph
          paragraphs={[p1]}
          textColor={"#fff"}
          textClasses="w-[80%] md:w-fit"
          paraClasses="text-justify"
        />
      </div>
    </motion.div>
  );
};

export default DiscoverIdeal;
