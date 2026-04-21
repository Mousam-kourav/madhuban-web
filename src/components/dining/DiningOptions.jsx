import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import React from "react";

const DiningOptions = () => {
  return (
    <section className="flex flex-col items-center bg-primary-gray2 w-full">
      <div className="max-w-7xl">
        <section className=" py-8 px-4 ">
          <DecorativeHeading
            text={"Buffet & Dining Options Near Ratapani"}
            as="h2"
            color="#fff"
          />

          <div className="flex flex-col gap-4">
            <p className="p-text text-justify text-white md:text-center  text-center">
              Guests can enjoy set meals, homestyle buffets on weekends, and
              carefully curated dishes made with ingredients harvested from our
              own gardens. If you’re searching for the best dinner in Ratapani,
              healthy lunch options, or a wholesome dining experience inside the
              jungle, Madhuban’s kitchen offers a memorable culinary journey.
            </p>
          </div>
        </section>
      </div>
    </section>
  );
};

export default DiningOptions;
