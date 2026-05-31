import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FiMapPin, FiArrowLeft, FiImage, FiCloud, FiGlobe, FiCalendar, FiStar,
  FiChevronDown, FiInfo, FiCheckCircle, FiClock, FiDownload, FiMail,
  FiX, FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import {
  FaTrain, FaPlane, FaCar, FaBus, FaLightbulb, FaUtensils, FaMonument,
  FaLeaf, FaHistory, FaLandmark, FaTemperatureHigh, FaArrowRight, FaStar as FaStarSolid
} from "react-icons/fa";
import { MdOutlineWbSunny, MdAcUnit, MdWaterDrop } from "react-icons/md";
import { stateService } from "../../../services/stateService";
import http from '../../../lib/axios';
import { toast } from 'react-toastify';
import SaveButton from '../../../components/ui/SaveButton';
import { cityService } from "../../../services/cityService";
import { placeService } from "../../../services/placeService";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";

// ─── Utility Components ────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-[#1a2338] rounded-xl ${className}`} />
);

const StateDetailsSkeleton = () => (
  <div className="min-h-screen bg-[#07090f]">
    <Skeleton className="h-[60vh] w-full rounded-none" />
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      <Skeleton className="h-12 w-64" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <Skeleton className="h-40 w-full" />
    </div>
  </div>
);

// ─── Section Label Component ──────────────────────────────────────────────────
const SectionLabel = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 text-[#E85D04] font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
    <Icon size={12} />
    <span>{text}</span>
  </div>
);

// ─── Collapsible Section Component ─────────────────────────────────────────────
const CollapsibleText = ({ title, icon: Icon, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!content) return null;
  
  return (
    <div className="relative pl-7 border-l-2 border-white/10">
      <div className="absolute w-3 h-3 bg-[#1a2540] border-2 border-white/20 rounded-full -left-[7px] top-1.5" />
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <h4 className="font-bold text-[#edf2ff] text-sm flex items-center gap-2 group-hover:text-[#E85D04] transition-colors">
          <Icon className="text-[#E85D04]" /> {title}
        </h4>
        <FiChevronDown className={`text-[#8fa3cc] transition-transform md:hidden ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100 mt-3' : 'max-h-0 opacity-0 md:max-h-[1000px] md:opacity-100 md:mt-3'}`}>
        <p className="text-sm text-[#8fa3cc] leading-relaxed pb-4 md:pb-0 whitespace-pre-line">
          {content}
        </p>
      </div>
    </div>
  );
};

// ─── Photo Modal Component ────────────────────────────────────────────────────
const PhotoModal = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose, handleNext, handlePrev]);

  if (!images || images.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white z-[110] p-2 bg-white/10 rounded-full backdrop-blur-md transition-colors" aria-label="Close modal">
        <FiX size={24} />
      </button>

      {images.length > 1 && (
        <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="absolute left-4 md:left-10 text-white/70 hover:text-white z-[110] p-4 bg-white/10 rounded-full backdrop-blur-md transition-colors" aria-label="Previous image">
          <FiChevronLeft size={32} />
        </button>
      )}

      <div className="relative w-full max-w-7xl h-full max-h-[85vh] flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg"
            alt={`Gallery image ${currentIndex + 1}`}
          />
        </AnimatePresence>
        {images.length > 1 && (
          <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-white/70 font-medium tracking-widest text-sm bg-black/50 px-4 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="absolute right-4 md:right-10 text-white/70 hover:text-white z-[110] p-4 bg-white/10 rounded-full backdrop-blur-md transition-colors" aria-label="Next image">
          <FiChevronRight size={32} />
        </button>
      )}
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const StateDetails = () => {
  const { slug } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [initialPhotoIndex, setInitialPhotoIndex] = useState(0);

  const { data: stateData, isLoading: stateLoading, isError: stateError } = useQuery({
    queryKey: ["stateBySlug", slug],
    queryFn: () => stateService.getStateBySlug(slug),
    enabled: !!slug,
  });

  const state = stateData?.data?.state;

  if (stateLoading) return <StateDetailsSkeleton />;

  if (stateError || !state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090f] gap-4">
        <FiMapPin size={56} className="text-[#E85D04]" />
        <h1 className="text-2xl font-bold text-white">State Not Found</h1>
        <p className="text-[#8fa3cc]">We couldn't find details for "{slug}".</p>
        <Link to="/states" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] text-white rounded-xl font-semibold text-sm hover:bg-[#D05203] transition">
          <FiArrowLeft size={16} /> Back to States
        </Link>
      </div>
    );
  }

  const validFoods = state.food?.filter(f => f.image) || [];
  const validGallery = state.images?.gallery?.filter(img => img) || [];

  return (
    <div className="min-h-screen bg-[#07090f] font-sans text-[#edf2ff]">

      {/* ── Photo Modal ── */}
      <AnimatePresence>
        {modalOpen && validGallery.length > 0 && (
          <PhotoModal 
            images={validGallery} 
            initialIndex={initialPhotoIndex} 
            onClose={() => setModalOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* ── Hero Section ── */}
      <section className="relative w-full min-h-[85vh] flex flex-col justify-center">
        {/* Background Image */}
        {state.images?.hero && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${state.images.hero})` }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-black/20 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-24">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-10">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-white"
            >
              <div className="flex items-center gap-3 mb-5">
                {state.region && (
                  <span className="bg-[#E85D04] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-[#E85D04]/30">
                    {state.region} India
                  </span>
                )}
                <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border border-white/20">
                  Must Visit
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-6 drop-shadow-xl leading-none">{state.name}</h1>
              {state.tagline && (
                <p className="text-sm md:text-base font-bold mb-6 tracking-[0.2em] uppercase text-white/60">
                  {state.tagline}
                </p>
              )}
              {state.description && (
                <p className="text-sm md:text-base text-white/75 mb-10 leading-relaxed max-w-xl">
                  {state.description}
                </p>
              )}
              <div className="flex gap-4">
                <SaveButton itemId={state._id} itemType="state" initialCount={state.saveCount} className="!px-6 !py-3 !text-sm" />
              </div>
            </motion.div>

            {/* Right Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block bg-[#0c1018]/80 backdrop-blur-xl p-6 rounded-2xl w-80 shrink-0 border border-white/10 shadow-2xl"
            >
              {state.images?.thumbnail && (
                <div className="w-full h-64 rounded-xl overflow-hidden mb-6 border border-white/10">
                  <img src={state.images.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="space-y-4">
                {state.capital && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] shrink-0">
                      <FiMapPin size={17} />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#4b607a] font-bold uppercase tracking-widest">Capital</p>
                      <p className="text-sm font-bold text-[#edf2ff] mt-0.5">{state.capital}</p>
                    </div>
                  </div>
                )}
                
                {state.capital && state.region && <hr className="border-white/8" />}
                
                {state.region && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] shrink-0">
                      <FiGlobe size={17} />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#4b607a] font-bold uppercase tracking-widest">Region</p>
                      <p className="text-sm font-bold text-[#edf2ff] mt-0.5">{state.region}</p>
                    </div>
                  </div>
                )}

                {(state.capital || state.region) && state.languages?.length > 0 && <hr className="border-white/8" />}

                {state.languages?.length > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] shrink-0">
                      <FiInfo size={17} />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#4b607a] font-bold uppercase tracking-widest">Language</p>
                      <p className="text-sm font-bold text-[#edf2ff] mt-0.5">{state.languages.join(", ")}</p>
                    </div>
                  </div>
                )}

                {(state.capital || state.region || state.languages?.length > 0) && state.weather?.bestSeason && <hr className="border-white/8" />}

                {state.weather?.bestSeason && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] shrink-0">
                      <FiCalendar size={17} />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#4b607a] font-bold uppercase tracking-widest">Best Season</p>
                      <p className="text-sm font-bold text-[#edf2ff] mt-0.5">{state.weather.bestSeason}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Overview & Features ── */}
      {(state.overview || state.highlights?.length > 0 || state.history || state.culture || validGallery.length > 0) && (
        <section className="py-24 bg-[#0c1018] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <SectionLabel icon={FiMapPin} text="Overview" />

            <div className="grid lg:grid-cols-12 gap-14">
              {/* Left Content */}
              <div className="lg:col-span-7">
                <h2 className="text-4xl md:text-5xl font-black text-[#edf2ff] mb-6 leading-tight">
                  The Vibrant Soul of <span className="text-[#E85D04]">{state.name}</span>
                </h2>
                
                {state.overview && (
                  <p className="text-[#8fa3cc] leading-relaxed mb-10 text-base">
                    {state.overview}
                  </p>
                )}

                {/* Highlights Grid */}
                {state.highlights?.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    {state.highlights.map((highlight, i) => (
                      <div key={i} className="bg-[#111827] p-5 rounded-2xl border border-white/6 hover:border-[#E85D04]/30 hover:bg-[#151e2d] transition-all duration-300 flex gap-4 items-start group">
                        <div className="bg-[#E85D04]/10 border border-[#E85D04]/20 p-2.5 rounded-xl text-[#E85D04] shrink-0 group-hover:bg-[#E85D04]/20 transition-colors">
                          <FaStarSolid size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#edf2ff] text-sm mb-1">{highlight.title}</h4>
                          <p className="text-xs text-[#4b607a] leading-relaxed line-clamp-3">{highlight.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Timeline Items */}
                <div className="space-y-8">
                  <CollapsibleText title="History" icon={FaHistory} content={state.history} />
                  <CollapsibleText title="Culture" icon={FaStarSolid} content={state.culture} />
                </div>
              </div>

              {/* Right Images / Gallery Preview */}
              <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
                {validGallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div 
                      className="col-span-3 rounded-2xl overflow-hidden h-64 shadow-2xl ring-1 ring-white/5 cursor-pointer group"
                      onClick={() => { setInitialPhotoIndex(0); setModalOpen(true); }}
                    >
                      <img src={validGallery[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Gallery preview main" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none" />
                    </div>
                    {validGallery.slice(1, 4).map((src, i) => (
                      <div 
                        key={i} 
                        className="rounded-2xl overflow-hidden h-32 shadow-lg ring-1 ring-white/5 cursor-pointer group relative"
                        onClick={() => { setInitialPhotoIndex(i + 1); setModalOpen(true); }}
                      >
                        <img src={src} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={`Gallery preview sub ${i + 1}`} />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery Section (Redesigned 3-Image Layout) ── */}
      {validGallery.length > 0 && (
        <section className="py-24 bg-[#07090f] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <SectionLabel icon={FiImage} text="Gallery" />
                <h2 className="text-4xl font-black text-[#edf2ff]">{state.name} Through the Lens</h2>
              </div>
              <button 
                onClick={() => { setInitialPhotoIndex(0); setModalOpen(true); }}
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 text-[#edf2ff] font-bold hover:bg-white/5 hover:border-white/20 transition text-sm"
              >
                See All Photos <FaArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-[500px]">
              {/* Image 1: Large */}
              <div 
                className="md:col-span-8 h-full relative rounded-3xl overflow-hidden group ring-1 ring-white/5 cursor-pointer"
                onClick={() => { setInitialPhotoIndex(0); setModalOpen(true); }}
              >
                <img src={validGallery[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 1" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Image 2 & 3: Small */}
              <div className="md:col-span-4 grid grid-rows-2 gap-3 h-full">
                {validGallery[1] && (
                  <div 
                    className="relative rounded-3xl overflow-hidden group ring-1 ring-white/5 cursor-pointer"
                    onClick={() => { setInitialPhotoIndex(1); setModalOpen(true); }}
                  >
                    <img src={validGallery[1]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 2" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}
                {validGallery[2] && (
                  <div 
                    className="relative rounded-3xl overflow-hidden group ring-1 ring-white/5 cursor-pointer"
                    onClick={() => { setInitialPhotoIndex(2); setModalOpen(true); }}
                  >
                    <img src={validGallery[2]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 3" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    {validGallery.length > 3 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors group-hover:bg-black/40">
                        <span className="text-white font-bold text-lg">+{validGallery.length - 3} Photos</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => { setInitialPhotoIndex(0); setModalOpen(true); }}
              className="w-full mt-6 sm:hidden flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 text-[#edf2ff] font-bold hover:bg-white/5 transition"
            >
              See All Photos
            </button>
          </div>
        </section>
      )}

      {/* ── Food Section ── */}
      {validFoods.length > 0 && (
        <section className="py-24 bg-[#0c1018] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <SectionLabel icon={FaUtensils} text="Culinary" />
                <h2 className="text-4xl font-black text-[#edf2ff]">Flavors of {state.name}</h2>
              </div>
              <div className="flex gap-5">
                <span className="flex items-center gap-2 text-sm font-bold text-[#8fa3cc]"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" /> Veg</span>
                <span className="flex items-center gap-2 text-sm font-bold text-[#8fa3cc]"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" /> Non-Veg</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {validFoods.map((item, i) => (
                <div key={i} className="bg-[#111827] rounded-3xl border border-white/6 overflow-hidden hover:border-white/12 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={item.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-4 right-4">
                      {item.isVeg ? (
                        <div className="bg-[#0c1018]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black text-emerald-400 flex items-center gap-1.5 border border-emerald-500/20">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" /> VEG
                        </div>
                      ) : (
                        <div className="bg-[#0c1018]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black text-red-400 flex items-center gap-1.5 border border-red-500/20">
                          <div className="w-2 h-2 rounded-full bg-red-500" /> NON-VEG
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-[#edf2ff] mb-2">{item.name}</h4>
                    {item.description && (
                      <p className="text-sm text-[#4b607a] line-clamp-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── When to Visit ── */}
      {state.weather && (state.weather.winter || state.weather.summer || state.weather.monsoon) && (
        <section className="py-24 bg-[#07090f] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-12 gap-4">
              <div>
                <SectionLabel icon={FiCalendar} text="Plan Your Trip" />
                <h2 className="text-4xl font-black text-[#edf2ff]">When to Visit {state.name}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Winter Card */}
              {state.weather.winter && (
                <div className="bg-[#111827] p-7 rounded-3xl border border-white/6 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-900/20 transition-all duration-300">
                  <div className="flex justify-between items-start mb-7">
                    <div className="w-12 h-12 bg-emerald-900/30 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                      <MdAcUnit size={22} />
                    </div>
                    {state.weather.bestSeason?.toLowerCase()?.includes("winter") && (
                       <span className="bg-emerald-900/30 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20 tracking-widest uppercase">Best Season</span>
                    )}
                  </div>
                  <h4 className="text-2xl font-black text-[#edf2ff] mb-4">Winter</h4>
                  <p className="text-sm text-[#8fa3cc] leading-relaxed">
                    {state.weather.winter}
                  </p>
                </div>
              )}

              {/* Summer Card */}
              {state.weather.summer && (
                <div className="bg-[#111827] p-7 rounded-3xl border border-white/6 hover:border-amber-500/20 hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-300">
                  <div className="flex justify-between items-start mb-7">
                    <div className="w-12 h-12 bg-amber-900/30 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center">
                      <MdOutlineWbSunny size={22} />
                    </div>
                    {state.weather.bestSeason?.toLowerCase()?.includes("summer") && (
                       <span className="bg-amber-900/30 text-amber-400 text-[10px] font-black px-3 py-1 rounded-full border border-amber-500/20 tracking-widest uppercase">Best Season</span>
                    )}
                  </div>
                  <h4 className="text-2xl font-black text-[#edf2ff] mb-4">Summer</h4>
                  <p className="text-sm text-[#8fa3cc] leading-relaxed">
                    {state.weather.summer}
                  </p>
                </div>
              )}

              {/* Monsoon Card */}
              {state.weather.monsoon && (
                <div className="bg-[#111827] p-7 rounded-3xl border border-white/6 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300">
                  <div className="flex justify-between items-start mb-7">
                    <div className="w-12 h-12 bg-blue-900/30 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
                      <MdWaterDrop size={22} />
                    </div>
                    {state.weather.bestSeason?.toLowerCase()?.includes("monsoon") && (
                       <span className="bg-blue-900/30 text-blue-400 text-[10px] font-black px-3 py-1 rounded-full border border-blue-500/20 tracking-widest uppercase">Best Season</span>
                    )}
                  </div>
                  <h4 className="text-2xl font-black text-[#edf2ff] mb-4">Monsoon</h4>
                  <p className="text-sm text-[#8fa3cc] leading-relaxed">
                    {state.weather.monsoon}
                  </p>
                </div>
              )}
            </div>

            {/* Note */}
            <div className="bg-[#E85D04]/8 border border-[#E85D04]/15 p-5 rounded-2xl flex items-start gap-4">
              <div className="bg-[#E85D04]/15 p-2 rounded-lg text-[#E85D04] mt-0.5 shrink-0"><FiInfo size={18} /></div>
              <div>
                <h5 className="font-bold text-[#edf2ff] mb-1 text-sm">Note: Check Local Conditions</h5>
                <p className="text-sm text-[#8fa3cc] leading-relaxed">Weather patterns can vary significantly between regions. Always check local forecasts before planning outdoor activities or remote travel.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── How to Reach ── */}
      {state.transport && (state.transport.byAir || state.transport.byTrain || state.transport.byRoad || state.transport.local) && (
        <section className="py-24 bg-[#0c1018] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <SectionLabel icon={FiMapPin} text="Transportation" />
            <h2 className="text-4xl font-black text-[#edf2ff] mb-12">How to Reach {state.name}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { condition: state.transport.byAir, icon: FaPlane, title: "By Air", text: state.transport.byAir, bg: "bg-purple-900/25", border: "border-purple-500/20", hover: "hover:border-purple-500/40", text_c: "text-purple-400", shadow: "hover:shadow-purple-900/20" },
                { condition: state.transport.byTrain, icon: FaTrain, title: "By Train", text: state.transport.byTrain, bg: "bg-emerald-900/25", border: "border-emerald-500/20", hover: "hover:border-emerald-500/40", text_c: "text-emerald-400", shadow: "hover:shadow-emerald-900/20" },
                { condition: state.transport.byRoad, icon: FaCar, title: "By Road", text: state.transport.byRoad, bg: "bg-[#E85D04]/15", border: "border-[#E85D04]/20", hover: "hover:border-[#E85D04]/40", text_c: "text-[#E85D04]", shadow: "hover:shadow-[#E85D04]/10" },
                { condition: state.transport.local, icon: FaBus, title: "Local Transport", text: state.transport.local, bg: "bg-blue-900/25", border: "border-blue-500/20", hover: "hover:border-blue-500/40", text_c: "text-blue-400", shadow: "hover:shadow-blue-900/20" },
              ].filter(item => item.condition).map(({ icon: Icon, title, text, bg, border, hover, text_c, shadow }, i) => (
                <div key={i} className={`bg-[#111827] border ${border} ${hover} p-7 rounded-3xl hover:shadow-xl ${shadow} transition-all duration-300 group`}>
                  <div className={`w-12 h-12 ${bg} border ${border} ${text_c} rounded-2xl flex items-center justify-center mb-7 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={22} />
                  </div>
                  <h4 className="text-lg font-bold text-[#edf2ff] mb-3">{title}</h4>
                  <p className="text-sm text-[#8fa3cc] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Essential Tips ── */}
      {state.travelTips?.filter(t => t.trim().length > 0).length > 0 && (
        <section className="py-24 bg-[#07090f]">
          <div className="max-w-7xl mx-auto px-4">
            <SectionLabel icon={FaLightbulb} text="Travel Hacks" />
            <h2 className="text-4xl font-black text-[#edf2ff] mb-12">Essential Tips for {state.name}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {state.travelTips.filter(t => t.trim().length > 0).map((tip, index) => (
                <div key={index} className="bg-[#111827] border border-white/6 p-6 rounded-2xl flex gap-4 items-start hover:border-[#E85D04]/20 hover:bg-[#151e2d] transition-all duration-300 group">
                  <div className="w-8 h-8 rounded-full bg-[#E85D04] text-white flex items-center justify-center font-black shrink-0 text-sm shadow-lg shadow-[#E85D04]/30 group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                  <p className="text-[#8fa3cc] text-sm font-medium leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Ready to Discover Banner ── */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="relative rounded-[2rem] overflow-hidden bg-[#0c1018] p-12 md:p-20 text-center flex flex-col items-center justify-center border border-white/6">
          {state.images?.hero && (
            <img src={state.images.hero} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" alt="Discover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-[#07090f]/70 to-transparent pointer-events-none" />

          {/* Decorative glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 rounded-full bg-[#E85D04]/8 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 justify-center text-[#E85D04] font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
              <FiMapPin size={12} /> Begin Your Journey
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#edf2ff] mb-4 leading-tight">
              Ready to Discover <span className="text-[#E85D04]">{state.name}</span>?
            </h2>
            <p className="text-base text-[#8fa3cc] mb-10">Begin your journey today and create memories that will last a lifetime.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default StateDetails;