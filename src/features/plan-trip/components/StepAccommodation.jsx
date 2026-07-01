import { useQuery } from "@tanstack/react-query";
import { useTripPlanner } from "../context/TripPlannerContext";
import { accommodationService } from "../../../services/accommodationService";
import { FiArrowRight, FiArrowLeft, FiStar, FiMapPin, FiCheck } from "react-icons/fi";
import PageLoader from "../../../components/ui/PageLoader";

const StepAccommodation = () => {
  const { tripData, updateTripData, nextStep, prevStep } = useTripPlanner();

  const { data, isLoading } = useQuery({
    queryKey: ['accommodations', tripData.destinationId],
    queryFn: () => accommodationService.getAccommodationsByDestination(tripData.destinationId),
    enabled: !!tripData.destinationId
  });

  const accommodations = data?.data?.accommodations || data?.accommodations || [];

  const toggleAccommodation = (hotel) => {
    const isSelected = tripData.accommodations.some(a => a._id === hotel._id);
    if (isSelected) {
      updateTripData({ accommodations: tripData.accommodations.filter(a => a._id !== hotel._id) });
    } else {
      updateTripData({ accommodations: [...tripData.accommodations, hotel] });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 py-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black mb-2 text-[#E85D04]">Where will you stay?</h2>
          <p className="text-white/60">Select one or more accommodations for your trip.</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-[#E85D04]">{tripData.accommodations.length}</span>
          <span className="text-white/50 text-sm ml-2">Selected</span>
        </div>
      </div>

      {isLoading ? (
        <PageLoader fullScreen={false} message="Finding perfect stays..." size="md" />
      ) : accommodations.length === 0 ? (
        <div className="bg-[#0A0F1A] border border-white/10 p-10 rounded-3xl text-center">
          <p className="text-white/50 mb-4">No accommodations found for this destination yet.</p>
          <button onClick={nextStep} className="text-[#E85D04] font-bold underline">Skip this step</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map((hotel) => {
            const isSelected = tripData.accommodations.some(a => a._id === hotel._id);
            return (
              <div 
                key={hotel._id} 
                onClick={() => toggleAccommodation(hotel)}
                className={`bg-[#0A0F1A] border rounded-2xl overflow-hidden cursor-pointer transition-all group ${
                  isSelected ? "border-[#E85D04] shadow-[0_0_20px_rgba(232,93,4,0.15)] scale-[1.02]" : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="h-48 relative overflow-hidden bg-white/5">
                  <img 
                    src={hotel.images?.hero || hotel.images?.gallery?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                  />
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-[#E85D04] rounded-full flex items-center justify-center text-white shadow-lg">
                      <FiCheck size={20} />
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-bold border border-white/10 uppercase tracking-wider">
                      {hotel.type}
                    </span>
                    <span className="bg-white text-black text-xs px-2 py-1 rounded font-black flex items-center gap-1 shadow-lg">
                      <FiStar className="text-[#E85D04]"/> {hotel.rating}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{hotel.name}</h3>
                  <p className="text-xs text-white/50 flex items-center gap-1 mb-4"><FiMapPin /> {hotel.distanceFromCenter}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-xs text-white/40 uppercase font-bold tracking-wider">Price per night</span>
                    <span className="font-black text-[#E85D04] text-xl">₹{hotel.pricePerNight.toLocaleString()}</span>
                  </div>
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
          Next: Attractions <FiArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default StepAccommodation;