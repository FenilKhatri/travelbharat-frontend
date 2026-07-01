import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiMapPin } from "react-icons/fi";
import LikeButton from "../../../../../components/ui/LikeButton";

const CityHero = ({ city, stateName, resolvedStateSlug, avgRating, totalPlaces }) => {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-end pt-28">
      {city.images?.hero && (
        <div className="absolute inset-0">
          <img src={city.images.hero} alt={city.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-linear-to-t from-[#07090f] via-black/30 to-black/50" />
        </div>
      )}

      <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <nav className="flex items-center gap-2 text-sm text-white/60 mb-8 flex-wrap">
          <Link to="/" className="hover:text-[#E85D04] transition">Home</Link>
          <span>/</span>
          <Link to="/states" className="hover:text-[#E85D04] transition">States</Link>
          {resolvedStateSlug && (
            <>
              <span>/</span>
              <Link to={`/states/${resolvedStateSlug}`} className="hover:text-[#E85D04] transition">{stateName}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-white font-semibold">{city.name}</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {stateName && (
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.15em]">
              {stateName}
            </span>
          )}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-none">{city.name}</h1>
          {city.tagline && (
            <p className="text-base md:text-lg text-[#E85D04] font-bold uppercase tracking-widest mb-6">{city.tagline}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 mb-8">
            {avgRating && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white font-bold text-sm">
                <FiStar className="text-[#E85D04] fill-[#E85D04]" /> {avgRating} Rating
              </span>
            )}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white font-bold text-sm">
              <FiMapPin className="text-[#E85D04]" /> {totalPlaces} Destinations
            </span>
            <LikeButton entityId={city._id} entityType="city" initialCount={city.likeCount} className="px-4! py-2! text-sm!" />
          </div>

          {city.description && (
            <p className="text-white/75 max-w-2xl leading-relaxed text-sm md:text-base">{city.description}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CityHero;
