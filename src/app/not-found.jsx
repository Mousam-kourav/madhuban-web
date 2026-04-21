import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center  px-6 py-35 sm:py-40">
      <div className="text-center bg-white/80 backdrop-blur rounded-2xl p-0 sm:p-10">
        <h1 className="text-2xl sm:text-4xl font-bold text-primary-gray2 font-primary text-emerald-700 mb-4">
          <span className="text-5xl sm:text-6xl mb-4 inline-block"> 404 </span>
          <br />
          You’ve Wandered Off the Forest Trail 🌲
        </h1>

        <p className="text-gray-700 text-lg mb-4">
          The page you’re looking for no longer exists or may have moved — just
          like hidden paths in a forest.
        </p>

        <p className="text-gray-700 mb-8">
          But don’t worry. Every journey at{" "}
          <span className="font-semibold text-primary-gray2 text-emerald-700">
            Madhuban Eco Retreat near Bhopal
          </span>{" "}
          leads back to peace, nature, and meaningful experiences.
        </p>

        <h2 className="text-xl sm:text-4xl text-primary-gray2 font-semibold text-gray-800 mb-6 font-primary">
          Where Would You Like to Go Next?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Link
            href="/eco-philosophy"
            className="block rounded-xl border border-[#6e6146ff]  p-4  font-medium hover:bg-[#d1c8c1] transition"
          >
            🌲 Explore Our Eco Retreat
          </Link>

          <Link
            href="/experiences/forest-walks-and-nature-trails"
            className="block rounded-xl border border-[#6e6146ff]  p-4  font-medium hover:bg-[#d1c8c1] transition"
          >
            🔥 New Year & Cultural Experiences
          </Link>

          <Link
            href="/stay"
            className="block rounded-xl border border-[#6e6146ff]  p-4  font-medium hover:bg-[#d1c8c1] transition"
          >
            🏕️ Stay Options – Rooms, Tents & Mud Houses
          </Link>

          <Link
            href="/nearby-attractions"
            className="block rounded-xl border border-[#6e6146ff]  p-4  font-medium hover:bg-[#d1c8c1] transition"
          >
            📍 Nearby Attractions – Bhimbetka, Ratapani & More
          </Link>
        </div>

        <div className="border-t pt-6">
          <Link
            href="/contact"
            className="text-xl sm:text-4xl text-primary-gray2 text-emerald-700 font-semibold hover:underline font-primary"
          >
            📞 Contact Madhuban Eco Retreat
          </Link>

          <p className="mt-6 text-gray-600 italic">
            Still Lost?
            <br />
            Take a deep breath, listen to the forest, and head back home.
          </p>

          <Link
            href="/"
            className="inline-block mt-4 rounded-full bg-primary-gray2 text-primary-gray px-6 py-3 font-semibold hover:opacity-90 transition font-primary"
          >
            Return To Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}

export const metadata = {
  title: "Page Not Found | Madhuban Eco Retreat, Near Bhopal",

  description:
    "The page you’re looking for doesn’t exist. Return to Madhuban Eco Retreat and explore peaceful forest stays, nature experiences, and eco tourism near Bhopal.",
};
