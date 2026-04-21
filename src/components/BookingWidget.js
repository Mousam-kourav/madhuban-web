// src/components/BookingWidget.js
import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Calendar, Users, ChevronRight } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

const BookingWidget = () => {
  //   const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [accommodationType, setAccommodationType] = useState("all");
  const router = useRouter();

  const handleCheckAvailability = (e) => {
    e.preventDefault();

    // Format dates for URL parameters
    const checkInStr = checkIn ? checkIn.toISOString().split("T")[0] : "";
    const checkOutStr = checkOut ? checkOut.toISOString().split("T")[0] : "";

    // Navigate to booking page with search parameters
    router.push(
      `/booking?checkIn=${checkInStr}&checkOut=${checkOutStr}&adults=${adults}&children=${children}&type=${accommodationType}`,
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-sm:py-4 bg-[#D1C8C1]">
      <div className="bg-[rgb(110,97,70)] rounded-lg shadow-xl p-4 max-sm:my-6 z-10 sm:p-6 relative sm:bottom-25 mx-auto max-w-[1000px]">
        <form onSubmit={handleCheckAvailability}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center">
            {/* Check-in Date */}
            <div className="lg:col-span-1 flex justify-center">
              <div>
                <label className="block text-lg font-semibold text-primary-gray text-center mb-1">
                  Check-in
                </label>
                <div className="relative text-black">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar
                      className="h-5 w-5 text-primary-gray2 z-1"
                      aria-label="calender"
                    />
                  </div>
                  <DatePicker
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date)}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={new Date()}
                    placeholderText="Select date"
                    className="pl-10 w-40 font-arial-narrow tracking-wider font-medium bg-[#D1C8C1] border-black text-white placeholder-[rgb(110,97,70)] hover:border-black outline-none rounded-md py-2 px-3 transition-all duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Check-out Date */}
            <div className="lg:col-span-1 flex justify-center">
              <div>
                <label className="block text-lg font-arial-narrow tracking-wider font-semibold text-primary-gray text-center mb-1">
                  Check-out
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-1">
                    <Calendar
                      className="h-5 w-5 text-primary-gray2"
                      aria-label="calender"
                    />
                  </div>
                  <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    selectsEnd
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={checkIn || new Date()}
                    placeholderText="Select date"
                    className="pl-10 w-40 font-arial-narrow tracking-wider font-medium bg-[#D1C8C1] text-white placeholder-[rgb(110,97,70)] hover:border-black focus:border-black outline-none rounded-md py-2 px-3 transition-all duration-150"
                  />
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="lg:col-span-1 flex justify-center">
              <div>
                <label className="block text-lg font-arial-narrow  font-semibold text-primary-gray text-center mb-1">
                  Guests
                </label>
                <div className="relative">
                  <div className="flex space-x-2">
                    <select
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value))}
                      className=" bg-[#D1C8C1] font-arial-narrow  font-medium rounded-md py-2.5 px-3 focus:outline-none text-[rgb(110,97,70)] hover:border-black focus:border-black"
                    >
                      <option label="1 Adult" value="1"></option>
                      <option label="2 Adults" value="2"></option>
                      <option label="3 Adults" value="3"></option>
                      <option label="4 Adults" value="4"></option>
                      <option label="5 Adults" value="5"></option>
                      <option label="6 Adults" value="6"></option>
                    </select>
                    <select
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value))}
                      className=" bg-[#D1C8C1] font-arial-narrow  font-medium rounded-md py-2 px-3 focus:outline-none text-[rgb(110,97,70)] hover:border-black focus:border-black"
                    >
                      <option label="0 Child" value="0"></option>
                      <option label="1 Child" value="1"></option>
                      <option label="2 Children" value="2"></option>
                      <option label="3 Children" value="3"></option>
                      <option label="4 Children" value="4"></option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Accommodation */}
            <div className="lg:col-span-1 flex justify-center">
              <div>
                <label className="block text-lg font-arial-narrow  font-semibold text-primary-gray text-center mb-1">
                  Accommodation
                </label>
                <select
                  value={accommodationType}
                  onChange={(e) => setAccommodationType(e.target.value)}
                  className="w-40 rounded-md bg-[#D1C8C1] font-arial-narrow  font-medium text-[rgb(110,97,70)] py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option label="All Types" value="all"></option>
                  <option label="Safari Tent" value="cottage"></option>
                  <option label="Mud Houses" value="tent"></option>
                  <option label="Pool Side Villa" value="treehouse"></option>
                  <option label="Camping Tent" value="camping"></option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-4 flex justify-center items-end">
              <div className="w-full">
                <button
                  type="submit"
                  className="w-full font-arial-narrow cursor-pointer  font-semibold flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-[rgb(110,97,70)] bg-[#D1C8C1]"
                >
                  Check Availability{" "}
                  <ChevronRight className="ml-2 h-5 w-5" aria-label="arrow" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingWidget;
