import { FaUtensils } from "react-icons/fa";
import SectionLabel from "../../../../../components/ui/SectionLabel";

const StateFoods = ({ stateName, validFoods }) => {
  if (!validFoods?.length) return null;

  return (
    <section className="py-24 bg-[#0c1018] border-y border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <SectionLabel icon={FaUtensils} text="Culinary" />
            <h2 className="text-4xl font-black text-[#edf2ff]">Flavors of {stateName}</h2>
          </div>
          <div className="flex gap-5">
            <span className="flex items-center gap-2 text-sm font-bold text-[#8fa3cc]"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" /> Veg</span>
            <span className="flex items-center gap-2 text-sm font-bold text-[#8fa3cc]"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" /> Non-Veg</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {validFoods.map((item, i) => (
            <div key={i} className="bg-[#111827] rounded-3xl border border-white/6 overflow-hidden hover:border-white/12 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image?.url || item.images?.thumbnail}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={item.name}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 right-4">
                  {item.type === "veg" ? (
                    <div className="bg-[#0c1018]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black text-emerald-400 flex items-center gap-1.5 border border-emerald-500/20">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" /> VEG
                    </div>
                  ) : item.type === "non-veg" ? (
                    <div className="bg-[#0c1018]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black text-red-400 flex items-center gap-1.5 border border-red-500/20">
                      <div className="w-2 h-2 rounded-full bg-red-500" /> NON-VEG
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-bold text-[#edf2ff] mb-2">{item.name}</h4>
                {item.description && (
                  <p className="text-sm text-[#4b607a] line-clamp-2 leading-relaxed">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StateFoods;
