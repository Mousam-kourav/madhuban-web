"use client";

import React from "react";
// import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  MountainSnow,
  ChevronLeft,
  CalendarDays,
  Star,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StayWhyChooseUs from "@/components/stay/Stay-WhyChooseUs";
import CommonFaqs from "@/common-components/faqs/CommonFaqs";
import { accommodationsData } from "./Stay.functions";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

const getAccommodation = (slug) => {
  return accommodationsData.find((acc) => acc.slug === slug);
};

const AccommodationDetail = () => {
  const params = useParams();
  const { slug } = params;
  const accommodation = getAccommodation(slug);
  const randomImgUrl =
    accommodation?.galleryImages[
      Math.floor(Math.random() * accommodation.galleryImages.length)
    ];

  if (!accommodation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 text-center px-4">
        <MountainSnow size={64} className="text-green-700 mb-4" />
        <h1 className="text-4xl font-inter font-medium text-green-800 mb-2">
          Oops! Accommodation Not Found
        </h1>
        <p className="font-openSans text-lg text-gray-600 mb-6">
          We couldn't find the accommodation you were looking for.
        </p>
        <Link
          href="/stay"
          className="mt-[30px] font-primary inline-flex items-center bg-green-700 text-gray-500 font-medium py-3 px-6 rounded-md hover:bg-green-600 transition-colors duration-300"
        >
          <ChevronLeft size={20} className="mr-2" aria-label="Left" />
          Back to All Accommodations
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-stone-50 min-h-screen py-12 pt-20 md:pt-24 md:pt-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <Link
              href="/stay"
              className="inline-flex items-center font-semibold text-[rgb(110,97,70)] mt-8 transition-colors duration-300 group"
            >
              <ChevronLeft
                aria-label="left"
                size={20}
                className="font-primary  font-medium mr-1 group-hover:-translate-x-1 transition-transform duration-300"
              />
              Back to All Accommodations
            </Link>
          </div>

          <div className="bg-[#F5F5F5] rounded-xl shadow-xl overflow-hidden">
            <div className="md:flex md:items-stretch">
              <div className="md:w-1/2 h-auto">
                {accommodation.image.toLowerCase().endsWith(".mp4") ? (
                  <video
                    style={{ width: "100%", height: "100vh" }}
                    src={accommodation.image}
                    controls
                    // autoPlay
                    // loop
                    className="w-full object-cover md:min-h-[80vh]"
                    onError={(e) => {
                      e.target.onerror = null;
                      console.error(
                        "Error loading video:",
                        accommodation.image,
                      );
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={accommodation.image}
                    alt={accommodation.altText}
                    className="w-full h-full object-cover md:min-h-[400px]"
                  />
                )}
              </div>

              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between h-auto md:min-h-[400px]">
                <div>
                  <h1 className="heading1 font-primary  text-[rgb(110,97,70)] mb-3">
                    {accommodation.name}
                  </h1>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < Math.floor(accommodation.rating)
                            ? "text-yellow-500 fill-current"
                            : i < accommodation.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="ml-2 text-gray-600 text-sm">
                      ({accommodation.rating})
                    </span>
                  </div>

                  {accommodation?.descriptions?.map((des, i) => {
                    return (
                      <p
                        key={i}
                        className="text-[rgb(110,97,70)] mb-6  text-justify font-arial-narrow p-text"
                      >
                        {des}
                      </p>
                    );
                  })}

                  {accommodation.amenities &&
                    accommodation.amenities.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xl font-primary font-semibold text-primary-gray2 mb-2">
                          Amenities:
                        </h3>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-md md:text-lg">
                          {accommodation.amenities.map((amenity, index) => (
                            <li
                              key={index}
                              className="flex items-start font-primary  text-primary-gray2 p-text "
                            >
                              <Check
                                aria-label="check"
                                size={16}
                                className="text-primary-gray2 mr-2 mt-1"
                              />
                              {amenity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>

                <div className="mt-auto">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Heading */}
                    <h3 className="text-md font-semibold  text-primary-gray2  mb-2">
                      BOOK YOUR STAY
                    </h3>

                    {accommodation.bookingOptions.map((bookOpt, i) => {
                      return (
                        <div
                          key={i}
                          className="flex justify-between items-center w-full"
                        >
                          <p className=" text-sm  md:text-base font-bold text-primary-gray2">
                            • {bookOpt.optionName}: <br />
                            <span className="font-normal text-xs md:text-sm">
                              {bookOpt.optionDetail}
                            </span>
                          </p>
                          <div className="bg-[rgb(110,97,70)] text-white rounded-full  px-8 md:px-16 py-3 flex flex-col items-center">
                            <span className="text-sm font-bold">
                              Rs. {bookOpt.price}
                            </span>
                            <span className="text-xs">{bookOpt.rateUnit}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {accommodation.inclusions && (
                    <>
                      <div className="mb-4">
                        <div className="text-lg md:text-xl font-semibold text-primary-gray2 mb-2">
                          Inclusions
                        </div>
                        {accommodation.inclusions.map((inc, i) => {
                          return (
                            <p key={i} className="text-primary-gray2">
                              • {inc}
                            </p>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Show Camping Tent Packages Only if slug === 'camping-tent' */}

                  {accommodation.extraBedding && (
                    <div className="flex justify-between items-center">
                      <p className=" text-[rgb(110,97,70)] mb-2">
                        <strong className="  font-semibold">
                          Extra Bedding -{" "}
                        </strong>{" "}
                        {accommodation.extraBedding}
                      </p>
                    </div>
                  )}

                  {accommodation.capacity && (
                    <div className="flex justify-between items-center">
                      <p className="text-md text-[rgb(110,97,70)] mb-2">
                        <strong className="  font-semibold">Capacity:</strong>{" "}
                        {accommodation.capacity}
                      </p>
                    </div>
                  )}

                  <Link
                    href="/booking"
                    className="font-inter w-full flex items-center justify-center bg-[rgb(110,97,70)] text-white font-medium py-3 px-6 rounded-md hover:bg-[rgb(123,108,80)] p-text"
                  >
                    <CalendarDays
                      size={20}
                      className="mr-2"
                      aria-label="calender"
                    />
                    Book Your Stay
                  </Link>
                </div>
              </div>
            </div>

            {accommodation.galleryImages &&
              accommodation.galleryImages.length > 0 && (
                <div className="p-6 md:p-8 border-t border-gray-200">
                  <DecorativeHeading
                    text={"Gallery"}
                    as="h2"
                    textClasses={"w-60"}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {accommodation.galleryImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${accommodation.name} gallery ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg shadow-sm"
                      />
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
      <StayWhyChooseUs
        points={accommodation?.whyChoosePoints}
        title={accommodation.whyChooseTitle}
        imageUrl={randomImgUrl}
      />
      <CommonFaqs faqs={accommodation.faqs} heading={accommodation.faqsTitle} />
    </>
  );
};

export default AccommodationDetail;
