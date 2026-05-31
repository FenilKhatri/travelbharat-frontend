import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiLoader, FiTrash2, FiPlus, FiNavigation, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import http from "../../../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../../../components/ui/CustomDropdown";

const Trips = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [newTrip, setNewTrip] = useState({ name: "", description: "", startDate: "", endDate: "", tripType: "leisure", budget: 0 });

  const { data, isLoading } = useQuery({
    queryKey: ['userTrips'],
    queryFn: () => http.get("/trips")
  });
  
  const trips = data?.data?.trips || data?.trips || [];

  const deleteMutation = useMutation({
    mutationFn: (id) => http.delete(`/trips/${id}`),
    onSuccess: () => {
      toast.success("Trip deleted successfully");
      queryClient.invalidateQueries(['userTrips']);
    },
    onError: () => toast.error("Failed to delete trip")
  });

  const createMutation = useMutation({
    mutationFn: (payload) => http.post("/trips", payload),
    onSuccess: () => {
      toast.success("Trip created successfully");
      queryClient.invalidateQueries(['userTrips']);
      setIsModalOpen(false);
      setNewTrip({ name: "", description: "", startDate: "", endDate: "", tripType: "leisure", budget: 0 });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create trip")
  });

  const handleCreateTrip = (e) => {
    e.preventDefault();
    createMutation.mutate(newTrip);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-30 pb-24 min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <FiNavigation className="text-[#E85D04]" size={32} />
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">My Trips</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><FiLoader className="animate-spin text-[#E85D04]" size={40} /></div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
          <FiNavigation className="mx-auto text-slate-400 mb-4" size={48} />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No upcoming trips</h3>
          <p className="text-slate-500 mb-6">You haven't planned any trips yet. Start planning your next adventure!</p>
          <button onClick={() => navigate('/places')} className="px-6 py-3 bg-[#E85D04] text-white font-bold rounded-xl hover:bg-[#D05203] transition-colors cursor-pointer">Create a Trip</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
             const firstPlace = trip.places?.[0]?.placeId;
             const coverImage = trip.coverImage || firstPlace?.images?.hero || firstPlace?.images?.thumbnail || firstPlace?.images?.gallery?.[0] || "https://images.unsplash.com/photo-1506461883276-594a12b11ac3?auto=format&fit=crop&q=80";

             return (
             <motion.div key={trip._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition group overflow-hidden flex flex-col">
                <div className="h-44 relative bg-slate-100 dark:bg-slate-800 w-full shrink-0">
                  <img src={coverImage} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                    <div>
                      <h3 className="text-lg font-black text-white line-clamp-1">{trip.name}</h3>
                      <p className="text-xs text-white/80 flex items-center gap-1 mt-1"><FiMapPin size={10} className="text-[#E85D04]"/> {firstPlace?.name || "Multiple Destinations"}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteMutation.mutate(trip._id)} className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-sm text-white/70 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition cursor-pointer opacity-0 group-hover:opacity-100">
                      <FiTrash2 size={16} />
                  </button>
                </div>
                <div className="p-5 flex flex-col flex-1">
                   <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <FiCalendar className="text-slate-400" />
                        {trip.startDate ? new Date(trip.startDate).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'}) : "TBD"} - {trip.endDate ? new Date(trip.endDate).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'}) : "TBD"}
                     </div>
                     <span className="text-xs font-bold text-slate-500">{trip.totalDays || 1} Days</span>
                   </div>
                   
                   <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                       <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${trip.status === 'completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : trip.status === 'upcoming' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                          {trip.status || "DRAFT"}
                       </span>
                       <Link to={`/user/trips/${trip._id}`} className="text-sm font-bold text-[#E85D04] hover:underline">View Details</Link>
                   </div>
                </div>
             </motion.div>
             )
           })}
        </div>
      )}

      {/* Create Trip Modal */}
      <AnimatePresence>
        {isModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-[#0A121F] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                 <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Trip</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"><FiX size={24} /></button>
                 </div>
                 <form onSubmit={handleCreateTrip} className="p-6 space-y-4">
                    <div>
                       <label className="block text-sm font-semibold text-slate-500 mb-1.5">Trip Name *</label>
                       <input required value={newTrip.name} onChange={e => setNewTrip({...newTrip, name: e.target.value})} placeholder="E.g. Summer in Goa" className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
                    </div>
                    <div>
                       <label className="block text-sm font-semibold text-slate-500 mb-1.5">Description</label>
                       <textarea rows={2} value={newTrip.description} onChange={e => setNewTrip({...newTrip, description: e.target.value})} placeholder="What's this trip about?" className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-semibold text-slate-500 mb-1.5">Start Date *</label>
                         <input required type="date" value={newTrip.startDate} onChange={e => setNewTrip({...newTrip, startDate: e.target.value})} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
                       </div>
                       <div>
                         <label className="block text-sm font-semibold text-slate-500 mb-1.5">End Date *</label>
                         <input required type="date" value={newTrip.endDate} onChange={e => setNewTrip({...newTrip, endDate: e.target.value})} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-semibold text-slate-500 mb-1.5">Trip Type</label>
                         <CustomDropdown
                           value={newTrip.tripType}
                           onChange={(val) => setNewTrip({...newTrip, tripType: val})}
                           options={[
                             { value: "leisure", label: "Leisure" },
                             { value: "adventure", label: "Adventure" },
                             { value: "business", label: "Business" },
                             { value: "family", label: "Family" },
                             { value: "spiritual", label: "Spiritual" },
                             { value: "road-trip", label: "Road Trip" },
                           ]}
                           placeholder="Select Type"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-semibold text-slate-500 mb-1.5">Budget (₹)</label>
                         <input type="number" min="0" value={newTrip.budget} onChange={e => setNewTrip({...newTrip, budget: e.target.value})} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
                       </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                       <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-sm transition cursor-pointer">Cancel</button>
                       <button type="submit" disabled={createMutation.isLoading} className="px-6 py-2 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm transition cursor-pointer disabled:opacity-60">Create Trip</button>
                    </div>
                 </form>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Trips;
