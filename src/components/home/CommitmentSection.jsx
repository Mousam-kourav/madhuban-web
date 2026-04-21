"use client";
import { motion } from "framer-motion";
import SustainabilityFeature from "@/components/SustainabilityFeature";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

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

const sustainabilityFeatures = [
  {
    icon: "water-drop",
    title: "Water Conservation",
    description: "Rainwater harvesting & recycling",
  },
  {
    icon: "sun",
    title: "Solar Energy",
    description: "80% of our energy needs",
  },
  {
    icon: "trees",
    title: "Organic Farm",
    description: "Fresh produce for our dining",
  },
  {
    icon: "community",
    title: "Local Employment",
    description: "80% of our staff are from local communities",
  },
  {
    icon: "nature",
    title: "Low-Impact Architecture",
    description: "Natural materials & earth-friendly design",
  },
];

const CommitmentSection = () => {
  return (
    <section className="py-8 px-4 md:px-8 bg-[rgb(110,97,70)] text-white">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <DecorativeHeading
            text="Our Commitment to Sustainability"
            color="#fff"
          />

          <p className="mt-1 p-text max-w-2xl mx-auto   font-arial-narrow text-[#D1C8C1] px-4 tracking-wide">
           As a leading eco-friendly resort near Bhopal, Madhuban Eco Retreat is built on practices that preserve the environment and support local communities.
          </p>
        </motion.div>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 -mt-9 font-poppins"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {sustainabilityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <SustainabilityFeature feature={feature} />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <p className="p-text mt-4 max-w-2xl mx-auto  font-arial-narrow text-[#D1C8C1] px-4 tracking-wide text-center">
            Every stay contributes to responsible tourism in Madhya Pradesh.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CommitmentSection;
