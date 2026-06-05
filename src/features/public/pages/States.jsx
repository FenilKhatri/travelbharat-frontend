import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { FiNavigation, FiStar, FiImage } from "react-icons/fi";
import { motion } from "framer-motion";
import { stateService } from "../../../services/stateService";
import { statsService } from "../../../services/statsService";
import stateByStateImage from "../../../assets/images/state_by_state_image.jpg";
import ExplorePageLayout from "../components/layout/ExplorePageLayout";
import SidebarFilter from "../components/layout/SidebarFilter";
import Pagination from "../../../components/ui/Pagination";

const regionOptions = [
  { value: "North", label: "North India" },
  { value: "South", label: "South India" },
  { value: "East", label: "East India" },
  { value: "West", label: "West India" },
  { value: "Central", label: "Central India" },
  { value: "Northeast", label: "Northeast India" },
];

const States = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const region = searchParams.get("region") || "";
  const sort = searchParams.get("sort") || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allStates", { page, search, region, sort }],
    queryFn: () => stateService.getAllStates({ 
      page, 
      limit: 12, 
      search, 
      region: region.toLowerCase(), 
      sort 
    }),
  });

  const { data: statsData } = useQuery({
    queryKey: ["publicStats"],
    queryFn: () => statsService.getPublicStats(),
    staleTime: 60_000,
  });

  const { data: countsData } = useQuery({
    queryKey: ['statesDestinationCounts'],
    queryFn: () => statsService.getStatesDestinationCounts(),
    staleTime: 60_000,
  });

  const states = data?.data?.states || [];
  const pagination = data?.data?.pagination;
  const stats = statsData?.data || {};
  const destCounts = countsData?.data?.counts || {};

  const heroStats = [
    { label: "States & UTs", value: stats.states },
    { label: "Cities", value: stats.cities },
    { label: "Places", value: stats.destinations },
    { label: "Experiences", value: stats.experiences },
  ];

  return (
    <ExplorePageLayout
      heroImage={stateByStateImage}
      highlightText="Explore India"
      title='Discover the Beauty of <br class="hidden md:block" /> India, <span class="text-[#E85D04]">State by State</span>'
      subtitle="From the mighty Himalayas in the north to the serene backwaters of the south, explore the incredible diversity of India."
      stats={heroStats}
      sidebarContent={
        <SidebarFilter 
          searchPlaceholder="Search by name..."
          searchLabel="Search States"
          filters={[{ key: "region", label: "Region", options: regionOptions }]}
          sortOptions={[
            { value: "a-z", label: "Name (A - Z)" },
            { value: "z-a", label: "Name (Z - A)" },
          ]}
        />
      }
      itemCount={pagination?.total || 0}
      itemName="States"
      isLoading={isLoading}
      isError={isError}
      hasItems={states.length > 0}
    >
      {states.map((state, index) => {
        const destCount = destCounts[state._id] || state.totalPlaces || 0;
        const displayDestCount = destCount > 15 ? "15+" : destCount;

        return (
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
                  <FiStar size={10} className="inline mr-1" /> Featured
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
                    {displayDestCount} Destinations
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        );
      })}
      
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

export default States;
