import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiMapPin, FiArrowLeft, FiImage, FiCloud, FiGlobe, FiCalendar, FiStar, FiChevronDown } from "react-icons/fi";
import { FaTrain, FaPlane, FaCar, FaBus, FaLightbulb, FaUtensils, FaMonument } from "react-icons/fa";
import { stateService } from "../../../services/stateService";
import { cityService } from "../../../services/cityService";
import { placeService } from "../../../services/placeService";
import { motion } from "framer-motion";
import { useState } from "react";

// ─── Utility Components ────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-800 rounded-xl ${className}`} />
);

const StateDetailsSkeleton = () => (
  <div className="min-h-screen bg-[#050B14]">
    <Skeleton className="h-[60vh] w-full rounded-none" />
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
      <Skeleton className="h-12 w-64" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <Skeleton className="h-40 w-full" />
    </div>
  </div>
);

const SectionHeading = ({ title, subtitle, icon: Icon }) => (
  <div className="mb-8 flex flex-col items-center text-center">
    {Icon && (
      <div className="w-12 h-12 rounded-full bg-[#E85D04]/10 flex items-center justify-center mb-4 border border-[#E85D04]/20">
        <Icon size={24} className="text-[#E85D04]" />
      </div>
    )}
    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{title}</h2>
    {subtitle && <p className="text-slate-400 font-medium max-w-2xl">{subtitle}</p>}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const StateDetails = () => {
  const { slug } = useParams();

  const { data: stateData, isLoading: stateLoading, isError: stateError } = useQuery({
    queryKey: ["stateBySlug", slug],
    queryFn: () => stateService.getStateBySlug(slug),
    enabled: !!slug,
  });

  const { data: citiesData } = useQuery({
    queryKey: ["citiesByState", slug],
    queryFn: () => cityService.getCitiesByState(slug),
    enabled: !!slug,
  });

  const { data: placesData } = useQuery({
    queryKey: ["placesByState", slug],
    queryFn: () => placeService.getPlacesByState(slug),
    enabled: !!slug,
  });

  const state = stateData?.data?.state;
  const cities = citiesData?.data?.cities || [];
  const places = placesData?.data?.places || [];
  const branding = state?.stateBranding || {};

  const [faqOpen, setFaqOpen] = useState(null);

  if (stateLoading) return <StateDetailsSkeleton />;

  if (stateError || !state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050B14] gap-4">
        <FiMapPin size={56} className="text-slate-600" />
        <h1 className="text-2xl font-bold text-white">State Not Found</h1>
        <p className="text-slate-400">We couldn't find details for "{slug}".</p>
        <Link to="/states" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] text-white rounded-xl font-semibold text-sm hover:bg-[#D05203] transition">
          <FiArrowLeft size={16} /> Back to States
        </Link>
      </div>
    );
  }

  const toggleFaq = (idx) => {
    setFaqOpen(faqOpen === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-200 relative overflow-x-hidden">
      
      {/* ── Background Branding ── */}
      {branding.patternImage && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url(${branding.patternImage})`, backgroundSize: '400px' }}
        />
      )}
      {branding.leftBackground && (
        <img src={branding.leftBackground} className="fixed left-0 top-0 h-screen w-auto object-cover opacity-10 pointer-events-none mix-blend-screen z-0 blur-[2px]" alt="" />
      )}
      {branding.rightBackground && (
        <img src={branding.rightBackground} className="fixed right-0 top-0 h-screen w-auto object-cover opacity-10 pointer-events-none mix-blend-screen z-0 blur-[2px]" alt="" />
      )}

      {/* ── Hero Section ── */}
      <div className="relative min-h-[60vh] md:min-h-[80vh] flex flex-col justify-end overflow-hidden">
        {/* Background Hero */}
        {state.images?.hero && (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={state.images.hero}
              alt={state.name}
              className="w-full h-full object-cover scale-105"
            />
          </div>
        )}
        
        {/* Deep Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050B14]/80 to-transparent" />

        {/* Floating Overlay Illustration */}
        {branding.overlayImage && (
          <motion.img 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={branding.overlayImage} 
            className="absolute right-[-5%] md:right-10 bottom-[-10%] md:bottom-10 w-[120%] md:w-1/2 max-w-3xl opacity-30 md:opacity-60 object-contain pointer-events-none"
            alt="Decoration"
          />
        )}

        {/* Back Button */}
        <Link
          to="/states"
          className="absolute top-24 left-6 z-30 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-xl border border-white/10 hover:bg-white/20 transition-all hover:-translate-x-1"
        >
          <FiArrowLeft size={16} /> Explore States
        </Link>

        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-4 md:px-8 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="bg-[#E85D04] text-white px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest shadow-lg shadow-[#E85D04]/30">
                {state.region} India
              </span>
              {state.featured && (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                  Featured
                </span>
              )}
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
              {state.name}
            </h1>
            
            {state.tagline && (
              <p className="text-xl md:text-3xl font-light text-slate-300 italic mb-6">
                "{state.tagline}"
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-4 md:px-8 pb-24 -mt-8 space-y-24">
        
        {/* ── Key Highlights & Quick Facts ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: FiMapPin, label: "Capital", value: state.capital },
            { icon: FiGlobe, label: "Total Area", value: "Varied" }, // Assuming we don't have area, just filler
            { icon: FiStar, label: "Destinations", value: `${state.totalPlaces || places.length}+ Places` },
            { icon: FiCalendar, label: "Best Time", value: state.bestTimeToVisit || "Oct - Mar" }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0A121F] border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl hover:-translate-y-1 transition-transform group">
              <stat.icon size={28} className="text-[#E85D04] mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-sm md:text-base font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Overview & Introduction ── */}
        {state.description && (
          <section className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 space-y-6">
              <h2 className="text-3xl md:text-4xl font-black text-white">
                Welcome to <span className="text-[#E85D04]">{state.name}</span>
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed font-light">
                {state.description}
              </p>
              {state.overview && (
                <p className="text-base text-slate-400 leading-relaxed">
                  {state.overview}
                </p>
              )}
            </div>
            <div className="md:col-span-5 relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-slate-800 relative z-10 shadow-2xl">
                {state.images?.thumbnail ? (
                  <img src={state.images.thumbnail} className="w-full h-full object-cover" alt={state.name} />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                    <FiImage size={48} className="text-slate-700" />
                  </div>
                )}
              </div>
              {/* Decorative offset border */}
              <div className="absolute -inset-4 border border-[#E85D04]/20 rounded-3xl z-0 -rotate-3" />
            </div>
          </section>
        )}

        {/* ── Famous Cities + Cultural Hubs ── */}
        {cities?.length > 0 && (
          <section>
            <SectionHeading title="Cultural Hubs & Cities" subtitle="Explore the major urban centers and traditional towns." icon={FiMapPin} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.slice(0, 6).map((city, index) => (
                <Link to={`/states/${state.slug}/cities/${city.slug}`} key={city._id || index} className="group relative h-64 rounded-2xl overflow-hidden border border-slate-800 cursor-pointer">
                  {city.images?.thumbnail ? (
                    <img src={city.images.thumbnail} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={city.name} />
                  ) : (
                    <div className="absolute inset-0 bg-slate-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/40 to-transparent opacity-90" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#E85D04] transition-colors">{city.name}</h3>
                    <p className="text-sm text-slate-300 mt-1 flex items-center gap-2">
                      <span>Explore City</span> <FiArrowLeft className="rotate-180" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            {cities.length > 6 && (
              <div className="text-center mt-8">
                <Link to="/cities" className="inline-block px-8 py-3 rounded-full border border-slate-700 hover:border-[#E85D04] hover:bg-[#E85D04]/10 text-white font-bold transition">
                  View All Cities
                </Link>
              </div>
            )}
          </section>
        )}

        {/* ── Top Destinations ── */}
        {places?.length > 0 && (
          <section>
            <SectionHeading title="Top Destinations" subtitle={`Must-visit places and attractions in ${state.name}.`} icon={FaMonument} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {places.slice(0, 8).map((place, index) => (
                <Link to={`/places/${place.slug}`} key={place._id || index} className="bg-[#0A121F] border border-slate-800 rounded-2xl overflow-hidden hover:border-[#E85D04]/50 transition group shadow-lg">
                  <div className="h-48 relative overflow-hidden">
                    <img src={place.images?.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={place.name} />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                      {place.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#E85D04] transition-colors line-clamp-1">{place.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-400">
                      <FiMapPin size={14} className="text-[#E85D04]" />
                      <span className="truncate">{place.cityId?.name || place.city}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Culture + Traditions & Local Food ── */}
        {(state.culture || state.food?.length > 0) && (
          <section className="grid lg:grid-cols-2 gap-12">
            {/* Culture */}
            {state.culture && (
              <div className="bg-[#0A121F] border border-slate-800 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                <FaMonument size={120} className="absolute -right-10 -bottom-10 text-slate-800 opacity-20 pointer-events-none" />
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#E85D04] flex items-center justify-center"><FaMonument size={14} className="text-white" /></span>
                  Culture & Traditions
                </h3>
                <p className="text-slate-300 leading-relaxed font-light">{state.culture}</p>
                
                {state.history && (
                  <div className="mt-8 pt-8 border-t border-slate-800">
                    <h4 className="text-lg font-bold text-white mb-3">Historical Significance</h4>
                    <p className="text-slate-400 leading-relaxed text-sm font-light">{state.history}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Food */}
            {state.food?.length > 0 && (
              <div className="bg-[#0A121F] border border-slate-800 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                <FaUtensils size={120} className="absolute -right-10 -bottom-10 text-slate-800 opacity-20 pointer-events-none" />
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center"><FaUtensils size={14} className="text-black" /></span>
                  Culinary Delights
                </h3>
                <div className="space-y-4">
                  {state.food.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition border border-white/5">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                          <FaUtensils size={20} className="text-slate-600" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white">{item.name}</h4>
                          <span className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} title={item.isVeg ? "Vegetarian" : "Non-Vegetarian"} />
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Best Seasons & Weather ── */}
        {state.weather && Object.values(state.weather).some(Boolean) && (
          <section>
            <SectionHeading title="Travel Planning & Weather" subtitle="When to pack your bags and what to expect." icon={FiCloud} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Summer", icon: "☀️", value: state.weather.summer, color: "text-amber-500", bg: "bg-amber-500/10" },
                { label: "Monsoon", icon: "🌧️", value: state.weather.monsoon, color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "Winter", icon: "❄️", value: state.weather.winter, color: "text-cyan-400", bg: "bg-cyan-500/10" },
              ].filter(w => w.value).map((weather, idx) => (
                <div key={idx} className={`p-6 rounded-3xl border border-slate-800 bg-[#0A121F] text-center`}>
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${weather.bg} flex items-center justify-center text-3xl mb-4`}>
                    {weather.icon}
                  </div>
                  <h4 className={`text-xl font-bold ${weather.color} mb-2`}>{weather.label}</h4>
                  <p className="text-slate-300">{weather.value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── How to Reach ── */}
        {state.transport && Object.values(state.transport).some(Boolean) && (
          <section className="bg-[#E85D04] rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-black">
            {/* Pattern */}
            <div className="absolute inset-0 opacity-10 mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-12">
              <div className="md:w-1/3">
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">How to Reach</h2>
                <p className="text-black/80 font-medium text-lg">Seamless connectivity ensures your journey is as smooth as your stay.</p>
              </div>
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: FaPlane, label: "By Air", value: state.transport.byAir },
                  { icon: FaTrain, label: "By Train", value: state.transport.byTrain },
                  { icon: FaCar, label: "By Road", value: state.transport.byRoad },
                  { icon: FaBus, label: "Local Transit", value: state.transport.local }
                ].filter(t => t.value).map((trans, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl hover:bg-white/20 transition">
                    <trans.icon size={24} className="mb-3" />
                    <h4 className="font-bold text-xl mb-2">{trans.label}</h4>
                    <p className="text-black/70 text-sm font-medium leading-relaxed">{trans.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Essential Information & Travel Tips ── */}
        {state.travelTips?.length > 0 && (
          <section>
            <SectionHeading title="Essential Travel Tips" icon={FaLightbulb} />
            <div className="max-w-4xl mx-auto bg-[#0A121F] border border-slate-800 p-8 md:p-12 rounded-3xl shadow-xl">
              <ul className="space-y-4">
                {state.travelTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition">
                    <div className="w-8 h-8 rounded-full bg-[#E85D04]/20 flex items-center justify-center shrink-0 mt-0.5 border border-[#E85D04]/30">
                      <FaLightbulb size={12} className="text-[#E85D04]" />
                    </div>
                    <span className="text-base text-slate-300 leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default StateDetails;
