"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { phone } from "@/utills/constants";
import "./StickyContactForm.css";

const ADMIN_WHATSAPP = phone;

const StickyContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const message = `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Message: ${data.message}
    `;

    const whatsappURL = `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP}&text=${encodeURIComponent(
      message
    )}`;

    try {
      const whatsappWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      setTimeout(() => {
        if (
          !whatsappWindow ||
          whatsappWindow.closed ||
          typeof whatsappWindow.closed === "undefined"
        ) {
          alert(
            "Popup blocked! Please allow popups, or copy this link and open manually: " +
              whatsappURL
          );
        } else {
          reset();
          alert(
            "WhatsApp opened successfully! Please send the pre-filled message."
          );
        }
      }, 1000);
    } catch (err) {
      console.error("Error opening WhatsApp:", err);
      alert(
        "Failed to open WhatsApp. Please try again or check your browser settings."
      );
    }
  };

  return (
    <div className="sticky-contact-form rounded-2xl shadow-lg p-5 py-6 bg-[#6e6146]">
      {/* Header */}
      <h2 className="text-xl font-semibold text-white text-center mb-1 font-primary">
        Send Us a Message
      </h2>
      <p className="text-xs text-gray-200 mb-4 text-center">
        Your message goes directly to WhatsApp.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Name */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Your Full Name"
            autoComplete="off"
            className="sticky-input"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-300 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <input
            type="email"
            placeholder="Your Email"
            autoComplete="off"
            className="sticky-input"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-300 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Your Phone Number"
            autoComplete="off"
            className="sticky-input"
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
                message: "Must be at least 10 digits",
              },
              maxLength: {
                value: 10,
                message: "Must be 10 digits",
              },
            })}
          />
          {errors.phone && (
            <p className="text-red-300 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Message */}
        <div className="mb-4">
          <textarea
            placeholder="Your Message"
            autoComplete="off"
            rows={3}
            className="sticky-input sticky-textarea"
            {...register("message", {
              required: "Message is required",
            })}
          ></textarea>
          {errors.message && (
            <p className="text-red-300 text-xs mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="sticky-submit-btn"
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
      </form>

      <p className="text-[11px] text-gray-300 mt-3 text-center">
        We promise to respond within 24 hours.
      </p>
    </div>
  );
};

export default StickyContactForm;