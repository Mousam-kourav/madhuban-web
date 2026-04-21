"use client";

import Link from "next/link";
import React from "react";

const CustomLinkBtn = ({
  href = "#",
  children,
  color = "#6e6146ff",
  height = "50px",
  width,
  borderRadius = "12px",
  textColor = "#FFFFFF",
  fullWidth = false,
  startIcon,
  endIcon,
  className = "",
  ariaLabel,
  loading = false,
}) => {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center gap-2
        px-6 font-medium text-white
        text-[14px]  sm:text-[16px]  md:text-[18px]  lg:text-[18px] leading-[25px] whitespace-nowrap
        transition-all duration-300 ease-in-out
        hover:opacity-90 hover:shadow-md
        cursor-pointer
        ${className}
      `}
      style={{
        backgroundColor: color,
        borderRadius,
        color: textColor,
        height,
        width: fullWidth ? "100%" : width,
        fontFamily: "Manrope",
      }}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
      )}
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </Link>
  );
};

export default CustomLinkBtn;
