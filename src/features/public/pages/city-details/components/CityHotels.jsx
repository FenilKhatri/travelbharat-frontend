import { FaHotel } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";
import SectionContainer from "../../../../../components/layout/SectionContainer";

const CityHotels = ({ hotels }) => {
  if (hotels.length === 0) return null;

  return (
    <SectionContainer className="bg-[#0c1018] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <SectionLabel icon={FaHotel} text="Stays" />
        <h2 className="text-4xl font-black text-[#edf2ff] mb-12">Where to Stay</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel, idx) => (
            <div key={idx} className="rounded-3xl overflow-hidden border border-white/6 bg-[#111827] group hover:border-[#E85D04]/30 transition-all">
              {hotel.images?.thumbnail && (
                <div className="h-52 overflow-hidden relative">
                  <img src={hotel.images.thumbnail} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  {hotel.priceRange && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-black/70 text-white text-xs font-bold">{hotel.priceRange}</span>
                  )}
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="text-lg font-black text-[#edf2ff]">{hotel.name}</h3>
                  {hotel.rating > 0 && (
                    <span className="flex items-center gap-1 text-[#E85D04] text-sm font-bold"><FiStar className="fill-current" size={12} /> {hotel.rating}</span>
                  )}
                </div>
                {hotel.description && <p className="text-sm text-[#8fa3cc] line-clamp-2">{hotel.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default CityHotels;
