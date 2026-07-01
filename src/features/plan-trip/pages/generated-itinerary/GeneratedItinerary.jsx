import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Components
import ItineraryHero from "./components/ItineraryHero";
import ItineraryDays from "./components/ItineraryDays";
import ItineraryAttractions from "./components/ItineraryAttractions";
import ItinerarySidebar from "./components/ItinerarySidebar";

const GeneratedItinerary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tripData = location.state?.tripData;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!tripData) {
      navigate('/places');
    }
  }, [tripData, navigate]);

  if (!tripData) return null;

  const { destination, itinerary, recommendedHotels, costBreakdown, weather, travelEssentials, nearbyAttractions } = tripData;

  return (
    <div className="bg-[#050505] min-h-screen font-sans text-white pb-32">
      <ItineraryHero destination={destination} itineraryLength={itinerary.length} />

      <div className="max-w-[1200px] mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: ITINERARY */}
        <div className="lg:col-span-8 space-y-12">

          <section>
            <h2 className="text-2xl font-black mb-4">Trip Overview</h2>
            <p className="text-white/60 leading-relaxed text-lg">
              {destination.overview}
            </p>
          </section>

          <ItineraryDays itinerary={itinerary} />

          <ItineraryAttractions nearbyAttractions={nearbyAttractions} />

        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <ItinerarySidebar
          weather={weather}
          costBreakdown={costBreakdown}
          recommendedHotels={recommendedHotels}
          travelEssentials={travelEssentials}
        />
      </div>
    </div>
  );
};

export default GeneratedItinerary;
