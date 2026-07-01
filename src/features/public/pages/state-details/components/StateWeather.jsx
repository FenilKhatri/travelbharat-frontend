import { FiCalendar, FiInfo } from "react-icons/fi";
import { MdOutlineWbSunny, MdAcUnit, MdWaterDrop } from "react-icons/md";
import SectionLabel from "../../../../../components/ui/SectionLabel";

const StateWeather = ({ state }) => {
  if (!state.weather || (!state.weather.winter && !state.weather.summer && !state.weather.monsoon)) {
    return null;
  }

  return (
    <section className="py-24 bg-[#07090f] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-12 gap-4">
          <div>
            <SectionLabel icon={FiCalendar} text="Plan Your Trip" />
            <h2 className="text-4xl font-black text-[#edf2ff]">When to Visit {state.name}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Winter Card */}
          {state.weather.winter && (
            <div className="bg-[#111827] p-7 rounded-3xl border border-white/6 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-900/20 transition-all duration-300">
              <div className="flex justify-between items-start mb-7">
                <div className="w-12 h-12 bg-emerald-900/30 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                  <MdAcUnit size={22} />
                </div>
                {state.weather.bestSeason?.toLowerCase()?.includes("winter") && (
                  <span className="bg-emerald-900/30 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20 tracking-widest uppercase">Best Season</span>
                )}
              </div>
              <h4 className="text-2xl font-black text-[#edf2ff] mb-4">Winter</h4>
              <p className="text-sm text-[#8fa3cc] leading-relaxed">
                {state.weather.winter}
              </p>
            </div>
          )}

          {/* Summer Card */}
          {state.weather.summer && (
            <div className="bg-[#111827] p-7 rounded-3xl border border-white/6 hover:border-amber-500/20 hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-300">
              <div className="flex justify-between items-start mb-7">
                <div className="w-12 h-12 bg-amber-900/30 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center">
                  <MdOutlineWbSunny size={22} />
                </div>
                {state.weather.bestSeason?.toLowerCase()?.includes("summer") && (
                  <span className="bg-amber-900/30 text-amber-400 text-[10px] font-black px-3 py-1 rounded-full border border-amber-500/20 tracking-widest uppercase">Best Season</span>
                )}
              </div>
              <h4 className="text-2xl font-black text-[#edf2ff] mb-4">Summer</h4>
              <p className="text-sm text-[#8fa3cc] leading-relaxed">
                {state.weather.summer}
              </p>
            </div>
          )}

          {/* Monsoon Card */}
          {state.weather.monsoon && (
            <div className="bg-[#111827] p-7 rounded-3xl border border-white/6 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300">
              <div className="flex justify-between items-start mb-7">
                <div className="w-12 h-12 bg-blue-900/30 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
                  <MdWaterDrop size={22} />
                </div>
                {state.weather.bestSeason?.toLowerCase()?.includes("monsoon") && (
                  <span className="bg-blue-900/30 text-blue-400 text-[10px] font-black px-3 py-1 rounded-full border border-blue-500/20 tracking-widest uppercase">Best Season</span>
                )}
              </div>
              <h4 className="text-2xl font-black text-[#edf2ff] mb-4">Monsoon</h4>
              <p className="text-sm text-[#8fa3cc] leading-relaxed">
                {state.weather.monsoon}
              </p>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="bg-[#E85D04]/8 border border-[#E85D04]/15 p-5 rounded-2xl flex items-start gap-4">
          <div className="bg-[#E85D04]/15 p-2 rounded-lg text-[#E85D04] mt-0.5 shrink-0"><FiInfo size={18} /></div>
          <div>
            <h5 className="font-bold text-[#edf2ff] mb-1 text-sm">Note: Check Local Conditions</h5>
            <p className="text-sm text-[#8fa3cc] leading-relaxed">Weather patterns can vary significantly between regions. Always check local forecasts before planning outdoor activities or remote travel.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StateWeather;
