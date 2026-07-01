import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { FiMapPin, FiCalendar, FiDollarSign, FiUsers, FiCompass, FiArrowRight, FiCheck } from "react-icons/fi";
import { placeService } from "../../../services/placeService";
import { tripPlannerService } from "../../../services/tripPlannerService";
import PageLoader from "../../../components/ui/PageLoader";
import { toast } from "react-toastify";

const travelStyles = ["Solo", "Family", "Couple", "Friends", "Adventure", "Luxury", "Budget", "Spiritual", "Road Trip", "Backpacking"];
const interestsList = ["Nature", "Food", "Wildlife", "Beaches", "Heritage", "Shopping", "Photography", "Trekking", "Adventure Sports", "Culture"];

const PlanTrip = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [duration, setDuration] = useState(5);
  const [budget, setBudget] = useState(30000);
  const [selectedStyles, setSelectedStyles] = useState(["Family"]);
  const [selectedInterests, setSelectedInterests] = useState(["Sightseeing"]);
  const [travelers, setTravelers] = useState({ adults: 2, children: 0, seniors: 0 });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['placeDetails', slug],
    queryFn: () => placeService.getPlaceBySlug(slug),
    enabled: !!slug
  });

  const { data: placesData, isLoading: placesLoading } = useQuery({
    queryKey: ['allPlacesForPlanner'],
    queryFn: () => placeService.getAllPlaces({ limit: 100 }),
    enabled: !slug
  });

  const place = data?.data?.place || data?.place;
  const allPlaces = placesData?.data?.places || placesData?.places || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!place) return;

    setIsGenerating(true);
    try {
      const payload = {
        destinationId: place._id,
        duration,
        budget,
        travelStyle: selectedStyles,
        interests: selectedInterests,
        travelers
      };

      const res = await tripPlannerService.generateTrip(payload);
      const generatedTrip = res.data || res;

      // Navigate to results page passing data via state
      navigate('/trip-result', { state: { tripData: generatedTrip } });
    } catch (error) {
      toast.error("Failed to generate itinerary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  if (!slug) {
    return (
      <div className="bg-[#050505] pt-40 min-h-screen font-sans text-white pb-32 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Where do you want to go?</h1>
        <p className="text-white/60 mb-8 text-center max-w-lg">Select a destination to start planning your perfect itinerary with our AI Trip Planner.</p>

        {placesLoading ? (
          <PageLoader fullScreen={false} message="Loading destinations..." />
        ) : (
          <div className="w-full max-w-md bg-[#0A0F1A] border border-white/10 rounded-2xl p-4 shadow-2xl">
            <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2 space-y-2">
              {allPlaces.map((p) => (
                <button
                  key={p._id}
                  onClick={() => navigate(`/plan/${p.slug}`)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 text-left"
                >
                  <img src={p.images?.thumbnail || p.images?.hero} className="w-12 h-12 rounded-lg object-cover bg-white/10" alt="" />
                  <div>
                    <h4 className="font-bold">{p.name}</h4>
                    <p className="text-xs text-white/50">{p.cityId?.name}, {p.stateId?.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isLoading) return <div className="min-h-screen bg-[#050505]"><PageLoader fullScreen={false} message="Loading Planner..." size="md" /></div>;
  if (isError || !place) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white text-2xl">Destination not found.</div>;

  const heroImage = place.images?.hero || place.images?.thumbnail || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80";

  return (
    <div className="bg-[#050505] min-h-screen font-sans text-white pb-32">
      {/* DESTINATION PREVIEW */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <img src={heroImage} alt={place.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/80 to-black/30" />
        </div>
        <div className="relative z-10 max-w-[1600px] mx-auto w-full px-4 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="bg-[#E85D04]/20 text-[#E85D04] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-[#E85D04]/30 mb-4 inline-block">
              AI Trip Planner
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-2">
              Plan your trip to <span className="text-[#E85D04]">{place.name}</span>
            </h1>
            <div className="flex items-center gap-2 text-white/70 font-medium">
              <FiMapPin className="text-[#E85D04]" />
              <span>{place.cityId?.name}, {place.stateId?.name}</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[100px]">
              <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider mb-1">Best Time</p>
              <p className="font-bold text-sm">{place.bestTimeToVisit || "All Year"}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[100px]">
              <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider mb-1">Category</p>
              <p className="font-bold text-sm capitalize">{place.category?.replace("-", " ")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANNER FORM */}
      <section className="max-w-4xl mx-auto px-4 -mt-6 relative z-20">
        <form onSubmit={handleGenerate} className="bg-[#0A0F1A] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">

          <div className="space-y-10">
            {/* DURATION */}
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <FiCalendar className="text-[#E85D04]" /> Trip Duration
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1" max="15"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-[#E85D04]"
                />
                <span className="bg-[#E85D04]/20 text-[#E85D04] font-black px-4 py-2 rounded-xl min-w-[80px] text-center border border-[#E85D04]/30">
                  {duration} Days
                </span>
              </div>
            </div>

            {/* BUDGET */}
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <FiDollarSign className="text-[#E85D04]" /> Estimated Budget (₹)
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5000" max="200000" step="1000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-[#E85D04]"
                />
                <span className="bg-[#E85D04]/20 text-[#E85D04] font-black px-4 py-2 rounded-xl min-w-[120px] text-center border border-[#E85D04]/30">
                  ₹{budget.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-xs text-white/40 mt-2 font-bold uppercase tracking-wider">
                <span>Budget</span>
                <span>Mid Range</span>
                <span>Luxury</span>
              </div>
            </div>

            {/* TRAVEL STYLE */}
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <FiCompass className="text-[#E85D04]" /> Travel Style
              </h3>
              <div className="flex flex-wrap gap-3">
                {travelStyles.map(style => {
                  const isSelected = selectedStyles.includes(style);
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleSelection(style, selectedStyles, setSelectedStyles)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all ${isSelected
                          ? "bg-[#E85D04] border-[#E85D04] text-white"
                          : "bg-transparent border-white/20 text-white/60 hover:border-white/50"
                        }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* INTERESTS */}
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <FiMapPin className="text-[#E85D04]" /> Interests
              </h3>
              <div className="flex flex-wrap gap-3">
                {interestsList.map(interest => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleSelection(interest, selectedInterests, setSelectedInterests)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all ${isSelected
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-transparent border-white/20 text-white/60 hover:border-white/50"
                        }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TRAVELERS */}
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                <FiUsers className="text-[#E85D04]" /> Travelers
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {['adults', 'children', 'seniors'].map(type => (
                  <div key={type} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center">
                    <span className="text-xs uppercase text-white/50 font-bold mb-3">{type}</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setTravelers({ ...travelers, [type]: Math.max(0, travelers[type] - 1) })}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 font-bold text-lg"
                      >-</button>
                      <span className="text-xl font-black w-6 text-center">{travelers[type]}</span>
                      <button
                        type="button"
                        onClick={() => setTravelers({ ...travelers, [type]: travelers[type] + 1 })}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 font-bold text-lg"
                      >+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-linear-to-r from-[#E85D04] to-[#D05203] text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(232,93,4,0.3)] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isGenerating ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating AI Itinerary...</span>
                </div>
              ) : (
                <>
                  Generate My Trip Itinerary <FiArrowRight />
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default PlanTrip;