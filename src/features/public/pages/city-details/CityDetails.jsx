import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useEffect } from "react";
import GalleryCarousel from "../../../../components/ui/GalleryCarousel";
import ExploreIconicSection from "../../sections/home/ExploreIconicSection";
import { useLogHistory } from "../../../../utils/auth/useLogHistory";

// Hooks
import { useCityData } from "./hooks/useCityData";

// Components
import CityDetailsSkeleton from "./components/CityDetailsSkeleton";
import CityHero from "./components/CityHero";
import CityQuickFacts from "./components/CityQuickFacts";
import CityAbout from "./components/CityAbout";
import CityDestinations from "./components/CityDestinations";
import CityTips from "./components/CityTips";
import CityHotels from "./components/CityHotels";
import CityRestaurants from "./components/CityRestaurants";
import CityTransport from "./components/CityTransport";
import CityNearby from "./components/CityNearby";
import CityEmergency from "./components/CityEmergency";
import CityMap from "./components/CityMap";
import CityCTA from "./components/CityCTA";

const CityDetails = () => {
  const { stateSlug, citySlug } = useParams();

  const {
    city,
    cityLoading,
    cityError,
    places,
    placesLoading,
    hotels,
    restaurants,
    festivals,
    festivalsLoading,
    resolvedStateSlug,
    avgRating,
    travelTips,
    quickFacts
  } = useCityData(citySlug, stateSlug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [citySlug]);

  useLogHistory({
    actionType: "VIEW_CITY",
    entityId: city?._id,
    entityModel: "City",
    entityTitle: city?.name,
    entitySlug: citySlug
  });

  if (cityLoading) return <CityDetailsSkeleton />;

  if (cityError || !city) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090f] gap-4">
        <FaMapMarkerAlt size={56} className="text-[#E85D04]" />
        <h1 className="text-2xl font-bold text-white">City Not Found</h1>
        <p className="text-[#8fa3cc]">We couldn't find details for "{citySlug}".</p>
        <Link to="/states" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] text-white rounded-xl font-semibold text-sm hover:bg-[#D05203] transition">
          <FiArrowLeft size={16} /> Back to States
        </Link>
      </div>
    );
  }

  const validGallery = city.images?.gallery?.filter(Boolean) || [];
  const stateName = city.stateId?.name;
  const validEmergency = city.emergencyInfo && Object.values(city.emergencyInfo).some((v) => v?.trim());

  return (
    <div className="min-h-screen bg-[#07090f] font-sans text-[#edf2ff]">
      <CityHero
        city={city}
        stateName={stateName}
        resolvedStateSlug={resolvedStateSlug}
        avgRating={avgRating}
        totalPlaces={city.totalPlaces || places.length}
      />

      <CityQuickFacts quickFacts={quickFacts} />

      <CityAbout city={city} />

      <div id="gallery">
        <GalleryCarousel images={validGallery} name={city.name} />
      </div>

      <CityDestinations
        city={city}
        places={places}
        placesLoading={placesLoading}
        resolvedStateSlug={resolvedStateSlug}
      />

      <CityTips travelTips={travelTips} cityName={city.name} />

      <CityHotels hotels={hotels} />

      <CityRestaurants restaurants={restaurants} />

      <CityTransport city={city} />

      <CityNearby city={city} />

      <CityEmergency city={city} validEmergency={validEmergency} />

      <CityMap city={city} />

      <ExploreIconicSection
        type="festival"
        highlightText="Cultural Experience"
        title={`Festivals in ${stateName || 'the State'}`}
        subtitle="Immerse yourself in local traditions and celebrations nearby."
        data={festivals}
        viewAllLink="/festivals"
        viewAllText="View All Festivals"
        isLoading={festivalsLoading}
      />

      <CityCTA city={city} places={places} />
    </div>
  );
};

export default CityDetails;
