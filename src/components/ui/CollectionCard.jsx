
import { motion } from "framer-motion";
import TravelBadge from "./TravelBadge";

const CollectionCard = ({ title, subtitle, image, onClick, badgeConfig }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative shrink-0 w-64 sm:w-72 h-80 rounded-[28px] overflow-hidden group border border-border-glass shadow-xl shadow-black/20 text-left"
    >
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
        loading="lazy"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-[#04060a]/90 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Glassmorphism Border/Hover Highlight */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-[28px] transition-colors duration-500 pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end z-10 pointer-events-none">
        {badgeConfig && (
          <div className="mb-3">
            <TravelBadge badgeName={badgeConfig.name} className="inline-flex drop-shadow-xl" />
          </div>
        )}
        <h4 className="text-xl sm:text-2xl font-extrabold text-white mb-1 drop-shadow-lg tracking-tight">
          {title}
        </h4>
        {subtitle && (
          <p className="text-sm text-white/70 font-medium drop-shadow-md group-hover:text-white/90 transition-colors">
            {subtitle}
          </p>
        )}
      </div>
    </motion.button>
  );
};

export default CollectionCard;
