import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { placeService } from "../../../services/placeService";
import PageLoader from "../../../components/ui/PageLoader";
import { FiMapPin, FiCalendar, FiCompass, FiDollarSign, FiUsers, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import http from "../../../lib/axios";
import { useQuery } from "@tanstack/react-query";

const travelStyles = ["Solo", "Couple", "Family", "Friends", "Group", "Pilgrim"];

const ManualPlanner = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [tripData, setTripData] = useState({
    destinationId: null,
    destination: null,
    name: "",
    startDate: "",
    endDate: "",
    duration: 1,
    travelers: { adults: 2, children: 0, seniors: 0 },
    tripType: "family",
    budget: 20000,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Fetch all places if no slug
  const { data: placesData, isLoading: placesLoading } = useQuery({
    queryKey: ['allPlacesForPlanner'],
    queryFn: () => placeService.getAllPlaces({ limit: 100 }),
    enabled: !slug && !tripData.destinationId
  });

  const allPlaces = placesData?.data?.places || placesData?.places || [];

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDest = async () => {
      try {
        const res = await placeService.getPlaceBySlug(slug);
        const place = res?.data?.place || res?.place;
        if (place) {
          setTripData(prev => ({ ...prev, destinationId: place._id, destination: place, name: `Trip to ${place.name}` }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (slug) fetchDest();
  }, [slug]);

  // Calc duration
  useEffect(() => {
    if (tripData.startDate && tripData.endDate) {
      const start = new Date(tripData.startDate);
      const end = new Date(tripData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTripData(prev => ({ ...prev, duration: diffDays > 0 ? diffDays : 1 }));
    }
  }, [tripData.startDate, tripData.endDate]);

  const updateTripData = (updates) => {
    setTripData(prev => ({ ...prev, ...updates }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!tripData.destinationId || !tripData.startDate || !tripData.endDate || !tripData.name) {
      return toast.error("Please fill all required fields.");
    }

    setIsSaving(true);
    try {
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
        status: "upcoming"
      };

      const res = await http.post("/trips", payload);
      const newTripId = res?.data?.trip?._id || res?.trip?._id;
      toast.success("Trip created successfully!");
      navigate(`/user/trips/${newTripId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create trip.");
    } finally {
      setIsSaving(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (!tripData.destination) {
    return (
      <div className="bg-[#050505] pt-20 min-h-screen font-sans text-white pb-32 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Where do you want to go?</h1>
        <p className="text-white/60 mb-8 text-center max-w-lg">Select a destination to start planning your perfect trip.</p>
        
        {placesLoading ? (
           <PageLoader fullScreen={false} message="Loading destinations..." />
        ) : (
           <div className="w-full max-w-md bg-[#0A0F1A] border border-white/10 rounded-2xl p-4 shadow-2xl">
              <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                 {allPlaces.map((p) => (
                    <button 
                       key={p._id} 
                       onClick={() => updateTripData({ destinationId: p._id, destination: p, name: `Trip to ${p.name}` })}
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

  const heroImage = tripData.destination.images?.hero || tripData.destination.images?.thumbnail || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80";

  return (
    <div className="bg-[#050505] min-h-screen font-sans text-white pb-32">
      <div className="relative h-[400px] w-full">
        <img src={heroImage} alt={tripData.destination.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-black/30" />
        <div className="absolute bottom-8 left-8 right-8 max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-2">{tripData.destination.name}</h1>
            <div className="flex items-center gap-2 text-white/70 font-medium text-lg">
              <FiMapPin className="text-[#E85D04]" />
              <span>{tripData.destination.cityId?.name}, {tripData.destination.stateId?.name}</span>
            </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 relative z-10 -mt-16">
        <form onSubmit={handleCreate} className="bg-[#0A0F1A] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl space-y-10">
          <div>
            <h2 className="text-2xl font-black mb-2 text-[#E85D04]">Create Your Trip</h2>
            <p className="text-white/60 text-sm">Fill in the details below to initialize your trip dashboard.</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wider">Trip Name *</label>
            <input 
              type="text" 
              required
              value={tripData.name} 
              onChange={(e) => updateTripData({ name: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E85D04] font-bold text-lg transition-colors"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-white/70 mb-2 flex items-center gap-2 uppercase tracking-wider"><FiCalendar /> Start Date *</label>
              <input 
                type="date" 
                required
                min={today}
                value={tripData.startDate} 
                onChange={(e) => updateTripData({ startDate: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E85D04] transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white/70 mb-2 flex items-center gap-2 uppercase tracking-wider"><FiCalendar /> End Date *</label>
              <input 
                type="date" 
                required
                min={tripData.startDate || today}
                value={tripData.endDate} 
                onChange={(e) => updateTripData({ endDate: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E85D04] transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

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
          </div>

          <div className="pt-8">
            <button 
              type="submit"
              disabled={isSaving} 
              className="w-full bg-[#E85D04] text-white px-8 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-[#D05203] transition-colors shadow-lg disabled:opacity-50"
            >
              {isSaving ? "Creating Trip..." : "Create Trip Dashboard"} <FiArrowRight />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualPlanner;
