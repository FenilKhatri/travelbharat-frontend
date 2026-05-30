import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiImage, FiMap, FiNavigation } from "react-icons/fi";
import { stateService } from "../../../services/stateService";
import { motion } from "framer-motion";
import stateByStateImage from "../../../assets/images/state_by_state_image.jpg";

const regions = ["All", "North", "South", "East", "West", "Central", "Northeast"];

const States = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allStates", selectedRegion],
    queryFn: () =>
      stateService.getAllStates({
        region: selectedRegion !== "All" ? selectedRegion.toLowerCase() : undefined,
        limit: 100,
      }),
  });

  const allStates = data?.data?.states || [];

  const filteredStates = allStates.filter((state) =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayStates = [...filteredStates].sort((a, b) => {
    if (a.name.toLowerCase() === "gujarat") return -1;
    if (b.name.toLowerCase() === "gujarat") return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1628] pb-24">
      {/* ── Hero Section ── */}
      <div className="relative pt-24 pb-20 md:pt-36 md:pb-28 flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${stateByStateImage})` }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0A1628] via-transparent to-transparent" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto">
          <span className="text-[#E85D04] font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">
            — Explore India —
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-lg leading-tight tracking-tight">
            Discover the Beauty of <br className="hidden md:block" /> India, <span className="text-[#E85D04]">State by State</span>
          </h1>
          <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto drop-shadow-md mb-12 font-medium">
            From the mighty Himalayas in the north to the serene backwaters of the south, 
            explore the incredible diversity of India.
          </p>

          {/* Search Bar */}
          <div className="bg-white p-2 md:p-2.5 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-2 max-w-4xl mx-auto">
            <div className="flex-1 relative flex items-center">
              <FiSearch className="absolute left-5 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by state name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl md:rounded-full bg-transparent border-none focus:ring-0 text-slate-900 font-bold placeholder-slate-400 outline-none"
              />
            </div>
            
            <div className="hidden md:block w-px h-10 bg-slate-200 self-center" />

            <div className="flex-1 relative flex items-center">
              <FiMap className="absolute left-5 text-slate-400" size={20} />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl md:rounded-full bg-transparent border-none focus:ring-0 text-slate-900 font-bold appearance-none cursor-pointer outline-none"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region === "All" ? "All Regions" : `${region} India`}
                  </option>
                ))}
              </select>
            </div>

            <button className="bg-[#E85D04] hover:bg-[#D05203] text-white px-8 py-4 rounded-xl md:rounded-full font-bold flex items-center justify-center transition-colors w-full md:w-auto shrink-0 shadow-lg shadow-[#E85D04]/30">
              Find Destinations
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 text-slate-800 dark:text-white">
            <div className="text-center">
              <div className="text-3xl font-black text-[#E85D04]">36</div>
              <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-300 mt-1">States & UTs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#E85D04]">600+</div>
              <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-300 mt-1">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#E85D04]">1000+</div>
              <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-300 mt-1">Places</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#E85D04]">100%</div>
              <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-300 mt-1">Authentic</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── States Grid Section ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-16">
        
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[#E85D04] font-bold tracking-wider uppercase text-xs mb-2 block">
            — Destinations
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            India State by State
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">
            Explore the diverse cultures, landscapes, and heritage of every Indian state. Find your next perfect getaway.
          </p>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-[300px] rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-slate-500 font-medium">
              Failed to load states. Please try again later.
            </div>
          ) : displayStates.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <FiMapPin size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-white">No States Found</h3>
              <p className="text-slate-500 mt-2 font-medium">Try adjusting your search or region filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayStates.map((state, index) => (
                <Link to={`/states/${state.slug}`} key={state._id || index}>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                    className="relative h-[280px] rounded-[1.25rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Image */}
                    {state.images?.thumbnail || state.images?.hero ? (
                      <img
                        src={state.images.thumbnail || state.images.hero}
                        alt={state.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const ph = e.currentTarget.parentElement.querySelector("[data-placeholder]");
                          if (ph) ph.style.display = "flex";
                        }}
                      />
                    ) : null}

                    {/* Placeholder */}
                    <div
                      data-placeholder
                      className="absolute inset-0 flex-col items-center justify-center bg-slate-200 dark:bg-slate-800"
                      style={{ display: (state.images?.thumbnail || state.images?.hero) ? "none" : "flex" }}
                    >
                      <FiImage size={32} className="text-slate-400 mb-2" />
                    </div>

                    {/* Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/90 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Badge */}
                    {state.featured && (
                      <div className="absolute top-4 left-4 bg-[#E85D04] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg z-10">
                        Featured
                      </div>
                    )}

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10 transform transition-transform duration-300">
                      <h3 className="text-2xl font-bold text-white mb-1.5 group-hover:text-[#E85D04] transition-colors">
                        {state.name}
                      </h3>
                      <div className="flex items-center gap-3 text-slate-300 text-[13px] font-semibold">
                        <span className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-sm">
                          <FiNavigation size={13} className="text-[#E85D04]" />
                          {state.totalPlaces || 0}+ Destinations
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default States;
