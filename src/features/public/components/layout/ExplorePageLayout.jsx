import { motion } from "framer-motion";
import { FiSearch, FiCompass, FiMapPin, FiImage } from "react-icons/fi";

/**
 * Reusable Layout for Explore Pages (States, Cities, Festivals, Destinations).
 * Includes Hero Banner, Sidebar Filters, and Grid Content Area.
 */
const ExplorePageLayout = ({
  heroImage,
  title,
  subtitle,
  highlightText,
  stats,
  sidebarContent,
  itemCount,
  itemName,
  isLoading,
  isError,
  hasItems,
  children
}) => {

  const formatStatCount = (count) => {
    if (count >= 1000) return `${Math.floor(count / 1000)}k+`;
    if (count >= 100) return `${count}+`;
    return String(count);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1628] pb-24">
      {/*  Hero Section  */}
      <div className="relative pt-24 pb-20 md:pt-36 md:pb-28 flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0A1628] via-transparent to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto">
          {highlightText && (
            <span className="text-[#E85D04] font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">
              — {highlightText} —
            </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-lg leading-tight tracking-tight" dangerouslySetInnerHTML={{ __html: title }} />
          {subtitle && (
            <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto drop-shadow-md mb-12 font-medium">
              {subtitle}
            </p>
          )}

          {/* Stats Row */}
          {stats && stats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 text-slate-800 dark:text-white">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl font-black text-[#E85D04]">
                    {stat.value ? formatStatCount(stat.value) : "—"}
                  </div>
                  <div className="text-[10px] sm:text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-300 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/*  Main Content Area (2-Column Layout)  */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-12 md:mt-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left Sidebar (Sticky) */}
          <div className="w-full lg:w-1/4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <FiCompass className="text-[#E85D04]" /> Explore Filters
              </h3>
              {sidebarContent}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="w-full lg:w-3/4">

            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-[#E85D04] font-bold tracking-wider uppercase text-xs mb-1.5 block">
                  — Explore
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  Directory
                </h2>
              </div>
              <div className="text-sm font-bold text-slate-500 bg-white dark:bg-slate-900/60 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm backdrop-blur-md">
                Showing <span className="text-[#E85D04]">{itemCount}</span> {itemName}
              </div>
            </div>

            <div className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-[280px] rounded-[1.25rem] bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  ))}
                </div>
              ) : isError ? (
                <div className="text-center py-20 text-slate-500 font-medium">
                  Failed to load {itemName}. Please try again later.
                </div>
              ) : !hasItems ? (
                <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <FiMapPin size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-bold text-slate-700 dark:text-white">No {itemName} Found</h3>
                  <p className="text-slate-500 mt-2 font-medium">Try adjusting your search or region filter.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {children}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePageLayout;
