import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { festivalService } from "../../../../services/festivalService";

const FestivalsSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['festivals'],
    queryFn: festivalService.getAllFestivals
  });

  const festivals = data?.data?.festivals || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-white dark:bg-[#060D18]">
        <div className="max-w-[1600px] w-full mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (festivals.length === 0) return null;

  return (
    <section className="py-20 bg-white dark:bg-[#060D18] relative overflow-hidden">
      {/* Decorative Mandala */}
      <motion.img 
        initial={{ opacity: 0, rotate: 0 }}
        whileInView={{ opacity: 0.05, rotate: 180 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        src="https://upload.wikimedia.org/wikipedia/commons/e/ec/Mandala_svg.svg" 
        alt="Mandala"
        className="absolute left-[-20%] top-[-20%] w-[800px] object-contain z-0 pointer-events-none"
      />

      <div className="max-w-[1600px] w-full mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#E85D04] font-bold uppercase tracking-wider text-sm mb-2 block">Cultural Vibrance</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Iconic Festivals of Bharat
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Immerse yourself in the colors, music, and traditions of India's most celebrated festivals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {festivals.slice(0, 3).map((festival, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-96 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(232,93,4,0.2)] transition-all cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${festival.images?.thumbnail || 'https://images.unsplash.com/photo-1533227268428-f9ed0900f9bf?auto=format&fit=crop&q=80'}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A121F]/90 via-[#0A121F]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-xs font-bold flex items-center gap-1">
                <FiCalendar size={14} /> {festival.month || 'Seasonal'}
              </div>

              <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                <h3 className="text-2xl font-bold text-white mb-2">{festival.name}</h3>
                <p className="text-slate-200 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                  {festival.description}
                </p>
                <div className="flex items-center text-white/80 text-sm gap-1">
                  <FiMapPin size={14} className="text-[#E85D04]" />
                  {festival.stateId?.name || 'Across India'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FestivalsSection;

