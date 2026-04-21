"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CommonFaqs from "@/common-components/faqs/CommonFaqs";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import Image from "next/image";
import HeroSlider from "./HeroSlider";
import { getAltFromUrl } from "@/utills/helperFunctions";

const heroSlides = [
  {
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/nearby-atterations/banner/smCaves1.jpg",
  },
  {
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/nearby-atterations/banner/smCaves11.jpg",
  },
  {
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/nearby-atterations/banner/smCaves12.jpg",
  },
  {
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/nearby-atterations/banner/smCaves6.jpg",
  },
];

const cardData = [
  {
    title: "Ratapani Widlife Sanctuary",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/nearby-atterations/ratapani-wildlife-sanctuary-nearby-attraction-madhuban-eco-retreat.jpg",
    description:
      "A stunning 688 sq. km forest known for teak woodlands, wildlife diversity, and peaceful jungle landscapes. Apart from the tiger, you may spot leopards, jackals, hyenas, wild dogs, and unique species of birds.",
    bestFor: "Wildlife lovers, nature photographers, jungle drives.",
  },
  {
    title: "Ginnorgarh Tribal Fort",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/nearby-atterations/ginnorgarh-tribal-fort-ratapani-tiger-reserve.jpg",
    description:
      "A historic 1200 BC hilltop fort rising over 700 meters, located inside Ratapani Tiger Reserve. The fort features ancient water bodies, palace remains, and stone gateways — offering a raw glimpse into tribal and medieval heritage.",
    bestFor: "Trekkers, history lovers, architecture enthusiasts.",
  },
  {
    title: "Bhimbetka Rock Shelters (UNESCO Site)",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/nearby-atterations/bhimbetka-rock-shelters-nearby-attraction-madhuban-eco-retreat.jpg",
    description:
      "A world-renowned archaeological site with prehistoric rock art from the Paleolithic, Mesolithic, and early historic periods. These caves represent the earliest evidence of human life in India.",
    bestFor: "Historians, students, cultural explorers.",
  },
  {
    title: "Satpura Tiger Reserve / Satpura National Park",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/nearby-atterations/satpura-tiger-reserve-nearby-attraction-madhuban-eco-retreat.jpg",
    description:
      "One of Central India’s finest forest belts, Satpura Tiger Reserve is known for its rugged landscapes, wildlife safaris, river boating, and deep forest trails.",
    bestFor: "Wildlife safaris, nature enthusiasts, adventure seekers.",
  },
  {
    title: "Saru Maru Caves",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/nearby-atterations/saru-maru-caves-nearby-attraction-madhuban-eco-retreat.jpg",
    description:
      "An ancient Buddhist monastic complex featuring meditation caves, inscriptions, and remnants of Ashokan-era history.",
    bestFor: "Archaeology lovers, cultural travelers, spiritual seekers.",
  },
  {
    title: "Narmada River Darshan (Sethani Ghat)",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/nearby-atterations/narmada-river-darshan-nearby-attraction-madhuban-eco-retreat.jpg",
    description:
      "A magnificent 19th-century riverside ghat located at Narmadapuram. It is one of India’s largest ghats and a serene place to experience the spiritual aura of the holy Narmada River.",
    bestFor: "Pilgrims, sunset views, riverside relaxation.",
  },
  {
    title: "Salkanpur Devi Temple",
    image:
      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/nearby-atterations/salkanpur-devi-temple-nearby-attraction-madhuban-eco-retreat.jpg",
    description:
      "A revered Shaktipeeth dedicated to Goddess Vindhyavasni Beejasan Devi. Located atop an 800-foot-high hill, the temple offers panoramic forest views and spiritual tranquility.",
    bestFor: "Devotees, trekking enthusiasts, sunrise/sunset views.",
  },
];

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
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

const NearbyAttractions = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nearbyAttractionsFaqs = [
    {
      question:
        "What are the best nearby attractions around Madhuban Eco Retreat?",
      answer:
        "Top attractions include Ratapani Wildlife Sanctuary, Bhimbetka Rock Shelters, Ginnorgarh Fort, Satpura Tiger Reserve, Saru Maru Caves, and Salkanpur Temple.",
    },
    {
      question: "How far is Bhimbetka from Madhuban Eco Retreat?",
      answer:
        "Bhimbetka is easily accessible and is one of the most recommended visits near the retreat.",
    },
    {
      question: "Is Ratapani good for wildlife lovers?",
      answer:
        "Yes, Ratapani is known for tigers, leopards, hyenas, wild dogs, and rich birdlife.",
    },
    {
      question: "Are these attractions suitable for families?",
      answer:
        "Yes, most nearby attractions are family-friendly and ideal for nature, culture, and spiritual visits.",
    },
    {
      question: "Can I visit Satpura Tiger Reserve from Madhuban?",
      answer:
        "Yes, Satpura lies within the same forest belt region and is accessible for full-day wildlife trips.",
    },
  ];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen bg-[#D1C8C1]  ">
      {/* Hero Section */}

      <HeroSlider heroSlides={heroSlides} />
      <section className=" px-4 py-4 rounded-bl-[60px] rounded-br-[60px] flex flex-col justify-center items-center">
        <div className="text-center max-w-7xl mb-12 mt-10">
          <p className="text-justify md:text-center p-text  text-primary-gray2">
            Beyond the calm of Madhuban Eco Retreat lies a region full of
            ancient caves, wildlife sanctuaries, tribal heritage, spiritual
            sites, and forested landscapes. Whether you're planning a short
            nature outing, heritage exploration, or a full-day adventure, these
            nearby attractions around Ratapani & Bhopal offer a glimpse into the
            rich culture and wilderness of Madhya Pradesh.
          </p>
          <p className=" text-justify md:text-center p-text  mt-4 text-primary-gray2">
            Discover ancient rock shelters, wildlife sanctuaries, waterfalls,
            tribal forts, and sacred temples — all within easy reach from the
            retreat.
          </p>
        </div>
        <motion.div
          className="flex flex-wrap justify-center gap-8 max-w-[86rem] mx-auto"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              className="w-80 bg-[rgb(110,97,70)] rounded-lg shadow-lg overflow-hidden"
              variants={item}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <motion.img
                className="w-full h-40 object-cover"
                src={card.image}
                alt={getAltFromUrl(card.image)}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2 }}
              />
              <div className="px-6 py-4">
                <div className="font-arial-narrow text-[#D1C8C1] font-primary text-xl text-center mb-2">
                  {card.title}
                </div>
                <p className="font-arial-narrow text-[#D1C8C1] text-sm  text-justify">
                  {card.description}
                </p>
                <p className="font-arial-narrow text-[#D1C8C1] text-sm  mt-2 text-justify">
                  Best For : {card.bestFor}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className=" px-4 py-4 rounded-bl-[60px] rounded-br-[60px] flex flex-col justify-center items-center">
        <CommonFaqs faqs={nearbyAttractionsFaqs} />
      </section>
    </div>
  );
};

export default NearbyAttractions;
