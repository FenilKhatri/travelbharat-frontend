import { FiMapPin } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";
import SectionContainer from "../../../../../components/layout/SectionContainer";

const CityNearby = ({ city }) => {
  if (!city.nearbyPlaces?.length) return null;

  return (
    <SectionContainer className="bg-[#0c1018] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <SectionLabel icon={FiMapPin} text="Day Trips" />
        <h2 className="text-4xl font-black text-[#edf2ff] mb-12">Nearby Explorations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {city.nearbyPlaces.map((place, idx) => (
            <div key={idx} className="group text-center">
              <div className="aspect-square rounded-3xl overflow-hidden mb-4 border-2 border-white/5 group-hover:border-[#E85D04] transition-colors ring-1 ring-white/5">
                {place.image ? (
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-[#111827] flex items-center justify-center"><FiMapPin className="text-[#E85D04]/40" /></div>
                )}
              </div>
              <h4 className="font-black text-[#edf2ff] mb-1 group-hover:text-[#E85D04] transition-colors">{place.name}</h4>
              {place.distance && <p className="text-[#4b607a] text-xs font-bold uppercase tracking-widest">{place.distance}</p>}
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default CityNearby;
