import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiArrowRight, FiMapPin } from "react-icons/fi";

const DestinationCard = ({ place, stateSlug, citySlug, index = 0 }) => {
  const image = place.images?.thumbnail || place.images?.hero;
  const category = place.category?.replace(/-/g, " ") || "Destination";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group h-full"
    >
      <div className="h-full rounded-3xl overflow-hidden border border-white/10 bg-[#111827] hover:border-[#E85D04]/40 hover:shadow-2xl hover:shadow-[#E85D04]/10 transition-all duration-500 hover:-translate-y-1 flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={place.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-[#1a2338] flex items-center justify-center">
              <FiMapPin className="text-[#E85D04]/50" size={36} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-black/20 to-transparent" />
          <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-wider">
            {category}
          </span>
          {place.rating > 0 && (
            <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E85D04] text-white text-xs font-black shadow-lg">
              <FiStar className="fill-current" size={12} /> {place.rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-black text-[#edf2ff] mb-2 group-hover:text-[#E85D04] transition-colors line-clamp-1">
            {place.name}
          </h3>
          {place.description && (
            <p className="text-sm text-[#8fa3cc] line-clamp-2 leading-relaxed mb-6 flex-1">
              {place.description}
            </p>
          )}
          <Link
            to={`/states/${stateSlug}/cities/${citySlug}/places/${place.slug}`}
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/30 text-[#E85D04] font-bold text-sm hover:bg-[#E85D04] hover:text-white transition-all duration-300"
          >
            View Details <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
