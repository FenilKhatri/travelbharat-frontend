import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiImage, FiNavigation } from "react-icons/fi";
import { cityService } from "../../../services/cityService";
import { motion } from "framer-motion";
import stateByStateImage from "../../../assets/images/state_by_state_image.jpg"; // Reusing state hero image for now

const Cities = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allCities"],
    queryFn: () => cityService.getAllCities({ limit: 200 }),
  });

  const allCities = data?.data?.cities || [];

  const filteredCities = allCities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A1628] pb-24">
      {/* ── Hero Section ── */}
      <div className="relative pt-24 pb-20 md:pt-36 md:pb-28 flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${stateByStateImage})` }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-slate-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto">
          <span className="text-[#E85D04] font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">
            — Explore Cities —
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-lg leading-tight tracking-tight">
            Discover the Heart of <br className="hidden md:block" /> India's <span className="text-[#E85D04]">Cities</span>
          </h1>
          <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto drop-shadow-md mb-12 font-medium">
            From bustling metropolises to serene cultural hubs, find the next city for your adventure.
          </p>

          {/* Search Bar */}
          <div className="bg-[#112035] p-2 md:p-2.5 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-2 max-w-4xl mx-auto border border-white/10">
            <div className="flex-1 relative flex items-center">
              <FiSearch className="absolute left-5 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by city name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl md:rounded-full bg-transparent border-none focus:ring-0 text-white font-bold placeholder-slate-400 outline-none"
              />
            </div>
            
            <button className="bg-[#E85D04] hover:bg-[#D05203] text-white px-8 py-4 rounded-xl md:rounded-full font-bold flex items-center justify-center transition-colors w-full md:w-auto shrink-0 shadow-lg shadow-[#E85D04]/30">
              Find Cities
            </button>
          </div>
        </div>
      </div>

      {/* ── Cities Grid Section ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-16">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[#E85D04] font-bold tracking-wider uppercase text-xs mb-2 block">
            — Urban Destinations
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Must-Visit Cities
          </h2>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-[280px] rounded-[1.25rem] bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-slate-400 font-medium">
              Failed to load cities. Please try again later.
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="text-center py-24 bg-slate-900 rounded-3xl border border-slate-800 shadow-sm">
              <FiMapPin size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-white">No Cities Found</h3>
              <p className="text-slate-400 mt-2 font-medium">Try adjusting your search filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCities.map((city, index) => (
                <Link to={`/states/${city.stateId?.slug}/cities/${city.slug}`} key={city._id || index}>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                    className="relative h-[280px] rounded-[1.25rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Image */}
                    {city.images?.thumbnail || city.images?.hero ? (
                      <img
                        src={city.images.thumbnail || city.images.hero}
                        alt={city.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800">
                        <FiImage size={32} className="text-slate-600 mb-2" />
                      </div>
                    )}

                    {/* Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/90 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10 transform transition-transform duration-300">
                      <h3 className="text-2xl font-bold text-white mb-1.5 group-hover:text-[#E85D04] transition-colors">
                        {city.name}
                      </h3>
                      <div className="flex flex-col gap-2 text-slate-300 text-[13px] font-semibold">
                         <span className="flex items-center gap-1.5 text-slate-400">
                          <FiMapPin size={13} className="text-[#E85D04]" />
                          {city.stateId?.name}
                        </span>
                        <span className="flex items-center w-fit gap-1.5 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-sm">
                          <FiNavigation size={13} className="text-[#E85D04]" />
                          Explore Places
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

export default Cities;
