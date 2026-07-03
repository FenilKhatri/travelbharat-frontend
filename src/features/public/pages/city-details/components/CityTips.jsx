import { FaLightbulb } from "react-icons/fa";
import SectionLabel from "../../../../../components/ui/SectionLabel";
import SectionContainer from "../../../../../components/layout/SectionContainer";

const CityTips = ({ travelTips, cityName }) => {
  if (travelTips.length === 0) return null;

  return (
    <SectionContainer className="bg-[#07090f] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <SectionLabel icon={FaLightbulb} text="Travel Tips" />
        <h2 className="text-4xl font-black text-[#edf2ff] mb-12">Essential Tips for {cityName}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {travelTips.map((tip, index) => (
            <div key={index} className="flex gap-4 p-6 rounded-2xl bg-[#111827] border border-white/6 hover:border-[#E85D04]/20 transition-all">
              <div className="w-8 h-8 rounded-full bg-[#E85D04] text-white flex items-center justify-center font-black shrink-0 text-sm">
                {index + 1}
              </div>
              <p className="text-[#8fa3cc] text-sm leading-relaxed whitespace-pre-line">{tip?.replace(/\\n/g, '\n').replace(/;\s*/g, '\n')}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default CityTips;
