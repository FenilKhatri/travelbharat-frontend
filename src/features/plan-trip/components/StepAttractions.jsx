import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useTripPlanner } from "../context/TripPlannerContext";
import { placeService } from "../../../services/placeService";
import { FiArrowRight, FiArrowLeft, FiPlus, FiCheck } from "react-icons/fi";
import PageLoader from "../../../components/ui/PageLoader";

const StepAttractions = () => {
  const { tripData, updateTripData, nextStep, prevStep } = useTripPlanner();

  const citySlug = tripData.destination?.cityId?.slug;

  const { data, isLoading } = useQuery({
    queryKey: ['attractions', citySlug],
    queryFn: () => placeService.getPlacesByCity(citySlug),
    enabled: !!citySlug
  });

  // Filter out the destination itself
  const attractions = (data?.data?.places || data?.places || []).filter(p => p._id !== tripData.destinationId);

  const toggleAttraction = (place) => {
    const isSelected = tripData.attractions.some(a => a._id === place._id);
    if (isSelected) {
      updateTripData({ attractions: tripData.attractions.filter(a => a._id !== place._id) });
    } else {
      updateTripData({ attractions: [...tripData.attractions, place] });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 py-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black mb-2 text-[#E85D04]">What do you want to see?</h2>
          <p className="text-white/60">Select attractions to add to your itinerary bag.</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-[#E85D04]">{tripData.attractions.length}</span>
          <span className="text-white/50 text-sm ml-2">Selected</span>
        </div>
      </div>

      {isLoading ? (
        <PageLoader fullScreen={false} message="Finding nearby attractions..." size="md" />
      ) : attractions.length === 0 ? (
        <div className="bg-[#0A0F1A] border border-white/10 p-10 rounded-3xl text-center">
          <p className="text-white/50 mb-4">No other attractions found in this city.</p>
          <button onClick={nextStep} className="text-[#E85D04] font-bold underline">Proceed to Itinerary</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {attractions.map((place) => {
            const isSelected = tripData.attractions.some(a => a._id === place._id);
            return (
              <div 
                key={place._id} 
                onClick={() => toggleAttraction(place)}
                className={`bg-[#0A0F1A] border rounded-2xl overflow-hidden cursor-pointer transition-all group ${
                  isSelected ? "border-[#E85D04] shadow-[0_0_15px_rgba(232,93,4,0.2)]" : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="h-32 relative bg-white/5">
                  <img 
                    src={place.images?.thumbnail || place.images?.hero} 
                    alt={place.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                  
                  <div className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                    isSelected ? "bg-[#E85D04] text-white" : "bg-black/50 backdrop-blur-md text-white/70 border border-white/20"
                  }`}>
                    {isSelected ? <FiCheck size={16} /> : <FiPlus size={16} />}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-sm mb-1 line-clamp-1">{place.name}</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold mb-2">
                    {place.category?.replace("-", " ")}
                  </p>
                  <p className="text-xs text-white/60 line-clamp-2">
                    {place.description || place.overview || "A must-visit attraction."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between pt-8 border-t border-white/10 mt-10">
        <button onClick={prevStep} className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-colors">
          <FiArrowLeft /> Back
        </button>
        <button onClick={nextStep} className="bg-[#E85D04] text-white px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-[#D05203] transition-colors shadow-lg">
          Next: Build Itinerary <FiArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default StepAttractions;