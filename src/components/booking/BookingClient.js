"use client";
// src/components/BookingModal.js
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { phone } from "@/utills/constants";
import BookStay from "./BookStay";
import WhyChoose from "./WhyChoose";
import CommonFaqs from "@/common-components/faqs/CommonFaqs";
import { motion } from "framer-motion";
import Link from "next/link";
const THANKYOU_URL = "/thank-you";

const ADMIN_WHATSAPP = phone;

const bookingFaqs = [
  {
    question: "How can I book a resort near Ratapani jungle?",
    answer:
      "Use our online booking portal for instant hotel booking in Ratapani and secure your preferred dates.",
  },
  {
    question: "What is the Madhuban Eco Retreat price?",
    answer:
      "Prices vary by room type. Please check our booking portal for the latest Ratapani resort prices and seasonal offers.",
  },
  {
    question: "Can I book a hotel near Ratapani for family stays?",
    answer:
      "Yes, our family-friendly rooms are ideal for group stays, weekend getaways, and digital detox experiences.",
  },
  {
    question: "Are there hotels near Ratapani Wildlife Sanctuary?",
    answer:
      "Yes, Madhuban Eco Retreat is a top-rated eco-resort located close to Ratapani Wildlife Sanctuary, perfect for nature and wildlife enthusiasts.",
  },
];

const BookingClient = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Get URL parameters
  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");
  const adultsParam = searchParams.get("adults");
  const childrenParam = searchParams.get("children");
  const typeParam = searchParams.get("type");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    people_count: 1,
    room_interested: "",
    message: "",
  });

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  // Ref to store original URL
  const originalUrlRef = useRef("");
  useEffect(() => {
    if (showThankYou) {
      originalUrlRef.current =
        window.location.pathname + window.location.search;
      window.history.pushState({ thankyou: true }, "", THANKYOU_URL);
    }
  }, [showThankYou]);
  useEffect(() => {
    const handlePopState = (event) => {
      if (showThankYou) {
        setShowThankYou(false);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [showThankYou]);

  // Auto-fill form data from URL parameters
  useEffect(() => {
    if (checkInParam) {
      setCheckIn(new Date(checkInParam));
    }
    if (checkOutParam) {
      setCheckOut(new Date(checkOutParam));
    }
    if (adultsParam || childrenParam) {
      const adults = adultsParam ? parseInt(adultsParam) : 2;
      const children = childrenParam ? parseInt(childrenParam) : 0;
      setFormData((prev) => ({
        ...prev,
        people_count: adults + children,
      }));
    }
    if (typeParam && typeParam !== "all") {
      // Map accommodation type from BookingWidget to BookingModal
      const typeMapping = {
        cottage: "Safari Tent",
        tent: "Mud Houses",
        treehouse: "Pool Side Villa",
        camping: "Camping Tent",
        glamping: "Glamping Tents",
      };
      setFormData((prev) => ({
        ...prev,
        room_interested: typeMapping[typeParam] || typeParam,
      }));
    }
  }, [checkInParam, checkOutParam, adultsParam, childrenParam, typeParam]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Build WhatsApp URL
  const buildWhatsAppUrl = (phoneNumber, message) => {
    const encodedMessage = encodeURIComponent(message);
    // Try alternative URL format
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
  };

  //Function to restore original URL
  const restoreOriginalUrl = () => {
    if (originalUrlRef.current) {
      window.history.replaceState({}, "", originalUrlRef.current);
    } else {
      window.history.replaceState({}, "", pathname);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate dates
    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    if (checkIn >= checkOut) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!formData.room_interested) {
      setError("Please select an accommodation type.");
      return;
    }

    // Create WhatsApp message (minimal version to avoid length limits)
    const checkInSimple = checkIn.toISOString().split("T")[0]; // 2025-10-04
    const checkOutSimple = checkOut.toISOString().split("T")[0];

    const message = `Booking Request
${formData.name.trim()}
${formData.email.trim()}
${formData.phone.trim()}
${checkInSimple} to ${checkOutSimple}
${formData.people_count} guests
${formData.room_interested}`;

    // Build WhatsApp URL
    const whatsappUrl = buildWhatsAppUrl(ADMIN_WHATSAPP, message);

    //Show thank you popup (URL will update via useEffect)
    setShowThankYou(true);

    //Wait 2 seconds, then close popup and open WhatsApp
    setTimeout(() => {
      restoreOriginalUrl();
      setShowThankYou(false);

      // Open WhatsApp
      try {
        const whatsappWindow = window.open(
          whatsappUrl,
          "_blank",
          "noopener,noreferrer",
        );

        // Check if popup was blocked
        setTimeout(() => {
          if (
            !whatsappWindow ||
            whatsappWindow.closed ||
            typeof whatsappWindow.closed === "undefined"
          ) {
            setError(
              "Popup blocked! Please allow popups, or click the button below to try again.",
            );
            // Create fallback button
            const fallbackBtn = document.createElement("a");
            fallbackBtn.href = whatsappUrl;
            fallbackBtn.target = "_blank";
            fallbackBtn.rel = "noopener noreferrer";
            fallbackBtn.textContent = "📱 Click Here to Open WhatsApp";
            fallbackBtn.className =
              "block mt-4 w-full bg-[#25D366] text-white py-3 rounded-md hover:bg-[#128C7E] transition text-center font-semibold";

            const existingBtn = document.getElementById("whatsapp-fallback");
            if (existingBtn) existingBtn.remove();
            fallbackBtn.id = "whatsapp-fallback";

            const form = document.querySelector("form");
            if (form && form.parentElement) {
              form.parentElement.appendChild(fallbackBtn);
            }
          } else {
            // Success - show thank you message
            setSubmitted(true);
            console.log("WhatsApp opened successfully");
          }
        }, 2000);
      } catch (err) {
        console.error("Error opening WhatsApp:", err);
        setError(
          "Failed to open WhatsApp. Please try again or check your browser settings.",
        );
      }
    }, 3000);
  };

  const roomOptions = [
    { value: "Safari Tent", label: "Safari Tent" },
    { value: "Mud Houses", label: "Mud Houses" },
    { value: "Pool Side Villa", label: "Pool Side Villa" },
    { value: "Camping Tent", label: "Camping Tent" },
    { value: "Glamping Tents", label: "Glamping Tents" },
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

  return (
    <div className="min-h-screen pt-20 md:pt-40 pb-20 bg-[#b4a6811a] flex flex-col items-center justify-center ">
      {/* Thank You Page Popup - loads your actual thank-you page in iframe */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-2xl h-[80vh] max-h-[600px] overflow-hidden relative"
          >
            <iframe
              src={THANKYOU_URL}
              className="w-full h-full border-0"
              title="Thank You"
            />
          </motion.div>
        </div>
      )}

      <BookStay />

      <motion.div
        className="text-center w-full  pb-8     overflow-hidden px-2 flex flex-col justify-center items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <p className="heading2 font-bold md:font-semibold text-justify md:text-center  text-primary-gray2 px-4 mb-4">
          Check Ratapani resort price and Madhuban Eco Retreat price online and
          reserve your room today.
        </p>

        <div className="bg-[#D1C8C1] rounded-2xl p-6   md:mt-6 shadow-xl w-full max-w-2xl border border-[rgb(110,97,70)]/20">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-green-600 font-semibold text-xl mb-2">
                WhatsApp Opened Successfully!
              </h2>
              <p className="text-[rgb(110,97,70)] mb-4">
                Please check WhatsApp and send the pre-filled message to
                complete your booking.
              </p>
              <p className="text-sm text-[rgb(110,97,70)]/70">
                We'll get back to you within 5 minutes.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    people_count: 1,
                    room_interested: "",
                    message: "",
                  });
                  setCheckIn(null);
                  setCheckOut(null);
                }}
                className="mt-6 bg-[rgb(110,97,70)] text-white py-2 px-6 rounded-md hover:bg-[rgb(117,105,83)] transition"
              >
                Make Another Booking
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-2xl font-primary  text-[rgb(110,97,70)]">
                  Book Your Stay
                </h2>
                <p className="text-[rgb(110,97,70)]/80 text-sm">
                  We'll reach out within minutes via WhatsApp.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-sm mb-1 text-[rgb(110,97,70)]">
                    Enter your name.
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    placeholder="Your Name"
                    required
                    className="w-full p-3 border border-[rgb(110,97,70)]/30 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(110,97,70)]/40"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-[rgb(110,97,70)]">
                    Enter your email.
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Your Email"
                    required
                    className="w-full p-3 border border-[rgb(110,97,70)]/30 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(110,97,70)]/40"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-[rgb(110,97,70)]">
                    Enter your phone.
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    placeholder="Your Phone"
                    required
                    className="w-full p-3 border border-[rgb(110,97,70)]/30 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(110,97,70)]/40"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-[rgb(110,97,70)]">
                    How many people?
                  </label>
                  <input
                    type="number"
                    name="people_count"
                    min="1"
                    max="12"
                    value={formData.people_count}
                    onChange={handleChange}
                    className="w-full p-3 border border-[rgb(110,97,70)]/30 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(110,97,70)]/40"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1 text-[rgb(110,97,70)]">
                        Check-in Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-[rgb(110,97,70)]" />
                        </div>
                        <DatePicker
                          selected={checkIn}
                          onChange={(date) => setCheckIn(date)}
                          selectsStart
                          startDate={checkIn}
                          endDate={checkOut}
                          minDate={new Date()}
                          placeholderText="Select check-in date"
                          className="w-full pl-10 p-3 border border-[rgb(110,97,70)]/30 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(110,97,70)]/40"
                          dateFormat="MM/dd/yyyy"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-[rgb(110,97,70)]">
                        Check-out Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-[rgb(110,97,70)]" />
                        </div>
                        <DatePicker
                          selected={checkOut}
                          onChange={(date) => setCheckOut(date)}
                          selectsEnd
                          startDate={checkIn}
                          endDate={checkOut}
                          minDate={checkIn || new Date()}
                          placeholderText="Select check-out date"
                          className="w-full pl-10 p-3 border border-[rgb(110,97,70)]/30 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(110,97,70)]/40"
                          dateFormat="MM/dd/yyyy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1 text-[rgb(110,97,70)]">
                    Accommodation Type
                  </label>
                  <select
                    name="room_interested"
                    value={formData.room_interested}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-[rgb(110,97,70)]/30 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(110,97,70)]/40"
                  >
                    <option value="" disabled>
                      Select a room type
                    </option>
                    {roomOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <textarea
                    name="message"
                    value={formData.message}
                    placeholder="Message (optional)"
                    className="w-full p-3 border border-[rgb(110,97,70)]/30 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(110,97,70)]/40 min-h-28"
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[rgb(110,97,70)] text-white py-3 rounded-md hover:bg-[rgb(117,105,83)] transition "
              >
                Send via WhatsApp
              </button>

              <p className="text-center text-sm text-[rgb(110,97,70)]/70">
                Clicking submit will open WhatsApp with your booking details
                ready to send.
              </p>
            </form>
          )}
        </div>
        <Link
          href="/stay"
          className="flex justify-center w-full  mt-4 max-w-2xl p-6"
        >
          <button
            type="button"
            className="w-full sm:w-[100%] max-w-[670px] bg-[rgb(110,97,70)] text-white py-2  text-base md:text-lg rounded-md hover:bg-[rgb(117,105,83)] transition mt-5 "
          >
            Stay
          </button>
        </Link>
      </motion.div>
      <WhyChoose />
      <CommonFaqs faqs={bookingFaqs} bgColor="none" />
    </div>
  );
};

export default BookingClient;
