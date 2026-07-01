import { FiHelpCircle, FiChevronDown } from "react-icons/fi";
import { useState } from "react";
import SectionLabel from "../../../../../components/ui/SectionLabel";
const StateFAQ = ({ faq }) => {
  const [openIndex, setOpenIndex] = useState(0);
  if (!faq || faq.length === 0) return null;
  return (
    <section className="py-24 bg-[#0a0d14] relative border-b border-white/5">
      <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 flex flex-col items-center">
          <SectionLabel icon={FiHelpCircle} text="FAQ" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 mt-4">Common Questions</h2>
          <p className="text-[#8fa3cc] text-sm md:text-base max-w-xl">
            Find answers to frequently asked questions to help you plan your perfect trip.
          </p>
        </div>
        <div className="space-y-4">
          {faq.map((item, index) => {
            const isOpen = openIndex === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen ? 'bg-[#121621] border-white/20 shadow-lg' : 'bg-transparent border-white/5 hover:border-white/10 hover:bg-[#121621]/50'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-white' : 'text-white/80'}`}>
                    {item.question}
                  </span>
                  <div className={`shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen ? 'bg-[#E85D04] text-white rotate-180' : 'bg-white/5 text-white/50'
                  }`}>
                    <FiChevronDown size={18} />
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 pb-6 text-[#8fa3cc] leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default StateFAQ;