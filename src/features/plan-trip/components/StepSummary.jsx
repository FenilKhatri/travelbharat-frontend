import { useState } from "react";
import { useTripPlanner } from "../context/TripPlannerContext";
import { FiArrowLeft, FiCheck, FiSave, FiMapPin, FiCalendar, FiUsers, FiDollarSign } from "react-icons/fi";
import { motion } from "framer-motion";
import http from "../../../lib/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const StepSummary = () => {
  const { tripData, prevStep } = useTripPlanner();
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const totalNights = Math.max(1, tripData.duration - 1);
  const accommCost = tripData.accommodations.reduce((acc, h) => acc + h.pricePerNight * totalNights, 0);
  const remainingBudget = tripData.budget - accommCost;

  const handleSaveTrip = async () => {
    setIsSaving(true);
    try {
      // Map to backend schema
      const payload = {
        name: tripData.name,
        destinationId: tripData.destinationId,
        city: tripData.destination?.cityId?.name,
        state: tripData.destination?.stateId?.name,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        duration: tripData.duration,
        travelers: tripData.travelers,
        tripType: tripData.tripType,
        budget: tripData.budget,
        transportation: tripData.transportation,
        accommodations: tripData.accommodations.map(a => a._id),
        places: tripData.attractions.map(a => ({ placeId: a._id })),
        itinerary: tripData.itinerary,
        estimatedCost: accommCost > 0 ? accommCost : tripData.budget,
        status: "upcoming"
      };

      await http.post("/trips", payload);
      toast.success("Trip saved successfully!");
      navigate("/user/trips");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save trip. Make sure you are logged in.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 py-10">
      <div>
        <h2 className="text-3xl font-black mb-2 text-[#E85D04]">Review & Save</h2>
        <p className="text-white/60">Review your manual trip plan before saving it to your dashboard.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0A0F1A] border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2"><FiMapPin className="text-[#E85D04]" /> {tripData.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-1">Destination</p>
                <p className="font-bold text-sm">{tripData.destination?.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-1">Dates</p>
                <p className="font-bold text-sm text-blue-400">{tripData.startDate} to {tripData.endDate}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-1">Travelers</p>
                <p className="font-bold text-sm">{tripData.travelers.adults}A, {tripData.travelers.children}C</p>
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-1">Type</p>
                <p className="font-bold text-sm capitalize">{tripData.tripType}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0F1A] border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="text-xl font-black mb-4">Selected Stays</h3>
            {tripData.accommodations.length === 0 ? (
              <p className="text-white/40 text-sm">No accommodations selected.</p>
            ) : (
              <div className="space-y-3">
                {tripData.accommodations.map(a => (
                  <div key={a._id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="font-bold text-sm">{a.name}</span>
                    <span className="text-[#E85D04] font-black text-sm">₹{a.pricePerNight}/night</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0A0F1A] border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="text-xl font-black mb-4">Itinerary Overview</h3>
            <div className="space-y-2">
              {tripData.itinerary.map(day => {
                const activityCount = day.activities.length;
                return (
                  <div key={day.dayNumber} className="flex items-center gap-4 text-sm border-b border-white/5 pb-2 last:border-0">
                    <span className="font-bold text-[#E85D04] w-12">Day {day.dayNumber}</span>
                    <span className="text-white/60">{activityCount} activities planned</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Budget & Save */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/10 border border-emerald-500/20 p-6 rounded-3xl">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-emerald-400">
              <FiDollarSign /> Budget Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Your Set Budget</span>
                <span className="font-bold">₹{tripData.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Accommodation Total ({totalNights} Nights)</span>
                <span className="font-bold text-red-400">- ₹{accommCost.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="font-bold text-white/80">Remaining Est.</span>
                <span className={`font-black text-xl ${remainingBudget < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                  ₹{remainingBudget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveTrip}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-[#E85D04] to-[#D05203] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(232,93,4,0.3)] disabled:opacity-70 disabled:hover:scale-100"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><FiSave /> Save My Trip</>
            )}
          </button>
        </div>

      </div>

      <div className="pt-8 mt-10">
        <button onClick={prevStep} className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-colors">
          <FiArrowLeft /> Back to Itinerary
        </button>
      </div>
    </motion.div>
  );
};

export default StepSummary;
