import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

const StateFunFacts = ({ funFacts }) => {
  if (!funFacts || funFacts.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#0a0d14] relative border-b border-slate-200 dark:border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-[#E85D04] font-black tracking-[0.2em] uppercase text-xs">Did You Know?</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-[#edf2ff] mt-2">Fun Facts</h2>
          <p className="text-slate-600 dark:text-[#8fa3cc] mt-4 max-w-2xl text-lg">
            Interesting trivia and lesser-known facts about the state.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {funFacts.map((fact, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-[#131824] border border-slate-200 dark:border-white/5 p-8 rounded-2xl hover:border-[#E85D04]/30 dark:hover:border-[#E85D04]/30 transition-colors group relative overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-[#E85D04]/10 rounded-xl flex items-center justify-center text-[#E85D04] mb-6 group-hover:scale-110 group-hover:bg-[#E85D04] group-hover:text-white transition-all duration-300">
                <FiStar size={24} />
              </div>
              <p className="text-slate-700 dark:text-[#edf2ff] text-base leading-relaxed">{fact}</p>
              
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform translate-x-4 -translate-y-4 group-hover:opacity-10 transition-opacity">
                <span className="text-8xl font-black">{idx + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StateFunFacts;
