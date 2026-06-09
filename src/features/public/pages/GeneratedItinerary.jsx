import { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FiMapPin, FiCalendar, FiSun, FiClock, FiDollarSign, FiCheck, FiArrowLeft, FiHeart, FiShare2, FiDownload, FiInfo } from "react-icons/fi";
import { motion } from "framer-motion";

const GeneratedItinerary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tripData = location.state?.tripData;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!tripData) {
      navigate('/places');
    }
  }, [tripData, navigate]);

  if (!tripData) return null;

  const { destination, itinerary, recommendedHotels, costBreakdown, weather, travelEssentials, nearbyAttractions } = tripData;

  return (
    <div className="bg-[#050505] min-h-screen font-sans text-white pb-32">
      {/* HEADER / HERO */}
      <section className="relative h-[40vh] min-h-[300px] flex items-end">
        <div className="absolute inset-0">
          <img src={destination.heroImage} alt={destination.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-black/30" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto w-full px-4 pb-12">
          <Link to={`/plan/${destination.id}`} className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-wider">
            <FiArrowLeft /> Back to Planner
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="bg-[#E85D04] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                AI Generated Itinerary
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2">
                {itinerary.length} Days in {destination.name}
              </h1>
              <div className="flex items-center gap-2 text-white/70 font-medium">
                <FiMapPin className="text-[#E85D04]" />
                <span>{destination.city}, {destination.state}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
                <FiHeart /> Save Trip
              </button>
              <button className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3 rounded-xl transition-colors">
                <FiShare2 />
              </button>
              <button className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3 rounded-xl transition-colors">
                <FiDownload />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: ITINERARY */}
        <div className="lg:col-span-8 space-y-12">
          
          <section>
            <h2 className="text-2xl font-black mb-4">Trip Overview</h2>
            <p className="text-white/60 leading-relaxed text-lg">
              {destination.overview}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
              <FiCalendar className="text-[#E85D04]" /> Your Itinerary
            </h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {itinerary.map((day, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#050505] bg-[#E85D04] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-black text-sm">
                    {day.day}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#0A0F1A] border border-white/5 p-6 rounded-2xl shadow-xl">
                    <h3 className="font-black text-xl mb-6 text-[#E85D04]">{day.title}</h3>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-white/10">
                      
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center"></div>
                        <p className="text-xs font-bold text-blue-400 mb-1">{day.morning.time}</p>
                        <h4 className="font-bold text-lg mb-1">{day.morning.activity}</h4>
                        <p className="text-sm text-white/50">{day.morning.description}</p>
                      </div>

                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center"></div>
                        <p className="text-xs font-bold text-amber-400 mb-1">{day.afternoon.time}</p>
                        <h4 className="font-bold text-lg mb-1">{day.afternoon.activity}</h4>
                        <p className="text-sm text-white/50">{day.afternoon.description}</p>
                      </div>

                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center"></div>
                        <p className="text-xs font-bold text-purple-400 mb-1">{day.evening.time}</p>
                        <h4 className="font-bold text-lg mb-1">{day.evening.activity}</h4>
                        <p className="text-sm text-white/50">{day.evening.description}</p>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* NEARBY ATTRACTIONS */}
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <FiMapPin className="text-[#E85D04]" /> Recommended Attractions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nearbyAttractions.map((attr, idx) => (
                <Link to={`/places/${attr._id}`} key={idx} className="bg-[#0A0F1A] border border-white/5 rounded-2xl overflow-hidden flex items-center hover:border-white/20 transition-all group">
                  <div className="w-24 h-24 shrink-0 bg-white/5">
                    <img src={attr.images?.thumbnail || attr.images?.hero} alt={attr.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-sm mb-1 line-clamp-1">{attr.name}</h4>
                    <p className="text-xs text-white/40 capitalize">{attr.category?.replace("-", " ")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* WEATHER */}
          <div className="bg-gradient-to-br from-sky-900/30 to-blue-900/10 border border-sky-500/20 p-6 rounded-3xl">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-sky-400">
              <FiSun /> Destination Weather
            </h3>
            <div className="text-3xl font-black mb-2">{weather.temperature}</div>
            <p className="text-sm font-bold text-white/70 mb-4">{weather.condition}</p>
            <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-xs text-white/60">
              <span className="font-bold text-white/90">Pack:</span> {weather.clothing}
            </div>
          </div>

          {/* BUDGET BREAKDOWN */}
          <div className="bg-[#0A0F1A] border border-white/5 p-6 rounded-3xl">
            <h3 className="font-black text-lg mb-6 flex items-center gap-2">
              <FiDollarSign className="text-emerald-400" /> Cost Estimate
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Transportation</span>
                <span className="font-bold">₹{costBreakdown.transportation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Accommodation</span>
                <span className="font-bold">₹{costBreakdown.accommodation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Food & Dining</span>
                <span className="font-bold">₹{costBreakdown.food.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Activities</span>
                <span className="font-bold">₹{costBreakdown.activities.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="font-black text-[#E85D04]">Total</span>
                <span className="font-black text-xl">₹{costBreakdown.totalEstimated.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* HOTELS */}
          <div className="bg-[#0A0F1A] border border-white/5 p-6 rounded-3xl">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
              <FiCheck className="text-blue-400" /> Recommended Stays
            </h3>
            <div className="space-y-3">
              {recommendedHotels.map((hotel, idx) => (
                <div key={idx} className="bg-black/30 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{hotel.name}</h4>
                    <p className="text-xs text-white/40">{hotel.rating} / 5 Rating</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[#E85D04] font-bold text-sm">{hotel.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ESSENTIALS */}
          <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-3xl">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-amber-500">
              <FiInfo /> Travel Essentials
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-bold text-white/80 mb-1 text-xs uppercase tracking-wider">Safety</p>
                <p className="text-white/50">{travelEssentials.safety}</p>
              </div>
              <div>
                <p className="font-bold text-white/80 mb-1 text-xs uppercase tracking-wider">Customs</p>
                <p className="text-white/50">{travelEssentials.customs}</p>
              </div>
              <div>
                <p className="font-bold text-white/80 mb-2 text-xs uppercase tracking-wider">Don't Forget</p>
                <div className="flex flex-wrap gap-2">
                  {travelEssentials.packing.map((item, idx) => (
                    <span key={idx} className="bg-white/5 px-2 py-1 rounded text-xs text-white/70">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GeneratedItinerary;
