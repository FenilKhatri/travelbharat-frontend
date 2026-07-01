
import { motion, useScroll, useTransform } from "framer-motion";
import { memo } from "react";

const ListingHero = ({ heroImage, highlightText, title, subtitle, onScrollClick }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity1 = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative h-[450px] md:h-[550px] flex flex-col items-center justify-center overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div
        style={{ y: y1, backgroundImage: `url(${heroImage})` }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      />
      {/* Gradients to seamlessly blend into background */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Gradient Overlay for Text Readability and seamless fade to content */}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-background" />

      {/* Hero Content */}
      <motion.div
        style={{ opacity: opacity1 }}
        className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto mt-16"
      >
        {highlightText && (
          <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[#E85D04] font-black tracking-[0.2em] uppercase text-[10px] sm:text-xs mb-6 shadow-xl">
            {highlightText}
          </span>
        )}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 drop-shadow-2xl leading-[1.1] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base md:text-xl text-white/80 max-w-2xl mx-auto drop-shadow-lg font-medium leading-relaxed">
            {subtitle}
          </p>
        )}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer"
        onClick={onScrollClick}
      >
        <span className="text-[10px] uppercase tracking-widest text-white/50 mb-2 font-bold">Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-8 h-12 rounded-full border-2 border-white/20 flex justify-center pt-2 bg-black/20 backdrop-blur-sm"
        >
          <div className="w-1 h-2 bg-[#E85D04] rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default memo(ListingHero);
