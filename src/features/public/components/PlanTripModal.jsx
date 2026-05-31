import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiPlus, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import http from "../../../lib/axios";

const PlanTripModal = ({ isOpen, onClose, placeId, placeName }) => {
  const queryClient = useQueryClient();
  const [selectedTrip, setSelectedTrip] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTripName, setNewTripName] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [totalDays, setTotalDays] = useState(1);
  const [totalPerson, setTotalPerson] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['userTrips'],
    queryFn: () => http.get("/trips"),
    enabled: isOpen
  });

  const trips = data?.data?.trips || data?.trips || [];

  const addPlaceMutation = useMutation({
    mutationFn: (tripId) => http.post(`/trips/${tripId}/add-place`, { placeId }),
    onSuccess: () => {
      toast.success(`${placeName} added to trip!`);
      queryClient.invalidateQueries(['userTrips']);
      onClose();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to add place to trip")
  });

  const createTripMutation = useMutation({
    mutationFn: (name) => {
       const start = journeyDate ? new Date(journeyDate) : new Date();
       const end = new Date(start.getTime() + totalDays * 24 * 60 * 60 * 1000);
       return http.post("/trips", { 
         name, 
         startDate: start.toISOString(), 
         endDate: end.toISOString(),
         totalDays,
         totalPerson
       });
    },
    onSuccess: (res) => {
      const trip = res?.data?.trip || res?.trip;
      if (trip && trip._id) {
        addPlaceMutation.mutate(trip._id);
      } else {
        toast.error("Failed to create trip properly");
      }
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create trip")
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCreatingNew || trips.length === 0) {
      if (!newTripName.trim()) return toast.error("Please enter a trip name");
      createTripMutation.mutate(newTripName);
    } else {
      if (!selectedTrip) return toast.error("Please select a trip");
      addPlaceMutation.mutate(selectedTrip);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-[#0A121F] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Plan a Trip</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"><FiX size={24} /></button>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-500 mb-6">Add <strong className="text-slate-900 dark:text-white">{placeName}</strong> to your itinerary.</p>
            
            {isLoading ? (
              <div className="flex justify-center py-8"><div className="animate-spin w-8 h-8 border-4 border-[#E85D04] border-t-transparent rounded-full" /></div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {trips.length > 0 && !isCreatingNew && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-2">Select Existing Trip</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {trips.map(trip => (
                        <div 
                          key={trip._id} 
                          onClick={() => setSelectedTrip(trip._id)}
                          className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition ${selectedTrip === trip._id ? 'border-[#E85D04] bg-[#E85D04]/5' : 'border-slate-200 dark:border-slate-700 hover:border-[#E85D04]/50'}`}
                        >
                          <div>
                             <p className="font-bold text-slate-900 dark:text-white text-sm">{trip.name}</p>
                             <p className="text-xs text-slate-500">{trip.places?.length || 0} destinations</p>
                          </div>
                          {selectedTrip === trip._id && <FiCheck className="text-[#E85D04]" size={20} />}
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => setIsCreatingNew(true)} className="mt-4 flex items-center gap-2 text-sm font-bold text-[#E85D04] hover:underline">
                      <FiPlus /> Or create a new trip
                    </button>
                  </div>
                )}

                {(trips.length === 0 || isCreatingNew) && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-sm font-semibold text-slate-500 mb-2">New Trip Name</label>
                    <input 
                      autoFocus
                      required
                      value={newTripName} 
                      onChange={(e) => setNewTripName(e.target.value)} 
                      placeholder="E.g. Summer in Goa" 
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 text-slate-900 dark:text-white" 
                    />
                    <label className="block text-sm font-semibold text-slate-500 mb-2 mt-4">Journey Date</label>
                    <input 
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={journeyDate} 
                      onChange={(e) => setJourneyDate(e.target.value)} 
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 text-slate-900 dark:text-white [color-scheme:dark]" 
                    />
                    
                    <div className="flex gap-4 mt-4">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-slate-500 mb-2">Total Days</label>
                        <input 
                          type="number"
                          min="1"
                          required
                          value={totalDays} 
                          onChange={(e) => setTotalDays(Number(e.target.value))} 
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 text-slate-900 dark:text-white" 
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-slate-500 mb-2">Total Persons</label>
                        <input 
                          type="number"
                          min="1"
                          required
                          value={totalPerson} 
                          onChange={(e) => setTotalPerson(Number(e.target.value))} 
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 text-slate-900 dark:text-white" 
                        />
                      </div>
                    </div>

                    {trips.length > 0 && (
                      <button type="button" onClick={() => setIsCreatingNew(false)} className="mt-3 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                        Cancel and select existing
                      </button>
                    )}
                  </motion.div>
                )}

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={addPlaceMutation.isLoading || createTripMutation.isLoading}
                    className="w-full py-3 bg-[#E85D04] hover:bg-[#D05203] text-white font-black rounded-xl transition cursor-pointer disabled:opacity-60 flex justify-center items-center gap-2"
                  >
                    {(addPlaceMutation.isLoading || createTripMutation.isLoading) ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : "Save to Trip"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PlanTripModal;
