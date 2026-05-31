import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiImage, FiMap, FiNavigation, FiGlobe, FiCompass } from "react-icons/fi";
import { stateService } from "../../../services/stateService";
import { statsService } from "../../../services/statsService";
import { motion } from "framer-motion";
import CustomDropdown from "../../../components/ui/CustomDropdown";
import stateByStateImage from "../../../assets/images/state_by_state_image.jpg";

const regionOptions = [
  { value: "All", label: "All Regions" },
  { value: "North", label: "North India" },
  { value: "South", label: "South India" },
  { value: "East", label: "East India" },
  { value: "West", label: "West India" },
  { value: "Central", label: "Central India" },
  { value: "Northeast", label: "Northeast India" },
];

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const formatStatCount = (count) => {
  if (count >= 1000) return `${Math.floor(count / 1000)}k+`;
  if (count >= 100) return `${count}+`;
  return String(count);
};

const States = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [sortOption, setSortOption] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allStates", selectedRegion],
    queryFn: () =>
      stateService.getAllStates({
        region: selectedRegion !== "All" ? selectedRegion.toLowerCase() : undefined,
        limit: 100,
      }),
  });

  // Fetch dynamic stats
  const { data: statsData } = useQuery({
    queryKey: ["publicStats"],
    queryFn: () => statsService.getPublicStats(),
    staleTime: 60_000,
  });

  // Fetch real destination counts per state
  const { data: countsData } = useQuery({
    queryKey: ['statesDestinationCounts'],
    queryFn: () => statsService.getStatesDestinationCounts(),
    staleTime: 60_000,
  });

  const destCounts = countsData?.data?.counts || {};
  const stats = statsData?.data || {};

  const allStates = data?.data?.states || [];

  // Filter by name, region, tagline using debounced search
  const filteredStates = useMemo(() => {
    if (!debouncedSearch) return allStates;
    const term = debouncedSearch.toLowerCase();
    return allStates.filter((state) =>
      state.name.toLowerCase().includes(term) ||
      (state.tagline && state.tagline.toLowerCase().includes(term)) ||
      (state.region && state.region.toLowerCase().includes(term))
    );
  }, [allStates, debouncedSearch]);

  const displayStates = useMemo(() => {
    let sorted = [...filteredStates];
    
    // Sort logic
    if (sortOption === "a-z") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "z-a") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      // Default sort (e.g. Gujarat first)
      sorted.sort((a, b) => {
        if (a.name.toLowerCase() === "gujarat") return -1;
        if (b.name.toLowerCase() === "gujarat") return 1;
        return 0;
      });
    }
    return sorted;
  }, [filteredStates, sortOption]);

  const formatDestCount = (state) => {
    const count = destCounts[state._id] || state.totalPlaces || 0;
    if (count > 15) return "15+";
    return count;
  };

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


          {/* Stats Row — Dynamic */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 text-slate-800 dark:text-white">
            <div className="text-center">
              <div className="text-3xl font-black text-[#E85D04]">
                {stats.states ?? "—"}
              </div>
              <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-300 mt-1">States & UTs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#E85D04]">
                {stats.cities ? formatStatCount(stats.cities) : "—"}
              </div>
              <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-300 mt-1">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#E85D04]">
                {stats.destinations ? formatStatCount(stats.destinations) : "—"}
              </div>
              <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-300 mt-1">Places</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#E85D04]">
                {stats.experiences ? formatStatCount(stats.experiences) : "—"}
              </div>
              <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-300 mt-1">Experiences</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Area (2-Column Layout) ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-12 md:mt-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar (Sticky) */}
          <div className="w-full lg:w-1/4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <FiCompass className="text-[#E85D04]" /> Explore Filters
              </h3>
              
              {/* Search */}
              <div className="mb-5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Search States</label>
                <div className="relative">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#E85D04] transition-colors"
                  />
                </div>
              </div>

              {/* Region Filter */}
              <div className="mb-5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Region</label>
                <CustomDropdown
                  value={selectedRegion}
                  onChange={setSelectedRegion}
                  options={regionOptions}
                  placeholder="All Regions"
                />
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Sort By</label>
                <CustomDropdown
                  value={sortOption}
                  onChange={setSortOption}
                  options={[
                    { value: "", label: "Default" },
                    { value: "a-z", label: "Name (A - Z)" },
                    { value: "z-a", label: "Name (Z - A)" },
                  ]}
                  placeholder="Default"
                />
              </div>

              {/* Clear Filters */}
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRegion("All");
                  setSortOption("");
                }}
                className="w-full py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-[#E85D04] dark:hover:text-[#E85D04] bg-slate-100 dark:bg-slate-800 hover:bg-[#E85D04]/10 rounded-xl transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="w-full lg:w-3/4">
            
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-[#E85D04] font-bold tracking-wider uppercase text-xs mb-1.5 block">
                  — Destinations
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  India State by State
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-xl">
                  Explore the diverse cultures, landscapes, and heritage of every Indian state. Find your next perfect getaway.
                </p>
              </div>
              <div className="text-sm font-bold text-slate-500 bg-white dark:bg-slate-900/60 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm backdrop-blur-md">
                Showing <span className="text-[#E85D04]">{displayStates.length}</span> States
              </div>
            </div>

            <div className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-[280px] rounded-[1.25rem] bg-slate-200 dark:bg-slate-800 animate-pulse" />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {displayStates.map((state, index) => (
                    <Link to={`/states/${state.slug}`} key={state._id || index}>
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
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
                              {formatDestCount(state)} Destinations
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
      </div>
    </div>
  );
};

export default States;
