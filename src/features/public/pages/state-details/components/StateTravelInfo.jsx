import { motion } from "framer-motion";
import { FiNavigation, FiInfo } from "react-icons/fi";
import { FaPlane, FaTrain, FaCar, FaBus } from "react-icons/fa";
import SectionLabel from "../../../../../components/ui/SectionLabel";
import SectionContainer from "../../../../../components/layout/SectionContainer";
import PageContainer from "../../../../../components/layout/PageContainer";
const StateTravelInfo = ({ travelInfo }) => {
  if (!travelInfo) return null;
  
  // Check if any fields actually have content
  const hasContent = travelInfo.byAir || travelInfo.byTrain || travelInfo.byRoad || travelInfo.localTransport;
  if (!hasContent) return null;
  return (
    <SectionContainer className="bg-[#0a0d14] relative border-b border-white/5">
      <PageContainer className="max-w-[1200px]">
        <SectionLabel icon={FiNavigation} text="Getting Around" />
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white">How to Reach</h2>
          <p className="text-[#8fa3cc] text-sm md:text-base max-w-md">
            Seamless travel options to help you plan your journey and navigate locally.
          </p>
        </div>
        {/* Major Hubs Banner */}
        {(travelInfo.airport || travelInfo.nearestMajorCity) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 p-6 mb-12 bg-linear-to-r from-[#E85D04]/10 to-transparent border border-[#E85D04]/20 rounded-2xl"
          >
            <div className="shrink-0 w-12 h-12 bg-[#E85D04] rounded-xl flex items-center justify-center text-white">
              <FiInfo size={24} />
            </div>
            <div className="grow flex flex-col sm:flex-row gap-8 justify-around">
              {travelInfo.airport && (
                <div>
                  <p className="text-[#8fa3cc] text-sm font-bold uppercase tracking-widest mb-1">Major Airport</p>
                  <p className="text-white font-medium">{travelInfo.airport}</p>
                </div>
              )}
              {travelInfo.nearestMajorCity && (
                <div>
                  <p className="text-[#8fa3cc] text-sm font-bold uppercase tracking-widest mb-1">Nearest Major Hub</p>
                  <p className="text-white font-medium">{travelInfo.nearestMajorCity}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {travelInfo.byAir && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-[#121621] border border-white/5 p-8 rounded-3xl hover:border-white/10 transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <FaPlane size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">By Air</h3>
              </div>
              <p className="text-[#8fa3cc] leading-relaxed">{travelInfo.byAir}</p>
            </motion.div>
          )}
          {travelInfo.byTrain && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-[#121621] border border-white/5 p-8 rounded-3xl hover:border-white/10 transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                  <FaTrain size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">By Train</h3>
              </div>
              <p className="text-[#8fa3cc] leading-relaxed">{travelInfo.byTrain}</p>
            </motion.div>
          )}
          {travelInfo.byRoad && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-[#121621] border border-white/5 p-8 rounded-3xl hover:border-white/10 transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                  <FaCar size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">By Road</h3>
              </div>
              <p className="text-[#8fa3cc] leading-relaxed">{travelInfo.byRoad}</p>
            </motion.div>
          )}
          {travelInfo.localTransport && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-[#121621] border border-white/5 p-8 rounded-3xl hover:border-white/10 transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <FaBus size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">Local Transport</h3>
              </div>
              <p className="text-[#8fa3cc] leading-relaxed">{travelInfo.localTransport}</p>
            </motion.div>
          )}
        </div>
      </PageContainer>
    </SectionContainer>
  );
};
export default StateTravelInfo;