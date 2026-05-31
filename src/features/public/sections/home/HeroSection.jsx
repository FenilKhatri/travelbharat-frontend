import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { FiSearch, FiMapPin, FiChevronLeft, FiChevronRight, FiCompass, FiCamera } from "react-icons/fi";
import { FaMountain, FaMagic } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/ui/Button";
import http from "../../../../lib/axios";

const fallbackSlides = [
  {
    title: "Experience The Timeless Beauty of Rani Ki Vav",
    subtitle:
      "Explore Gujarat’s UNESCO World Heritage marvel filled with royal carvings, ancient architecture, and breathtaking underground artistry.",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80",
    buttonText: "Explore Heritage",
    buttonLink: "/destinations/gujarat/patan/rani-ki-vav",
  },
  {
    title: "Witness The Grandeur Of Jaipur",
    subtitle:
      "Discover majestic forts, royal palaces, colorful bazaars, and Rajasthan’s rich cultural heritage.",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600&auto=format&fit=crop",
    buttonText: "Explore Jaipur",
    buttonLink: "/states/rajasthan",
  },
  {
    title: "Discover The Serenity Of Kerala",
    subtitle:
      "Cruise through peaceful backwaters, lush tea gardens, tropical beaches, and authentic South Indian culture.",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&auto=format&fit=crop",
    buttonText: "Explore Kerala",
    buttonLink: "/states/kerala",
  },
  {
    title: "Adventure Through The Himalayas",
    subtitle:
      "Experience snow-capped mountains, spiritual valleys, monasteries, and unforgettable trekking destinations.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop",
    buttonText: "Explore Himalayas",
    buttonLink: "/states/himachal-pradesh",
  },
  {
    title: "Feel The Energy Of Mumbai",
    subtitle:
      "Dive into India’s city of dreams filled with iconic skylines, street food, nightlife, and Bollywood culture.",
    image:
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1600&auto=format&fit=crop",
    buttonText: "Explore Mumbai",
    buttonLink: "/states/maharashtra",
  },
];

const HeroSection = () => {
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  /* ------------------------------ */
  /* FETCH SLIDERS FROM BACKEND */
  /* ------------------------------ */

  const { data: banners } = useQuery({
    queryKey: ["activeBanners"],
    queryFn: async () => {
      
      const res = await http.get("/admin/banners/active");
      return res.data?.banners || [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  /* ------------------------------------------------ */
  /* USE BACKEND SLIDES ONLY IF ALL 5 ARE VALID */
  /* ------------------------------------------------ */

  const sliderData = useMemo(() => {
    if (
      banners &&
      banners.length >= 5 &&
      banners.every(
        (banner) =>
          banner?.image &&
          banner?.title &&
          banner?.subtitle
      )
    ) {
      return [...banners].slice(0, 5).map((banner) => ({
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image,
        buttonText: banner.buttonText || "Explore Now",
        buttonLink: banner.targetUrl || "/states",
      }));
    }

    return fallbackSlides;
  }, [banners]);

  const currentBanner =
    sliderData[currentSlide] || fallbackSlides[0];

  /* ------------------------------ */
  /* AUTO SLIDER */
  /* ------------------------------ */

  useEffect(() => {
    if (isHovered) return;

    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= sliderData.length - 1) {
          return 0;
        }

        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(autoSlide);
  }, [currentSlide, isHovered, sliderData.length]);

  /* ------------------------------ */
  /* CTA BUTTON */
  /* ------------------------------ */

  const handleCTAClick = () => {
    const link = currentBanner.buttonLink || "/states";

    if (link.startsWith("/")) {
      navigate(link);
    } else {
      window.location.href = link;
    }
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden flex items-center bg-gradient-to-l from-[#FFFDF9] via-[#FFF5EA] to-[#FFE8D1] dark:from-[#080E1B] dark:via-[#0D1628] dark:to-[#080E1B]"
    >

      <div
        className="absolute inset-0 z-0 opacity-[0.5] dark:opacity-[1] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1713729991304-d0b6c328560e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVkJTIwZm9ydHxlbnwwfHwwfHx8MA%3D%3D')",
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9]/50 via-[#FFF5EA]/50 to-[#FFE8D1]/50 dark:from-[#080E1B]/95 dark:via-[#0D1628]/92 dark:to-[#080E1B]/88 z-0"></div>

      {/* GLOW EFFECTS */}
      <div className="absolute top-20 left-20 w-80 h-80 bg-[#FF8F00]/15 rounded-full blur-[120px] z-0"></div>

      <div className="absolute bottom-10 right-0 w-[420px] h-[420px] bg-[#E85D04]/10 rounded-full blur-[150px] z-0"></div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-[1700px] mx-auto px-6 lg:px-12 pt-28 pb-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* LEFT SIDE */}
          <div className="lg:col-span-7">

            {/* TOP BADGE */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#FF8F00]/20 bg-white/70 dark:bg-white/5 backdrop-blur-xl mb-8">
              <FaMagic className="text-[#FF8F00]" size={16} />

              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Explore Incredible Bharat
              </span>
            </div>

            {/* TITLE */}
            <div className="min-h-[260px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.45 }}
                  className="space-y-6"
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[1.1] text-slate-900 dark:text-white tracking-tight">
                    {currentBanner.title}
                  </h1>

                  <p className="max-w-2xl text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {currentBanner.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* STATS */}
            <div className="flex flex-wrap gap-8 mt-12 border-t border-slate-200/50 dark:border-white/5 pt-8">
              {[
                { number: "28+", label: "States" },
                { number: "500+", label: "Destinations" },
                { number: "100+", label: "Festivals" },
              ].map((item, index) => (
                <div key={index}>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                    {item.number}
                  </h3>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="lg:col-span-5 relative flex justify-center items-center"
          >

            {/* FLOATING CARD 1 */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-6 -left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-xl z-20 flex items-center gap-3"
            >
              <div className="p-2 bg-[#FF8F00]/10 rounded-lg text-[#FF8F00]">
                <FaMountain size={16} />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  Heritage Destinations
                </p>

                <h4 className="font-bold text-slate-800 dark:text-white text-xs mt-0.5">
                  Explore Royal India
                </h4>
              </div>
            </motion.div>

            {/* FLOATING CARD 2 */}
            <motion.div
              animate={{ y: [8, -8, 8] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-5 -right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl px-5 py-4 shadow-xl z-20 flex items-center gap-3"
            >
              <div className="p-2 bg-[#E85D04]/10 rounded-lg text-[#E85D04]">
                <FiCamera size={16} />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  Cultural Journeys
                </p>

                <h4 className="font-bold text-slate-800 dark:text-white text-xs mt-0.5">
                  Discover Hidden Gems
                </h4>
              </div>
            </motion.div>

            {/* IMAGE CARD */}
            <div className="relative overflow-hidden rounded-[38px] border border-white/20 dark:border-white/70 shadow-2xl z-10 w-full aspect-[4/5] md:h-[600px] md:w-[480px] bg-white/10 backdrop-blur-xl">

              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45 }}
                  src={currentBanner.image}
                  alt={currentBanner.title}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>

              {/* CONTENT */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <span className="text-[10px] font-black uppercase bg-[#FF8F00] text-white px-2.5 py-1 rounded-md tracking-wider">
                  Incredible Bharat
                </span>

                <h3 className="text-2xl font-black mt-3 text-white leading-tight">
                  {currentBanner.title}
                </h3>

                <p className="text-white/80 text-xs mt-2 font-medium line-clamp-2">
                  {currentBanner.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SLIDER CONTROLS */}
      {sliderData.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-white/60 dark:bg-black/40 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/40 dark:border-white/10 shadow-lg">

          <button
            onClick={() =>
              setCurrentSlide(
                (prev) =>
                  (prev - 1 + sliderData.length) %
                  sliderData.length
              )
            }
            className="p-1.5 text-slate-700 dark:text-white hover:text-[#E85D04] transition cursor-pointer"
          >
            <FiChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {sliderData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx
                    ? "w-6 bg-[#E85D04]"
                    : "w-2 bg-slate-400/50"
                  }`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev + 1) % sliderData.length
              )
            }
            className="p-1.5 text-slate-700 dark:text-white hover:text-[#E85D04] transition cursor-pointer"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      )}

      {/* BOTTOM BLEND */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#FFFDF9] dark:from-[#080E1B] to-transparent z-10"></div>
    </section>
  );
};

export default HeroSection;