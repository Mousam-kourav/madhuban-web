import DecorativeHeading from "@/common-components/heading/DecorativeHeading";
import React from "react";

const Map = () => {
  return (
    <div className="px-6">
      <section className="pb-12  flex items-center justify-center flex-col">
        <div className="text-center mb-10">
          <DecorativeHeading as="h2" text={"Escape to the Wilds"} />

          <h4 className="heading2 text-primary-gray2 max-w-3xl mx-auto ">
            Only 1 hour from Bhopal – Escape the city noise. Located in the
            heart of
            <span className="text-primary font-semibold">
              {" "}
              the Ratapani Tiger Reserve
            </span>
          </h4>
        </div>

        <div className="relative max-w-7xl overflow-hidden w-full h-[500px] rounded-xl  bg-[#1a2e28] shadow-md ">
          {/* <div
          className="absolute inset-0 opacity-40 grayscale contrast-125"
          data-alt="Topographic satellite map of central India forest area"
          data-location="Bhopal, India"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBqE0hCUagfdIYkic2r6oN1enYMDO9pB6qhPtb_RHajNRME77fXXtG-0x_PMytR7JOyY4WNNLVAb6jcv7l68d17oTadeUwxzFshuefeH4ub6A_uzFaD7NQqdDC595X5WfjM3rteW8MEGsE-dbA2qruDVmo55miOysz1PPAqw6XN4ReAIUMQLMy7sSprHby5aqgPzQO3_y87Zh6lpcMsXywHucBKbHeefSbigGAXTYDZzpMgSPMtclj2C0SAMTXRxNMqomJL0MoS1V0m")',
          }}
        ></div> */}

          <div className="absolute inset-0  ">
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

          {/* <div className="absolute inset-0 bg-gradient-to-b from-background-dark/20 to-background-dark/60"></div> */}

          {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping bg-primary rounded-full opacity-75"></div>
            <div className="relative bg-primary text-background-dark p-3 rounded-full shadow-2xl">
              <span className="material-symbols-outlined block text-3xl font-bold">
                location_on
              </span>
            </div>
          </div>
          <div className="mt-4 bg-background-dark/90 border border-primary/30 backdrop-blur px-4 py-2 rounded-lg shadow-xl">
            <p className="font-bold text-sm tracking-wide">
              MADHUBAN ECO RETREAT
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4">
          <div className="bg-background-dark/80 backdrop-blur-md px-4 py-3 rounded-lg flex items-center gap-3 border border-[#283933]">
            <span className="material-symbols-outlined text-primary">
              directions_car
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-60">
                From Bhopal
              </p>
              <p className="text-sm font-bold">1 hour 15 mins (45km)</p>
            </div>
          </div>
          <div className="bg-background-dark/80 backdrop-blur-md px-4 py-3 rounded-lg flex items-center gap-3 border border-[#283933]">
            <span className="material-symbols-outlined text-primary">
              forest
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-60">
                Reserve Entrance
              </p>
              <p className="text-sm font-bold">5 mins drive</p>
            </div>
          </div>
        </div> */}
        </div>
      </section>
    </div>
  );
};

export default Map;
