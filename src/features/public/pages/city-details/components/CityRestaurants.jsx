import { FaUtensils } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";

const CityRestaurants = ({ restaurants }) => {
  if (restaurants.length === 0) return null;

  return (
    <section className="py-24 bg-[#07090f] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <SectionLabel icon={FaUtensils} text="Food" />
        <h2 className="text-4xl font-black text-[#edf2ff] mb-12">Culinary Delights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r, idx) => (
            <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-[#111827] border border-white/6 hover:border-[#E85D04]/20 transition-all">
              {r.images?.thumbnail ? (
                <img src={r.images.thumbnail} alt={r.name} className="w-20 h-20 rounded-xl object-cover shrink-0" loading="lazy" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-[#1a2338] flex items-center justify-center shrink-0"><FaUtensils className="text-[#E85D04]/50" /></div>
              )}
              <div>
                <h4 className="font-bold text-[#edf2ff] mb-1">{r.name}</h4>
                {r.cuisine && <p className="text-[10px] font-black uppercase tracking-widest text-[#E85D04] mb-1">{r.cuisine}</p>}
                {r.rating > 0 && <span className="text-xs text-[#8fa3cc] flex items-center gap-1"><FiStar className="text-yellow-500 fill-yellow-500" size={12} /> {r.rating}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityRestaurants;
