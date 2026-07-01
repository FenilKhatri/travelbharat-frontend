import { motion } from "framer-motion";
import { useTripPlanner } from "../context/TripPlannerContext";
import { FiCalendar, FiUsers, FiCompass, FiDollarSign, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useEffect } from "react";

const travelStyles = ["Solo", "Couple", "Family", "Friends", "Group", "Pilgrim"];

const StepDetails = () => {
  const { tripData, updateTripData, nextStep, prevStep } = useTripPlanner();

  // Calculate duration whenever dates change
  useEffect(() => {
    if (tripData.startDate && tripData.endDate) {
      const start = new Date(tripData.startDate);
      const end = new Date(tripData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      updateTripData({ duration: diffDays > 0 ? diffDays : 1 });
    }
  }, [tripData.startDate, tripData.endDate]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 py-10">
      <div>
        <h2 className="text-3xl font-black mb-2 text-[#E85D04]">Trip Details</h2>
        <p className="text-white/60">Let's get the basics down for your trip to {tripData.destination?.name}.</p>
      </div>

      <div className="bg-[#0A0F1A] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-10">
        
        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wider">Trip Name *</label>
          <input 
            type="text" 
            value={tripData.name} 
            onChange={(e) => updateTripData({ name: e.target.value })}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E85D04] font-bold text-lg transition-colors"
            placeholder="e.g. Summer in Goa"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-white/70 mb-2 flex items-center gap-2 uppercase tracking-wider"><FiCalendar /> Start Date</label>
            <input 
              type="date" 
              value={tripData.startDate} 
              onChange={(e) => updateTripData({ startDate: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E85D04] transition-colors [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-white/70 mb-2 flex items-center gap-2 uppercase tracking-wider"><FiCalendar /> End Date</label>
            <input 
              type="date" 
              value={tripData.endDate} 
              onChange={(e) => updateTripData({ endDate: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E85D04] transition-colors [color-scheme:dark]"
            />
          </div>
        </div>

        {tripData.startDate && tripData.endDate && (
           <div className="bg-[#E85D04]/10 border border-[#E85D04]/20 text-[#E85D04] p-4 rounded-xl font-bold">
              Total Duration: {tripData.duration} Days / {tripData.duration - 1} Nights
           </div>
        )}

        {/* Travelers */}
        <div>
          <label className="block text-sm font-bold text-white/70 mb-4 flex items-center gap-2 uppercase tracking-wider"><FiUsers /> Travelers</label>
          <div className="grid grid-cols-3 gap-4">
            {['adults', 'children', 'seniors'].map(type => (
              <div key={type} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center">
                <span className="text-xs uppercase text-white/50 font-bold mb-3">{type}</span>
                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={() => updateTripData({ travelers: { ...tripData.travelers, [type]: Math.max(0, tripData.travelers[type] - 1) } })}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 font-bold text-lg"
                  >-</button>
                  <span className="text-xl font-black w-6 text-center">{tripData.travelers[type]}</span>
                  <button 
                    type="button" 
                    onClick={() => updateTripData({ travelers: { ...tripData.travelers, [type]: tripData.travelers[type] + 1 } })}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 font-bold text-lg"
                  >+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label className="block text-sm font-bold text-white/70 mb-4 flex items-center gap-2 uppercase tracking-wider"><FiCompass /> Travel Type</label>
          <div className="flex flex-wrap gap-3">
            {travelStyles.map(style => {
              const isSelected = tripData.tripType.toLowerCase() === style.toLowerCase();
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => updateTripData({ tripType: style.toLowerCase() })}
                  className={`px-6 py-3 rounded-xl text-sm font-bold border transition-all ${
                    isSelected 
                      ? "bg-[#E85D04] border-[#E85D04] text-white" 
                      : "bg-black/30 border-white/10 text-white/60 hover:border-white/30"
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-bold text-white/70 mb-4 flex items-center justify-between uppercase tracking-wider">
            <span className="flex items-center gap-2"><FiDollarSign /> Estimated Budget</span>
            <span className="text-xl font-black text-[#E85D04]">₹{tripData.budget.toLocaleString('en-IN')}</span>
          </label>
          <input 
            type="range" 
            min="1000" max="1000000" step="1000"
            value={tripData.budget} 
            onChange={(e) => updateTripData({ budget: Number(e.target.value) })}
            className="w-full accent-[#E85D04]"
          />
          <div className="flex justify-between text-xs text-white/40 mt-2 font-bold uppercase tracking-wider">
            <span>₹1K</span>
            <span>₹500K</span>
            <span>₹10L+</span>
          </div>
        </div>

      </div>

      <div className="flex justify-between pt-8">
        <button onClick={prevStep} className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-colors">
          <FiArrowLeft /> Back
        </button>
        <button onClick={nextStep} disabled={!tripData.name || !tripData.startDate || !tripData.endDate} className="bg-[#E85D04] text-white px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-[#D05203] transition-colors shadow-lg disabled:opacity-50">
          Next: Transportation <FiArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default StepDetails;