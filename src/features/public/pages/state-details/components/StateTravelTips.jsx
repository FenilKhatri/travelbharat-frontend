import { motion } from "framer-motion";
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiHeart, FiStar } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";
import * as Icons from "react-icons/fi";

const StateTravelTips = ({ travelTips }) => {
  if (!travelTips || travelTips.length === 0) return null;

  const getIcon = (iconName) => {
    if (!iconName) return <FiCheckCircle size={24} />;
    const IconComponent = Icons[iconName] || FiCheckCircle;
    return <IconComponent size={24} />;
  };

  return (
    <section className="py-24 bg-[#07090f] relative border-b border-white/5">
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <SectionLabel icon={FiStar} text="Good to Know" />
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white">Essential Tips</h2>
          <p className="text-[#8fa3cc] text-sm md:text-base max-w-md">
            Local insights and practical advice to make the most of your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#121621]/50 border border-white/5 p-6 rounded-3xl hover:bg-[#161b29] hover:border-white/10 transition flex gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E85D04]/10 text-[#E85D04] flex items-center justify-center shrink-0">
                {getIcon(tip.icon)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{tip.title}</h3>
                <p className="text-[#8fa3cc] text-sm leading-relaxed">{tip.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StateTravelTips;
