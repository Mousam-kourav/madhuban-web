import "./Stay.css";
import WhyStayMadhuban from "./WhyStayMadhuban";
import CommonFaqs from "@/common-components/faqs/CommonFaqs";
import StayBanner from "./StayBanner";
import Accommodations from "./Accommodations";
import DiscoverIdeal from "./DiscoverIdeal";

const stayFaqs = [
  {
    question:
      "Which is the best eco-friendly resort near Bhopal for a weekend stay?",
    answer:
      "Madhuban Eco Retreat is one of the top-rated eco-stays near Bhopal, offering safari tents, mud houses, glamping tents, and poolside villas surrounded by Ratapani’s natural beauty.",
  },
  {
    question: "Do you offer safari tent stays near Bhopal?",
    answer:
      "Yes. Our eco-friendly Safari Tents near Ratapani provide a classic wilderness stay with modern comforts like Wi-Fi, vanity area, and open-sky showers.",
  },
  {
    question: "Are mud houses available for booking in Ratapani?",
    answer:
      "Absolutely. Our traditional Gond-inspired Mud Houses offer authentic rural architecture with modern amenities and are among the best mud house stays near Bhopal.",
  },
  {
    question: "Do you have private poolside villas?",
    answer:
      "Yes. Our Pool Side Villas near Bhopal offer tranquil water views, sustainable architecture, and a peaceful ambiance ideal for families and couples.",
  },
  {
    question: "Is camping allowed inside the Ratapani Wildlife area?",
    answer:
      "We offer safe, managed camping experiences within the Ratapani region, perfect for nature lovers and adventure seekers.",
  },
  {
    question: "Are your stays suitable for families?",
    answer:
      "Yes. Most of our accommodations, including Pool Side Villas, Glamping Tents, and Mud Houses, are ideal for families.",
  },
  {
    question: "What activities can guests enjoy during their stay?",
    answer:
      "Guests can enjoy forest walks, bird watching, nature trails, village experiences, stargazing, eco-farm visits, and wellness-centric retreats.",
  },
  {
    question: "How far is Madhuban Eco Retreat from Bhopal city?",
    answer:
      "The retreat is conveniently located near Bhopal, offering quick access while immersing guests in the serene Ratapani forest region.",
  },
];

const Stay = () => {
  return (
    <div className="stay-page bg-[#b4a681d8]">
      <StayBanner />
      <DiscoverIdeal />
      <Accommodations />
      <WhyStayMadhuban />
      <CommonFaqs faqs={stayFaqs} />
    </div>
  );
};

export default Stay;
