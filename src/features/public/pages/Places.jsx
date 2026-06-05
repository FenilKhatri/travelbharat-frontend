import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { FiMapPin, FiStar, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { placeService } from "../../../services/placeService";
import { stateService } from "../../../services/stateService";
import stateByStateImage from "../../../assets/images/state_by_state_image.jpg";
import ExplorePageLayout from "../components/layout/ExplorePageLayout";
import SidebarFilter from "../components/layout/SidebarFilter";
import Pagination from "../../../components/ui/Pagination";

const categories = [
  { label: "Heritage", value: "heritage" },
  { label: "Nature", value: "nature" },
  { label: "Adventure", value: "adventure" },
  { label: "Beaches", value: "beach" },
  { label: "Mountains", value: "hill-station" },
  { label: "Spiritual", value: "religious" }
];

const Places = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const stateId = searchParams.get("stateId") || "";
  const budget = searchParams.get("budget") || "";
  const sort = searchParams.get("sort") || "-priority";

  // Fetch states for filter dropdown
  const { data: statesData } = useQuery({
    queryKey: ['filterStates'],
    queryFn: () => stateService.getAllStates({ limit: 100 })
  });

  // Fetch places with backend filters
  const { data: placesData, isLoading, isError } = useQuery({
    queryKey: ['allPlaces', { page, search, category, stateId, budget, sort }],
    queryFn: () => placeService.getAllPlaces({
      page,
      limit: 12,
      category: category || undefined,
      stateId: stateId || undefined,
      search: search || undefined,
      budget: budget || undefined,
      sort: sort || undefined,
    })
  });

  const places = placesData?.data?.places || [];
  const pagination = placesData?.data?.pagination;

  const stateOptions = statesData?.data?.states?.map(s => ({ value: s._id, label: s.name })) || [];

  return (
    <ExplorePageLayout
      heroImage={stateByStateImage}
      highlightText="Explore Destinations"
      title='Discover the Perfect <br class="hidden md:block" /> Indian <span class="text-[#E85D04]">Destinations</span>'
      subtitle="Find the perfect spot for your next adventure."
      stats={[]}
      sidebarContent={
        <SidebarFilter 
          searchPlaceholder="Search destinations..."
          searchLabel="Search Places"
          filters={[
            { key: "category", label: "Category", options: categories },
            { key: "stateId", label: "State", options: stateOptions },
            { key: "budget", label: "Budget", options: [
              { value: "budget", label: "Budget" },
              { value: "moderate", label: "Moderate" },
              { value: "luxury", label: "Luxury" }
            ]}
          ]}
          sortOptions={[
            { value: "-priority", label: "Featured First" },
            { value: "-createdAt", label: "Newest First" },
            { value: "-rating", label: "Highest Rated" },
            { value: "name", label: "Name (A - Z)" },
          ]}
        />
      }
      itemCount={pagination?.total || 0}
      itemName="Destinations"
      isLoading={isLoading}
      isError={isError}
      hasItems={places.length > 0}
    >
      {places.map((place, index) => (
        <Link 
          to={place.stateId?.slug && place.cityId?.slug 
            ? `/states/${place.stateId.slug}/cities/${place.cityId.slug}/places/${place.slug}` 
            : `/places/${place.slug}`
          } 
          key={place._id || index}
        >
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
              
              {place.featured && (
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
                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium capitalize">
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

      {/* Pagination wrapper */}
      <div className="col-span-full mt-6">
        <Pagination 
          pagination={pagination} 
          onPageChange={(p) => {
            setSearchParams(prev => {
              prev.set("page", p);
              return prev;
            });
          }}
        />
      </div>
    </ExplorePageLayout>
  );
};

export default Places;




