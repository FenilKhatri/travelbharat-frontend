import { FiMapPin, FiCalendar, FiClock, FiInfo } from "react-icons/fi";
import LikeButton from "../../../../../components/ui/LikeButton";
const FestivalHero = ({ festival }) => {
  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center">
      {/* Background Image */}
      {(festival.images?.hero || festival.images?.thumbnail) && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${festival.images.hero || festival.images.thumbnail})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-linear-to-t from-[#07090f] via-black/20 to-black/40" />
          <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent" />
        </div>
      )}
      <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-24">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <div className="flex items-center gap-3 mb-5">
              {festival.category && (
                <span className="bg-[#E85D04] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-[#E85D04]/30">
                  {festival.category}
                </span>
              )}
              <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border border-white/20">
                Festival
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 drop-shadow-xl leading-none">{festival.name}</h1>
            {festival.stateId?.name && (
              <p className="text-sm md:text-lg font-bold mb-6 tracking-[0.2em] uppercase text-[#E85D04] flex items-center gap-2">
                <FiMapPin /> {festival.stateId.name}
              </p>
            )}
            {festival.description && (
              <p className="text-sm md:text-base text-white/75 mb-10 leading-relaxed max-w-xl">
                {festival.description}
              </p>
            )}
            <div className="flex gap-4">
              <LikeButton entityId={festival._id} entityType="festival" initialCount={festival.likeCount || 0} className="!px-6 !py-3 !text-sm" />
            </div>
          </motion.div>
          {/* Right Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block bg-[#0c1018]/80 backdrop-blur-xl p-6 rounded-2xl w-80 shrink-0 border border-white/10 shadow-2xl"
          >
            {festival.images?.thumbnail && (
              <div className="w-full h-64 rounded-xl overflow-hidden mb-6 border border-white/10">
                <img src={festival.images.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="space-y-4">
              {festival.month && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] shrink-0">
                    <FiCalendar size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4b607a] font-bold uppercase tracking-widest">Month</p>
                    <p className="text-sm font-bold text-[#edf2ff] mt-0.5 capitalize">{festival.month}</p>
                  </div>
                </div>
              )}
              {festival.month && festival.duration && <hr className="border-white/8" />}
              {festival.duration && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] shrink-0">
                    <FiClock size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4b607a] font-bold uppercase tracking-widest">Duration</p>
                    <p className="text-sm font-bold text-[#edf2ff] mt-0.5">{festival.duration}</p>
                  </div>
                </div>
              )}
              {(festival.month || festival.duration) && festival.category && <hr className="border-white/8" />}
              {festival.category && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] shrink-0">
                    <FiInfo size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4b607a] font-bold uppercase tracking-widest">Category</p>
                    <p className="text-sm font-bold text-[#edf2ff] mt-0.5 capitalize">{festival.category}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default FestivalHero;