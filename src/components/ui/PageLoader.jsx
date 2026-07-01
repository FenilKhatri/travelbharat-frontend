import { FiMapPin } from "react-icons/fi";

const sizeMap = {
  sm: { ring: "w-12 h-12", icon: 16, text: "text-xs" },
  md: { ring: "w-16 h-16", icon: 20, text: "text-sm" },
  lg: { ring: "w-20 h-20", icon: 24, text: "text-sm" }};

const PageLoader = ({
  message = "Discovering India...",
  fullScreen = true,
  size = "lg",
  className = ""}) => {
  const dims = sizeMap[size] || sizeMap.lg;

  const content = (
    <div className={`flex flex-col items-center justify-center gap-5 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="absolute w-32 h-32 rounded-full bg-[#E85D04]/10 dark:bg-[#E85D04]/15 blur-2xl animate-pulse" />
        <div className="absolute w-24 h-24 rounded-full border border-[#E85D04]/20 animate-loader-orbit" />
        <motion.div
          className={`relative ${dims.ring} rounded-full border-2 border-slate-200/80 dark:border-white/10 flex items-center justify-center bg-white/80 dark:bg-[#0A121F]/80 backdrop-blur-md shadow-lg`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-1 rounded-full border-t-2 border-r-2 border-[#E85D04] border-b-transparent border-l-transparent" />
          <FiMapPin className="text-[#E85D04]" size={dims.icon} />
        </motion.div>
        <motion.span
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E85D04] shadow-[0_0_12px_rgba(232,93,4,0.8)]"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`${dims.text} font-semibold tracking-[0.2em] uppercase text-slate-600 dark:text-slate-300`}
        >
          {message}
        </motion.p>
      )}

      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#E85D04]"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-50/90 dark:bg-[#050B14]/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center py-16">
      {content}
    </div>
  );
};

export default PageLoader;