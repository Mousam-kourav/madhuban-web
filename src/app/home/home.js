export const dynamic = "force-static";
import HomeBanner from "@/components/home/HomeBanner";
import WelComeSection from "@/components/home/WelComeSection";
import Accommodations from "@/components/home/Accommodations";
import ImmersiveExperiences from "@/components/home/ImmersiveExperiences";
import CommitmentSection from "@/components/home/CommitmentSection";
import GuestsSection from "@/components/home/GuestsSection";
import GuestsExperiences from "@/components/home/GuestsExperiences";
import OurJourney from "@/components/home/OurJourney";
import SEO from "@/components/seo/Seo";
import ReadyForEcoRetreat from "@/components/home/ReadyForEcoRetreat";

const Home = () => {
  return (
    <>
      <div className="min-h-screen bg-stone-50 ">
        <HomeBanner />
        <WelComeSection />
        <Accommodations />
        <ImmersiveExperiences />
        <CommitmentSection />
        <GuestsSection />
        <GuestsExperiences />
        <OurJourney />
        <ReadyForEcoRetreat />
      </div>
    </>
  );
};

export default Home;
