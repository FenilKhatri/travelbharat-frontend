import { FiClock } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";
const StateTimeline = ({ timeline }) => {
  if (!timeline || timeline.length === 0) return null;
  // Sort by order field
  const sortedTimeline = [...timeline].sort((a, b) => (a.order || 0) - (b.order || 0));
  return (
    <section className="py-24 bg-[#0a0d14] relative border-b border-white/5">
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <SectionLabel icon={FiClock} text="History" />
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white">Through the Ages</h2>
          <p className="text-[#8fa3cc] text-sm md:text-base max-w-md">
            Journey through the pivotal moments that shaped the cultural and historical landscape.
          </p>
        </div>
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2" />
          <div className="space-y-12">
            {sortedTimeline.map((item, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className={`relative flex flex-col md:flex-row gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 top-8 w-3 h-3 bg-[#E85D04] rounded-full shadow-[0_0_15px_rgba(232,93,4,0.6)] translate-x-[-5px] md:-translate-x-1.5 z-10" />
                  
                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden md:block md:w-1/2" />
                  {/* Content Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, x: isEven ? 20 : -20 }}
                    whileInView={{ opacity: 1, y: 0, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="w-full md:w-1/2 pl-12 md:pl-0"
                  >
                    <div className={`bg-[#121621] border border-white/5 rounded-2xl p-6 md:p-8 hover:bg-[#161b29] hover:border-white/10 transition ${isEven ? 'md:ml-12' : 'md:mr-12'}`}>
                      {item.year && (
                        <span className="inline-block px-3 py-1 bg-[#E85D04]/10 text-[#E85D04] text-sm font-black rounded-lg mb-4">
                          {item.year}
                        </span>
                      )}
                      
                      <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                      
                      <p className="text-[#8fa3cc] leading-relaxed mb-6">
                        {item.description}
                      </p>
                      {item.image?.url && (
                        <div className="w-full h-48 rounded-xl overflow-hidden mt-4">
                          <img 
                            src={item.image.url} 
                            alt={item.image.altText || item.title}
                            className="w-full h-full object-cover hover:scale-105 transition duration-500"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
export default StateTimeline;