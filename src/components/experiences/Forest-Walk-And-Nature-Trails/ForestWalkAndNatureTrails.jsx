"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";
import CommonFaqs from "@/common-components/faqs/CommonFaqs";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

const ForestWalkAndNatureTrails = () => {
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [activeNestedAccordion, setActiveNestedAccordion] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // for fullscreen modal

  const forestImages = [
    {
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/forest-walk/Nature & Forest From Madhuban Eco Retreat - 1.avif",
      alt: "Forest View 1",
    },
    {
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/forest-walk/nature-visit-ratapani-madhuban-eco-retreat-bhopal-2.avif",
      alt: "Forest View 2",
    },
    {
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/forest-walk/Ratapani Forest Walk With Madhuban Eco Retreat Team.avif",
      alt: "Forest View 3",
    },
  ];

  const accordionItems = [
    {
      title: "Forest Walks & Nature Trails",
      content: (
        <>
          <p className="mb-4 text-justify  text-white  p-text  ">
            Step into the quiet, refreshing world of Ratapani with our Forest
            Walks & Nature Trails experience. Designed for travelers who love
            calm, nature, and mindful exploration, this guided walk takes you
            through the lush wilderness surrounding Madhuban Eco Retreat.
          </p>
          <p className="mb-4 text-justify  text-white  p-text  ">
            Discover medicinal plants, native trees, butterflies, birds, and the
            natural ecosystem that thrives in this part of Madhya Pradesh. Every
            trail is led by trained naturalists who help you understand the
            forest, its rhythm, and the life it nurtures. These trails are safe,
            scenic, and suitable for families, seniors, solo travelers, and
            nature lovers.
          </p>
          <p className="mb-4 text-justify  text-white  p-text  ">
            Whether you're looking for forest walks near Bhopal, peaceful
            eco-tourism, or an offbeat nature experience, this trail offers a
            chance to reconnect with yourself and the wild.
          </p>
          <div className=" divide-y rounded-lg bg-primary-gray shadow-inner overflow-hidden">
            {[
              {
                title: "What to Expect",
                content: (
                  <ul className="list-disc list-inside text-primary-gray2  space-y-2 p-text">
                    <li>Guided eco-trails with trained naturalists</li>
                    <li>
                      Learning about local flora, herbs, and forest ecology
                    </li>
                    <li>
                      Mindful walking sessions to improve calmness & focus
                    </li>
                    <li>Device-free experience to help you disconnect</li>
                    <li>Safe, well-marked routes for all age groups</li>
                  </ul>
                ),
              },
              {
                title: "Ideal For",
                content: (
                  <ul className="list-disc list-inside text-primary-gray2  space-y-2 p-text">
                    <li>Nature enthusiasts & eco-tourists</li>
                    <li>Wellness travelers</li>
                    <li>Families & children</li>
                    <li>Photographers & bird watchers</li>
                    <li>Travelers seeking offbeat experiences near Bhopal</li>
                  </ul>
                ),
              },
              {
                title: "Ready to Walk the Wild Side?",
                content: (
                  <>
                    <p className="text-primary-gray2  p-text">
                      Join our guided forest walk and discover Ratapani’s
                      natural treasures. —{" "}
                    </p>
                    <Link
                      href="/booking"
                      className="text-primary-gray2 underline "
                    >
                      Book Your Nature Trail Experience Now
                    </Link>
                  </>
                ),
              },
            ].map((item, idx) => (
              <div key={idx} className="group border-primary-gray2">
                <button
                  className="p-text flex items-center justify-between w-full py-3 px-4 text-left text-primary-gray2  transition duration-200"
                  onClick={() =>
                    setActiveNestedAccordion(
                      activeNestedAccordion === idx ? null : idx,
                    )
                  }
                >
                  <span>{item.title}</span>
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-300 ${
                      activeNestedAccordion === idx ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`px-4 pb-3 text-[#D1C8C1] transition-all duration-300 ease-in-out ${
                    activeNestedAccordion === idx ? "block" : "hidden"
                  }`}
                >
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </>
      ),
    },
  ];

  const forestWalkFaqs = [
    {
      question: "Are the forest walks safe for beginners?",
      answer:
        "Yes, all trails are beginner-friendly, guided, and suitable for families and seniors.",
    },
    {
      question: "How long does a forest walk take?",
      answer:
        "Most walks last between 45 minutes to 1.5 hours, depending on the trail.",
    },
    {
      question: "What can I see during the nature trail?",
      answer:
        "Guests can spot medicinal herbs, butterflies, native trees, insects, bird species, and natural forest formations.",
    },
    {
      question: "Is this the best forest walk experience near Bhopal?",
      answer:
        "Yes, Madhuban Eco Retreat offers one of the most peaceful and eco-friendly forest walks near Bhopal, inside the Ratapani region.",
    },
    {
      question: "Do I need to book in advance?",
      answer: "Pre-booking is recommended to ensure naturalist availability.",
    },
    {
      question: "Are the trails suitable for children?",
      answer:
        "Yes, children enjoy the nature learning experience and the easy, safe trails.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#908873d8]">
      {/* Hero Section with Scroll Down Button */}
      <section className="relative h-[100vh] w-full">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src={
              "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/forest-walk/nature-trails1.mp4"
            }
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center text-white">
            <h1 className="bannerHeading font-primary  mb-4">
              Forest Walks & Nature Trails
            </h1>
            <p className="bannerSubHeading ">
              Slow Down, Breathe, and Walk With the Forest
            </p>
          </div>
          <button
            onClick={() =>
              document
                .getElementById("accordion-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="font-primary font-semibold tracking-wider mt-10 text-white border border-white px-4 py-2 rounded-full hover:bg-white hover:text-[rgb(110,97,70)] transition duration-300"
          >
            ↓ Scroll Down
          </button>
        </div>
      </section>

      {/* Accordion Section */}
      <section
        id="accordion-section"
        className="py-10 px-4 md:px-8 bg-primary-gray"
      >
        <div className="container mx-auto max-w-4xl">
          <DecorativeHeading text={"Explore Our Forest"} as="h2" />

          <div className="divide-y  rounded-xl bg-primary-gray2 shadow-md overflow-hidden">
            {accordionItems.map((item, index) => (
              <div key={index} className="group">
                <button
                  className="font-primary tracking-widest flex items-center justify-between w-full py-5 px-4 text-left text-white transition duration-200"
                  onClick={() =>
                    setActiveAccordion(activeAccordion === index ? null : index)
                  }
                >
                  <span className="text-md md:text-xl">{item.title}</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform duration-300 ${
                      activeAccordion === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={` px-4 pb-4 text-[#D1C8C1]  transition-all duration-300 ease-in-out ${
                    activeAccordion === index ? "block" : "hidden"
                  }`}
                >
                  {typeof item.content === "string"
                    ? item.content
                    : item.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Slider Section */}
      <section className="py-10 px-4 md:px-8 	bg-primary-gray2">
        <div className="container mx-auto">
          <DecorativeHeading text={"Forest Gallery"} as="h2" color="#fff" />

          <div className="min-w-[80vw] md:w-[100%] h-[70vh] mx-auto">
            <Swiper
              modules={[Pagination, Autoplay]}
              loop={true}
              autoplay={{ delay: 4000 }}
              pagination={{ clickable: true }}
              className="h-full"
            >
              {forestImages.map((image, index) => (
                <SwiperSlide key={index} className="h-full">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover rounded-xl shadow-lg cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full p-4">
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold z-10"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* FAQs */}
      <section className="py-10 px-4 md:px-8 	bg-[#D1C8C1]">
        <CommonFaqs faqs={forestWalkFaqs} />
      </section>
    </div>
  );
};

export default ForestWalkAndNatureTrails;
