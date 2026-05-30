import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiLoader, FiStar, FiFilter, FiArrowRight } from "react-icons/fi";
import { FaSlidersH } from "react-icons/fa";
import { placeService } from "../../../services/placeService";
import { stateService } from "../../../services/stateService";
import Button from "../../../components/ui/Button";
import { motion } from "framer-motion";

const categories = ["Heritage", "Nature", "Adventure", "Beaches", "Mountains", "Spiritual"];

const Places = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch states for filter dropdown
  const { data: statesData } = useQuery({
    queryKey: ['filterStates'],
    queryFn: () => stateService.getAllStates({})
  });

  // Fetch places
  const { data: placesData, isLoading, isError } = useQuery({
    queryKey: ['allPlaces', selectedCategory, selectedState],
    queryFn: () => placeService.getAllPlaces({
      category: selectedCategory || undefined,
      stateId: selectedState || undefined,
    })
  });

  // Local search filter
  const filteredPlaces = placesData?.data?.places?.filter(place => 
    place.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Surat/Gujarat priority logic
  const displayPlaces = [...filteredPlaces].sort((a, b) => {
    const isASurat = a.cityId?.name?.toLowerCase() === 'surat';
    const isBSurat = b.cityId?.name?.toLowerCase() === 'surat';
    const isAGujarat = a.stateId?.name?.toLowerCase() === 'gujarat';
    const isBGujarat = b.stateId?.name?.toLowerCase() === 'gujarat';

    if (isASurat && !isBSurat) return -1;
    if (!isASurat && isBSurat) return 1;
    if (isAGujarat && !isBGujarat) return -1;
    if (!isAGujarat && isBGujarat) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1628] pb-24 pt-24">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        
        {/* Header & Mobile FiFilter Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Explore <span className="text-[#E85D04]">Destinations</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Find the perfect spot for your next adventure.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search destinations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#060D18] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#E85D04] text-slate-900 dark:text-white"
              />
            </div>
            <button 
              className="md:hidden p-2.5 bg-white dark:bg-[#060D18] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-white"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <FaSlidersH size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`w-full md:w-64 shrink-0 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white dark:bg-[#060D18] p-5 rounded-2xl border border-slate-200 dark:border-slate-800/50 sticky top-28 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white font-bold text-lg">
                <FiFilter size={18} className="text-[#E85D04]" /> Filters
              </div>

              {/* State FiFilter */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm uppercase tracking-wider">State</h3>
                <select 
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#E85D04]"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="">All States</option>
                  {statesData?.data?.states?.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Category FiFilter */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm uppercase tracking-wider">Category</h3>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      value=""
                      checked={selectedCategory === ""}
                      onChange={() => setSelectedCategory("")}
                      className="accent-[#E85D04] w-4 h-4" 
                    />
                    <span className={`text-sm group-hover:text-[#E85D04] transition-colors ${selectedCategory === "" ? "text-[#E85D04] font-medium" : "text-slate-600 dark:text-slate-400"}`}>All Categories</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category" 
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="accent-[#E85D04] w-4 h-4" 
                      />
                      <span className={`text-sm group-hover:text-[#E85D04] transition-colors ${selectedCategory === cat ? "text-[#E85D04] font-medium" : "text-slate-600 dark:text-slate-400"}`}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full text-sm"
                onClick={() => { setSelectedCategory(""); setSelectedState(""); setSearchTerm(""); }}
              >
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Places Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center py-20 h-full">
                <FiLoader className="animate-spin text-[#E85D04]" size={48} />
              </div>
            ) : isError ? (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center">
                Failed to load destinations. Please try again.
              </div>
            ) : displayPlaces.length === 0 ? (
              <div className="bg-white dark:bg-[#060D18] border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center">
                <FiMapPin size={48} className="text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-white mb-2">No Destinations Found</h3>
                <p className="text-slate-500 max-w-md">Try removing some filters or adjusting your search term to find what you're looking for.</p>
                <Button 
                  className="mt-6"
                  onClick={() => { setSelectedCategory(""); setSelectedState(""); setSearchTerm(""); }}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayPlaces.map((place, index) => (
                  <Link to={`/places/${place.slug}`} key={place._id || index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
                      className="bg-white dark:bg-[#060D18] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800/50 group flex flex-col h-full"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url('${place.images?.thumbnail || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800"}')` }}
                        />
                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-slate-800 dark:text-white shadow-sm">
                          {place.category}
                        </div>
                        
                        {(place.cityId?.name?.toLowerCase() === 'surat' || place.stateId?.name?.toLowerCase() === 'gujarat') && (
                          <div className="absolute top-3 right-3 bg-[#E85D04] text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                            Highly Recommended
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm gap-1">
                            <FiMapPin size={14} className="text-[#E85D04]" />
                            <span className="truncate max-w-[150px]">{place.cityId?.name}, {place.stateId?.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[#D4A72C] font-semibold text-sm bg-[#D4A72C]/10 px-2 py-0.5 rounded-full">
                            <FiStar size={12} fill="currentColor" /> {place.rating || "New"}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#E85D04] transition-colors line-clamp-1">
                          {place.name}
                        </h3>
                        
                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                          <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                            {place.budget || "Moderate"}
                          </span>
                          <span className="text-[#E85D04] font-medium text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            View Details <FiArrowRight size={14} />
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
  );
};

export default Places;



