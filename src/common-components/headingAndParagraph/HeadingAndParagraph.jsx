"use client";

import React from "react";
import { motion } from "framer-motion";
import DecorativeHeading from "../heading/DecorativeHeading";
import { primary_gray2 } from "@/styles/variables";

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

const HeadingAndParagraph = ({
  headingText = "",
  headingType = "h2",
  subHeadingText = "",
  paragraphs = [],
  bg = "bg-primary-gray2",
  textColor = { primary_gray2 },
  textClasses = "",
  paraClasses = "",
}) => {
  return (
    <motion.div
      className={`text-center pb-16  pt-12 ${bg} overflow-hidden`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className="max-w-7xl mx-auto ">
        {headingText && (
          <DecorativeHeading
            text={headingText}
            as={headingType}
            color={textColor}
            textClasses={textClasses}
          />
        )}

        {subHeadingText && (
          <p
            className="mt-1 max-w-2xl mx-auto p-text text-white px-4 tracking-wide font-arial-narrow mb-4"
            style={{ color: textColor }}
          >
            {subHeadingText}
          </p>
        )}

        <motion.div className="h-full" variants={itemVariants}>
          <div className="grid  gap-6">
            {paragraphs.map((paragraph, i) => {
              return (
                <motion.div
                  key={i}
                  className="h-full"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <p
                    className={`p-text  ${paraClasses}`}
                    style={{ color: textColor }}
                  >
                    {paragraph}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeadingAndParagraph;
