import { FiMapPin } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";
import CardSkeleton from "../../../../../components/ui/CardSkeleton";
import TravelCard from "../../../../../components/cards/TravelCard";

const StateCities = ({ state, cities, citiesLoading, slug }) => {
  return (
    <section className="py-24 bg-[#0c1018] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <SectionLabel icon={FiMapPin} text="Urban Destinations" />
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="text-4xl font-black text-[#edf2ff]">
            Explore Cities in <span className="text-[#E85D04]">{state.name}</span>
          </h2>
          {cities.length > 0 && (
            <p className="text-[#8fa3cc] text-sm font-medium">
              {cities.length} {cities.length === 1 ? "city" : "cities"} to discover
            </p>
          )}
        </div>

        {citiesLoading ? (
          <CardSkeleton count={8} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
        ) : cities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((city, index) => (
              <TravelCard key={city._id} type="city" data={city} stateSlug={slug} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl border border-white/10 bg-[#111827]/50">
            <FiMapPin className="mx-auto text-[#E85D04]/50 mb-4" size={40} />
            <p className="text-[#8fa3cc] font-medium">Cities for this state are coming soon.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StateCities;
