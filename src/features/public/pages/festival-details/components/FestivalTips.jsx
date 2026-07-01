import { FaLightbulb } from "react-icons/fa";
import SectionLabel from "../../../../../components/ui/SectionLabel";

const FestivalTips = ({ festival }) => {
  const tips = festival.travelTips?.filter(t => t.trim().length > 0) || [];
  if (tips.length === 0) return null;

  return (
    <section className="py-24 bg-[#0c1018]">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <SectionLabel icon={FaLightbulb} text="Travel Hacks" />
        <h2 className="text-4xl font-black text-[#edf2ff] mb-12">Essential Tips for {festival.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tips.map((tip, index) => (
            <div key={index} className="bg-[#111827] border border-white/6 p-6 rounded-2xl flex gap-4 items-start hover:border-[#E85D04]/20 hover:bg-[#151e2d] transition-all duration-300 group">
              <div className="w-8 h-8 rounded-full bg-[#E85D04] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-lg shadow-[#E85D04]/30 group-hover:scale-110 transition-transform">
                {index + 1}
              </div>
              <p className="text-[#8fa3cc] text-sm font-medium leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FestivalTips;
