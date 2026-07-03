import { motion } from "framer-motion";
import { FiCamera } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";
import SectionContainer from "../../../../../components/layout/SectionContainer";
import PageContainer from "../../../../../components/layout/PageContainer";
const StateWildlife = ({ wildlifeHighlights }) => {
  if (!wildlifeHighlights || wildlifeHighlights.length === 0) return null;
  return (
    <SectionContainer className="bg-slate-50 dark:bg-[#0a0d14] relative border-b border-slate-200 dark:border-white/5">
      <PageContainer>
        <SectionLabel icon={FiCamera} text="Wildlife & Nature" />
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Into the Wild</h2>
          <p className="text-slate-600 dark:text-[#8fa3cc] text-sm md:text-base max-w-md">
            Discover the rich biodiversity and majestic creatures in their natural habitat.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wildlifeHighlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/90 dark:bg-[#121621]/80 backdrop-blur-sm border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden group hover:bg-white hover:border-slate-300 dark:hover:bg-[#1a202c]/80 dark:hover:border-white/10 transition flex flex-col"
            >
              {highlight.image?.url && (
                <div className="w-full h-64 overflow-hidden relative">
                  <img 
                    src={highlight.image.url} 
                    alt={highlight.image.altText || highlight.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-white dark:from-[#121621] via-white/20 dark:via-[#121621]/20 to-transparent" />
                </div>
              )}
              <div className="p-8 grow flex flex-col relative z-10 -mt-20">
                <div className="w-12 h-12 bg-[#E85D04] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-[#E85D04]/20 border border-white/10">
                  <FiCamera size={20} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{highlight.title}</h3>
                <p className="text-slate-600 dark:text-[#8fa3cc] leading-relaxed grow">{highlight.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </SectionContainer>
  );
};
export default StateWildlife;