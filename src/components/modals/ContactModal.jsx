"use client";
import { Modal, Fade, Box } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdCloseCircle } from "react-icons/io";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { phone } from "@/utills/constants";
import "./ContactModal.css";

const ADMIN_WHATSAPP = phone;

const ContactModal = () => {
  const COOKIE_NAME = "contact_popup_hidden";
  const [open, setOpen] = useState(false);
  const pathName = usePathname();

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

  useEffect(() => {
    const isHidden = Cookies.get(COOKIE_NAME);

    if (!isHidden) {
      setTimeout(() => {
        if (pathName !== "/contact-us") {
          setOpen(true);
        }
      }, 10000);
    }
  }, []);

  const handleClose = () => {
    // hide popup for 1 day
    Cookies.set(COOKIE_NAME, "true", { expires: 1 });
    setOpen(false);
  };

  if (!open) return null;

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => {}}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          className="rounded-2xl contactModal"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "85%", md: "30%" },
            boxShadow: 24,
            border: "none",
            outline: "none",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: 0,
              fontSize: "30px",
              cursor: "pointer",
              color: "white",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "rotate(90deg)",
              },
            }}
            onClick={handleClose}
          >
            <IoMdCloseCircle />
          </Box>
          <div className="rounded-2xl shadow-lg p-2 py-4 md:p-8 bg-[#6e6146] ">
            <h2 className="heading1 font-semibold text-white text-center mb-1 font-primary">
              Send Us a Message
            </h2>
            <p className="p-text text-gray-200 mb-1 md:mb-4 text-center">
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

            <p className="text-sm text-white md:mt-4 text-center">
              We promise to respond within 24 hours.
            </p>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ContactModal;
