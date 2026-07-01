import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";
const StateWhyVisit = ({ whyVisit }) => {
  if (!whyVisit || whyVisit.length === 0) return null;
  return (
    <section className="py-24 bg-[#0a0d14] relative border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <SectionLabel icon={FiCheckCircle} text="Why Visit" />
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white">Highlights</h2>
          <p className="text-[#8fa3cc] text-sm md:text-base max-w-md">
            Discover the most compelling reasons to explore this incredible destination.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {whyVisit.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#121621]/80 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden group hover:bg-[#1a202c]/80 hover:border-white/10 transition flex flex-col"
            >
              {highlight.image?.url && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={highlight.image.url} 
                    alt={highlight.image.altText || highlight.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                  />
                </div>
              )}
              <div className="p-6 grow flex flex-col">
                <h3 className="text-xl font-bold text-white mb-3">{highlight.title}</h3>
                <p className="text-[#8fa3cc] text-sm leading-relaxed grow">{highlight.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default StateWhyVisit;