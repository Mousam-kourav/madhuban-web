"use client"
import { IoMdAdd } from "react-icons/io";
import { FaMinus } from "react-icons/fa6";
import { useState } from "react";

const CommonFaq = ({ faqData, title }) => {
  const [expanded, setExpanded] = useState(null);
  const handleChange = (index) => {
    setExpanded(expanded === index ? null : index);
  };
  return (
    <div className="custom-container py-7 ">
      <div className='flex gap-2 w-fit m-auto'>
        <div className="w-[20px] h-[35px] bg-primary-gray2 rounded-r-full"></div>
        <h2 className="responsiveheading2  flex w-fit m-auto items-center gap-2 text-[22px] font-primary">{`FAQs `}{""}{title}</h2>
      </div>

      {faqData?.map((item, index) => (
        <div key={index} className="mb-2.5">
          <div
            className={`px-[15px] sm:px-[33px] md:px-[38px] py-[14px] sm:py-[15px] md:py-[17px]  cursor-pointer transition-all 
             ${expanded === index
                ? " text-[#484545]"
                : "bg-transparent text-[#1A2E33]"
              }
            `}
            onClick={() => handleChange(index)}
          >
            <div className="flex gap-3 items-center ">
              {expanded === index ? (
                <FaMinus size="32px" className="shrink-0 transform transition-all duration-200 bg-primary-gray2  rounded-full p-1 text-[#D1C8C1]" />
              ) : (
                <IoMdAdd size="32px" className="shrink-0 transform transition-all duration-200 bg-primary-gray2  rounded-full p-1 text-[#D1C8C1]" />
              )}
              <h3
                className={`responsiveheading6 dm_sans font-medium  text-[#1A2E33] ${expanded === index ? "text-[#1D1C1C]" : "text-[#1A2E33]"
                  }`}
              >
                {item.question}
              </h3>
            </div>
            {expanded === index && (
              <div className="mt-1.5 md:mt-3 pl-11">
                <p className="responsive-text dm_sans">{item.answer}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
export default CommonFaq;



// const faqData = [
//   {
//     question: "What is mood-based travel?",
//     answer:
//       "Mood-based travel means choosing journeys that match your state of mind—whether you seek peace, adventure, love, or healing.",
//   },
// ];

{/* <CommonFaq faqData={faqData} /> */ }