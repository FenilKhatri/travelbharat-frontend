import { Link } from "react-router-dom";
import { useScroll, useTransform, motion } from "framer-motion";
import { FiCompass, FiArrowRight, FiShare2 } from "react-icons/fi";
import { toast } from "react-toastify";
import Reveal from "../../../../../components/ui/Reveal";
import LikeButton from "../../../../../components/ui/LikeButton";
import PageContainer from "../../../../../components/layout/PageContainer";
const PlaceHero = ({ place, heroImage, validGallery, heroRef }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: place.name,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityHero = useTransform(scrollY, [0, 800], [1, 0]);
  return (
    <section ref={heroRef} className="relative w-full h-screen flex flex-col justify-end overflow-hidden">
      <motion.div
        style={{ y: yHero, opacity: opacityHero }}
        className="absolute inset-0 z-0 origin-center"
      >
        <motion.img
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 25, ease: "easeOut" }}
          src={heroImage}
          className="w-full h-full object-cover"
          alt={place.name}
        />
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-[#050505]/70 via-transparent to-transparent" />
      </motion.div>
      <PageContainer className="relative z-10 w-full pb-24 md:pb-32">
        <Reveal delay={0.2}>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {place.featured && (
              <span className="bg-purple-600/80 backdrop-blur-sm border border-purple-400/30 text-white px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-lg">
                Featured Destination
              </span>
            )}
            {place.trending && (
              <span className="bg-[#E85D04]/90 backdrop-blur-sm border border-[#E85D04]/30 text-white px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(232,93,4,0.4)]">
                Trending
              </span>
            )}
            {place.budget && (
              <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                {place.budget} Budget
              </span>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-2xl">
            {place.name}
          </h1>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="flex items-center gap-3 text-white/80 text-base md:text-lg font-light mb-10 tracking-wide">
            <span className="font-bold text-white">{place.cityId?.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E85D04]" />
            <span>{place.stateId?.name}</span>
            {place.category && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E85D04]" />
                <span className="capitalize">{place.category.replace("-", " ")}</span>
              </>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.5}>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to={`/plan/${place.slug}`}
              className="bg-[#E85D04] text-white px-6 py-3 rounded-full font-black flex items-center gap-2 hover:bg-[#D05203] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(232,93,4,0.4)]"
            >
              Plan a Trip <FiCompass />
            </Link>
            {validGallery.length > 0 && (
              <a
                href="#gallery"
                className="bg-white text-[#050505] px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-200 hover:scale-105 transition-all duration-300"
              >
                Explore Photos <FiArrowRight />
              </a>
            )}
            <LikeButton entityId={place._id} entityType="place" initialIsLiked={place.isLiked} className="px-6! py-3! text-sm! cursor-pointer" />
            <button onClick={handleShare} className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer">
              <FiShare2 /> Share
            </button>
          </div>
        </Reveal>
      </PageContainer>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 text-xs font-bold tracking-[0.2em] uppercase z-10"
      >
        <span>Discover More</span>
        <div className="w-px h-8 bg-linear-to-b from-white/50 to-transparent mt-2" />
      </motion.div>
    </section>
  );
};
export default PlaceHero;