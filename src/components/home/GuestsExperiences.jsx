"use client";
import { motion } from "framer-motion";
import TestimonialSlider from "@/components/TestimonialSlider";
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const GuestsExperiences = () => {
  return (
    <section
      className="py-8 px-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dx3aj7a40/image/upload/v1770624796/ex-bg_qefnmz.jpg')",
      }}
    >
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <DecorativeHeading text="Guest Experiences" />
          <p className="mt-1 max-w-2xl mx-auto p-text  px-4 tracking-wide font-arial-narrow">
            What our guests say about their stay at Madhuban Eco Retreat
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <TestimonialSlider />
        </motion.div>
      </div>
    </section>
  );
};

export default GuestsExperiences;
