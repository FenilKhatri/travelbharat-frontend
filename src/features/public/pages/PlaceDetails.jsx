import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

import {
  FiMapPin, FiClock, FiCalendar, FiDollarSign, FiTag,
  FiX, FiChevronLeft, FiChevronRight, FiCamera,
  FiArrowRight, FiStar, FiInfo, FiWind
} from "react-icons/fi";
import { FaHistory, FaQuoteLeft, FaPlane, FaTrain, FaCar, FaBus } from "react-icons/fa";
import { placeService } from "../../../services/placeService";
import ReviewSection from "../components/ReviewSection";
import PageLoader from "../../../components/ui/PageLoader";
import { useAuth } from "../../../context/AuthContext";
import LikeButton from "../../../components/ui/LikeButton";
import GalleryCarousel from "../../../components/ui/GalleryCarousel";
import { festivalService } from "../../../services/festivalService";
import ExploreIconicSection from "../sections/home/ExploreIconicSection";


// Scroll Reveal Wrapper
const Reveal = ({ children, delay = 0, y = 30 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// --- Main Page Component ---

const PlaceDetails = () => {
  const { slug } = useParams();
  const heroRef = useRef(null);
  const { user } = useAuth();

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityHero = useTransform(scrollY, [0, 800], [1, 0]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['placeDetails', slug],
    queryFn: () => placeService.getPlaceBySlug(slug)
  });

  const place = data?.data?.place;
  const stateSlug = place?.stateId?.slug;

  const { data: festivalsData, isLoading: festivalsLoading } = useQuery({
    queryKey: ['festivalsByState', stateSlug],
    queryFn: () => festivalService.getFestivalsByState(stateSlug),
    enabled: !!stateSlug
  });

  const festivals = festivalsData?.data?.festivals || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <PageLoader fullScreen={false} message="Loading destination..." size="md" />
      </div>
    );
  }

  if (isError || !place) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center text-center p-4">
        <h1 className="text-4xl font-black text-white mb-4">Destination Not Found</h1>
        <p className="text-white/60 mb-8">This experience might have been removed or is temporarily unavailable.</p>
        <Link to="/places" className="bg-[#E85D04] text-white px-8 py-3 rounded-full font-bold hover:bg-[#D05203] transition-colors">
          Explore Other Destinations
        </Link>
      </div>
    );
  }

  const heroImage = place.images?.hero || place.images?.thumbnail || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80";
  const validGallery = place.images?.gallery?.filter(img => img) || [];
  const hasValidMap = !!(place.location?.coordinates?.lat && place.location?.coordinates?.lng);

  return (
    <div className="bg-[#050505] font-sans overflow-x-hidden selection:bg-[#E85D04] selection:text-white text-white">

      {/*  SECTION 1: CINEMATIC HERO  */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-4 w-full pb-24 md:pb-32">

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
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black text-white mb-4 leading-[0.95] tracking-tight drop-shadow-2xl">
              {place.name}
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="flex items-center gap-3 text-white/80 text-lg md:text-2xl font-light mb-10 tracking-wide">
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
            <div className="flex flex-wrap gap-4">
              {validGallery.length > 0 && (
                <a
                  href="#gallery"
                  className="bg-white text-[#050505] px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-200 hover:scale-105 transition-all duration-300"
                >
                  Explore Photos <FiArrowRight />
                </a>
              )}

              <LikeButton entityId={place._id} entityType="destination" initialCount={place.likeCount} className="!px-8 !py-4 !text-base cursor-pointer" />
            </div>
          </Reveal>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 text-xs font-bold tracking-[0.2em] uppercase z-10"
        >
          <span>Discover More</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent mt-2" />
        </motion.div>
      </section>

      {/*  SECTION 2: DESTINATION SNAPSHOT  */}
      <section className="relative z-20 -mt-10 mb-24 max-w-[1600px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { icon: FiClock, label: "Duration", value: place.duration },
            { icon: FiCalendar, label: "Timings", value: place.timings },
            { icon: FiWind, label: "Best Time", value: place.bestTimeToVisit },
            { icon: FiDollarSign, label: "Entry Fee", value: place.entryFee?.indian },
            { icon: FiStar, label: "Rating", value: place.rating > 0 ? `${place.rating} / 5 (${place.reviewCount})` : null },
            { icon: FiTag, label: "Type", value: place.tripType?.[0] || place.category }
          ].filter(item => item.value && item.value !== "Free" && item.value !== "Open 24 Hours").map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-3 group"
            >
              <item.icon size={24} className="text-[#E85D04] group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.15em] mb-1">{item.label}</p>
                <p className="text-white font-bold text-sm lg:text-base capitalize leading-tight">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/*  SECTION 3: WHY VISIT (STORY)  */}
      <section className="py-24 max-w-[1600px] mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] font-serif">
                Why Visit <span className="text-[#E85D04] italic">{place.name}?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <div
                className="text-white/70 text-lg md:text-xl leading-relaxed font-light prose prose-invert prose-p:mb-6 max-w-none"
                dangerouslySetInnerHTML={{ __html: place.whyVisit || place.overview || place.description }}
              />
            </Reveal>
          </div>
          <div className="lg:col-span-5 relative hidden md:block">
            <Reveal delay={0.4}>
              <motion.div
                whileHover={{ rotate: 2, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] aspect-[4/5] max-w-md ml-auto"
              >
                <img src={place.images?.thumbnail || heroImage} alt={place.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/*  SECTION 4: VISUAL JOURNEY  */}
      <div id="gallery">
        <GalleryCarousel images={validGallery} name={place.name} />
      </div>

      {/*  SECTION 5: HIGHLIGHTS (TIMELINE)  */}
      {place.highlights?.length > 0 && (
        <section className="py-32 overflow-hidden bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
          <div className="max-w-[1600px] mx-auto px-4">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Key Highlights</h2>
            </Reveal>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-[28px] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent hidden md:block" />

              <div className="flex flex-col md:flex-row gap-8 md:gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-8">
                {place.highlights.map((highlight, idx) => (
                  <Reveal key={idx} delay={idx * 0.1}>
                    <div className="relative w-full md:w-[320px] shrink-0 snap-center md:pt-16 group">
                      {/* Timeline Dot */}
                      <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#E85D04] border-[4px] border-[#0a0a0a] hidden md:block group-hover:scale-150 transition-transform shadow-[0_0_15px_#E85D04]" />

                      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors h-full">
                        <h4 className="text-xl font-black mb-4 text-[#E85D04]">{highlight.title || highlight.name || `Highlight ${idx + 1}`}</h4>
                        <p className="text-white/60 leading-relaxed text-sm">
                          {highlight.description || highlight}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/*  SECTION 6: ACTIVITIES (AUTO CAROUSEL)  */}
      {place.activities?.length > 0 && (
        <section className="py-24 bg-[#0a0a0a]">
          <div className="max-w-[1600px] mx-auto px-4">
            <Reveal>
              <div className="flex justify-between items-end mb-12">
                <h2 className="text-4xl md:text-5xl font-black">Top Activities</h2>
                <div className="flex gap-2">
                  <button className="act-prev w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"><FiChevronLeft size={24} /></button>
                  <button className="act-next w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"><FiChevronRight size={24} /></button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
                <Swiper
                  modules={[Autoplay, Navigation]}
                  spaceBetween={24}
                  slidesPerView={1.2}
                  breakpoints={{
                    640: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 3.5 }
                  }}
                  navigation={{ prevEl: '.act-prev', nextEl: '.act-next' }}
                  autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                  loop={true}
                  className="pb-12"
                >
                  {place.activities.map((act, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="group bg-[#050505] rounded-[2rem] overflow-hidden border border-white/10 hover:border-white/30 transition-colors cursor-grab active:cursor-grabbing">
                        <div className="h-64 overflow-hidden relative">
                          <img
                            src={act.image || heroImage}
                            className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                            alt={act.name}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                        </div>
                        <div className="p-8 relative -mt-10 z-10">
                          <h3 className="text-2xl font-black mb-2">{act.name}</h3>
                          {act.description && <p className="text-white/60 text-sm line-clamp-3">{act.description}</p>}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/*  SECTION 7: FOOD EXPERIENCES  */}
      {place.foodSpecialities?.length > 0 && (
        <section className="py-24 bg-[#050505]">
          <div className="max-w-[1600px] mx-auto px-4">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-black mb-12">Culinary Delights</h2>
            </Reveal>
            <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-8 snap-x snap-mandatory">
              {place.foodSpecialities.map((food, idx) => (
                <Reveal key={idx} delay={idx * 0.1}>
                  <div className="w-[280px] sm:w-[350px] shrink-0 snap-center group rounded-[2rem] overflow-hidden relative border border-white/10 aspect-square">
                    <img
                      src={food.image || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={food.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <h3 className="text-2xl font-black text-white mb-2">{food.name}</h3>
                      <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-3">{food.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/*  SECTION 8: PHOTOGRAPHY SPOTS (PINTEREST MASONRY)  */}
      {place.photographySpots?.length > 0 && (
        <section className="py-24 bg-[#0a0a0a]">
          <div className="max-w-[1600px] mx-auto px-4">
            <Reveal>
              <div className="flex items-center gap-4 mb-12">
                <FiCamera className="text-[#E85D04]" size={40} />
                <h2 className="text-4xl md:text-5xl font-black">Photography Spots</h2>
              </div>
            </Reveal>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {place.photographySpots.map((spot, idx) => (
                <Reveal key={idx} delay={idx * 0.1}>
                  <div className="break-inside-avoid relative rounded-[2rem] overflow-hidden border border-white/5 bg-[#050505] group p-8 hover:bg-white/5 transition-colors">
                    <h3 className="text-xl font-black text-[#E85D04] mb-3">{spot.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{spot.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/*  SECTION 9: HISTORY & LEGENDS (NAT GEO STYLE)  */}
      {(place.history || place.legends) && (
        <section className="py-32 bg-[#050505] relative border-y border-white/5">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 md:gap-24">

              {place.history && (
                <Reveal>
                  <div className="prose prose-invert max-w-none">
                    <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
                      <FaHistory size={24} className="text-[#E85D04]" />
                      <h2 className="text-3xl font-black uppercase tracking-[0.2em] m-0">History</h2>
                    </div>
                    <p className="font-serif text-lg md:text-xl leading-[1.8] text-white/80 first-letter:float-left first-letter:text-[6rem] first-letter:leading-[0.8] first-letter:font-black first-letter:text-[#E85D04] first-letter:pr-4">
                      {place.history}
                    </p>
                  </div>
                </Reveal>
              )}

              {place.legends && (
                <Reveal delay={0.2}>
                  <div className="prose prose-invert max-w-none">
                    <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
                      <FaQuoteLeft size={24} className="text-purple-500" />
                      <h2 className="text-3xl font-black uppercase tracking-[0.2em] m-0">Legends</h2>
                    </div>
                    <p className="font-serif text-lg md:text-xl leading-[1.8] text-white/80 border-l-2 border-purple-500/50 pl-6 italic">
                      {place.legends}
                    </p>
                  </div>
                </Reveal>
              )}

            </div>
          </div>
        </section>
      )}

      {/*  SECTION 10: TRAVEL PLANNER  */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-[1600px] mx-auto px-4">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-black mb-12">Travel Planner</h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            <Reveal delay={0.1}>
              <div className="bg-[#050505] p-8 rounded-[2rem] border border-white/10 h-full">
                <FiClock className="text-[#E85D04] mb-6" size={32} />
                <h3 className="text-xl font-bold mb-6 text-white/50 uppercase tracking-widest">Schedule</h3>
                <div className="space-y-4 font-medium">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Timings</span> <span className="text-white text-right">{place.timings}</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Closed On</span> <span className="text-white text-right">{place.closedOn}</span></div>
                  <div className="flex justify-between"><span>Duration</span> <span className="text-white text-right">{place.duration || "N/A"}</span></div>
                </div>
              </div>
            </Reveal>

            {place.entryFee && (
              <Reveal delay={0.2}>
                <div className="bg-[#050505] p-8 rounded-[2rem] border border-white/10 h-full">
                  <FiDollarSign className="text-green-500 mb-6" size={32} />
                  <h3 className="text-xl font-bold mb-6 text-white/50 uppercase tracking-widest">Ticketing</h3>
                  <div className="space-y-4 font-medium">
                    <div className="flex justify-between border-b border-white/5 pb-2"><span>Indian</span> <span className="text-white">{place.entryFee.indian}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span>Foreigner</span> <span className="text-white">{place.entryFee.foreigner}</span></div>
                    <div className="flex justify-between"><span>Camera</span> <span className="text-white">{place.entryFee.camera}</span></div>
                  </div>
                </div>
              </Reveal>
            )}

            {place.quickFacts && (
              <Reveal delay={0.3}>
                <div className="bg-[#050505] p-8 rounded-[2rem] border border-white/10 h-full">
                  <FiInfo className="text-blue-500 mb-6" size={32} />
                  <h3 className="text-xl font-bold mb-6 text-white/50 uppercase tracking-widest">Quick Facts</h3>
                  <div className="space-y-4 font-medium">
                    {place.quickFacts.distanceFromCity && <div className="flex justify-between border-b border-white/5 pb-2"><span>Distance</span> <span className="text-white">{place.quickFacts.distanceFromCity}</span></div>}
                    {place.quickFacts.famousFor && <div className="flex justify-between border-b border-white/5 pb-2"><span>Famous For</span> <span className="text-white text-right max-w-[50%]">{place.quickFacts.famousFor}</span></div>}
                    {place.bestTimeToVisit && <div className="flex justify-between"><span>Best Time</span> <span className="text-white text-right">{place.bestTimeToVisit}</span></div>}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/*  SECTION 11: HOW TO REACH  */}
      {place.howToReach && (
        <section className="py-24 bg-[#050505] border-t border-white/5">
          <div className="max-w-[1600px] mx-auto px-4">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-black mb-12">How To Reach</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { type: "Air", text: place.howToReach.byAir, icon: FaPlane, color: "text-sky-400" },
                { type: "Train", text: place.howToReach.byTrain, icon: FaTrain, color: "text-orange-400" },
                { type: "Road", text: place.howToReach.byRoad, icon: FaCar, color: "text-green-400" },
                { type: "Local", text: place.howToReach.localTransport, icon: FaBus, color: "text-purple-400" }
              ].filter(t => t.text).map((route, idx) => (
                <Reveal key={idx} delay={idx * 0.1}>
                  <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2rem] h-full hover:-translate-y-2 transition-transform shadow-xl">
                    <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                      <route.icon size={24} className={route.color} />
                      <h3 className="text-xl font-bold uppercase tracking-widest">{route.type}</h3>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">{route.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/*  SECTION 12: TRAVELER TIPS (STICKY NOTES)  */}
      {place.tips?.length > 0 && (
        <section className="py-24 bg-[#0a0a0a] overflow-hidden">
          <div className="max-w-[1600px] mx-auto px-4">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Know Before You Go</h2>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {place.tips.map((tip, idx) => (
                <Reveal key={idx} delay={idx * 0.1}>
                  <motion.div
                    initial={{ rotate: Math.random() * 8 - 4 }}
                    whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }}
                    className="w-[280px] sm:w-[320px] aspect-square bg-gradient-to-br from-[#E85D04] to-orange-600 p-8 shadow-[10px_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-center text-center cursor-default"
                  >
                    <FiInfo className="text-white/30 mx-auto mb-4" size={40} />
                    <p className="text-white font-bold text-lg leading-relaxed">{tip}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/*  SECTION 13: NEARBY ATTRACTIONS  */}
      {place.nearbyAttractions?.length > 0 && (
        <section className="py-24 bg-[#050505] overflow-hidden">
          <div className="max-w-[1600px] mx-auto px-4">
            <Reveal>
              <div className="flex justify-between items-end mb-12">
                <h2 className="text-4xl md:text-5xl font-black">Nearby Attractions</h2>
                <div className="flex gap-2">
                  <button className="near-prev w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"><FiChevronLeft size={24} /></button>
                  <button className="near-next w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"><FiChevronRight size={24} /></button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
                <Swiper
                  modules={[Autoplay, Navigation]}
                  spaceBetween={24}
                  slidesPerView={1.5}
                  breakpoints={{
                    640: { slidesPerView: 2.5 },
                    1024: { slidesPerView: 4.5 }
                  }}
                  navigation={{ prevEl: '.near-prev', nextEl: '.near-next' }}
                  autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                  loop={true}
                  className="pb-12"
                >
                  {place.nearbyAttractions.map((attraction, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="group cursor-pointer">
                        <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-4 border border-white/10 group-hover:border-[#E85D04]/50 transition-colors relative shadow-xl">
                          {attraction.image ? (
                            <img src={attraction.image} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" loading="lazy" />
                          ) : (
                            <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
                              <FiMapPin className="text-white/20" size={40} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-[#E85D04] transition-colors line-clamp-1">{attraction.name}</h4>
                        {attraction.distance && <p className="text-white/50 text-sm font-medium">{attraction.distance}</p>}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/*  SECTION 14: LOCATION MAP  */}
      {hasValidMap && (
        <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-[1600px] mx-auto px-4">
            <Reveal>
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black mb-4">Location</h2>
                  {place.location.address && (
                    <p className="text-white/60 text-lg flex items-center gap-2">
                      <FiMapPin className="text-[#E85D04]" /> {place.location.address}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="h-[60vh] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative bg-[#050505]">
                <iframe
                  title={`${place.name} Map`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(80%) contrast(120%)' }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${place.location.coordinates.lat},${place.location.coordinates.lng}&hl=en&z=15&output=embed`}
                ></iframe>
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-[32px]" />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/*  SECTION 14.5: REVIEWS  */}
      <section className="py-24 bg-[#050505] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <ReviewSection placeId={place._id} />
          </Reveal>
        </div>
      </section>

      {/*  Related Festivals  */}
      <ExploreIconicSection
        type="festival"
        highlightText="Cultural Experience"
        title={`Festivals in ${place.stateId?.name || 'the State'}`}
        subtitle="Immerse yourself in local traditions and celebrations nearby."
        data={festivals}
        viewAllLink="/festivals"
        viewAllText="View All Festivals"
        isLoading={festivalsLoading}
      />

      {/*  SECTION 15: EXPLORE MORE CTA  */}
      <section className="py-40 relative flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505] z-0">
          <img src={heroImage} className="w-full h-full object-cover opacity-20 scale-110 blur-xl" alt="CTA Background" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/60 to-[#050505]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <Reveal>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Ready To Experience <br /><span className="text-[#E85D04]">{place.name}</span>?
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
              <Link to="/places" className="w-full sm:w-auto bg-[#E85D04] text-white px-10 py-5 rounded-full font-black text-lg hover:bg-[#D05203] hover:-translate-y-1 transition-all shadow-[0_20px_40px_rgba(232,93,4,0.3)]">
                Explore More Destinations
              </Link>
              {place.cityId?.slug && place.stateId?.slug && (
                <Link to={`/states/${place.stateId.slug}/cities/${place.cityId.slug}`} className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-black text-lg hover:bg-white/20 transition-all">
                  Discover {place.cityId.name}
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
};

export default PlaceDetails;
