import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import PageLoader from "../../../../components/ui/PageLoader";
import GalleryCarousel from "../../../../components/ui/GalleryCarousel";
import ExploreIconicSection from "../../sections/home/ExploreIconicSection";
import ReviewSection from "../../components/ReviewSection";
import Reveal from "../../../../components/ui/Reveal";
import { useLogHistory } from "../../../../utils/auth/useLogHistory";

// Hooks
import { usePlaceData } from "./hooks/usePlaceData";

// Components
import PlaceHero from "./components/PlaceHero";
import PlaceSnapshot from "./components/PlaceSnapshot";
import PlaceStory from "./components/PlaceStory";
import PlaceHighlights from "./components/PlaceHighlights";
import PlaceActivities from "./components/PlaceActivities";
import PlaceFoods from "./components/PlaceFoods";
import PlacePhotography from "./components/PlacePhotography";
import PlaceHistory from "./components/PlaceHistory";
import PlacePlanner from "./components/PlacePlanner";
import PlaceTransport from "./components/PlaceTransport";
import PlaceTips from "./components/PlaceTips";
import PlaceNearby from "./components/PlaceNearby";
import PlaceMap from "./components/PlaceMap";

const PlaceDetails = () => {
  const { slug } = useParams();
  const heroRef = useRef(null);

  const { place, isLoading, isError, festivals, festivalsLoading } = usePlaceData(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useLogHistory({
    actionType: "VIEW_PLACE",
    entityId: place?._id,
    entityModel: "Place",
    entityTitle: place?.name,
    entitySlug: slug
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#050505]">
        <PageLoader fullScreen={false} message="Loading destination..." size="md" />
      </div>
    );
  }

  if (isError || !place) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col justify-center items-center text-center p-4">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Destination Not Found</h1>
        <p className="text-slate-600 dark:text-white/60 mb-8">This experience might have been removed or is temporarily unavailable.</p>
        <Link to="/places" className="bg-[#E85D04] text-white px-8 py-3 rounded-full font-bold hover:bg-[#D05203] transition-colors">
          Explore Other Destinations
        </Link>
      </div>
    );
  }

  const heroImage = place.images?.hero || place.images?.thumbnail || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80";
  const validGallery = place.images?.gallery?.filter(img => img) || [];
  const hasValidMap = !!(place.location?.coordinates?.lat && place.location?.coordinates?.lng);

  return (
    <div className="bg-slate-50 dark:bg-[#050505] font-sans overflow-x-hidden selection:bg-[#E85D04] selection:text-white text-slate-900 dark:text-white">

      <PlaceHero place={place} heroImage={heroImage} validGallery={validGallery} heroRef={heroRef} />

      <PlaceSnapshot place={place} />

      <PlaceStory place={place} heroImage={heroImage} />

      <div id="gallery">
        <GalleryCarousel images={validGallery} name={place.name} />
      </div>

      <PlaceHighlights place={place} />

      <PlaceActivities place={place} heroImage={heroImage} />

      <PlaceFoods place={place} />

      <PlacePhotography place={place} />

      <PlaceHistory place={place} />

      <PlacePlanner place={place} />

      <PlaceTransport place={place} />

      <PlaceTips place={place} />

      <PlaceNearby place={place} />

      <ExploreIconicSection
        type="festival"
        highlightText="Cultural Experience"
        title={`Festivals in ${place.stateId?.name || 'the State'}`}
        subtitle="Immerse yourself in local traditions and celebrations nearby."
        data={festivals}
        viewAllLink="/festivals"
        viewAllText="View All Festivals"
        isLoading={festivalsLoading}
      />

      <PlaceMap place={place} hasValidMap={hasValidMap} />

      <section className="py-24 bg-slate-50 dark:bg-[#050505] border-t border-slate-200 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <ReviewSection placeId={place._id} />
          </Reveal>
        </div>
      </section>

    </div>
  );
};

export default PlaceDetails;
