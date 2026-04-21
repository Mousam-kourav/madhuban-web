"use client";

import React, { useState, useEffect } from "react";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import styled from "styled-components";
import "../../components/photoGallery.css";
import { FaPlayCircle } from "react-icons/fa";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import { motion } from "framer-motion";
import Image from "next/image";
import { getAltFromUrl } from "@/utills/helperFunctions";

const tabs = [
  "Madhuban Eco Retreat",
  "Bhim Bettika",
  "Forest & Nature",
  "Ginnorgarh Fort",
  "Tribal Culture At Madhuban",
  "Saru Maru Caves",
];

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

const mediaContent = {
  "Madhuban Eco Retreat": [
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/madhuban-eco-retreat-best-resort-near-bhopal-1.webp",
    },
    {
      type: "video",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/gallery-video.mp4",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/glamping-tent-madhuban-eco-retreat-1.webp",
    },
    {
      type: "video",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/gallery-video5.mp4",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/collage-image-madhuban-eco-retreat-best-resort-near-bhopal.webp",
    },
    {
      type: "video",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/gallery-video4.mp4",
    },
    {
      type: "video",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/gallery-video-7.mp4",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/glamping-tent-gallery-madhuban-eco-retreat.webp",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/mud-house-sunset-madhuban-eco-retreat-bhopal.webp",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/pool-view-image-madhuban-eco-retreat-bhopal.webp",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/madhuban-eco-retreat-image.webp",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/madhuban-eco-retreat-image-best-resort-near-bhopal.webp",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/mud-house-gallery-image-2-madhuban-eco-retreat.webp",
    },
    {
      type: "video",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/gallery-video-6.mp4",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/guest-near-safari-tent-madhuban-eco-retreat-bhopal.webp",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/dinning-area-image-7-madhuban-eco-retreat-bhopal.webp",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/fine-dine-restaurant-in-ratapani-bhopal-madhuban-eco-retreat-2.webp",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/madhuban-eco-retreat-best-restaurant-near-bhopal.webp",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/fine-dine-restaurant-in-ratapani-bhopal-madhuban-eco-retreat.webp",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/madhuban-eco-retreat/dinning-area-image-8-madhuban-eco-retreat-bhopal.webp",
    },
  ],
  "Tribal Culture At Madhuban": [
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/Tribal/traditional-tribal-dance-madhuban-eco-retreat-bhopal.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/Tribal/traditional-tribal-dance-madhuban-eco-retreat-bhopal2.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/Tribal/traditional-tribal-dance-madhuban-eco-retreat-bhopal3.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/Tribal/traditional-tribal-dance-madhuban-eco-retreat-bhopal4.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/Tribal/traditional-tribal-dance-madhuban-eco-retreat-bhopal5.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/Tribal/traditional-tribal-dance-madhuban-eco-retreat-bhopal6.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/Tribal/traditional-tribal-dance-madhuban-eco-retreat-bhopal7.jpg",
    },
  ],
  "Forest & Nature": [
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature1.jpg",
    },
    {
      type: "video",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature-video.mp4",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature2.jpg",
    },
    {
      type: "video",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature.mp4",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature3.jpg",
    },
    {
      type: "video",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature-video1.mp4",
    },
    {
      type: "video",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature-video2.mp4",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature6.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature7.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature8.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature9.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature10.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature11.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature12.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature13.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature14.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature15.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature16.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature17.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature18.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature19.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature20.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/nature/nature5.jpg",
    },
  ],
  "Bhim Bettika": [
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/bhim-betika/bhimbetika-rock-shelter-image.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/bhim-betika/bhimbetika-image-1-madhuban-eco-retreat.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/bhim-betika/bhimbetika-image-2-madhuban-eco-retreat.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/bhim-betika/bhimbetika-image-3-madhuban-eco-retreat.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/bhim-betika/bhimbetika-image-4-madhuban-eco-retreat.jpeg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/bhim-betika/bhimbetika-image-5-madhuban-eco-retreat.jpeg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/bhim-betika/bhimbetika-image-6-madhuban-eco-retreat.jpeg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/bhim-betika/bhimbetika-image-madhuban-eco-retreat-1.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/bhim-betika/bhimbetika-image-madhuban-eco-retreat-bhopal.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/bhim-betika/bhimbetika-image-madhuban-eco-retreat.jpeg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/bhim-betika/bhimbetika-rock-shelter-image-1.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/bhim-betika/bhimbetika-rock-shelter-madhuban-eco-retreat-1.jpg",
    },
  ],
  "Saru Maru Caves": [
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal.jpg",
    },
    {
      type: "video",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal-video1.mp4",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal2.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal3.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal4.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal5.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal6.jpg",
    },
    {
      type: "video",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal-video2.mp4",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal7.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal8.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal9.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal11.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/saru-maru-caves/saru-maru-caves-madhuban-eco-retreat-bhopal12.jpg",
    },
  ],
  "Ginnorgarh Fort": [
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/ginnorgarh-fort/ginnorgarh-fort-ratapani-madhuban-eco-retreat-bhopal.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/ginnorgarh-fort/ginnorgarh-fort-ratapani-madhuban-eco-retreat-bhopal1.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/ginnorgarh-fort/ginnorgarh-fort-ratapani-madhuban-eco-retreat-bhopal2.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/ginnorgarh-fort/ginnorgarh-fort-ratapani-madhuban-eco-retreat-bhopal3.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/ginnorgarh-fort/ginnorgarh-fort-ratapani-madhuban-eco-retreat-bhopal4.jpg",
    },
    {
      type: "image",
      src: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/gallery/ginnorgarh-fort/ginnorgarh-fort-ratapani-madhuban-eco-retreat-bhopal5.jpg",
    },
  ],
};

const Gallery = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [playingVideoIndex, setPlayingVideoIndex] = useState(null);

  useEffect(() => {
    NativeFancybox.bind('[data-fancybox="gallery"]', {});
    return () => {
      NativeFancybox.destroy();
    };
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#D1C8C1]">
      <section className="relative w-full h-[85vh] overflow-hidden mb-20 ">
        {/* Video Layer */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/home/welcome/madhuban-intro.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content Layer */}
        <div className="relative z-10 flex items-center justify-center h-full text-white text-center px-4">
          <div className="max-w-7xl">
            <h1 className="bannerHeading font-primary">Eco Gallery</h1>

            <h2 className="bannerSubHeading">
              Discover the beauty of nature through our lens
            </h2>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 -mt-24 rounded-bl-[60px] rounded-br-[60px] ">
        <div className="max-w-[86rem] mx-auto">
          <DecorativeHeading
            text={" Experience Madhuban Through Nature & Culture"}
            as="h2"
            textClasses={"w-[80%] md:w-full"}
          />

          <div className="flex flex-col gap-4">
            <p className="p-text md:text-center p-text-black  text-justify ">
              Explore the natural beauty, earthy architecture, and cultural
              heritage that make Madhuban Eco Retreat unique. Our gallery
              showcases scenic forest landscapes, wildlife moments, tribal art,
              ancient sites like Bhimbetka and Ginnorgarh Fort, and peaceful
              corners of our eco-friendly retreat. From lush greenery to
              thoughtfully designed stays, these images capture the true essence
              of Ratapani’s wilderness. Dive in and experience the charm of
              Madhuban through our curated collection of photos and videos.
            </p>
            <p className="p-text md:text-center  text-justify p-text-black ">
              From lush greenery to thoughtfully designed stays, these images
              capture the true essence of Ratapani’s wilderness. Dive in and
              experience the charm of Madhuban through our curated collection of
              photos and videos.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 px-4   rounded-bl-[60px] rounded-br-[60px] ">
        <div className="max-w-[86rem] mx-auto">
          <DecorativeHeading
            text={" Our Gallery"}
            as="h2"
            textClasses={"w-50"}
          />

          <TabWrapper>
            {tabs.map((tab) => (
              <StyledButton
                key={tab}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className="text-xs md:text-sm"
              >
                {tab}
              </StyledButton>
            ))}
          </TabWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaContent[activeTab].map((item, index) => (
              <article
                key={index}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl shadow-lg max-w-sm w-full mx-auto"
              >
                {item.type === "image" ? (
                  <>
                    <Image
                      width={300}
                      height={300}
                      src={item.src}
                      alt={getAltFromUrl(item.src)}
                      className="h-80 w-full object-cover rounded-t-2xl"
                      loading="lazy"
                    />
                    <a
                      href={item.src}
                      data-fancybox="gallery"
                      className="absolute inset-0 z-10"
                      aria-label="Visit Site"
                    ></a>
                  </>
                ) : playingVideoIndex === index ? (
                  <video
                    controls
                    autoPlay
                    className="w-full h-80 object-cover rounded-2xl"
                  >
                    <source src={item.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div
                    className="relative w-full h-80 bg-black rounded-2xl cursor-pointer group overflow-hidden"
                    onClick={() => setPlayingVideoIndex(index)}
                  >
                    <video
                      src={item.src}
                      className="w-full h-full object-cover rounded-2xl"
                      poster={item.poster}
                      preload="metadata"
                      muted
                      loop
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaPlayCircle className="text-white text-6xl group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;

// Styled Components
// Styled Components
const TabWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
`;

const StyledButton = styled.button`
  margin: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid ${({ isActive }) => (isActive ? "#000000" : "#000000")};
  border-radius: 9999px;
  background-color: ${({ isActive }) => (isActive ? "#d1c8c1" : "#6E6146")};
  color: ${({ isActive }) => (isActive ? "black" : "white")};
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #b3a69d;
    color: black;
    border-color: #000000;
  }
`;
