import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { festivalService } from "../../../services/festivalService";
import FestivalCard from "../../../components/cards/FestivalCard";
import stateByStateImage from "../../../assets/images/state_by_state_image.jpg"; 
import ExplorePageLayout from "../components/layout/ExplorePageLayout";
import SidebarFilter from "../components/layout/SidebarFilter";
import Pagination from "../../../components/ui/Pagination";

const Festivals = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allFestivals", { page, search, sort }],
    queryFn: () => festivalService.getAllFestivals({ 
      page, 
      limit: 12, 
      search, 
      sort 
    }),
  });

  const festivals = data?.data?.festivals || [];
  const pagination = data?.data?.pagination;

  return (
    <ExplorePageLayout
      heroImage={stateByStateImage}
      highlightText="Cultural Celebrations"
      title='Discover the Colors of <br class="hidden md:block" /> India&#39;s <span class="text-[#E85D04]">Festivals</span>'
      subtitle="From spectacular rituals to vibrant street fairs, experience the traditions that define India."
      stats={[]}
      sidebarContent={
        <SidebarFilter 
          searchPlaceholder="Search by festival name..."
          searchLabel="Search Festivals"
          filters={[]}
          sortOptions={[
            { value: "a-z", label: "Name (A - Z)" },
            { value: "z-a", label: "Name (Z - A)" },
          ]}
        />
      }
      itemCount={pagination?.total || 0}
      itemName="Festivals"
      isLoading={isLoading}
      isError={isError}
      hasItems={festivals.length > 0}
    >
      {festivals.map((festival, index) => (
        <FestivalCard key={festival._id || index} festival={festival} index={index} />
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

export default Festivals;
