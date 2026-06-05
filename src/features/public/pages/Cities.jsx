import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { FiNavigation, FiImage, FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";
import { cityService } from "../../../services/cityService";
import stateByStateImage from "../../../assets/images/state_by_state_image.jpg";
import ExplorePageLayout from "../components/layout/ExplorePageLayout";
import SidebarFilter from "../components/layout/SidebarFilter";
import Pagination from "../../../components/ui/Pagination";

const Cities = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allCities", { page, search, sort }],
    queryFn: () => cityService.getAllCities({ 
      page, 
      limit: 12, 
      search, 
      sort 
    }),
  });

  const cities = data?.data?.cities || [];
  const pagination = data?.data?.pagination;

  return (
    <ExplorePageLayout
      heroImage={stateByStateImage}
      highlightText="Explore Cities"
      title='Discover the Heart of <br class="hidden md:block" /> India&#39;s <span class="text-[#E85D04]">Cities</span>'
      subtitle="From bustling metropolises to serene cultural hubs, find the next city for your adventure."
      stats={[]}
      sidebarContent={
        <SidebarFilter 
          searchPlaceholder="Search by city name..."
          searchLabel="Search Cities"
          filters={[]}
          sortOptions={[
            { value: "a-z", label: "Name (A - Z)" },
            { value: "z-a", label: "Name (Z - A)" },
          ]}
        />
      }
      itemCount={pagination?.total || 0}
      itemName="Cities"
      isLoading={isLoading}
      isError={isError}
      hasItems={cities.length > 0}
    >
      {cities.map((city, index) => (
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
              className="absolute inset-0 flex-col items-center justify-center bg-slate-800"
              style={{ display: (city.images?.thumbnail || city.images?.hero) ? "none" : "flex" }}
            >
              <FiImage size={32} className="text-slate-600 mb-2" />
            </div>

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

export default Cities;
