"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { IoLocation } from "react-icons/io5";
import { IoCall } from "react-icons/io5";
import { IoMail } from "react-icons/io5";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { TbBrandYoutubeFilled } from "react-icons/tb";
import { FaLinkedin } from "react-icons/fa6";
import "./contactPage.css";
import {
  facebook,
  gmail,
  instagram,
  linkedin,
  phone,
  youtube,
} from "@/utills/constants";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

const ADMIN_WHATSAPP = phone;

export default function ContactPage2() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // 🔥 Example: WhatsApp redirect
    const message = `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Message: ${data.message}
    `;

    const whatsappURL = `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP}&text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappURL, "_blank");

    try {
      const whatsappWindow = window.open(
        whatsappURL,
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
          alert(
            "Popup blocked! Please allow popups, or copy this link and open manually: " +
              whatsappURL,
          );
        } else {
          reset();
          alert(
            "WhatsApp opened successfully! Please send the pre-filled message.",
          );
        }
      }, 1000);
    } catch (err) {
      console.error("Error opening WhatsApp:", err);
      alert(
        "Failed to open WhatsApp. Please try again or check your browser settings.",
      );
    }
  };

  return (
    <section className="bg-[#f7f5f0] pt-25 md:pt-40 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <div className="text-center mb-4 md:mb-14">
          <DecorativeHeading text={"Contact Us"} as="h1" />

          <p className="text-gray-700 text-justify md:text-center p-text max-w-3xl mx-auto">
            Whether you’re planning a peaceful retreat or seeking information
            about our eco tourism experiences, our team at{" "}
            <span className="font-semibold">Madhuban Eco Retreat</span> is here
            to assist you.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE – CONTACT INFO */}
          <div className="space-y-8">
            {/* Description */}
            <p className="text-gray-700 text-justify md:text-center p-text">
              Nestled on the edge of the Ratapani Wildlife Sanctuary, our nature
              resort near Ratapani is the perfect escape into nature and an
              ideal digital detox retreat.
            </p>

            {/* Location */}
            <div>
              <h3 className="text-lg md:text-xl flex items-center gap-1  text-primary-gray2 mb-2 font-primary">
                <IoLocation /> Location
              </h3>
              <p className="text-gray-700">
                Salkanpur, Road, Dongri, Near Ratapani Wildlife Sanctuary,
                <br />
                Bhopal, Madhya Pradesh, India – 466446
              </p>
              <p className="text-sm text-gray-600 mt-1">
                (Exact location shown on the map below)
              </p>
            </div>

            {/* Call / WhatsApp */}
            <div>
              <h3 className="text-lg md:text-xl flex items-center gap-1  text-primary-gray2 mb-2 font-primary">
                <IoCall /> Call / WhatsApp
              </h3>
              <p className="text-gray-700 font-medium">+{phone}</p>
              <p className="p-text text-gray-600">
                We’re just a message away! Send us a WhatsApp message and we’ll
                respond within 24 hours. Perfect for resorts near Bhopal for day
                outing inquiries.
              </p>
            </div>

            {/* Email */}
            <div>
              <h3 className="text-lg md:text-xl flex items-center gap-1  text-primary-gray2 mb-2 font-primary">
                <IoMail /> Email
              </h3>
              <p className="text-gray-700 p-text">{gmail}</p>
              <p className=" text-gray-600 p-text">
                Prefer email? Write to us anytime and our team will get back to
                you promptly.
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg md:text-xl   text-primary-gray2  font-primary">
                Follow Us on Social Media
              </h3>
              <p className="text-gray-600 p-text">
                Stay connected with us for the latest updates, offers, and
                glimpses of life at Madhuban Eco Retreat.
              </p>
              <div className="flex gap-4 text-gray-700 mt-4">
                <Link href={facebook} className="text-2xl text-primary-gray2">
                  <FaFacebookSquare />
                </Link>
                <Link href={instagram} className="text-2xl text-primary-gray2">
                  <FaSquareInstagram />
                </Link>
                <Link href={youtube} className="text-2xl text-primary-gray2">
                  <TbBrandYoutubeFilled />
                </Link>
                <Link href={linkedin} className="text-2xl text-primary-gray2">
                  <FaLinkedin />
                </Link>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 rounded-xl bg-[#6e6146]/10 p-6">
              <h3 className="text-base md:text-2xl  text-primary-gray2 mb-2 font-primary">
                Looking for the Best Weekend Digital Detox Stay Near Ratapani?
              </h3>
              <p className="text-primary-gray2 p-text">
                Madhuban Eco Retreat is Here!
              </p>

              <p className="text-gray-700 mb-4 p-text">
                Escape the city, immerse yourself in nature, and rejuvenate your
                mind and body.
              </p>
              <Link
                href="/booking"
                className="inline-block rounded-full bg-[#6e6146] px-6 py-3 text-white font-semibold hover:bg-[#5b503a] transition "
              >
                Book Now
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE – CONTACT FORM */}
          <div
            className=" rounded-2xl shadow-lg p-4 md:p-8  bg-[#6e6146]"
            style={{ height: "fit-content" }}
          >
            <h2 className="heading1 text-center  font-semibold text-white mb-2 font-primary">
              Send Us a Message
            </h2>
            <p className="text-gray-200 mb-6  text-center">
              Your message goes directly to WhatsApp.
            </p>

            <div className="contact-form ">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-group font-inter">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Full Name"
                    autoComplete="off"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="form-group font-inter">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    autoComplete="off"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div className="form-group  font-inter">
                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Your Phone Number"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numbers are allowed",
                      },
                      minLength: {
                        value: 10,
                        message: "Phone number must be at least 10 digits",
                      },
                      maxLength: {
                        value: 10,
                        message: "Phone number must be 10 digits",
                      },
                    })}
                  />
                  {errors.phone && (
                    <p className=" text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <div className="form-group font-inter">
                  <textarea
                    name="message"
                    autoComplete="off"
                    placeholder="Your Message"
                    {...register("message", {
                      required: "Message is required",
                    })}
                  ></textarea>
                  {errors.message && (
                    <p className=" text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="submit-btn font-arial-narrow text-[rgb(110,97,70)] font-primary"
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
              </form>
            </div>

            <p className="text-sm text-white mt-4 text-center">
              We promise to respond within 24 hours.
            </p>
          </div>
        </div>

        {/* MAP SECTION */}
        <div className="mt-16 text-center">
          <DecorativeHeading text={"Find Us Here"} as="h2" />
          <p className="mb-4 text-gray-700 p-text">
            Explore our beautiful location near Ratapani Wildlife Sanctuary. The
            map below will help you find us easily and plan your visit.
          </p>

          <div className="w-full h-[400px] rounded-xl overflow-hidden shadow">
            <iframe
              title="Madhuban Resort Location"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7356.4265978489275!2d77.490283!3d22.794559!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397db52b7cf3a4f1%3A0xb82cef7e7d9cfa61!2sMadhuban%20Resort%20By%20Somaiya!5e0!3m2!1sen!2sin!4v1747417125028!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
