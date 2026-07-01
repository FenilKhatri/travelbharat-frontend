import { motion } from "framer-motion";
import { FiBookOpen } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";
const StateDiscover = ({ discoverSections }) => {
  if (!discoverSections || discoverSections.length === 0) return null;
  return (
    <section className="py-24 bg-[#07090f] relative border-b border-white/5">
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {discoverSections.map((section, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <div key={index} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2"
              >
                {section.image?.url ? (
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-4/5 border border-white/10 group">
                    <img 
                      src={section.image.url} 
                      alt={section.image.altText || section.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-1000"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  </div>
                ) : (
                  <div className="relative rounded-3xl bg-[#121621] border border-white/5 shadow-2xl aspect-4/5 flex items-center justify-center p-12 text-center">
                    <div>
                      <FiBookOpen size={48} className="text-white/10 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-white/50">{section.title}</h3>
                    </div>
                  </div>
                )}
              </motion.div>
              {/* Content Side */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full lg:w-1/2 space-y-6"
              >
                <SectionLabel icon={FiBookOpen} text={section.subtitle || "Discover"} />
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  {section.title}
                </h2>
                
                <div className="prose prose-invert max-w-none text-[#8fa3cc] leading-relaxed">
                  {section.description?.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="mb-4 last:mb-0">{paragraph}</p>
                  ))}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default StateDiscover;