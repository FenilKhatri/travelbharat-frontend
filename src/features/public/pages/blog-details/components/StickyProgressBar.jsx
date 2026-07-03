import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const StickyProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Convert scroll progress (0-1) to percentage (0%-100%)
  const widthPercentage = useTransform(width, [0, 1], ["0%", "100%"]);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 dark:bg-slate-800 z-50">
      <motion.div 
        className="h-full bg-[#E85D04] rounded-r-full"
        style={{ width: widthPercentage }}
      />
    </div>
  );
};

export default StickyProgressBar;
