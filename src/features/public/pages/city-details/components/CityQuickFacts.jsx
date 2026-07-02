import { motion } from "framer-motion";
import { FiInfo } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";
const CityQuickFacts = ({ quickFacts }) => {
  if (quickFacts.length === 0) return null;
  return (
    <section className="py-16 bg-white dark:bg-[#0c1018] border-b border-slate-200 dark:border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <SectionLabel icon={FiInfo} text="Quick Facts" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickFacts.map((fact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/6 hover:border-[#E85D04]/30 transition-colors duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] mb-4 group-hover:scale-110 transition-transform">
                <fact.icon size={18} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-[#4b607a] mb-1">{fact.label}</p>
              <p className="text-sm font-bold text-slate-900 dark:text-[#edf2ff] leading-snug">{fact.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default CityQuickFacts;