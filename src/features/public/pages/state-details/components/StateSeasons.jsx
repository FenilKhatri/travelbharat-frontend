import { motion } from "framer-motion";
import { FiSun, FiCloudRain, FiThermometer, FiCalendar } from "react-icons/fi";
import { BsSnow } from "react-icons/bs";
import SectionLabel from "../../../../../components/ui/SectionLabel";
const StateSeasons = ({ seasons }) => {
  if (!seasons || seasons.length === 0) return null;
  const getSeasonIcon = (seasonName) => {
    const name = seasonName.toLowerCase();
    if (name.includes('summer')) return <FiSun size={24} className="text-yellow-400" />;
    if (name.includes('monsoon') || name.includes('rain')) return <FiCloudRain size={24} className="text-blue-400" />;
    if (name.includes('winter')) return <BsSnow size={24} className="text-cyan-400" />;
    return <FiThermometer size={24} className="text-orange-400" />;
  };
  return (
    <section className="py-24 bg-[#07090f] relative border-b border-white/5">
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <SectionLabel icon={FiCalendar} text="Climate & Seasons" />
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white">When to Visit</h2>
          <p className="text-[#8fa3cc] text-sm md:text-base max-w-md">
            Plan your trip around the best weather conditions for your preferred activities.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seasons.map((season, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-8 rounded-3xl border transition ${
                season.recommended 
                  ? 'bg-linear-to-br from-[#E85D04]/10 to-[#121621] border-[#E85D04]/30' 
                  : 'bg-[#121621] border-white/5'
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center">
                    {getSeasonIcon(season.season)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{season.season}</h3>
                    <p className="text-[#8fa3cc] font-medium mt-1">{season.months}</p>
                  </div>
                </div>
                {season.recommended && (
                  <span className="px-3 py-1 bg-[#E85D04] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-[#E85D04]/20">
                    Best Time
                  </span>
                )}
              </div>
              {season.temperature && (
                <div className="inline-block px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-white font-bold mb-4">
                  {season.temperature}
                </div>
              )}
              <p className="text-[#8fa3cc] leading-relaxed">
                {season.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default StateSeasons;