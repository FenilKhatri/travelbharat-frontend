import { FaMapMarkerAlt } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";

const FestivalPlaces = ({ festival }) => {
  if (!festival.bestPlacesToCelebrate?.length) return null;

  return (
    <section className="py-24 bg-[#07090f] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <SectionLabel icon={FiMapPin} text="Destinations" />
        <h2 className="text-4xl font-black text-[#edf2ff] mb-12">Best Places to Celebrate</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {festival.bestPlacesToCelebrate.map((place, index) => (
            <div key={index} className="bg-[#111827] p-6 rounded-2xl border border-white/6 hover:border-[#E85D04]/30 transition-all duration-300">
              <div className="w-12 h-12 bg-[#E85D04]/10 border border-[#E85D04]/20 text-[#E85D04] rounded-xl flex items-center justify-center mb-4">
                <FaMapMarkerAlt size={20} />
              </div>
              <h4 className="text-xl font-bold text-[#edf2ff] mb-2">{place.name}</h4>
              <p className="text-sm text-[#8fa3cc] leading-relaxed">{place.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FestivalPlaces;
