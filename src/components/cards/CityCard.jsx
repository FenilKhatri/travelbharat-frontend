import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiArrowRight, FiCompass } from "react-icons/fi";

const CityCard = ({ city, stateSlug, index = 0 }) => {
  const image = city.images?.thumbnail || city.images?.hero;
  const description = city.tagline || city.description || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      <Link to={`/states/${stateSlug}/cities/${city.slug}`}>
        <div className="h-full rounded-3xl overflow-hidden border border-white/10 bg-[#111827] hover:border-[#E85D04]/40 hover:shadow-2xl hover:shadow-[#E85D04]/10 transition-all duration-500 hover:-translate-y-1 flex flex-col cursor-pointer">
        <div className="relative aspect-[4/3] overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={city.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-[#1a2338] flex items-center justify-center">
              <FiMapPin className="text-[#E85D04]/50" size={40} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-transparent to-transparent" />
          {city.totalPlaces > 0 && (
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-wider">
              <FiCompass size={12} className="text-[#E85D04]" />
              {city.totalPlaces} {city.totalPlaces === 1 ? "Place" : "Places"}
            </span>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-black text-[#edf2ff] mb-2 group-hover:text-[#E85D04] transition-colors">
            {city.name}
          </h3>
          {description && (
            <p className="text-sm text-[#8fa3cc] line-clamp-2 leading-relaxed flex-1">
              {description}
            </p>
          )}
        </div>
      </div>
      </Link>
    </motion.div>
  );
};

export default CityCard;
