import { useQuery } from "@tanstack/react-query";
import { placeService } from "../../../services/placeService";
import { useTripPlanner } from "../context/TripPlannerContext";
import PageLoader from "../../../components/ui/PageLoader";
import { FiArrowLeft, FiArrowRight, FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const StepDestination = () => {
  const { tripData, updateTripData, nextStep } = useTripPlanner();

  const { data: placesData, isLoading: placesLoading } = useQuery({
    queryKey: ['allPlacesForPlanner'],
    queryFn: () => placeService.getAllPlaces({ limit: 100 }),
    enabled: !tripData.destination
  });

  const allPlaces = placesData?.data?.places || placesData?.places || [];

  const handleSelect = (place) => {
    updateTripData({ 
        destinationId: place._id, 
        destination: place,
        name: `Trip to ${place.name}` 
    });
    nextStep();
  };

  if (!tripData.destination) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-center">Where do you want to go?</h1>
        <p className="text-white/60 mb-8 text-center max-w-lg">Select a destination to start planning your perfect itinerary.</p>
        
        {placesLoading ? (
           <PageLoader fullScreen={false} message="Loading destinations..." />
        ) : (
           <div className="w-full max-w-md bg-[#0A0F1A] border border-white/10 rounded-2xl p-4 shadow-2xl">
              <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                 {allPlaces.map((p) => (
                    <button 
                       key={p._id} 
                       onClick={() => handleSelect(p)}
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

  // Pre-selected destination preview
  const place = tripData.destination;
  const heroImage = place.images?.hero || place.images?.thumbnail || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 md:mt-20 pb-20 pt-10">
      <div className="flex justify-start">
      <Link to={-1} className="text-white/60 hover:text-[#E85D04] transition-colors flex items-center gap-2">
        <FiArrowLeft /> Back
      </Link>
      </div>
      <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <img src={heroImage} alt={place.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-black/30" />
        <div className="absolute bottom-8 left-8 right-8">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-2">{place.name}</h1>
            <div className="flex items-center gap-2 text-white/70 font-medium text-lg">
              <FiMapPin className="text-[#E85D04]" />
              <span>{place.cityId?.name}, {place.stateId?.name}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0A0F1A] border border-white/10 p-4 rounded-2xl text-center">
            <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider mb-1">Best Time</p>
            <p className="font-bold text-sm">{place.bestTimeToVisit || "All Year"}</p>
        </div>
        <div className="bg-[#0A0F1A] border border-white/10 p-4 rounded-2xl text-center">
            <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider mb-1">Category</p>
            <p className="font-bold text-sm capitalize">{place.category?.replace("-", " ")}</p>
        </div>
        <div className="bg-[#0A0F1A] border border-white/10 p-4 rounded-2xl text-center">
            <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider mb-1">Rating</p>
            <p className="font-bold text-sm">{place.rating || "4.5"} / 5</p>
        </div>
        <div className="bg-[#0A0F1A] border border-white/10 p-4 rounded-2xl text-center">
            <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider mb-1">Duration</p>
            <p className="font-bold text-sm">{place.duration || "2-3 Days"}</p>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button onClick={nextStep} className="bg-[#E85D04] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-[#D05203] transition-colors shadow-lg">
          Continue to Trip Details <FiArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default StepDestination;
