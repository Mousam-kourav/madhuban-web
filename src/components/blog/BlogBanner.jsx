"use client";
import { motion } from "framer-motion";

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

const BlogBanner = () => {
  return (
    <section
      className="h-[90vh] bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/blogs/hero-2.jpg')",
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-white text-center px-4"
      >
        <h1 className="bannerHeading d mb-4 font-primary">Madhuban Blog</h1>
        <p className="bannerSubHeading max-w-2xl mx-auto text-lg md:text-xl">
          Explore mindful, eco-friendly experiences designed around forests,
          wildlife, and peaceful living near Bhopal
        </p>
      </motion.div>
    </section>
  );
};

export default BlogBanner;
