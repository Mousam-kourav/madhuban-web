module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        max640: { max: "640px" },
        max500: { max: "500px" },
        "max-sm": { max: "640px" },
        "max-Xsm": { max: "400px" },
        "max-340": { max: "340px" },
        "max-367": { max: "367px" },
      },
      colors: {
        green: {
          800: "#2D5F2D",
          700: "#3A6B35",
          600: "#4A8B40",
          500: "#5BA84C",
          400: "#79B86B",
          300: "#99CB8F",
          200: "#BBDDB4",
          100: "#DDEED9",
          50: "#F2F8F0",
        },
        brown: {
          800: "#8B5A2B",
          700: "#9C6A3C",
          600: "#AD7B4D",
          500: "#BD8C5E",
          400: "#CA9F77",
          300: "#D7B291",
          200: "#E4C6B0",
          100: "#F1D9CA",
          50: "#F8ECE4",
        },
        stone: {
          900: "#28241F",
          800: "#3C3730",
          700: "#504A41",
          600: "#655D52",
          500: "#7A7063",
          400: "#8F8474",
          300: "#A59985",
          200: "#BAAD97",
          100: "#D0C2A8",
          50: "#F5F0E8",
        },
        title: "rgb(154, 136, 100)",
      },
      fontFamily: {
        // Default font families
        poppins: ["Poppins", "sans-serif"], // custom "font-poppins"
        openSans: ["Open Sans", "sans-serif"], // custom "font-openSans"
        inter: ["Inter", "sans-serif"], // custom "font-inter"
        // "sitka-banner": ['"Sitka Banner"', "serif"], // Quotes needed because of space in name
        "arial-narrow": ['"Arial Narrow"', "sans-serif"], // custom "font-cinzel"
      },

      boxShadow: {
        subtle: "0 2px 10px rgba(0, 0, 0, 0.05)",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
