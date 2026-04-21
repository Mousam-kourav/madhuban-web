"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MdOutlineDateRange } from "react-icons/md";

import { motion } from "framer-motion";
import Image from "next/image";

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

function formatDate(dateString) {
  const [day, month, year] = dateString.split("-");
  const date = new Date(year, month - 1, day);
  const d = date.getDate();
  const monthName = date.toLocaleString("default", { month: "long" });
  const y = date.getFullYear();

  const getSuffix = (d) => {
    if (d >= 11 && d <= 13) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${monthName} ${d}${getSuffix(d)}, ${y}`;
}
export default function HeroSection({
  breadcom = [],
  title = ``,
  createdAt = ``,
  image = "",
}) {
  const [imgSrc, setImgSrc] = useState(image);
  return (
    <>
      <section className="h-[90vh] relative">
        {/* Background Image */}
        <Image
          src={imgSrc}
          alt={title || "Banner"}
          fill
          priority
          className="object-cover object-center"
          onError={() =>
            setImgSrc(
              "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image-banner.png",
            )
          }
        />

        {/* Everything below is unchanged */}
        <div
          className="w-full h-full flex flex-col items-center justify-center relative z-10"
          style={{
            background:
              "linear-gradient(180deg,rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.4) 80%)",
          }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-white flex gap-2 mb-4"
          >
            <MdOutlineDateRange size={22} />{" "}
            <span className=" mr-2">{formatDate(createdAt)}</span>
          </motion.div>
          <div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-white text-center px-4 max-w-5xl"
            >
              <h1
                className="bannerHeading  mb-4 font-primary"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            </motion.div>
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="absolute bottom-6"
          >
            {breadcom?.length > 0 && (
              <div className="max-w-7xl mx-auto flex justify-center w-screen    ">
                <div className="flex items-center text-white text-md max-w-[90%]   ">
                  <Link href="/" className="hover:underline ">
                    {` Home`}
                  </Link>
                  {breadcom.map((item, index) => (
                    <React.Fragment key={index}>
                      <span className="px-1 ">/</span>
                      {item?.url ? (
                        <Link href={item.url} className="hover:underline px-1">
                          {item.title}
                        </Link>
                      ) : (
                        <span className="px-1 text-white truncate">
                          {item.title}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
