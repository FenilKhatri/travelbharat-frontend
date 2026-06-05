import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";

const FestivalCard = ({ festival, index = 0 }) => {
  const image = festival.images?.thumbnail || festival.images?.hero;
  const description = festival.description || festival.overview || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      <div className="h-full rounded-3xl overflow-hidden border border-white/10 bg-[#111827] hover:border-[#E85D04]/40 hover:shadow-2xl hover:shadow-[#E85D04]/10 transition-all duration-500 hover:-translate-y-1 flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={festival.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-[#1a2338] flex items-center justify-center">
              <FiCalendar className="text-[#E85D04]/50" size={40} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-transparent to-transparent" />
          {festival.month && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-wider">
              <FiCalendar size={12} className="text-[#E85D04]" />
              {festival.month}
            </span>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-xl font-black text-[#edf2ff] group-hover:text-[#E85D04] transition-colors line-clamp-1">
              {festival.name}
            </h3>
          </div>
          
          {festival.stateId?.name && (
            <p className="text-xs font-bold uppercase tracking-widest text-[#E85D04] mb-3 flex items-center gap-1">
               <FaMapMarkerAlt /> {festival.stateId.name}
            </p>
          )}

          {description && (
            <p className="text-sm text-[#8fa3cc] line-clamp-2 leading-relaxed mb-6 flex-1">
              {description}
            </p>
          )}
          <Link
            to={`/festivals/${festival.slug}`}
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/30 text-[#E85D04] font-bold text-sm hover:bg-[#E85D04] hover:text-white transition-all duration-300"
          >
            View Festival <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FestivalCard;
