import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { FiCalendar, FiMapPin, FiTrash2, FiPlus, FiNavigation, FiCopy, FiShare2, FiDownload, FiEdit2, FiMoreVertical } from "react-icons/fi";
import PageLoader from "../../../components/ui/PageLoader";
import { toast } from "react-toastify";
import http from "../../../lib/axios";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { id: "upcoming", label: "Upcoming Trips" },
  { id: "ongoing", label: "Ongoing" },
  { id: "completed", label: "Completed" },
  { id: "draft", label: "Saved Drafts" }
];

const Trips = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [openMenuId, setOpenMenuId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['userTrips'],
    queryFn: () => http.get("/trips")
  });

  const allTrips = data?.data?.trips || data?.trips || [];
  const filteredTrips = allTrips.filter(trip => trip.status === activeTab);

  const deleteMutation = useMutation({
    mutationFn: (id) => http.delete(`/trips/${id}`),
    onSuccess: () => {
      toast.success("Trip deleted successfully");
      queryClient.invalidateQueries(['userTrips']);
    },
    onError: () => toast.error("Failed to delete trip")
  });

  const duplicateMutation = useMutation({
    mutationFn: (id) => http.post(`/trips/${id}/duplicate`),
    onSuccess: () => {
      toast.success("Trip duplicated successfully");
      queryClient.invalidateQueries(['userTrips']);
      setActiveTab("draft");
    },
    onError: () => toast.error("Failed to duplicate trip")
  });

  const toggleMenu = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleShare = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out my Trip Plan!',
          url: `${window.location.origin}/user/trips/${id}`
        });
      } else {
        navigator.clipboard.writeText(`${window.location.origin}/user/trips/${id}`);
        toast.success("Trip link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing", err);
    }
    setOpenMenuId(null);
  };

  const handleDownload = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/user/trips/${id}?print=true`);
    setOpenMenuId(null);
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 pt-30 pb-24 min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <FiNavigation className="text-[#E85D04]" size={32} />
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">My Trips</h1>
        </div>
        <button
          onClick={() => navigate('/plan')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#E85D04] text-white font-black tracking-wider rounded-xl hover:bg-[#D05203] transition-colors shadow-lg hover:shadow-xl hover:scale-[1.02]"
        >
          <FiPlus size={20} />
          <span>PLAN NEW TRIP</span>
        </button>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-2 custom-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors whitespace-nowrap ${activeTab === tab.id
                ? "bg-[#E85D04] text-white shadow-md"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
          >
            {tab.label}
            <span className="ml-2 bg-black/10 px-2 py-0.5 rounded-full text-xs">
              {allTrips.filter(t => t.status === tab.id).length}
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageLoader fullScreen={false} message="Loading your journeys..." size="md" />
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0A121F] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
          <FiNavigation className="mx-auto text-slate-400 mb-4" size={48} />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No {activeTab} trips</h3>
          <p className="text-slate-500 mb-6">You don't have any trips in this category right now.</p>
          <button onClick={() => navigate('/plan')} className="px-6 py-3 bg-[#E85D04] text-white font-bold rounded-xl hover:bg-[#D05203] transition-colors shadow-lg">Start Planning</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTrips.map((trip) => {
            const firstPlace = trip.destinationId || trip.places?.[0]?.placeId;
            let coverImg = trip.coverImage || firstPlace?.heroImage || firstPlace?.images?.hero || firstPlace?.images?.thumbnail || firstPlace?.images?.gallery?.[0];
            const coverImage = (coverImg && coverImg.trim() !== "") ? coverImg : "https://images.unsplash.com/photo-1506461883276-594a12b11ac3?auto=format&fit=crop&q=80";

            return (
              <motion.div key={trip._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col relative">

                {/* Image Header */}
                <div className="h-48 relative w-full shrink-0 cursor-pointer rounded-t-3xl" onClick={() => navigate(`/user/trips/${trip._id}`)}>
                  <img src={coverImage} alt={trip.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 rounded-t-3xl" />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0A121F] via-transparent to-black/40 rounded-t-3xl" />

                  {/* Context Menu Button */}
                  <button onClick={(e) => toggleMenu(e, trip._id)} className="absolute top-4 right-4 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition z-50 relative">
                    <FiMoreVertical />
                  </button>

                  {/* Context Menu Dropdown */}
                  <AnimatePresence>
                    {openMenuId === trip._id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, originTopRight: true }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-14 right-4 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-[60] py-1"
                      >
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/user/trips/${trip._id}`); }} className="w-full text-left px-4 py-2 text-sm font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"><FiEdit2 /> View & Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); duplicateMutation.mutate(trip._id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"><FiCopy /> Duplicate</button>
                        <button onClick={(e) => handleShare(e, trip._id)} className="w-full text-left px-4 py-2 text-sm font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"><FiShare2 /> Share Trip</button>
                        <button onClick={(e) => handleDownload(e, trip._id)} className="w-full text-left px-4 py-2 text-sm font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"><FiDownload /> Download PDF</button>
                        <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                        <button onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(trip._id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm font-bold flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"><FiTrash2 /> Delete Trip</button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="text-xl font-black text-white line-clamp-1 mb-1">{trip.name}</h3>
                    <p className="text-xs text-white/80 font-bold flex items-center gap-1">
                      <FiMapPin className="text-[#E85D04]" /> {trip.city ? `${trip.city}, ${trip.state}` : (firstPlace?.name || "Multiple Destinations")}
                    </p>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 flex flex-col flex-1 bg-white dark:bg-[#0A121F] cursor-pointer" onClick={() => navigate(`/user/trips/${trip._id}`)}>
                  <div className="flex items-center justify-between mb-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                      <FiCalendar className="text-[#E85D04]" size={16} />
                      <div>
                        {trip.startDate ? new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "TBD"}
                        <span className="mx-1">→</span>
                        {trip.endDate ? new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "TBD"}
                      </div>
                    </div>
                    <span className="text-xs font-black bg-white dark:bg-slate-800 px-2 py-1 rounded shadow-sm border border-slate-200 dark:border-slate-700">
                      {trip.duration || 1} Days
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Est. Budget</span>
                      <span className="font-black text-lg text-slate-900 dark:text-white">
                        {trip.estimatedCost ? `₹${trip.estimatedCost.toLocaleString()}` : (trip.budget ? `₹${trip.budget.toLocaleString()}` : "N/A")}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Travelers</span>
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                        {trip.travelers ? `${trip.travelers.adults}A, ${trip.travelers.children}C` : `${trip.totalPerson || 1} Person`}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Global Click Handler to close menus */}
      {openMenuId && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)}></div>
      )}
    </div>
  );
};

export default Trips;
