import { useEffect } from "react";
import { useTripPlanner } from "../context/TripPlannerContext";
import { FiArrowRight, FiArrowLeft, FiPlus, FiTrash2, FiMapPin } from "react-icons/fi";

const TIMESLOTS = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
  { id: "night", label: "Night" }
];

const StepItinerary = () => {
  const { tripData, updateTripData, nextStep, prevStep } = useTripPlanner();
  
  // Initialize itinerary if empty based on duration
  useEffect(() => {
    if (tripData.itinerary.length !== tripData.duration) {
      const newItinerary = Array.from({ length: tripData.duration }, (_, i) => {
        const existingDay = tripData.itinerary.find(day => day.dayNumber === i + 1);
        if (existingDay) return existingDay;
        
        return {
          dayNumber: i + 1,
          title: `Day ${i + 1}`,
          activities: []
        };
      });
      updateTripData({ itinerary: newItinerary });
    }
  }, [tripData.duration]);

  const addActivity = (dayIndex, timeSlot) => {
    const newItinerary = [...tripData.itinerary];
    newItinerary[dayIndex].activities.push({
      id: Date.now().toString(),
      timeSlot,
      description: "",
      activityType: "other"
    });
    updateTripData({ itinerary: newItinerary });
  };

  const updateActivity = (dayIndex, activityIndex, field, value) => {
    const newItinerary = [...tripData.itinerary];
    newItinerary[dayIndex].activities[activityIndex][field] = value;
    updateTripData({ itinerary: newItinerary });
  };

  const removeActivity = (dayIndex, activityIndex) => {
    const newItinerary = [...tripData.itinerary];
    newItinerary[dayIndex].activities.splice(activityIndex, 1);
    updateTripData({ itinerary: newItinerary });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 py-10">
      <div>
        <h2 className="text-3xl font-black mb-2 text-[#E85D04]">Build Your Itinerary</h2>
        <p className="text-white/60">Manually slot your selected attractions or add custom activities for each day.</p>
      </div>

      {tripData.attractions.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-2xl mb-8">
          <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2"><FiMapPin /> Your Selected Attractions</h4>
          <div className="flex flex-wrap gap-2">
            {tripData.attractions.map(a => (
              <span key={a._id} className="bg-black/40 px-3 py-1.5 rounded-full text-xs font-bold border border-white/10">{a.name}</span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {tripData.itinerary.map((day, dayIndex) => (
          <div key={day.dayNumber} className="bg-[#0A0F1A] border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="text-xl font-black mb-6 text-[#E85D04]">Day {day.dayNumber}</h3>
            
            <div className="space-y-6">
              {TIMESLOTS.map(slot => {
                const activitiesInSlot = day.activities.filter(a => a.timeSlot === slot.id);
                
                return (
                  <div key={slot.id} className="relative pl-6 border-l-2 border-white/5 pb-4">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#0A0F1A] border-2 border-white/20"></div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-white/80 uppercase tracking-wider text-sm">{slot.label}</h4>
                      <button 
                        onClick={() => addActivity(dayIndex, slot.id)}
                        className="text-xs font-bold text-[#E85D04] hover:text-white transition-colors flex items-center gap-1"
                      >
                        <FiPlus /> Add Activity
                      </button>
                    </div>

                    <div className="space-y-3">
                      {activitiesInSlot.map((activity, _idx) => {
                        // Find true index in the main activities array
                        const activityIndex = day.activities.findIndex(a => a.id === activity.id);
                        
                        return (
                          <div key={activity.id} className="flex gap-3 items-start bg-black/40 p-3 rounded-xl border border-white/5">
                            <div className="flex-1 space-y-2">
                              <select 
                                value={activity.activityType}
                                onChange={(e) => updateActivity(dayIndex, activityIndex, 'activityType', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E85D04]"
                              >
                                <option value="other">Custom Activity</option>
                                <option value="place">Visit Attraction</option>
                                <option value="food">Dining / Food</option>
                                <option value="travel">Travel / Transit</option>
                              </select>
                              
                              {activity.activityType === 'place' && tripData.attractions.length > 0 ? (
                                <select
                                  value={activity.description}
                                  onChange={(e) => updateActivity(dayIndex, activityIndex, 'description', e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E85D04]"
                                >
                                  <option value="">Select an attraction...</option>
                                  {tripData.attractions.map(a => (
                                    <option key={a._id} value={a.name}>{a.name}</option>
                                  ))}
                                </select>
                              ) : (
                                <input 
                                  type="text" 
                                  placeholder="E.g., Relax at the beach, Lunch at XYZ" 
                                  value={activity.description}
                                  onChange={(e) => updateActivity(dayIndex, activityIndex, 'description', e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E85D04]"
                                />
                              )}
                            </div>
                            <button 
                              onClick={() => removeActivity(dayIndex, activityIndex)}
                              className="p-2 text-white/30 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                      {activitiesInSlot.length === 0 && (
                        <p className="text-xs text-white/30 italic">No activities planned.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-8 border-t border-white/10 mt-10">
        <button onClick={prevStep} className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-colors">
          <FiArrowLeft /> Back
        </button>
        <button onClick={nextStep} className="bg-[#E85D04] text-white px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-[#D05203] transition-colors shadow-lg">
          Next: Review Summary <FiArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default StepItinerary;