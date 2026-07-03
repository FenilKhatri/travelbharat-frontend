import { FiMapPin, FiGlobe, FiInfo, FiCalendar } from "react-icons/fi";
import TravelBadge from "../../../../../components/ui/TravelBadge";
import LikeButton from "../../../../../components/ui/LikeButton";
import { motion } from "framer-motion";
import PageContainer from "../../../../../components/layout/PageContainer";

const StateHero = ({ state }) => {
  const quickFactsEntries = state.quickFacts ? Object.entries(state.quickFacts).filter(([key]) => key !== "_id" && key !== "id") : [];
  const displayedFacts = quickFactsEntries.slice(0, 4);

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center">
      {/* Background Image */}
      {(state.images?.hero?.url || state.heroImage?.url) && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${state.images?.hero?.url || state.heroImage?.url})`,
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-linear-to-t from-[#07090f] via-black/20 to-black/40" />
          <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent" />
        </div>
      )}
      <PageContainer className="relative z-10 pt-32 pb-24">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
          {/* Overlay Illustration */}
          {state.stateBranding?.overlayImage && (
            <div
              className="absolute right-0 bottom-0 w-full max-w-[600px] h-full bg-contain bg-no-repeat bg-bottom-right opacity-40 pointer-events-none mix-blend-screen z-[-1]"
              style={{
                backgroundImage: `url(${state.stateBranding.overlayImage})`,
              }}
            />
          )}
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <div className="flex items-center flex-wrap gap-3 mb-5">
              {state.region && (
                <span className="bg-[#E85D04] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-[#E85D04]/30">
                  {state.region} India
                </span>
              )}
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-4 drop-shadow-xl leading-none">
              {state.name}
            </h1>

            {/* Badges Under Title */}
            <div className="flex items-center flex-wrap gap-3 mb-6">
              {state.badges?.map((badgeName) => (
                <TravelBadge key={badgeName} badgeName={badgeName} />
              ))}
            </div>
            {state.tagline && (
              <p className="text-sm md:text-base font-bold mb-6 tracking-[0.2em] uppercase text-white/60">
                {state.tagline}
              </p>
            )}

            {/* New heroDescription instead of description */}
            {(state.heroDescription || state.description) && (
              <p className="text-sm md:text-base text-white/90 mb-10 leading-relaxed max-w-xl">
                {state.heroDescription || state.description}
              </p>
            )}

            <div className="flex gap-4">
              <LikeButton 
                entityId={state._id} 
                entityType="state" 
                initialIsLiked={state.isLiked}
                className="px-6! py-3! text-sm!"
              />

              {/* Optional CTA */}
              {state.ctaLabel && (
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl backdrop-blur-md transition border border-white/20">
                  {state.ctaLabel}
                </button>
              )}
            </div>
          </motion.div>

          {/* Right Info Card */}
          {state.quickFacts && Object.keys(state.quickFacts).length > 0 ? (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block bg-white/90 dark:bg-[#0c1018]/80 backdrop-blur-xl p-6 rounded-2xl w-80 shrink-0 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4"
            >
              {(state.images?.thumbnail?.url || state.heroImage?.url) && (
                <div className="w-full h-48 lg:h-56 rounded-xl overflow-hidden mb-6 border border-slate-200 dark:border-white/10 shadow-inner">
                  <img
                    src={state.images?.thumbnail?.url || state.heroImage?.url}
                    alt={`${state.name} Thumbnail`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex flex-col space-y-4">
                {displayedFacts.map(([key, value], index) => {
                  const title = key.replace(/([A-Z])/g, " $1").trim();
                  return (
                    <div key={index} className="flex flex-col">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] shrink-0">
                          <FiInfo size={17} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 dark:text-[#4b607a] font-bold uppercase tracking-widest">
                            {title}
                          </p>
                          <p className="text-sm font-bold text-slate-800 dark:text-[#edf2ff] mt-0.5 line-clamp-2">
                            {value}
                          </p>
                        </div>
                      </div>
                      {index < displayedFacts.length - 1 && (
                        <hr className="border-slate-200 dark:border-white/8 my-4" />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block bg-white/90 dark:bg-[#0c1018]/80 backdrop-blur-xl p-6 rounded-2xl w-80 shrink-0 border border-slate-200 dark:border-white/10 shadow-2xl"
            >
              {(state.images?.thumbnail?.url || state.heroImage?.url) && (
                <div className="w-full h-64 rounded-xl overflow-hidden mb-6 border border-slate-200 dark:border-white/10">
                  <img
                    src={state.images?.thumbnail?.url || state.heroImage?.url}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-4">
                {state.capital && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] shrink-0">
                      <FiMapPin size={17} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-[#4b607a] font-bold uppercase tracking-widest">
                        Capital
                      </p>
                      <p className="text-sm font-bold text-slate-800 dark:text-[#edf2ff] mt-0.5">
                        {state.capital}
                      </p>
                    </div>
                  </div>
                )}
                {state.capital && state.region && (
                  <hr className="border-slate-200 dark:border-white/8 my-4" />
                )}
                {state.region && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] shrink-0">
                      <FiGlobe size={17} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-[#4b607a] font-bold uppercase tracking-widest">
                        Region
                      </p>
                      <p className="text-sm font-bold text-slate-800 dark:text-[#edf2ff] mt-0.5">
                        {state.region}
                      </p>
                    </div>
                  </div>
                )}
                {(state.capital || state.region) &&
                  state.languages?.length > 0 && (
                    <hr className="border-slate-200 dark:border-white/8 my-4" />
                  )}
                {state.languages?.length > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] shrink-0">
                      <FiInfo size={17} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-[#4b607a] font-bold uppercase tracking-widest">
                        Language
                      </p>
                      <p className="text-sm font-bold text-slate-800 dark:text-[#edf2ff] mt-0.5">
                        {state.languages.join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </PageContainer>
    </section>
  );
};
export default StateHero;
