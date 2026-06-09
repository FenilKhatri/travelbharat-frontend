import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiActivity, FiChevronLeft, FiImage, FiFileText, FiTrash2, FiPlus, FiUploadCloud, FiShare2 } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { motion } from "framer-motion";
import http from "../../../lib/axios";
import PageLoader from "../../../components/ui/PageLoader";
import CustomDropdown from "../../../components/ui/CustomDropdown";

const TripDetails = () => {
  const { tripId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const location = useLocation();

  useEffect(() => {
    const isPrint = new URLSearchParams(location.search).get('print');
    if (isPrint === 'true') {
      setTimeout(() => window.print(), 1000);
    }
  }, [location.search]);
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: "", amount: "", category: "food" });

  const uploadGalleryMutation = useMutation({
    mutationFn: async (formData) => http.post(`/trips/${tripId}/gallery`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => { toast.success("Files uploaded successfully"); queryClient.invalidateQueries(['tripDetails', tripId]); },
    onError: (err) => toast.error(err.response?.data?.message || "Upload failed")
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (imageId) => http.delete(`/trips/${tripId}/gallery/${imageId}`),
    onSuccess: () => { toast.success("File deleted"); queryClient.invalidateQueries(['tripDetails', tripId]); }
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (data) => http.post(`/trips/${tripId}/expenses`, data),
    onSuccess: () => { toast.success("Expense added"); setNewExpense({ title: "", amount: "", category: "food" }); queryClient.invalidateQueries(['tripDetails', tripId]); }
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId) => http.delete(`/trips/${tripId}/expenses/${expenseId}`),
    onSuccess: () => { toast.success("Expense deleted"); queryClient.invalidateQueries(['tripDetails', tripId]); }
  });

  const [newItineraryDay, setNewItineraryDay] = useState({ dayNumber: 1, title: "", activityTime: "", activityDesc: "", activityType: "place" });

  const addItineraryDayMutation = useMutation({
    mutationFn: async (data) => http.post(`/trips/${tripId}/itinerary`, data),
    onSuccess: () => { toast.success("Itinerary day added"); queryClient.invalidateQueries(['tripDetails', tripId]); }
  });

  const deleteItineraryDayMutation = useMutation({
    mutationFn: async (dayId) => http.delete(`/trips/${tripId}/itinerary/${dayId}`),
    onSuccess: () => { toast.success("Itinerary day deleted"); queryClient.invalidateQueries(['tripDetails', tripId]); }
  });

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (files.length > 10) return toast.error("Maximum 10 files allowed at a time");
    
    for (let f of files) {
      if (f.size > 25 * 1024 * 1024) return toast.error(`File ${f.name} exceeds 25MB limit`);
    }

    const formData = new FormData();
    files.forEach(f => formData.append("gallery", f));
    
    setIsUploading(true);
    uploadGalleryMutation.mutate(formData, { onSettled: () => setIsUploading(false) });
  };

  const { data, isLoading } = useQuery({
    queryKey: ['tripDetails', tripId],
    queryFn: async () => {
      const res = await http.get(`/trips/${tripId}`);
      return res.data?.data?.trip || res.data?.trip;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24">
        <PageLoader fullScreen={false} message="Loading trip..." size="md" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-slate-400">
        <h2 className="text-2xl font-bold text-white mb-2">Trip Not Found</h2>
        <p>The trip you are looking for does not exist or you don't have access.</p>
        <Link to="/user/trips" className="mt-4 text-[#E85D04] hover:underline">Return to Trips</Link>
      </div>
    );
  }

  const trip = data;
  const firstPlace = trip.destinationId || trip.places?.[0]?.placeId;
  let coverImg = trip.coverImage || firstPlace?.heroImage || firstPlace?.images?.hero || firstPlace?.images?.thumbnail || firstPlace?.images?.gallery?.[0];
  const coverImage = (coverImg && coverImg.trim() !== "") ? coverImg : "https://images.unsplash.com/photo-1506461883276-594a12b11ac3?auto=format&fit=crop&q=80";
  
  const TABS = [
    { id: "overview", label: "Overview", icon: FiFileText },
    { id: "itinerary", label: "Itinerary", icon: FiMapPin },
    { id: "expenses", label: "Expenses", icon: FaRupeeSign },
    { id: "gallery", label: "Gallery", icon: FiImage },
    { id: "timeline", label: "Activity", icon: FiActivity },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white pt-24 pb-20 selection:bg-[#FF7A00] selection:text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Top Back Link & Share */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/user/trips" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition">
            <FiChevronLeft /> Back to Trips
          </Link>
          <button 
            onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: 'Check out my Trip Plan!',
                    url: window.location.href,
                  });
                } catch (err) {
                  console.error(err);
                }
              }
            }}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer"
          >
            <FiShare2 /> Share Trip
          </button>
        </div>

        {/* HERO SECTION */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-8 border border-white/10">
          <img 
            src={coverImage} 
            alt={trip.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${trip.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : trip.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                  {trip.status || "Planned"}
                </span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                  {trip.tripType || "Leisure"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{trip.name}</h1>
              <p className="text-white/70 max-w-2xl">{trip.description || firstPlace?.overview || "No description provided."}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 md:gap-6 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-wider font-bold mb-1">Duration</p>
                <div className="flex items-center gap-1.5 font-semibold"><FiCalendar className="text-[#FF7A00]" /> {trip.totalDays || 1} Days</div>
              </div>
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-wider font-bold mb-1">Travelers</p>
                <div className="flex items-center gap-1.5 font-semibold"><FiUsers className="text-[#FF7A00]" /> {trip.totalPerson || 1} People</div>
              </div>
              <div>
                <p className="text-white/50 text-[10px] uppercase tracking-wider font-bold mb-1">Budget</p>
                <div className="flex items-center gap-1.5 font-semibold capitalize"><FaRupeeSign className="text-[#FF7A00]" /> {trip.budget || "Moderate"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT: TABS SIDEBAR */}
          <div className="lg:col-span-1 relative z-50">
            <div className="bg-[#0A121F] border border-white/5 rounded-2xl p-2 sticky top-28 shadow-2xl">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all cursor-pointer relative z-50 ${isActive ? "bg-[#FF7A00]/10 text-[#FF7A00]" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                  >
                    <Icon size={18} /> {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* RIGHT: TAB CONTENT */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0A121F] border border-white/5 rounded-3xl p-6 md:p-8 min-h-[500px]"
            >
              
              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><FiFileText className="text-[#FF7A00]" /> Trip Overview</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                       <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Start Date</h3>
                       <p className="font-bold text-lg">{trip.startDate ? new Date(trip.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Not set"}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                       <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">End Date</h3>
                       <p className="font-bold text-lg">{trip.endDate ? new Date(trip.endDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Not set"}</p>
                    </div>
                  </div>

                  {trip.places?.map((p, i) => {
                    const place = p.placeId;
                    if (!place) return null;
                    return (
                      <div key={i} className="mb-12 pb-8 border-b border-white/10 last:border-0 last:pb-0">
                        <h3 className="font-black text-xl mb-4 text-[#FF7A00] flex items-center gap-2">
                          <FiMapPin /> {place.name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                           <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                              <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Location</h3>
                              <p className="font-bold">{place.cityId?.name}, {place.stateId?.name}</p>
                           </div>
                           <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                              <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Category</h3>
                              <p className="font-bold capitalize">{place.category}</p>
                           </div>
                           <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                              <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Best Time</h3>
                              <p className="font-bold">{place.bestTimeToVisit || "Year round"}</p>
                           </div>
                           {place.entryFee && (
                             <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Entry Fee</h3>
                                <p className="font-bold">{place.entryFee?.indian !== "Free" ? `${place.entryFee.indian} (Indians)` : "Free"}</p>
                             </div>
                           )}
                           {place.timings && (
                             <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Timings</h3>
                                <p className="font-bold">{place.timings}</p>
                             </div>
                           )}
                           {place.location?.coordinates && place.location.coordinates.length === 2 && (
                             <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                                <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Coordinates</h3>
                                <p className="font-bold text-sm">{place.location.coordinates[1].toFixed(4)}° N, {place.location.coordinates[0].toFixed(4)}° E</p>
                             </div>
                           )}
                        </div>

                        {place.overview && (
                          <div className="mb-6">
                            <h4 className="font-bold mb-3 text-lg">Destination Overview</h4>
                            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white/70 whitespace-pre-wrap leading-relaxed">
                              {place.overview}
                            </div>
                          </div>
                        )}

                        {place.highlights && place.highlights.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-bold mb-3 text-lg">Highlights</h4>
                            <ul className="list-disc list-inside bg-white/5 border border-white/10 p-5 rounded-2xl text-white/70 space-y-2">
                              {place.highlights.map((item, idx) => (
                                 <li key={idx}>{item.title}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {place.travelTips && place.travelTips.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-bold mb-3 text-lg">Travel Tips</h4>
                            <ul className="list-disc list-inside bg-white/5 border border-white/10 p-5 rounded-2xl text-white/70 space-y-2">
                              {place.travelTips.map((item, idx) => (
                                 <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  <div>
                     <h3 className="font-bold mb-3 text-lg">Destinations ({trip.places?.length || 0})</h3>
                     <div className="flex flex-wrap gap-3">
                        {trip.places?.map((p, i) => (
                          <div key={i} className="flex items-center gap-2 bg-[#FF7A00]/10 border border-[#FF7A00]/20 px-4 py-2 rounded-xl text-[#FF7A00] font-bold text-sm">
                             <FiMapPin /> {p.placeId?.name || "Unknown Place"}
                          </div>
                        ))}
                        {(!trip.places || trip.places.length === 0) && (
                          <p className="text-white/50 text-sm">No destinations added yet.</p>
                        )}
                     </div>
                  </div>

                  <div>
                    <h3 className="font-bold mb-3 text-lg">Notes</h3>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white/70 whitespace-pre-wrap">
                      {trip.notes || "No notes for this trip."}
                    </div>
                  </div>
                </div>
              )}

              {/* ITINERARY TAB */}
              {activeTab === "itinerary" && (
                <div>
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><FiMapPin className="text-[#FF7A00]" /> Itinerary</h2>
                  
                  {/* Add Day Form */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newItineraryDay.title || !newItineraryDay.activityDesc) return;
                    addItineraryDayMutation.mutate({
                      dayNumber: newItineraryDay.dayNumber,
                      title: newItineraryDay.title,
                      activities: [{
                        time: newItineraryDay.activityTime,
                        description: newItineraryDay.activityDesc,
                        activityType: newItineraryDay.activityType
                      }]
                    });
                  }} className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8">
                    <h3 className="font-bold mb-4 text-white">Plan Your Day</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input 
                        type="number" placeholder="Day Number" min="1"
                        value={newItineraryDay.dayNumber} onChange={e => setNewItineraryDay({...newItineraryDay, dayNumber: Number(e.target.value)})}
                        className="bg-[#0A121F] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF7A00]" required 
                      />
                      <input 
                        type="text" placeholder="Day Title (e.g. Arrival & Beach)" 
                        value={newItineraryDay.title} onChange={e => setNewItineraryDay({...newItineraryDay, title: e.target.value})}
                        className="bg-[#0A121F] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF7A00]" required 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <input 
                        type="time" 
                        value={newItineraryDay.activityTime} onChange={e => setNewItineraryDay({...newItineraryDay, activityTime: e.target.value})}
                        className="bg-[#0A121F] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF7A00]" required 
                      />
                      <input 
                        type="text" placeholder="Activity (e.g. Lunch at Cafe)" 
                        value={newItineraryDay.activityDesc} onChange={e => setNewItineraryDay({...newItineraryDay, activityDesc: e.target.value})}
                        className="bg-[#0A121F] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF7A00] md:col-span-2" required 
                      />
                      <CustomDropdown
                        value={newItineraryDay.activityType}
                        onChange={(val) => setNewItineraryDay({...newItineraryDay, activityType: val})}
                        options={[
                          { value: "place", label: "Place to Visit" },
                          { value: "food", label: "Food & Dining" },
                          { value: "travel", label: "Travel/Transit" },
                          { value: "other", label: "Other Activity" },
                        ]}
                      />
                    </div>
                    <button type="submit" disabled={addItineraryDayMutation.isPending} className="mt-4 bg-[#FF7A00] hover:bg-[#E85D04] text-white font-bold rounded-xl px-6 py-2.5 transition disabled:opacity-50">
                      {addItineraryDayMutation.isPending ? 'Saving...' : 'Add to Itinerary'}
                    </button>
                  </form>

                  {/* Itinerary List */}
                  {trip.itinerary?.length > 0 ? (
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 md:before:ml-[2.25rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                      {trip.itinerary.map((day, idx) => (
                        <div key={day._id || idx} className="relative flex items-start gap-6 group">
                          <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-[#0A121F] bg-white/10 text-white font-bold shadow shrink-0 z-10">
                            D{day.dayNumber}
                          </div>
                          <div className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl">
                            <div className="flex items-start justify-between mb-4">
                              <h3 className="font-bold text-lg text-[#FF7A00]">{day.title}</h3>
                              <button onClick={() => deleteItineraryDayMutation.mutate(day._id)} className="text-white/20 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                                <FiTrash2 />
                              </button>
                            </div>
                            <div className="space-y-3">
                              {day.activities.map((act, actIdx) => (
                                <div key={actIdx} className="flex gap-4 items-start bg-[#0A121F]/50 p-3 rounded-xl border border-white/5">
                                  <span className="font-mono text-sm text-white/50 bg-white/5 px-2 py-1 rounded">{act.time}</span>
                                  <div>
                                    <p className="text-white/90">{act.description}</p>
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-white/30">{act.activityType}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-3xl">
                       <FiMapPin className="mx-auto text-white/20 mb-3" size={40} />
                       <p className="text-white/50 font-bold mb-2">Itinerary Builder</p>
                       <p className="text-sm text-white/40">Plan your days by adding activities above.</p>
                    </div>
                  )}
                </div>
              )}

              {/* EXPENSES TAB */}
              {activeTab === "expenses" && (
                <div>
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><FaRupeeSign className="text-[#FF7A00]" /> Trip Expenses</h2>
                  
                  {/* Total Expense Summary */}
                  <div className="bg-[#E85D04]/10 border border-[#E85D04]/20 p-6 rounded-2xl mb-8 flex justify-between items-center">
                    <div>
                      <p className="text-[#E85D04] text-sm font-bold uppercase tracking-wider mb-1">Total Spent</p>
                      <h3 className="text-4xl font-black text-white">
                        <FaRupeeSign className="inline -mt-1 mr-1" size={24}/>
                        {trip.expenses?.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString() || 0}
                      </h3>
                    </div>
                  </div>

                  {/* Add Expense Form */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newExpense.title || !newExpense.amount) return;
                    addExpenseMutation.mutate(newExpense);
                  }} className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8">
                    <h3 className="font-bold mb-4 text-white">Add New Expense</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <input 
                        type="text" placeholder="Expense Title (e.g. Dinner)" 
                        value={newExpense.title} onChange={e => setNewExpense({...newExpense, title: e.target.value})}
                        className="bg-[#0A121F] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF7A00]" required 
                      />
                      <input 
                        type="number" placeholder="Amount ()" 
                        value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                        className="bg-[#0A121F] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF7A00]" required min="1"
                      />
                      <CustomDropdown
                        value={newExpense.category}
                        onChange={(val) => setNewExpense({...newExpense, category: val})}
                        options={[
                          { value: "food", label: "Food" },
                          { value: "transport", label: "Transport" },
                          { value: "accommodation", label: "Accommodation" },
                          { value: "shopping", label: "Shopping" },
                          { value: "activities", label: "Activities" },
                          { value: "other", label: "Other" },
                        ]}
                      />
                      <button type="submit" disabled={addExpenseMutation.isPending} className="bg-[#FF7A00] hover:bg-[#E85D04] text-white font-bold rounded-xl px-4 py-2.5 transition disabled:opacity-50">
                        {addExpenseMutation.isPending ? 'Adding...' : 'Add Expense'}
                      </button>
                    </div>
                  </form>

                  {/* Expenses List */}
                  {trip.expenses?.length > 0 ? (
                    <div className="space-y-3">
                      {trip.expenses.map((expense, idx) => (
                        <div key={expense._id || idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 capitalize font-bold text-xs">
                              {expense.category[0]}
                            </div>
                            <div>
                              <h4 className="font-bold text-white">{expense.title}</h4>
                              <p className="text-xs text-white/50 capitalize">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-white">{expense.amount.toLocaleString()}</span>
                            <button onClick={() => deleteExpenseMutation.mutate(expense._id)} className="text-white/20 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-3xl">
                       <FaRupeeSign className="mx-auto text-white/20 mb-3" size={40} />
                       <p className="text-white/50 font-bold mb-2">No Expenses Yet</p>
                       <p className="text-sm text-white/40">Track your budget by adding your first expense above.</p>
                    </div>
                  )}
                </div>
              )}

              {/* GALLERY TAB */}
              {activeTab === "gallery" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black flex items-center gap-2"><FiImage className="text-[#FF7A00]" /> Memories</h2>
                    
                    <label className="cursor-pointer bg-[#FF7A00]/10 text-[#FF7A00] font-bold rounded-xl px-4 py-2 border border-[#FF7A00]/20 hover:bg-[#FF7A00] hover:text-white transition flex items-center gap-2">
                      {isUploading ? 'Uploading...' : <><FiUploadCloud /> Upload Media</>}
                      <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                    </label>
                  </div>
                  
                  {trip.gallery?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {trip.gallery.map((media, idx) => (
                        <div key={media._id || idx} className="relative aspect-square rounded-2xl overflow-hidden group bg-white/5 border border-white/10">
                          {media.resourceType === 'video' ? (
                            <video src={media.url} className="w-full h-full object-cover" controls />
                          ) : (
                            <img src={media.url} alt="Gallery" className="w-full h-full object-cover" />
                          )}
                          <button onClick={() => deleteGalleryMutation.mutate(media._id)} className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-red-500">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-3xl">
                       <FiImage className="mx-auto text-white/20 mb-3" size={40} />
                       <p className="text-white/50 font-bold mb-2">Empty Gallery</p>
                       <p className="text-sm text-white/40 mb-4">Upload photos and videos to remember your journey. (Max 10 files, 25MB each)</p>
                       <label className="cursor-pointer px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition text-sm inline-block">
                         Browse Files
                         <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                       </label>
                    </div>
                  )}
                </div>
              )}

              {/* TIMELINE TAB */}
              {activeTab === "timeline" && (
                <div>
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><FiActivity className="text-[#FF7A00]" /> Activity Log</h2>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                     
                     <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0A121F] bg-[#FF7A00] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                           <FiClock size={16} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/10 p-4 rounded-xl shadow">
                           <div className="flex items-center justify-between space-x-2 mb-1">
                              <div className="font-bold text-white">Trip Created</div>
                              <time className="font-caveat font-medium text-[#FF7A00]">{new Date(trip.createdAt).toLocaleDateString()}</time>
                           </div>
                           <div className="text-white/60 text-sm">Started planning this trip.</div>
                        </div>
                     </div>

                  </div>
                </div>
              )}

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TripDetails;
