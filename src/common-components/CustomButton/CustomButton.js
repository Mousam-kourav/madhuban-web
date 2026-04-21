"use client";

import React from "react";

const CustomButton = ({
  children,
  color = "#6e6146ff",
  type = "button",
  height,
  width,
  borderRadius = "12px",
  onClick,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  loading = false,
  className = "",
  ariaLabel,
  sx = {},
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      style={{
        backgroundColor: color,
        borderRadius,
        height,
        width: fullWidth ? "100%" : width,
        fontFamily: "dm_sans",
        ...sx,
      }}
      className={`
        inline-flex items-center justify-center gap-2
        cursor-pointer
        py-3 font-normal  
        leading-[30px] whitespace-nowrap
        rounded-lg shadow 
        transition-all duration-300 ease-in-out
        text-[#D1C8C1]
        hover:scale-[1.03] hover:opacity-90
        disabled:opacity-60 disabled:cursor-not-allowed

        ${className}
      `}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin"></span>
      )}

      {startIcon && <span className="flex items-center">{startIcon}</span>}

      <span>{children}</span>

      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default CustomButton;
