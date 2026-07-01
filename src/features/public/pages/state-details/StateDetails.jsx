import { useParams, Link } from "react-router-dom";
import { FiMapPin, FiArrowLeft, FiGlobe } from "react-icons/fi";
import { useStateData } from "./hooks/useStateData";
import ExploreIconicSection from "../../sections/home/ExploreIconicSection";
import TravelCard from "../../../../components/cards/TravelCard";
import GalleryCarousel from "../../../../components/ui/GalleryCarousel";
import SectionLabel from "../../../../components/ui/SectionLabel";

// Components
import StateDetailsSkeleton from "./components/StateDetailsSkeleton";
import StateHero from "./components/StateHero";
import StateOverview from "./components/StateOverview";
import StateFoods from "./components/StateFoods";
import StateWeather from "./components/StateWeather";
import StateTransport from "./components/StateTransport";
import StateTips from "./components/StateTips";
import StateCities from "./components/StateCities";
import StateDiscoverBanner from "./components/StateDiscoverBanner";

const StateDetails = () => {
  const { slug } = useParams();
  const {
    state, stateLoading, stateError,
    cities, citiesLoading,
    festivals, festivalsLoading,
    places, placesLoading,
    foods, foodsLoading,
    similarStates, similarStatesLoading
  } = useStateData(slug);

  if (stateLoading) return <StateDetailsSkeleton />;

  if (stateError || !state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090f] gap-4">
        <FiMapPin size={56} className="text-[#E85D04]" />
        <h1 className="text-2xl font-bold text-white">State Not Found</h1>
        <p className="text-[#8fa3cc]">We couldn't find details for "{slug}".</p>
        <Link to="/states" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] text-white rounded-xl font-semibold text-sm hover:bg-[#D05203] transition">
          <FiArrowLeft size={16} /> Back to States
        </Link>
      </div>
    );
  }

  const validFoods = foods.filter(f => f.image?.url || f.images?.thumbnail) || [];
  const validGallery = state.images?.gallery?.map(img => img.url).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-[#07090f] font-sans text-[#edf2ff] relative overflow-x-hidden">
      
      {/* State Branding Overlays */}
      {state.stateBranding?.leftBackground && (
        <div
          className="absolute left-0 top-0 w-full h-[1200px] max-w-[500px] bg-contain bg-no-repeat bg-top-left opacity-[0.05] pointer-events-none z-0"
          style={{ backgroundImage: `url(${state.stateBranding.leftBackground})` }}
        />
      )}
      {state.stateBranding?.rightBackground && (
        <div
          className="absolute right-0 top-[30%] w-full h-[1200px] max-w-[500px] bg-contain bg-no-repeat bg-top-right opacity-[0.05] pointer-events-none z-0"
          style={{ backgroundImage: `url(${state.stateBranding.rightBackground})` }}
        />
      )}
      {state.stateBranding?.patternImage && (
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
          style={{ backgroundImage: `url(${state.stateBranding.patternImage})`, backgroundRepeat: 'repeat' }}
        />
      )}

      <StateHero state={state} />

      <StateOverview state={state} validGallery={validGallery} />

      <div id="gallery">
        <GalleryCarousel images={validGallery} name={state.name} />
      </div>

      <StateFoods stateName={state.name} validFoods={validFoods} />

      <StateWeather state={state} />

      <StateTransport state={state} />

      {/* Map */}
      {state.mapCoordinates?.lat && state.mapCoordinates?.lng && (
        <section className="h-[450px] w-full border-b border-white/5">
          <iframe
            title={`${state.name} Map`}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) grayscale(80%) contrast(120%)" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${state.mapCoordinates.lat},${state.mapCoordinates.lng}&hl=en&z=7&output=embed`}
          />
        </section>
      )}

      <StateTips state={state} />

      <StateCities state={state} cities={cities} citiesLoading={citiesLoading} slug={slug} />

      <ExploreIconicSection
        type="festival"
        highlightText="Cultural Experience"
        title={`Festivals in ${state.name}`}
        subtitle="Immerse yourself in local traditions and celebrations."
        data={festivals}
        viewAllLink="/festivals"
        viewAllText="View All Festivals"
        isLoading={festivalsLoading}
      />

      <ExploreIconicSection
        type="destination"
        highlightText="Top Attractions"
        title={`Must-Visit Places in ${state.name}`}
        subtitle="Explore the most iconic and highly rated tourist spots."
        data={places}
        viewAllLink={`/places?state=${slug}`}
        viewAllText="Explore All Places"
        isLoading={placesLoading}
      />

      {similarStates.length > 0 && (
        <section className="py-24 bg-[#07090f] border-b border-white/5">
          <div className="max-w-[1600px] w-full mx-auto px-4">
            <SectionLabel icon={FiGlobe} text="Discover More" />
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <h2 className="text-4xl font-black text-[#edf2ff]">Similar States</h2>
              <p className="text-[#8fa3cc] text-sm font-medium">Based on shared characteristics and badges</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarStates.map((similarState, index) => (
                <TravelCard key={similarState._id} type="state" data={similarState} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      <StateDiscoverBanner state={state} />

    </div>
  );
};

export default StateDetails;
