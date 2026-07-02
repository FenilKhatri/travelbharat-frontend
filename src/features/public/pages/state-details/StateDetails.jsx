import { useParams, Link } from "react-router-dom";
import { FiMapPin, FiArrowLeft, FiGlobe } from "react-icons/fi";
import { useStateData } from "./hooks/useStateData";
import GalleryCarousel from "../../../../components/ui/GalleryCarousel";

// Components
import StateDetailsSkeleton from "./components/StateDetailsSkeleton";
import StateHero from "./components/StateHero";
import StateQuickFacts from "./components/StateQuickFacts";
import StateWhyVisit from "./components/StateWhyVisit";
import StateDiscover from "./components/StateDiscover";
import StateTimeline from "./components/StateTimeline";
import StateExperiences from "./components/StateExperiences";
import StateFeaturedAttractions from "./components/StateFeaturedAttractions";
import StateFeaturedFestivals from "./components/StateFeaturedFestivals";
import StateCuisine from "./components/StateCuisine";
import StateWildlife from "./components/StateWildlife";
import StateSeasons from "./components/StateSeasons";
import StateTravelInfo from "./components/StateTravelInfo";
import StateTravelTips from "./components/StateTravelTips";
import StateFAQ from "./components/StateFAQ";
import StateNearby from "./components/StateNearby";
import StateCities from "./components/StateCities";
import StateDiscoverBanner from "./components/StateDiscoverBanner";
import StateFunFacts from "./components/StateFunFacts";

const StateDetails = () => {
  const { slug } = useParams();
  const {
    state, stateLoading, stateError,
    cities, citiesLoading
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

  const validGallery = state.gallery?.map(img => img.url).filter(Boolean) || state.images?.gallery?.map(img => img.url).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090f] text-slate-900 dark:text-[#edf2ff] selection:bg-[#E85D04]/30 relative overflow-x-hidden">
      
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

      {/* Hero Section */}
      <StateHero state={state} />

      {/* Remaining Quick Facts */}
      <StateQuickFacts quickFacts={state.quickFacts} />

      {/* Fun Facts */}
      {state.funFacts?.length > 0 && <StateFunFacts funFacts={state.funFacts} />}

      {/* Overview / Why Visit */}
      {state.whyVisit?.length > 0 && <StateWhyVisit whyVisit={state.whyVisit} />}

      {/* Discover / About */}
      {state.discoverSections?.length > 0 && <StateDiscover discoverSections={state.discoverSections} />}

      {/* Timeline */}
      {state.historyTimeline?.length > 0 && <StateTimeline timeline={state.historyTimeline} />}

      {/* Gallery */}
      {validGallery.length > 0 && (
        <div id="gallery">
          <GalleryCarousel images={validGallery} name={state.name} />
        </div>
      )}

      {/* Experiences */}
      {state.experiences?.length > 0 && <StateExperiences experiences={state.experiences} />}

      {/* Top Attractions */}
      {state.featuredAttractions?.length > 0 && <StateFeaturedAttractions featuredAttractions={state.featuredAttractions} slug={slug} />}

      {/* Festivals */}
      {state.featuredFestivals?.length > 0 && <StateFeaturedFestivals featuredFestivals={state.featuredFestivals} slug={slug} />}

      {/* Cities - still a separate query conceptually, passing in to old component */}
      <StateCities state={state} cities={cities} citiesLoading={citiesLoading} slug={slug} />

      {/* Cuisine */}
      {state.featuredCuisine?.length > 0 && <StateCuisine featuredCuisine={state.featuredCuisine} />}

      {/* Wildlife */}
      {state.wildlifeHighlights?.length > 0 && <StateWildlife wildlifeHighlights={state.wildlifeHighlights} />}

      {/* Climate & Seasons */}
      {state.seasons?.length > 0 && <StateSeasons seasons={state.seasons} />}

      {/* Travel Info */}
      {state.travelInfo && <StateTravelInfo travelInfo={state.travelInfo} />}

      {/* Map */}
      {state.mapCoordinates?.coordinates && state.mapCoordinates.coordinates.length === 2 && (
        <section className="h-[450px] w-full border-b border-slate-200 dark:border-white/5">
          <iframe
            title={`${state.name} Map`}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) grayscale(80%) contrast(120%)" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${state.mapCoordinates.coordinates[1]},${state.mapCoordinates.coordinates[0]}&hl=en&z=7&output=embed`}
          />
        </section>
      )}

      {/* Travel Tips */}
      {state.travelTips?.length > 0 && <StateTravelTips travelTips={state.travelTips} />}

      {/* FAQ */}
      {state.faq?.length > 0 && <StateFAQ faq={state.faq} />}

      {/* Nearby States */}
      {state.nearbyStates?.length > 0 && <StateNearby nearbyStates={state.nearbyStates} />}

      {/* Bottom CTA Banner */}
      <StateDiscoverBanner state={state} />

    </div>
  );
};

export default StateDetails;
