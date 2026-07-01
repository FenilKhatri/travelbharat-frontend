import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCalendar, FiArrowLeft } from "react-icons/fi";
import GalleryCarousel from "../../../../components/ui/GalleryCarousel";
import ExploreIconicSection from "../../sections/home/ExploreIconicSection";

// Hooks
import { useFestivalData } from "./hooks/useFestivalData";

// Components
import FestivalDetailsSkeleton from "./components/FestivalDetailsSkeleton";
import FestivalHero from "./components/FestivalHero";
import FestivalOverview from "./components/FestivalOverview";
import FestivalPlaces from "./components/FestivalPlaces";
import FestivalTips from "./components/FestivalTips";

const FestivalDetails = () => {
  const { slug } = useParams();

  const {
    festival,
    festivalLoading,
    festivalError,
    places,
    placesLoading,
  } = useFestivalData(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (festivalLoading) return <FestivalDetailsSkeleton />;

  if (festivalError || !festival) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090f] gap-4">
        <FiCalendar size={56} className="text-[#E85D04]" />
        <h1 className="text-2xl font-bold text-white">Festival Not Found</h1>
        <p className="text-[#8fa3cc]">We couldn't find details for "{slug}".</p>
        <Link to="/festivals" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] text-white rounded-xl font-semibold text-sm hover:bg-[#D05203] transition">
          <FiArrowLeft size={16} /> Back to Festivals
        </Link>
      </div>
    );
  }

  const validGallery = festival.images?.gallery?.filter(img => img) || [];

  return (
    <div className="min-h-screen bg-[#07090f] font-sans text-[#edf2ff]">
      <FestivalHero festival={festival} />

      <FestivalOverview festival={festival} />

      <FestivalPlaces festival={festival} />

      <div id="gallery">
        <GalleryCarousel images={validGallery} name={festival.name} />
      </div>

      <FestivalTips festival={festival} />

      <ExploreIconicSection
        type="destination"
        highlightText="Top Attractions"
        title={`Must-Visit Places in ${festival.stateId?.name || 'the State'}`}
        subtitle="Explore iconic destinations to visit while you're here."
        data={places}
        viewAllLink={`/places?state=${festival.stateId?.slug || ''}`}
        viewAllText="Explore All Places"
        isLoading={placesLoading}
      />
    </div>
  );
};

export default FestivalDetails;
