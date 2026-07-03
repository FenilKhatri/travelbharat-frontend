import { motion } from "framer-motion";
import { FiCompass } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";
import SectionContainer from "../../../../../components/layout/SectionContainer";
import PageContainer from "../../../../../components/layout/PageContainer";
const StateExperiences = ({ experiences }) => {
  if (!experiences || experiences.length === 0) return null;
  return (
    <SectionContainer className="bg-white dark:bg-[#07090f] relative border-b border-slate-200 dark:border-white/5">
      <PageContainer>
        <SectionLabel icon={FiCompass} text="Experiences" />
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Curated Experiences</h2>
          <p className="text-slate-600 dark:text-[#8fa3cc] text-sm md:text-base max-w-md">
            Unforgettable activities and adventures handpicked for your journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative rounded-3xl overflow-hidden aspect-4/5 md:aspect-3/4 cursor-pointer"
            >
              {exp.image?.url ? (
                <img 
                  src={exp.image.url} 
                  alt={exp.image.altText || exp.title}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-100 dark:bg-[#121621]" />
              )}
              
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent transition duration-500 group-hover:from-black/95" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                {exp.category && (
                  <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold rounded-lg w-fit mb-4">
                    {exp.category}
                  </span>
                )}
                <h3 className="text-2xl font-bold text-white mb-3">{exp.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </SectionContainer>
  );
};
export default StateExperiences;