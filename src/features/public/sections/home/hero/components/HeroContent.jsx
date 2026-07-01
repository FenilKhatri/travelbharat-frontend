import { FaMagic } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
const HeroContent = ({ currentBanner, currentSlide, statsData }) => {
  return (
    <div className="lg:col-span-7">
      {/* TOP BADGE */}
      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-theme bg-glass-bg backdrop-blur-xl mb-8">
        <FaMagic className="text-accent" size={16} />
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Explore Incredible Bharat
        </span>
      </div>
      {/* TITLE */}
      <div className="min-h-[260px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45 }}
            className="space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[1.1] text-primary tracking-tight">
              {currentBanner.title}
            </h1>
            <p className="max-w-2xl text-sm sm:text-base md:text-lg text-secondary leading-relaxed font-medium">
              {currentBanner.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* STATS */}
      <div className="flex flex-wrap gap-8 mt-12 border-t border-border-theme pt-8">
        {[
          { number: statsData?.data?.states ? `${statsData.data.states}` : "28+", label: "States" },
          { number: statsData?.data?.destinations ? `${statsData.data.destinations}` : "50+", label: "Destinations" },
          { number: statsData?.data?.festivals ? `${statsData.data.festivals}` : "10+", label: "Festivals" },
        ].map((item, index) => (
          <div key={index}>
            <h3 className="text-3xl font-black text-primary text-center">{item.number}</h3>
            <p className="text-xs font-bold uppercase tracking-wider text-muted mt-1">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default HeroContent;