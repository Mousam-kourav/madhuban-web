import React from "react";
import { MapPin, Car, Users, TreePine, Map, Clock } from "lucide-react";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

export const Location = () => {
  return (
    <section id="location" className="py-16 md:py-24 px-6 bg-primary-gray2">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <DecorativeHeading
            text={"Easy Access from Bhopal, Indore & Nearby Regions"}
            as="h2"
            color="#fff"
          />

          <p className="text-gray-200 max-w-2xl mx-auto font-light text-sm md:text-lg">
            Madhuban Eco Retreat is conveniently reachable for day travelers
            seeking a peaceful escape from the city bustle.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-10">
          {/* Map Visualization */}
          <div className="relative rounded-[10px] md:rounded-[20px] overflow-hidden aspect-[5/4] border border-white/5 shadow-2xl group">
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

            {/* Custom Map Markers */}
          </div>

          {/* Location Cards */}
          <div className="space-y-6">
            <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] transition-all duration-300">
              <div className="flex gap-6 items-center">
                <div className="w-14  h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gray-200  transition-colors">
                  <Car size={28} aria-label="car" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg md:text-xl font-bold text-white">
                    From Bhopal
                  </h4>
                  <p className=" text-sm leading-relaxed text-gray-200">
                    Ideal same-day return for urban explorers.
                  </p>
                  <div className="flex items-center gap-2 text-white font-bold text-sm pt-2">
                    <Clock size={16} aria-label="clock" />
                    <span>Approx. 45-minute drive</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] transition-all duration-300">
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gray-200  transition-colors">
                  <Users size={28} aria-label="users" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg md:text-xl font-bold text-white">
                    From Indore
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-200">
                    Popular choice for planned weekend group outings.
                  </p>
                  <div className="flex items-center gap-2 text-white font-bold text-sm pt-2">
                    <Clock size={16} aria-label="clock"/>
                    <span>Approx. 3-hour drive</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] transition-all duration-300">
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gray-200  transition-colors">
                  <TreePine size={28} aria-label="tree" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg md:text-xl font-bold text-white">
                    Near Ratapani & Satpura
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-200">
                    Perfect nature setting integrated within MP's finest
                    reserves.
                  </p>
                  <div className="flex items-center gap-2 text-white font-bold text-sm pt-2">
                    <MapPin size={16} aria-label="map pin" />
                    <span>Nature at your doorstep</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-4 md:p-10 text-center text-white  relative ">
          <p className="max-w-4xl mx-auto  font-light text-sm text-lg ">
            If you are searching online for resorts near Bhopal for day outing,
            Madhuban offers the perfect balance of distance, comfort, and
            experience.
          </p>
        </div>
      </div>
    </section>
  );
};
