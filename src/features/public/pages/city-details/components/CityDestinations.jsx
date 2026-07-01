import { FiCompass } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";
import TravelCard from "../../../../../components/cards/TravelCard";
import DestinationSkeleton from "../../../../../components/ui/DestinationSkeleton";

const CityDestinations = ({ city, places, placesLoading, resolvedStateSlug }) => {
  return (
    <section id="destinations" className="py-24 bg-[#07090f] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <SectionLabel icon={FiCompass} text="Must Visit" />
        <h2 className="text-4xl font-black text-[#edf2ff] mb-4">
          Top Places to Visit in <span className="text-[#E85D04]">{city.name}</span>
        </h2>
        <p className="text-[#8fa3cc] mb-12 max-w-2xl">
          Explore curated destinations handpicked for an unforgettable experience in {city.name}.
        </p>

        {placesLoading ? (
          <DestinationSkeleton count={6} />
        ) : places.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place, index) => (
              <TravelCard
                key={place._id}
                type="place"
                data={place}
                stateSlug={resolvedStateSlug}
                citySlug={city.slug}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl border border-white/10 bg-[#111827]/50">
            <FiCompass className="mx-auto text-[#E85D04]/50 mb-4" size={40} />
            <p className="text-[#8fa3cc] font-medium">Destinations for {city.name} are coming soon.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CityDestinations;
