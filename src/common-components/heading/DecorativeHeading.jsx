import React from "react";

const DecorativeHeading = ({
  as = "h2",
  text,
  color = "#6e6146",
  textClasses,
  subheading = "",
  subheadingAs = "p",
}) => {
  const Tag = as;
  const SubheadingTag = subheadingAs;
  return (
    <div className="group flex flex-col justify-center items-center">
      <div className="relative flex flex-col items-center justify-center  w-fit text-center">
        <Tag
          className={`font-primary heading1   mb-6 text-center ${textClasses}`}
          style={{ color }}
        >
          {text}
        </Tag>
        <div
          className={
            " flex items-center justify-center gap-2 cursor-pointer py-4 absolute bottom-0 w-full"
          }
        >
          {/* Left line */}
          <div
            className={`h-[2px]  transition-all duration-800 ease-in-out w-[30%] group-hover:w-full `}
            style={{
              backgroundColor: color,
            }}
          />

          {/* Left decorative end */}
          <div className="flex items-center gap-1">
            <div
              className={`w-1 h-1 md:w-1.5 md:h-1.5   rotate-45 transition-colors duration-300 group-hover:bg-divider-hover`}
              style={{
                backgroundColor: color,
              }}
            />
          </div>

          {/* Center diamond */}
          <div className="relative flex items-center justify-center">
            <div
              className={`w-2 h-2 md:w-3 md:h-3  rotate-45 transition-all duration-300 group-hover:bg-divider-hover group-hover:scale-110`}
              style={{
                backgroundColor: color,
              }}
            />
            <div className="absolute w-1.5 h-1.5 bg-background rotate-45" />
          </div>

          {/* Right decorative end */}
          <div className="flex items-center gap-1">
            <div
              className={`w-1 h-1 md:w-1.5 md:h-1.5   rotate-45 transition-colors duration-300 group-hover:bg-divider-hover`}
              style={{
                backgroundColor: color,
              }}
            />
          </div>

          {/* Right line */}
          <div
            className={`h-[2px] bg-[${color}]  transition-all duration-800 w-[30%] ease-in-out group-hover:w-full`}
            style={{
              backgroundColor: color,
            }}
          />
        </div>
      </div>
      {subheading && (
        <SubheadingTag
          className="heading2 text-gray-400 mt-2 text-center"
          style={{ color }}
        >
          {subheading}
        </SubheadingTag>
      )}
    </div>
  );
};

export default DecorativeHeading;
