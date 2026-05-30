import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  FiMapPin, FiArrowLeft, FiImage, FiClock, FiStar, 
  FiChevronLeft, FiChevronRight, FiX, FiPhoneCall, FiInfo,
  FiArrowRight, FiPlay, FiPause
} from "react-icons/fi";
import { 
  FaHotel, FaUtensils, FaShoppingBag, FaPlane, FaTrain, FaBus, FaCar,
  FaMapMarkerAlt, FaUsers, FaMap
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { cityService } from "../../../services/cityService";

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

// ─── Utility Components ────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-[#1a1a1a] rounded-xl ${className}`} />
);

const CityDetailsSkeleton = () => (
  <div className="min-h-screen bg-[#050505] pt-24">
    <Skeleton className="h-[80vh] w-full rounded-none" />
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      <Skeleton className="h-12 w-64" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <Skeleton className="h-40 w-full" />
    </div>
  </div>
);

// ─── Advanced Cinematic Photo Modal Component ───────────────────────────────────
const PhotoModal = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keydown / Wheel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    
    // Prevent quick scrolling from flying through images
    let scrollTimeout;
    const handleWheel = (e) => {
      if (scrollTimeout) return;
      if (e.deltaX > 20 || e.deltaY > 30) {
        handleNext();
        scrollTimeout = setTimeout(() => { scrollTimeout = null }, 300);
      } else if (e.deltaX < -20 || e.deltaY < -30) {
        handlePrev();
        scrollTimeout = setTimeout(() => { scrollTimeout = null }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: true });
    document.body.style.overflow = "hidden";
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      document.body.style.overflow = "unset";
      clearTimeout(scrollTimeout);
    };
  }, [onClose, handleNext, handlePrev]);

  // Swipe logic
  const [touchStart, setTouchStart] = useState(null);
  const onTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();
  };

  if (!images || images.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]/95 backdrop-blur-2xl"
      aria-modal="true"
      role="dialog"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background click to close */}
      <div className="absolute inset-0 z-0" onClick={onClose} />
      
      <button onClick={onClose} className="absolute top-6 md:top-8 right-6 md:right-8 text-white/70 hover:text-white z-50 p-3 md:p-4 bg-white/10 rounded-full backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 hover:scale-110 shadow-2xl">
        <FiX size={24} className="md:w-7 md:h-7" />
      </button>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/50 font-bold tracking-[0.3em] text-sm bg-white/5 px-6 py-2 rounded-full border border-white/10 z-50">
        {currentIndex + 1} <span className="mx-2">/</span> {images.length}
      </div>

      {/* Carousel Track */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden z-10 pointer-events-none">
        {images.map((src, idx) => {
          let distance = idx - currentIndex;
          const half = images.length / 2;
          if (distance > half) distance -= images.length;
          if (distance < -half) distance += images.length;

          // Only render visible items for performance
          if (Math.abs(distance) > 2) return null;

          const isCenter = distance === 0;
          const isLeft = distance === -1;
          const isRight = distance === 1;

          // Desktop vs Mobile offsets
          let xOffset = `${distance * 65}vw`; 
          if (window.innerWidth < 768) {
            xOffset = `${distance * 85}vw`;
          }

          return (
            <motion.div
              key={idx} 
              initial={false}
              animate={{
                x: xOffset,
                scale: isCenter ? 1 : 0.7,
                opacity: isCenter ? 1 : Math.abs(distance) === 1 ? 0.4 : 0,
                filter: isCenter ? "blur(0px) brightness(1)" : "blur(16px) brightness(0.4)",
                zIndex: isCenter ? 50 : 40 - Math.abs(distance)
              }}
              transition={{ type: "spring", stiffness: 150, damping: 25, mass: 0.8 }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[90vw] md:w-[55vw] h-[60vh] md:h-[75vh] ${isCenter ? 'pointer-events-auto' : 'pointer-events-auto cursor-pointer'}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isLeft) handlePrev();
                if (isRight) handleNext();
              }}
            >
              <img src={src} className="max-w-full max-h-full object-contain rounded-2xl drop-shadow-[0_0_40px_rgba(0,0,0,0.8)] pointer-events-none select-none" alt={`Gallery ${idx + 1}`} />
            </motion.div>
          )
        })}
      </div>

      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 z-50">
        <button onClick={handlePrev} className="text-white/70 hover:text-white p-4 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-110 shadow-2xl">
          <FiChevronLeft size={28} />
        </button>
        <button onClick={handleNext} className="text-white/70 hover:text-white p-4 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-110 shadow-2xl">
          <FiChevronRight size={28} />
        </button>
      </div>
    </motion.div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getAttractionTags = (attraction) => {
  const text = `${attraction.name} ${attraction.description}`.toLowerCase();
  const tags = [];
  if (text.includes("nature") || text.includes("park") || text.includes("garden") || text.includes("lake") || text.includes("river")) tags.push("Nature");
  if (text.includes("heritage") || text.includes("fort") || text.includes("temple") || text.includes("palace") || text.includes("history")) tags.push("Heritage");
  if (text.includes("entertainment") || text.includes("mall") || text.includes("cinema") || text.includes("park") || text.includes("show")) tags.push("Entertainment");
  if (text.includes("beach") || text.includes("ocean") || text.includes("sea") || text.includes("coast")) tags.push("Beaches");
  if (text.includes("culture") || text.includes("art") || text.includes("museum") || text.includes("festival")) tags.push("Culture");
  return tags;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CityDetails = () => {
  const { citySlug } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [initialPhotoIndex, setInitialPhotoIndex] = useState(0);
  
  const [expSwiper, setExpSwiper] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleAutoplay = () => {
    if (!expSwiper) return;
    if (isPlaying) {
      expSwiper.autoplay.stop();
    } else {
      expSwiper.autoplay.start();
    }
    setIsPlaying(!isPlaying);
  };

  const { data: cityData, isLoading: cityLoading, isError: cityError } = useQuery({
    queryKey: ["cityBySlug", citySlug],
    queryFn: () => cityService.getCityBySlug(citySlug),
    enabled: !!citySlug,
  });

  const city = cityData?.data?.city;

  if (cityLoading) return <CityDetailsSkeleton />;

  if (cityError || !city) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] gap-4">
        <FaMapMarkerAlt size={56} className="text-[#E85D04]" />
        <h1 className="text-2xl font-bold text-white">City Not Found</h1>
        <p className="text-white/50">We couldn't find details for "{citySlug}".</p>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] text-white rounded-xl font-semibold text-sm hover:bg-[#D05203] transition">
          <FiArrowLeft size={16} /> Back Home
        </Link>
      </div>
    );
  }

  const validGallery = city.images?.gallery?.filter(img => img) || [];
  const experiencedAttractions = city.attractions?.map(a => ({...a, tags: getAttractionTags(a)})).filter(a => a.tags.length > 0) || [];
  const validEmergency = city.emergencyInfo && Object.values(city.emergencyInfo).some(val => val && val.trim() !== "");

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white selection:bg-[#E85D04] selection:text-white overflow-x-hidden pt-24">

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

      {/* ── SECTION 1: IMMERSIVE HERO ── */}
      {/* pt-28 and md:pt-36 ensure the hero is offset from the fixed navbar correctly */}
      <section className="relative w-full min-h-screen flex flex-col justify-center pt-28 md:pt-36 pb-24 md:pb-32">
        {city.images?.hero && (
          <div className="absolute inset-0 bg-[#050505]">
            <img src={city.images.hero} className="w-full h-full object-contain object-top md:object-cover md:object-center opacity-80" alt={city.name} />
            <div className="absolute inset-0 bg-black/40 mix-blend-multiply pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent opacity-80 pointer-events-none" />
          </div>
        )}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
            <h1 className="text-6xl md:text-9xl font-black text-white mb-4 drop-shadow-2xl tracking-tighter leading-none">
              {city.name}
            </h1>
            {city.tagline && (
              <p className="text-xl md:text-3xl font-bold text-[#E85D04] mb-8 tracking-wider uppercase drop-shadow-lg">
                {city.tagline}
              </p>
            )}
            {city.description && (
              <p className="text-base md:text-lg text-white/80 max-w-3xl leading-relaxed mb-12 font-medium">
                {city.description}
              </p>
            )}
            
            {/* Floating Pills */}
            <div className="flex flex-wrap gap-4">
              {city.population && (
                 <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl cursor-default">
                   <FaUsers className="text-[#E85D04]" size={16} /> <span className="text-white text-sm font-bold tracking-wide">{city.population}</span>
                 </motion.div>
              )}
              {city.pincode && (
                 <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl cursor-default">
                   <FaMapMarkerAlt className="text-[#E85D04]" size={16} /> <span className="text-white text-sm font-bold tracking-wide">{city.pincode}</span>
                 </motion.div>
              )}
              {city.bestTimeToVisit && (
                 <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl cursor-default">
                   <FiClock className="text-[#E85D04]" size={16} /> <span className="text-white text-sm font-bold tracking-wide">{city.bestTimeToVisit}</span>
                 </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: CITY OVERVIEW ── */}
      {city.overview && (
        <section className="py-24 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                The Urban Pulse
              </h2>
              <div className="w-20 h-1.5 bg-[#E85D04] mb-10 rounded-full" />
              <p className="text-sm md:text-xl text-white/70 leading-relaxed font-light">
                {city.overview}
              </p>
            </div>
            {city.images?.thumbnail && (
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-3xl md:rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
                  <img src={city.images.thumbnail} alt={`${city.name} Overview`} className="w-full h-60 md:h-full object-cover hover:scale-105 transition-transform duration-1000" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── SECTION 3: VISUAL JOURNEY ── */}
      {validGallery.length > 0 && (
        <section className="py-24 bg-[#0a0a0a] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">Visual Journey</h2>
                <p className="text-white/50 text-sm uppercase tracking-widest">Glimpses of {city.name}</p>
              </div>
              <button 
                onClick={() => { setInitialPhotoIndex(0); setModalOpen(true); }} 
                className="hidden sm:flex items-center gap-2 px-8 py-3 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition hover:border-[#E85D04] hover:text-[#E85D04]"
              >
                View All Photos <FiArrowRight />
              </button>
            </div>

            {/* Exactly 5 photos layout: 1 Large, 4 Small */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[600px]">
              {/* Featured Image */}
              {validGallery[0] && (
                <div className="md:col-span-8 h-full rounded-3xl md:rounded-[2rem] overflow-hidden relative group cursor-pointer ring-1 ring-white/10 shadow-2xl" onClick={() => { setInitialPhotoIndex(0); setModalOpen(true); }}>
                  <img src={validGallery[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" loading="lazy" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
              )}
              
              {/* 4 Supporting Images Grid */}
              <div className="md:col-span-4 grid grid-cols-2 grid-rows-2 gap-4 h-full">
                {[1, 2, 3, 4].map((idx) => {
                  if (!validGallery[idx]) return null;
                  return (
                    <div key={idx} className="relative rounded-2xl md:rounded-[1.5rem] overflow-hidden group cursor-pointer ring-1 ring-white/10 shadow-xl" onClick={() => { setInitialPhotoIndex(idx); setModalOpen(true); }}>
                      <img src={validGallery[idx]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                      {idx === 4 && validGallery.length > 5 && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm group-hover:bg-black/60 transition-colors">
                          <span className="text-white font-black text-2xl md:text-3xl">+{validGallery.length - 5}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button onClick={() => { setInitialPhotoIndex(0); setModalOpen(true); }} className="w-full mt-8 sm:hidden flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition">
              View All Photos
            </button>
          </div>
        </section>
      )}

      {/* ── SECTION 4: LOCAL EXPERIENCES (Interactive Auto-Scroll Showcase) ── */}
      {experiencedAttractions.length > 0 && (
        <section className="py-24 bg-[#050505] overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">Local Experiences</h2>
                <p className="text-white/50 text-sm max-w-2xl">Curated experiences dynamically tailored to what the city has to offer.</p>
              </div>
              
              {/* Manual Navigation Controls */}
              <div className="flex items-center gap-3">
                <button className="local-exp-prev w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-[#E85D04] hover:border-[#E85D04] transition-all duration-300 shadow-xl backdrop-blur-md">
                  <FiChevronLeft size={20} />
                </button>
                <button onClick={toggleAutoplay} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-[#E85D04] hover:border-[#E85D04] transition-all duration-300 shadow-xl backdrop-blur-md">
                  {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} className="ml-0.5" />}
                </button>
                <button className="local-exp-next w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-[#E85D04] hover:border-[#E85D04] transition-all duration-300 shadow-xl backdrop-blur-md">
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
              <style>
                {`
                  .continuous-swiper .swiper-wrapper {
                    transition-timing-function: linear !important;
                  }
                `}
              </style>
              <Swiper
                onSwiper={setExpSwiper}
                modules={[Autoplay, Navigation]}
                spaceBetween={24}
                slidesPerView={1.2}
                breakpoints={{
                  640: { slidesPerView: 2.2 },
                  1024: { slidesPerView: 3.2 },
                  1440: { slidesPerView: 4.2 }
                }}
                loop={true}
                speed={3500}
                autoplay={{
                  delay: 0,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                navigation={{
                  prevEl: '.local-exp-prev',
                  nextEl: '.local-exp-next',
                }}
                className="continuous-swiper !pb-12"
              >
                {[...experiencedAttractions, ...experiencedAttractions, ...experiencedAttractions].map((exp, idx) => (
                  <SwiperSlide key={idx} className="py-4"> 
                    {/* Hover causes color restoration, scale, and glow */}
                    <div className="relative h-[480px] rounded-3xl md:rounded-[2.5rem] overflow-hidden group cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(232,93,4,0.25)] ring-1 ring-white/10 hover:ring-[#E85D04]/50">
                      
                      {/* Default: B&W and desaturated. Hover: Full color. */}
                      <img src={exp.image || city.images?.thumbnail} className="w-full h-full object-cover grayscale-[85%] opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" loading="lazy" />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-[5rem] group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        
                        <div className="flex gap-2 mb-4 flex-wrap">
                          {exp.tags.map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10 group-hover:bg-[#E85D04]/90 group-hover:border-[#E85D04] transition-colors duration-500">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-4 leading-tight">{exp.name}</h3>
                        
                        {/* Hidden description block revealed on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-[80px]">
                          <p className="text-white/70 text-sm line-clamp-2 leading-relaxed mb-4">{exp.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {exp.entryFee && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E85D04]/10 border border-[#E85D04]/20 text-[10px] font-bold text-[#E85D04] uppercase tracking-wider">
                                <FiInfo size={12} /> {exp.entryFee}
                              </span>
                            )}
                            {exp.timings && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/80 uppercase tracking-wider">
                                <FiClock size={12} /> {exp.timings}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 4b: ALL ATTRACTIONS ── */}
      {city.attractions?.length > 0 && (
        <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl sm:text-4xl md:text-5xl font-black text-white mb-12">Must Visit Places</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {city.attractions.map((attraction, idx) => (
                <div key={idx} className="group bg-[#050505] rounded-3xl md:rounded-[2rem] overflow-hidden border border-white/5 hover:border-[#E85D04]/30 transition-all duration-500 shadow-xl flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#E85D04]/5">
                  {attraction.image && (
                    <div className="h-64 overflow-hidden relative shrink-0">
                      <img src={attraction.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                    </div>
                  )}
                  <div className={`p-8 flex-1 flex flex-col ${attraction.image ? '-mt-10 relative z-10' : ''}`}>
                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#E85D04] transition-colors">{attraction.name}</h3>
                    {attraction.description && (
                      <p className="text-white/60 text-sm leading-relaxed mb-8 line-clamp-3 flex-1">
                        {attraction.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-auto">
                      {attraction.entryFee && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90 font-bold">
                          <FiInfo className="text-[#E85D04]" size={14} /> {attraction.entryFee}
                        </span>
                      )}
                      {attraction.timings && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90 font-bold">
                          <FiClock className="text-[#E85D04]" size={14} /> {attraction.timings}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 6: HOTELS ── */}
      {city.hotels?.length > 0 && (
        <section className="py-24 bg-[#050505] border-y border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-5 mb-12">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                <FaHotel size={20} />
              </div>
              <h2 className="text-xl sm:text-4xl md:text-5xl font-black text-white">Luxury Stays</h2>
            </div>

            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={32}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              navigation
              pagination={{ clickable: true, dynamicBullets: true }}
              className="!pb-20 hotels-swiper"
            >
              {city.hotels.map((hotel, idx) => (
                <SwiperSlide key={idx} className="h-auto">
                  <div className="bg-[#0a0a0a] rounded-xl md:rounded-[2rem] border border-white/10 overflow-hidden group h-full hover:border-[#E85D04]/40 transition-colors shadow-2xl flex flex-col">
                    {hotel.image && (
                      <div className="h-64 relative overflow-hidden shrink-0">
                        <img src={hotel.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                        {hotel.priceRange && (
                          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white font-black text-sm shadow-xl">
                            {hotel.priceRange}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <h3 className="text-xl md:text-2xl font-black text-white flex-1">{hotel.name}</h3>
                        {hotel.rating > 0 && (
                          <div className="flex items-center gap-1 text-[#E85D04] font-black text-sm bg-[#E85D04]/10 px-3 py-1 rounded-lg border border-[#E85D04]/20 shrink-0">
                            <FiStar className="fill-current" size={12} /> {hotel.rating}
                          </div>
                        )}
                      </div>
                      {hotel.address && (
                        <p className="text-white/40 text-xs mb-6 flex items-start gap-2 uppercase tracking-wider font-bold">
                          <FiMapPin className="shrink-0 mt-0.5 text-[#E85D04]" size={14} /> {hotel.address}
                        </p>
                      )}
                      {hotel.description && (
                        <p className="text-white/60 text-sm line-clamp-3 leading-relaxed mt-auto">
                          {hotel.description}
                        </p>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* ── SECTION 7: RESTAURANTS ── */}
      {city.restaurants?.length > 0 && (
        <section className="py-24 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-5 mb-12">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                <FaUtensils size={20} />
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white">Culinary Delights</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {city.restaurants.map((restaurant, idx) => (
                <div key={idx} className="flex gap-6 p-5 rounded-3xl md:rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 items-center group">
                  {restaurant.image ? (
                    <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                      <img src={restaurant.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 shrink-0">
                      <FaUtensils size={32} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-bold text-white mb-2 truncate group-hover:text-[#E85D04] transition-colors">{restaurant.name}</h4>
                    {restaurant.cuisine && <p className="text-[#E85D04] text-[10px] font-black mb-3 uppercase tracking-widest">{restaurant.cuisine}</p>}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white/50">
                      {restaurant.rating > 0 && <span className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-md"><FiStar className="text-yellow-500 fill-current" /> {restaurant.rating}</span>}
                      {restaurant.priceRange && <span className="bg-white/10 px-2 py-1 rounded-md">{restaurant.priceRange}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 8: SHOPPING ── */}
      {city.shopping?.length > 0 && (
        <section className="py-24 bg-[#050505] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-5 mb-12">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                <FaShoppingBag size={20} />
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white">Retail Therapy</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {city.shopping.map((shop, idx) => (
                <div key={idx} className="group relative rounded-3xl md:rounded-[2rem] overflow-hidden aspect-[3/4] cursor-pointer ring-1 ring-white/10 hover:ring-[#E85D04]/50 transition-all duration-500 hover:-translate-y-1 shadow-2xl">
                  {shop.image && <img src={shop.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {shop.speciality && (
                      <span className="inline-block px-4 py-1.5 bg-[#E85D04]/20 backdrop-blur-md rounded-lg text-[#E85D04] text-[10px] uppercase font-black tracking-widest mb-4 border border-[#E85D04]/30">
                        {shop.speciality}
                      </span>
                    )}
                    <h4 className="text-2xl font-black text-white">{shop.name}</h4>
                    <p className="text-white/60 text-sm line-clamp-3 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{shop.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 9: HOW TO REACH ── */}
      {city.transport && (city.transport.fromAirport || city.transport.fromStation || city.transport.busStation || city.transport.local) && (
        <section className="py-24 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white mb-12">How To Reach</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { condition: city.transport.fromAirport, icon: FaPlane, title: "Airport", text: city.transport.fromAirport, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                { condition: city.transport.fromStation, icon: FaTrain, title: "Railway Station", text: city.transport.fromStation, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                { condition: city.transport.busStation, icon: FaBus, title: "Bus Station", text: city.transport.busStation, color: "text-[#E85D04]", bg: "bg-[#E85D04]/10", border: "border-[#E85D04]/20" },
                { condition: city.transport.local, icon: FaCar, title: "Local Transport", text: city.transport.local, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" }
              ].filter(t => t.condition).map((t, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl md:rounded-[2rem] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-8 border ${t.bg} ${t.color} ${t.border}`}>
                    <t.icon size={20} />
                  </div>
                  <h4 className="text-xl font-black text-white mb-4">{t.title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 10: NEARBY PLACES ── */}
      {city.nearbyPlaces?.length > 0 && (
        <section className="py-24 bg-[#050505] border-y border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white mb-16 text-center">Nearby Explorations</h2>
            
            <Swiper
              modules={[FreeMode]}
              spaceBetween={32}
              slidesPerView={1.5}
              breakpoints={{
                425: { slidesPerView: 2.5 },
                768: { slidesPerView: 3.5 },
                1024: { slidesPerView: 5.5 }
              }}
              freeMode={true}
              className="px-4"
            >
              {city.nearbyPlaces.map((place, idx) => (
                <SwiperSlide key={idx}>
                  <div className="group text-center cursor-pointer">
                    <div className="w-full aspect-square rounded-3xl md:rounded-full overflow-hidden mb-6 border-4 border-white/5 group-hover:border-[#E85D04] transition-colors relative shadow-2xl">
                      {place.image && (
                        <img src={place.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <h4 className="text-lg font-black text-white mb-2 group-hover:text-[#E85D04] transition-colors">{place.name}</h4>
                    {place.distance && (
                      <p className="text-white/50 text-xs font-bold uppercase tracking-widest">{place.distance}</p>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* ── SECTION 11: REDESIGNED EMERGENCY ASSISTANCE PANEL ── */}
      {validEmergency && (
        <section className="py-24 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative p-[2px] rounded-3xl md:rounded-[3rem] overflow-hidden group">
              {/* Animated Gradient Border Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#E85D04]/60 via-purple-500/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Inner Content */}
              <div className="relative bg-[#050505]/90 backdrop-blur-3xl rounded-3xl md:rounded-[3rem] p-10 md:p-16 h-full border border-white/5 overflow-hidden">
                {/* Soft Inner Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#E85D04]/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
                    <div className="w-12 md:w-20 md:h-20 h-12 rounded-md md:rounded-3xl md:rounded-[2rem] bg-gradient-to-br from-[#E85D04] to-orange-600 text-white flex items-center justify-center shadow-[0_0_40px_rgba(232,93,4,0.4)] shrink-0">
                      <FiPhoneCall size={32} />
                    </div>
                    <div>
                      <h2 className="text-4xl md:text-5xl font-black text-white mb-2">Emergency Assistance</h2>
                      <p className="text-white/60 text-lg">Important contacts accessible during your visit.</p>
                    </div>
                  </div>
                  
                  {/* Modern Contact Pills Layout */}
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    {[
                      { label: "Police", value: city.emergencyInfo.police },
                      { label: "Ambulance", value: city.emergencyInfo.ambulance },
                      { label: "Fire Brigade", value: city.emergencyInfo.fireBrigade },
                      { label: "Hospital", value: city.emergencyInfo.hospital },
                      { label: "Tourist Helpline", value: city.emergencyInfo.touristHelpline }
                    ].filter(e => e.value && e.value.trim() !== "").map((em, idx) => (
                      <motion.div whileHover={{ scale: 1.05 }} key={idx} className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-4 rounded-lg md:rounded-full border border-white/10 hover:border-[#E85D04]/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(232,93,4,0.15)] transition-colors cursor-default">
                        <div className="w-12 h-12 rounded-full bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                          <FiPhoneCall size={16} />
                        </div>
                        <div className="pr-2">
                          <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.15em] mb-0.5">{em.label}</p>
                          <p className="text-sm md:text-xl font-black text-white">{em.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 12: MAP SECTION ── */}
      {city.mapCoordinates?.lat && city.mapCoordinates?.lng && (
        <section className="h-[500px] w-full bg-[#050505] relative border-t border-white/5 group overflow-hidden">
          <iframe
            title={`${city.name} Map`}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(80%) contrast(120%)' }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${city.mapCoordinates.lat},${city.mapCoordinates.lng}&hl=en&z=13&output=embed`}
            className="group-hover:scale-105 transition-transform duration-1000"
          ></iframe>
          <div className="absolute top-10 left-10 bg-black/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl md:rounded-[2rem] z-10 shadow-2xl max-w-sm pointer-events-none group-hover:-translate-y-2 transition-transform duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04] shrink-0">
                <FaMap size={20} />
              </div>
              <h3 className="text-2xl font-black text-white">{city.name}</h3>
            </div>
            <div className="space-y-2">
              <p className="text-white/50 text-sm font-bold uppercase tracking-widest flex items-center justify-between">
                <span>Lat</span> <span className="text-white">{city.mapCoordinates.lat}</span>
              </p>
              <p className="text-white/50 text-sm font-bold uppercase tracking-widest flex items-center justify-between">
                <span>Lng</span> <span className="text-white">{city.mapCoordinates.lng}</span>
              </p>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default CityDetails;
