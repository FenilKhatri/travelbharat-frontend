import { AnimatePresence, motion } from "framer-motion";
import { FaMountain } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";

const HeroImageCard = ({ currentBanner, currentSlide, setIsHovered }) => {
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="lg:col-span-5 relative flex justify-center items-center"
    >
      {/* FLOATING CARD 1 */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-6 -left-6 bg-surface-elevated/90 backdrop-blur-xl border border-slate-200 dark:border-slate-600 rounded-2xl p-4 shadow-xl z-20 flex items-center gap-3"
      >
        <div className="p-2 bg-orange-500/10 rounded-lg text-accent">
          <FaMountain size={16} />
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
            Heritage Destinations
          </p>
          <h4 className="font-bold text-primary text-xs mt-0.5">
            Explore Royal India
          </h4>
        </div>
      </motion.div>

      {/* FLOATING CARD 2 */}
      <motion.div
        animate={{ y: [8, -8, 8] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-5 -right-6 bg-surface-elevated/90 backdrop-blur-xl border border-border-theme rounded-2xl px-5 py-4 shadow-xl z-20 flex items-center gap-3"
      >
        <div className="p-2 bg-orange-500/10 rounded-lg text-accent">
          <FiCamera size={16} />
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
            Cultural Journeys
          </p>
          <h4 className="font-bold text-primary text-xs mt-0.5">
            Discover Hidden Gems
          </h4>
        </div>
      </motion.div>

      {/* IMAGE CARD */}
      <div className="relative overflow-hidden rounded-[38px] border border-white/20 dark:border-white/70 shadow-2xl z-10 w-full aspect-4/5 md:h-[600px] md:w-[480px] bg-white/10 backdrop-blur-xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45 }}
            src={currentBanner.image}
            alt={currentBanner.title}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent"></div>

        {/* CONTENT */}
        <div className="absolute bottom-6 left-6 right-6 z-20">
          <span className="text-[10px] font-black uppercase bg-[#FF8F00] text-white px-2.5 py-1 rounded-md tracking-wider">
            Incredible Bharat
          </span>
          <h3 className="text-2xl font-black mt-3 text-white leading-tight">
            {currentBanner.title}
          </h3>
          <p className="text-white/80 text-xs mt-2 font-medium line-clamp-2">
            {currentBanner.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroImageCard;
