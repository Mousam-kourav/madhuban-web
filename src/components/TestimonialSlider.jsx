import { Star } from "lucide-react";
import {
  IoIosArrowDroprightCircle,
  IoIosArrowDropleftCircle,
} from "react-icons/io";

const testimonials = [
  {
    id: 1,
    name: "Apoorva Ugarkar",
    location: "Indore, Madhya Pradesh",
    rating: 5,
    text: "The stay at Madhuban resort was very comfortable and relaxing. The staff was very friendly and caring. The food was too good. The star gazing activity was the most beautiful experience. The morning forest walk was refreshing. The overall experience at Madhuban resort was awesome. I would definitely like to visit this place again.",
  },
  {
    id: 2,
    name: "Alok Shrivastava",
    location: "Bhopal, Madhya Pradesh",
    rating: 5,
    text: "We all from defence service came to Madhuban for a picnic today. The property is ideally suited for large gatherings of 150-200 persons. They have attractions for all age groups. The staff were very courteous and prompt in service. We had a great day outing. Food was awesome, and the place was offered in a spic and span condition. Must-visit place for nature lovers.",
  },
  {
    id: 3,
    name: "Poonam Acharekar",
    location: "Mumbai, Maharashtra ",
    rating: 4,
    text: "I recently stayed at “Madhuban Resort by Somaiya”, and it was truly a magical experience! Nestled in the heart of the jungle (specifically surrounded by Ratapani Wildlife Sanctuary & Tiger Reserve), the resort offers an incredible blend of adventure and tranquility. From the moment we arrived, the Manager Mr. Shibaji and the rest of the staff were warm, welcoming, and attentive, making us feel right at home.",
  },
  {
    id: 4,
    name: "Nikhil Acharya",
    location: "Madhya Pradesh",
    rating: 5,
    text: "Overall a good experience of calm & peaceful stay. Nice staff, services are prompt. Food freshly cooked and served. Blend of modern & forest stay amenities. Away from city's chaos yet connected with it. Staff is well trained and their behavior was welcoming. They gave guided tour to property as well. Taking care of small needs during stay was well handled. Pool was clean and maintained.Best part is - Fully vegetarian & no alcohol zone.,",
  },
  {
    id: 5,
    name: "Shubhobroto Ghosh",
    location: "New Delhi",
    rating: 5,
    text: "Grand experience. Resort staff are polite and helpful. Surroundings are beautiful. Thoroughly enjoyable. We saw many animals, including a variety of birds. Among birds, Ashy Prinias and Paradise Flycatchers were mesmerizing to observe. We were also able to observe a baby Fan-Throated Lizard, an animal we saw for the first time. There were wild fishes and crabs to see. We enjoyed watching dragonflies hovering like helicopters.",
  },
  {
    id: 6,
    name: "Gaura Joshi",
    location: "Bhopal, Madhya Pradesh",
    rating: 5,
    text: "What a wonderful place! The location, the room, view, food, staff - everything was excellent! Would be back soon. Special thanks to Shibaji da for making the stay all the more beautiful.",
  },
];

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./TestimonialSlide.css";

// import required modules
import {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  Autoplay,
} from "swiper/modules";

export default function App() {
  return (
    <>
      <Swiper
        cssMode={true}
        navigation={{
          prevEl: ".swiper-prev",
          nextEl: ".swiper-next",
        }}
        pagination={true}
        mousewheel={true}
        keyboard={true}
        autoplay={{
          pauseOnMouseEnter: true,
        }}
        loop={true}
        modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
        className="mySwiper testimonial-swiper"
      >
        <button
          name={"prevSlide"}
          className="swiper-prev absolute left-0 top-1/2 z-10 cursor-pointer"
        >
          <IoIosArrowDropleftCircle size={40} className="text-primary-gray"  aria-label="arrow" />
        </button>

        <button
          name={"nextSlide"}
          className="swiper-next absolute right-0 top-1/2 z-10 cursor-pointer"
        >
          <IoIosArrowDroprightCircle size={40} className="text-primary-gray" aria-label="arrow" />
        </button>

        {testimonials.map((testimonial) => (
          <SwiperSlide
            key={testimonial.id}
            className="bg-primary-gray2  shadow-lg"
          >
            <div key={testimonial.id} className="w-full ">
              <div className="p-8 flex flex-col justify-center items-center text-center h-full">
                <div className="flex items-center mb-4 justify-center">
                  <div className="flex text-yellow-500 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5"
                        fill={i < testimonial.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>

                <blockquote className=" text-white tracking-wider text-lg mb-6 font-arial-narrow max-w-3xl">
                  <span className="text-4xl  mr-1">“</span>
                  <span className="text-sm md:text-lg">{testimonial.text}</span>
                  <span className="text-4xl  ml-1">”</span>
                </blockquote>

                <div className="text-white">
                  <p className="text-sm md:text-lg tracking-widest font-primary">
                    {testimonial.name}
                  </p>
                  <p className="text-sm md:text-lg font-primary tracking-wider font-medium">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
