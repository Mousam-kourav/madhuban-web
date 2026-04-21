"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import Image from "next/image";

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
const ReadyForEcoRetreat = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden min-h-[400px] flex items-center">
      {/* 1. The Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/readyForEco/mud-house-madhuban-eco-retreat-bhopal.webp"
          alt="Madhuban Eco Retreat Mud House"
          fill
          priority // Added priority since it's a large background
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
        {/* 2. The Overlay Layer (Ensures text is readable) */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* 3. The Content Layer (z-10 ensures it stays on top) */}
      <div className="container mx-auto relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <DecorativeHeading
            text={"Ready for Your Eco Retreat in Madhya Pradesh?"}
            color="#fff"
            textClasses={"w-[80%] md:w-fit mx-auto"}
          />

          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white px-4 tracking-wide font-arial-narrow">
            Escape to nature without leaving comfort behind.
          </p>

          <p className="mt-4 max-w-2xl mx-auto p-text text-white px-4 tracking-wide font-arial-narrow">
            Book your stay at Madhuban Eco Retreat — the perfect jungle resort
            in Ratapani for peaceful getaways, wellness travel, and nature
            exploration.
          </p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Link
                href="/booking"
                className="px-10 py-4 bg-[#D1C8C1] hover:bg-[#b8ada5] text-[rgb(110,97,70)] transition-all rounded-md font-primary font-extrabold text-xl tracking-wider inline-block shadow-lg"
              >
                Book Your Stay
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReadyForEcoRetreat;
