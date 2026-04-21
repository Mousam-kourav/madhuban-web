"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import { phone } from "@/utills/constants";
import CommonFaqs from "@/common-components/faqs/CommonFaqs";
import { motion } from "framer-motion";
const THANKYOU_URL = "/thank-you";
import { Select, MenuItem, FormControl } from "@mui/material";
import { Users, Phone, User } from "lucide-react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Features from "./Features";
import LuxeryStay from "./LuxeryStay";
import Map from "./Map";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import "./Booking.css";
import Image from "next/image";

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

const NewBooking = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [guests, setGuests] = useState("1 Guest");
  const [checkIn, setCheckIn] = useState(dayjs());

  // Get URL parameters
  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");
  const adultsParam = searchParams.get("adults");
  const childrenParam = searchParams.get("children");
  const typeParam = searchParams.get("type");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  // const [checkIn, setCheckIn] = useState(null);
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
      setCheckIn(dayjs(checkInParam));
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
    if (!checkIn) {
      setError("Please select check-in date");
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    // Create WhatsApp message (minimal version to avoid length limits)
    const checkInSimple = checkIn.toISOString().split("T")[0]; // 2025-10-04

    const message = `Booking Request
${formData.name.trim()}
${formData.phone.trim()}
${checkInSimple}
${guests}`;

    // Build WhatsApp URL
    const whatsappUrl = buildWhatsAppUrl(ADMIN_WHATSAPP, message);

    //Show thank you popup (URL will update via useEffect)
    // setShowThankYou(true);

    //Wait 2 seconds, then close popup and open WhatsApp
    setTimeout(() => {
      restoreOriginalUrl();
      // setShowThankYou(false);

      // Open WhatsApp
      try {
        const whatsappWindow = window.open(
          whatsappUrl,
          "_blank",
          "noopener,noreferrer",
        );

        // Check if popup was blocked
        // setTimeout(() => {
        //   if (
        //     !whatsappWindow ||
        //     whatsappWindow.closed ||
        //     typeof whatsappWindow.closed === "undefined"
        //   ) {
        //     setError(
        //       "Popup blocked! Please allow popups, or click the button below to try again.",
        //     );
        //     // Create fallback button
        //     const fallbackBtn = document.createElement("a");
        //     fallbackBtn.href = whatsappUrl;
        //     fallbackBtn.target = "_blank";
        //     fallbackBtn.rel = "noopener noreferrer";
        //     fallbackBtn.textContent = "📱 Click Here to Open WhatsApp";
        //     fallbackBtn.className =
        //       "block mt-4 w-full bg-[#25D366] text-white py-3 rounded-md hover:bg-[#128C7E] transition text-center font-semibold";

        //     const existingBtn = document.getElementById("whatsapp-fallback");
        //     if (existingBtn) existingBtn.remove();
        //     fallbackBtn.id = "whatsapp-fallback";

        //     const form = document.querySelector("form");
        //     if (form && form.parentElement) {
        //       form.parentElement.appendChild(fallbackBtn);
        //     }
        //   } else {
        //     // Success - show thank you message
        //     setSubmitted(true);
        //     console.log("WhatsApp opened successfully");
        //   }
        // }, 2000);
      } catch (err) {
        console.error("Error opening WhatsApp:", err);
        setError(
          "Failed to open WhatsApp. Please try again or check your browser settings.",
        );
      }
    }, 100);
  };

  return (
    <>
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
      <div className="bg-[#b4a6811a]">
        <main className="relative min-h-screen flex flex-col items-center justify-center pt-50 pb-24 overflow-hidden  ">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 hero-overlay z-10"></div>
            <Image
              width={1200}
              height={400}
              alt="Lush tropical jungle retreat with luxury wooden cabins"
              className="w-full h-full object-cover"
              src="https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/booking/madhuban-eco-retreat-bhopal-image.avif"
            />
          </div>
          <div className="relative z-20 max-w-4xl mx-auto px-6 w-full flex flex-col items-center text-center">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-white text-white text-xs font-bold uppercase tracking-widest mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                </span>
                Now Open for Bookings
              </div>
              <div className="flex justify-center">
                <h1 className="bannerHeading primary-font-family text-center  text-white md:w-[70%]  mb-6 ">
                  Escape to Ratapani’s{" "}
                  <span className="text-primary text-mask-nature heading-glow font-serif-luxury">
                    Premier
                  </span>{" "}
                  Eco-Luxury Retreat
                </h1>
              </div>
              <p className="text-sm md:text-xl text-white/80 font-light leading-relaxed max-w-2xl mx-auto">
                Experience nature like never before. Immerse yourself in the
                heart of the Tiger Reserve, just 1 hour from the bustle of
                Bhopal.
              </p>
            </div>
            <div className="mt-12 glass rounded-3xl p-8 md:p-10 max-w-3xl mx-auto shadow-2xl relative">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-green-500/10 blur-3xl"></div>

              <div className="space-y-1 mb-8">
                <h3 className="text-xl text-white font-bold">
                  Plan Your Nature Getaway
                </h3>
                <p className="text-sm text-white">
                  Fill in the details below to receive a personalized quote.
                </p>
              </div>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 bookingForm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                >
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold tracking-widest text-white uppercase ml-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white z-10" />
                      <input
                        name="name"
                        type="text"
                        placeholder="Your name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-(--primaryGray2) focus:bg-white/10 transition-all text-white"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold tracking-widest text-white uppercase ml-1">
                      WhatsApp Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white z-10" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-(--primaryGray2) focus:bg-white/10 transition-all text-white"
                        onChange={(e) => {
                          const valueStr = e.target.value.replace(/\s/g, "");
                          if (
                            valueStr.length <= 13 &&
                            /^\+?\d*$/.test(valueStr)
                          ) {
                            handleChange(e);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold tracking-widest text-white uppercase ml-1">
                      Guests
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white z-10 pointer-events-none" />
                      <FormControl fullWidth>
                        <Select
                          name="guests"
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          displayEmpty
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid #fff",
                            borderRadius: "0.75rem",
                            height: "56px",
                            paddingLeft: "32px",
                            fontSize: "0.875rem",
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&.Mui-focused": { border: "1px solid #fff" },
                            transition: "all 0.2s",
                            color: "white",
                            "& .MuiSelect-icon": {
                              color: "rgba(255,255,255,0.3)",
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              className: "mui-paper-glass",
                              sx: {
                                marginTop: "8px",
                                "& .MuiMenuItem-root": {
                                  fontSize: "0.875rem",
                                  paddingY: "12px",
                                  "&.Mui-selected": {
                                    backgroundColor: "var(--primary-gray2)",
                                    color: "#fff",
                                    fontWeight: "700",
                                  },
                                },
                              },
                            },
                            MenuListProps: {
                              sx: {
                                maxHeight: "200px",
                                overflowY: "auto",
                                scrollbarColor:
                                  "rgba(255, 255, 255, 0.3) transparent",
                                "&::-webkit-scrollbar": {
                                  width: "6px",
                                },
                                "&::-webkit-scrollbar-track": {
                                  background: "transparent",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                                  borderRadius: "3px",
                                },
                              },
                            },
                          }}
                        >
                          {Array.from({ length: 10 }, (_, i) => (
                            <MenuItem key={i} value={`${i + 1} Guest`}>
                              {i + 1} Guest
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold tracking-widest text-white uppercase ml-1">
                      Check-In
                    </label>
                    <div className="relative">
                      <DatePicker
                        value={checkIn}
                        onChange={(newValue) => setCheckIn(newValue)}
                        format="DD / MM / YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            placeholder: "Select Date",
                            sx: {
                              "& .MuiPickersInputBase-root": {
                                color: "#fff",
                                borderRadius: "14px",
                                border: "1px solid #fff",
                                "&:hover": {
                                  border: "1px solid #fff",
                                },
                                "&.Mui-focused": {
                                  border: "1px solid #fff",
                                },
                              },
                              "& .MuiInputBase-root": {
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid #fff",
                                borderRadius: "0.75rem",
                                height: "56px",
                                fontSize: "0.875rem",
                                color: "#fff",
                                paddingLeft: "8px",
                                transition: "all 0.2s",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                                border: "1px solid #fff",
                              },
                              "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                                color: "#fff",
                                fontSize: "1.25rem",
                              },
                            },
                          },
                          popper: {
                            sx: {
                              "& .MuiPaper-root": {
                                className: "mui-paper-glass",
                              },
                            },
                          },
                          desktopPaper: {
                            className: "mui-paper-glass",
                          },
                          mobilePaper: {
                            className: "mui-paper-glass",
                          },
                        }}
                      />
                    </div>
                  </div>

                  <button className="md:col-span-2 group flex items-center cursor-pointer justify-center gap-3 w-full bg-[#25D366]  text-white font-black text-sm tracking-widest py-5 rounded-xl transition-all hover:scale-101">
                    <WhatsAppIcon className="w-5 h-5 " />
                    SEND BY WHATSAPP
                  </button>
                  {error && (
                    <p className="md:col-span-2 text-red-500 text-sm font-semibold text-center">
                      {error}
                    </p>
                  )}
                  <p className="md:col-span-2 text-[10px] font-bold tracking-widest text-white uppercase">
                    Clicking submit opens WhatsApp with your details ready to
                    send.
                  </p>
                </form>
              </LocalizationProvider>
            </div>
          </div>
        </main>
        <Features />
        <LuxeryStay />
        <Map />
        <CommonFaqs faqs={bookingFaqs} bgColor="none" />
      </div>
    </>
  );
};

export default NewBooking;
