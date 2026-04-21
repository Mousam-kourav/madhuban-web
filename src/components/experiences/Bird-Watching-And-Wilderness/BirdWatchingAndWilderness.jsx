"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";
import CommonFaqs from "@/common-components/faqs/CommonFaqs";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

const BirdWatchingAndWilderness = () => {
  // Track active main accordion index
  const [activeAccordion, setActiveAccordion] = useState(0); // First expanded by default
  // Track active nested accordion index for the first accordion item
  const [activeNestedAccordion, setActiveNestedAccordion] = useState(null);

  const forestImages = [
    {
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/birds-watch/best-wildlife-view.jpg",
      alt: "Forest View 1",
    },
    {
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/birds-watch/bird-watching-with-guides.jpg",
      alt: "Forest View 1",
    },
    {
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/birds-watch/bird2.jpg",
      alt: "Forest View 2",
    },
    {
      url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/birds-watch/bird3.jpg",
      alt: "Forest View 3",
    },
  ];

  const accordionItems = [
    {
      title: "Bird Watching & Wilderness",
      content: (
        <>
          <p className="mb-4 text-justify text-white">
            Escape into the peaceful wilderness of Ratapani with our Bird
            Watching & Wilderness experience at Madhuban Eco Retreat. Surrounded
            by untouched forest, this region is home to over 70+ species of
            native and migratory birds — making it one of the best bird-watching
            locations near Bhopal.
          </p>
          <p className="mb-4 text-justify text-white">
            Our guided birding sessions take place during early mornings and
            golden-hour evenings, when the forest is most alive. With no urban
            noise and minimal human disturbance, you can witness the beauty of
            birds in their natural habitat — from the graceful Indian Paradise
            Flycatcher to colorful orioles, kingfishers, drongos, peacocks, and
            seasonal visitors.
          </p>
          <p className="mb-4 text-justify text-white">
            If you’re seeking a silent wilderness experience, a nature-based
            activity for families, or an ideal spot for wildlife photography,
            this trail offers a rare chance to slow down, observe, and connect
            deeply with the forest.
          </p>

          {/* Nested Accordion inside first main accordion item */}
          <div className=" divide-y rounded-lg bg-primary-gray shadow-inner overflow-hidden">
            {[
              {
                title: "What to Expect ",
                content: (
                  <ul className="list-disc list-inside text-primary-gray2  space-y-2">
                    <li>Guided sessions at sunrise and sunset</li>
                    <li>Spot native & migratory birds across forest zones</li>
                    <li>Learn bird calls, seasonal patterns & behaviors</li>
                    <li>Low-impact wilderness exploration</li>
                    <li>Photography-friendly viewing points</li>
                  </ul>
                ),
              },

              {
                title: "Perfect For",
                content: (
                  <ul className="list-disc list-inside text-primary-gray2  space-y-2">
                    <li>Bird watchers & ornithologists</li>
                    <li>Wildlife photographers</li>
                    <li>Nature lovers & quiet travelers</li>
                    <li>Families & students</li>
                    <li>Anyone exploring eco-tourism near Bhopal</li>
                  </ul>
                ),
              },
              {
                title: "Let Nature Surprise You",
                content: (
                  <>
                    <p className="text-primary-gray2">
                      Immerse yourself in the sounds of wings and the calm of
                      the forest.—{" "}
                    </p>
                    <Link
                      href="/booking"
                      className="list-disc list-inside underline text-primary-gray2  space-y-2"
                    >
                      Book Your Bird Watching Experience Now
                    </Link>
                  </>
                ),
              },
            ].map((item, idx) => (
              <div key={idx} className="group">
                <button
                  className="flex items-center justify-between w-full py-3 px-4 text-left text-primary-gray2 font-medium transition duration-200"
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

  const birdWatchingFaqs = [
    {
      question: "What birds can I spot in Ratapani during bird watching?",
      answer:
        "You may see the paradise flycatcher, golden oriole, kingfisher, drongo, peacock, woodpeckers, and various migratory species.",
    },
    {
      question: "Is this the best bird watching spot near Bhopal?",
      answer:
        "Yes. Madhuban Eco Retreat is considered one of the top bird-watching zones near Bhopal due to its peaceful forest surroundings and rich biodiversity.",
    },
    {
      question: "Are the bird watching sessions guided?",
      answer:
        "Yes, all sessions are led by experienced naturalists familiar with local bird species and their behavior.",
    },
    {
      question: "What time is ideal for bird watching?",
      answer:
        "Early mornings and sunset hours are the most active and recommended times for bird watching.",
    },
    {
      question: "Is bird watching suitable for children and beginners?",
      answer:
        "Absolutely. The sessions are easy, educational, and enjoyable for all age groups.",
    },
    {
      question: "Do I need binoculars or a camera?",
      answer:
        "You may bring your own binoculars or camera, but even without equipment, the bird watching experience remains enriching.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#b4a681d8]">
      {/* Hero Section */}
      <section className="relative h-[100vh] w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src={
              "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/experiences/birds-watch/wilderness.mp4"
            }
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-opacity-50 flex flex-col items-center justify-center text-white px-4">
          <h1 className="bannerHeading font-primary mb-4">
            Bird Watching & Wilderness
          </h1>
          <p className="bannerSubHeading">
            Listen to Wings, Follow the Forest, Feel the Silence
          </p>
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
          <DecorativeHeading text={"Explore The Nature"} as="h2" />

          <div className="divide-y rounded-xl bg-primary-gray2 shadow-md overflow-hidden">
            {accordionItems.map((item, index) => (
              <div key={index} className="group bg-primary-gray2">
                <button
                  className="font-primary  flex items-center justify-between w-full py-5 px-4 text-left text-white transition duration-200"
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
                  className={`px-4 pb-4 text-[rgb(110,97,70)] transition-all duration-300 ease-in-out ${
                    activeAccordion === index ? "block" : "hidden"
                  }`}
                >
                  {
                    typeof item.content === "string"
                      ? item.content
                      : item.content /* support nested JSX */
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Slider Section */}
      <section className="py-10 px-4 md:px-8 	bg-primary-gray2">
        <div className="container mx-auto">
          <DecorativeHeading text={"Birds Gallery"} as="h2" color="#fff" />

          <div className="w-[90%] md:w-[100%] h-[70vh] mx-auto">
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
                    className="w-full h-full object-cover rounded-xl shadow-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <CommonFaqs
        heading="FAQs – Bird Watching & Wilderness"
        faqs={birdWatchingFaqs}
      />
    </div>
  );
};

export default BirdWatchingAndWilderness;
