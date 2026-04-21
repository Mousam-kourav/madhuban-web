export const dynamic = "force-static";
import SEO from "@/components/seo/Seo";
import AccommodationDetail from "@/components/stay/AccommodationsDetails";
import { accommodationsData } from "@/components/stay/Stay.functions";

const getAccommodation = (slug) => {
  return accommodationsData.find((acc) => acc.slug === slug);
};

const AccommodationDetailPage = async ({ params }) => {
  const { slug } = await params;
  const accommodation = getAccommodation(slug);
  return (
    <>
      <SEO schemas={accommodation.schemas} />
      <AccommodationDetail accommodationDetail={accommodation} />
    </>
  );
};

export default AccommodationDetailPage;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const accommodation = getAccommodation(slug);
  return accommodation.metadata;
}
