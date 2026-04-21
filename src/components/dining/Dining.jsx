"use client";

import React, { useState } from "react";
import "./Dining.css";
import DiningSpacial from "./DiningSpacial";
import DiningOptions from "./DiningOptions";
import CommonFaqs from "@/common-components/faqs/CommonFaqs";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import { motion } from "framer-motion";
import Image from "next/image";
import { getAltFromUrl } from "@/utills/helperFunctions";

const foodAndDiningFaqs = [
  {
    question: "Do you serve non-vegetarian food?",
    answer:
      "No. Madhuban Eco Retreat serves only pure vegetarian meals prepared from fresh, local ingredients.",
  },
  {
    question: "Is alcohol available at the retreat?",
    answer:
      "No, we maintain an alcohol-free environment to preserve the peace and wellness focus of the retreat.",
  },
  {
    question: "What kind of food is served at Madhuban?",
    answer:
      "We serve clean, homestyle vegetarian meals inspired by local and tribal flavors, prepared fresh every day.",
  },
  {
    question: "Is the food organic?",
    answer:
      "Yes. Most vegetables and herbs come from our on-site organic farm or local growers.",
  },
  {
    question: "Do you offer buffet meals?",
    answer:
      "Weekend and group buffets may be available, along with daily set meals.",
  },
  {
    question: "Is your dining suitable for health-conscious travelers?",
    answer:
      "Absolutely — our food is fresh, minimally processed, and aligned with clean, mindful eating.",
  },
];

const Dining = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  function removeCloudinaryParams(url) {
    // match /image/<params>/<filename>
    return url.replace(/\/image\/[^/]+\/([^/]+)$/, "/image/$1");
  }

  const photos = [
    {
      id: 1,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/food-image-2-madhuban-eco-retreat-bhopal.avif",
    },
    {
      id: 2,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/food-image-3-madhuban-eco-retreat-bhopal.avif",
    },
    {
      id: 3,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/food-image-4-madhuban-eco-retreat-bhopal.webp",
    },
    {
      id: 4,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/food-image-5-madhuban-eco-retreat-bhopal.webp",
    },
    {
      id: 5,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/food-image-6-madhuban-eco-retreat-bhopal.avif",
    },
    {
      id: 6,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/food-image-7-madhuban-eco-retreat.avif",
    },
    {
      id: 7,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/food-image-8-madhuban-eco-retreat-bhopal.avif",
    },
    {
      id: 8,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/food-image-9-madhuban-eco-retreat-bhopal.avif",
    },
    {
      id: 9,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/food-image-madhuban-eco-retreat-bhopal-1.avif",
    },

    {
      id: 10,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/food-image-madhuban-eco-retreat-bhopal.avif",
    },
    {
      id: 11,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/food-image-madhuban-eco-retreat-ratapani-bhopal.avif",
    },
    {
      id: 12,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/food-image-madhuban-eco-retreat.avif",
    },
    {
      id: 13,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/food-image-madhuban-eco-retreat2.avif",
    },
    {
      id: 14,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/dinning-area-image-4-madhuban-eco-retreat.webp",
    },
    {
      id: 15,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/dinning-area-image-5-madhuban-eco-retreat.avif",
    },
    {
      id: 16,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/dinning-area-image-6-madhuban-eco-retreat-bhopal.avif",
    },
    {
      id: 17,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/dinning-area-image-7-madhuban-eco-retreat-bhopal.avif",
    },
    {
      id: 18,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/dinning-area-image-8-madhuban-eco-retreat-bhopal.avif",
    },
  ];

  const videos = [
    {
      id: 1,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/dining.mp4",
    },
    {
      id: 2,
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/dining1.mp4",
    },
    // Add more if needed
  ];

  const closeModal = () => {
    setSelectedMedia(null);
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

  return (
    <>
      <div className="farm-to-table bg-[#D1C8C1] flex flex-col items-center">
        <div className="relative w-full h-[85vh]  ">
          <Image
            src={
              "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/dinning-area-image-madhuban-eco-retreat.webp"
            }
            alt={getAltFromUrl(
              "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/dining/dinning-area-image-madhuban-eco-retreat.webp",
            )}
            className="w-full h-full object-cover"
            fill
            priority
            sizes="100vw"
          />

          <div
            className="absolute top-0 z-10 h-full w-full text-white flex flex-col items-center justify-center"
            style={{
              background: "linear-gradient(180deg,rgba(0, 0, 0, 0.4 ) 100%)",
            }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-white text-center px-4"
            >
              <div className="text-center max-w-7xl">
                <h1 className="bannerHeading font-primary">
                  {" "}
                  Farm-To-Fork Dining
                </h1>
                <h2 className="bannerSubHeading">
                  Fresh ingredients from our farm to your plate
                </h2>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="bg-primary-gray w-full flex flex-col items-center  max-w-7xl pt-4">
          <section className="p-4 bg-primary max-w-7xl ">
            <div>
              <DecorativeHeading text={"Fresh, Local & Wholesome"} as="h2" />

              <div className="flex flex-col gap-4 p-text p-text-black">
                <p className=" text-justify md:text-center  ">
                  At Madhuban Eco Retreat, dining is more than a meal — it’s an
                  experience rooted in nature, purity, and mindful eating. Our
                  farm-to-table concept brings fresh ingredients straight from
                  our organic farm, local growers, and nearby tribal
                  communities, ensuring every dish is nourishing, seasonal, and
                  full of flavor.
                </p>
                <p className=" text-justify md:text-center  ">
                  Prepared with minimal processing and maximum care, our meals
                  celebrate the essence of clean eating, inspired by the
                  simplicity of rural Madhya Pradesh. Whether you’re enjoying a
                  warm breakfast, a comforting lunch, or a wholesome dinner,
                  you’ll experience food that is earthy, honest, and deeply
                  satisfying.
                </p>
                <p className=" text-justify md:text-center  ">
                  Perfect for travelers looking for veg food near Ratapani,
                  healthy cuisine, or sustainable dining options close to
                  Bhopal, our kitchen reflects our commitment to eco-conscious
                  living and wellness.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-primary-gray2 w-full items-center flex flex-col">
          <section className="py-8 px-4 max-w-7xl">
            <DecorativeHeading text={"Photo Gallery"} as="h2" color="#fff" />

            <div className="flex flex-col ">
              <div className="media-grid max-w-7xl">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="media-item"
                    onClick={() => setSelectedMedia(photo)}
                  >
                    <Image
                      width={400}
                      height={400}
                      src={photo.url}
                      alt={getAltFromUrl(photo.url)}
                      objectFit="cover"
                    />
                    <div className="media-title">{photo.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="max-w-7xl w-full">
          <section className="py-8 px-4 mt-6 w-full ">
            <DecorativeHeading text={"Video Gallery"} />

            <div className="flex flex-col mt-4 ">
              <div
                className={`media-grid ${
                  videos.length === 1 ? "single-media" : ""
                } max-w-7xl`}
              >
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="media-item"
                    onClick={() => setSelectedMedia(video)}
                  >
                    <video>
                      <source src={video.url} type="video/mp4" />
                    </video>
                    <div className="media-title">{video.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {selectedMedia && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              {selectedMedia.url.includes(".mp4") ? (
                <video controls autoPlay>
                  <source src={selectedMedia.url} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={getAltFromUrl(selectedMedia.url)}
                />
              )}
              <h3>{selectedMedia.title}</h3>
            </div>
          </div>
        )}
      </div>
      <DiningSpacial />
      <DiningOptions />
      <CommonFaqs faqs={foodAndDiningFaqs} />
    </>
  );
};

export default Dining;
