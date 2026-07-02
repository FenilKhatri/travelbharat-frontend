import { useRef } from "react";
import { useScroll, useSpring, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { FiCompass, FiBookOpen } from "react-icons/fi";
import { Link } from "react-router-dom";
import { statsService } from "../../../../services/statsService";
import journeyBg from "../../../../assets/images/journey_bg.png";
import {
  CURVE_PATH_DESKTOP,
  CURVE_PATH_MOBILE,
  milestones,
} from "./data/journeyData";

/*  component  */
const JourneySection = () => {
  const timelineRef = useRef(null);

  /* scroll-driven animated path */
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const pathLength = useSpring(scrollYProgress, { stiffness: 40, damping: 18 });

  /* real counts from the backend */
  const { data: statsData } = useQuery({
    queryKey: ["publicStats"],
    queryFn: () => statsService.getPublicStats(),
    staleTime: 5 * 60 * 1000,
  });
  const stats = statsData?.data?.data || statsData?.data || {};

  return (
    <section className="relative w-full py-20 md:py-36 bg-slate-50 dark:bg-[#060d1b] overflow-hidden">
      {/*  ambient background  */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-slate-200 dark:bg-[#0e1a30] blur-[120px] opacity-60" />
      </div>

      {/* compass watermark */}
      <div className="absolute top-32 left-6 md:left-16 opacity-[0.04] pointer-events-none rotate-15">
        <FiCompass className="w-48 h-48 md:w-72 md:h-72 text-slate-900 dark:text-slate-300" />
      </div>

      {/* cloud blob – left side (desktop only) */}
      <svg
        className="absolute left-0 top-[55%] -translate-y-1/2 w-40 md:w-60 opacity-[0.06] pointer-events-none hidden md:block"
        viewBox="0 0 200 120"
        fill="none"
      >
        <ellipse cx="70" cy="80" rx="70" ry="40" fill="#3b82f6" />
        <ellipse cx="130" cy="65" rx="55" ry="35" fill="#3b82f6" />
        <ellipse cx="100" cy="50" rx="50" ry="30" fill="#60a5fa" />
      </svg>

      {/* journey_bg at bottom — full width */}
      <div
        className="absolute bottom-0 left-0 w-full h-[500px] md:h-[800px] bg-cover bg-bottom bg-no-repeat opacity-[0.15] pointer-events-none"
        style={{ backgroundImage: `url(${journeyBg})` }}
      />

      {/*  header  */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4 mb-14 md:mb-28">
        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#E85D04]/10 border border-[#E85D04]/30 text-[#E85D04] text-[10px] font-black uppercase tracking-[0.2em] mb-5">
          <FiCompass className="text-xs" /> TravelBharat Ecosystem
        </span>
        <h2 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-4 md:mb-5">
          Your Journey <span className="text-[#E85D04]">Begins Here</span>
        </h2>
        <p className="text-slate-600 dark:text-[#7b8fb0] text-sm md:text-lg leading-relaxed max-w-lg mx-auto">
          From discovering hidden gems to planning unforgettable adventures,
          TravelBharat guides you every step of the way.
        </p>
      </div>

      {/*  timeline  */}
      <div ref={timelineRef} className="relative z-10 max-w-3xl mx-auto px-4">
        {/* SVG curvy path — desktop (hidden on mobile) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d={CURVE_PATH_DESKTOP}
            fill="none"
            stroke="#1e3050"
            strokeWidth="2"
            strokeDasharray="8 6"
            vectorEffect="non-scaling-stroke"
          />
          <motion.path
            d={CURVE_PATH_DESKTOP}
            fill="none"
            stroke="#E85D04"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            style={{
              pathLength,
              filter:
                "drop-shadow(0 0 8px rgba(232,93,4,0.7)) drop-shadow(0 0 18px rgba(232,93,4,0.35))",
            }}
          />
        </svg>

        {/* SVG curvy path — mobile (hidden on desktop) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none md:hidden"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d={CURVE_PATH_MOBILE}
            fill="none"
            stroke="#1e3050"
            strokeWidth="2"
            strokeDasharray="8 6"
            vectorEffect="non-scaling-stroke"
          />
          <motion.path
            d={CURVE_PATH_MOBILE}
            fill="none"
            stroke="#E85D04"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            style={{
              pathLength,
              filter:
                "drop-shadow(0 0 8px rgba(232,93,4,0.7)) drop-shadow(0 0 18px rgba(232,93,4,0.35))",
            }}
          />
        </svg>

        {/* milestone rows */}
        <div className="flex flex-col gap-0">
          {milestones.map((m) => {
            const isLeft = m.align === "left";
            const Icon = m.icon;
            const CardIcon = m.cardIcon;

            return (
              <div
                key={m.id}
                className="relative h-[160px] md:h-[200px] flex items-center"
              >
                {/* node — left on mobile, center on desktop */}
                <div className="absolute left-[10%] md:left-1/2 -translate-x-1/2 z-30">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.05 }}
                    viewport={{ once: true, margin: "-15%" }}
                    className="relative"
                  >
                    <div className="absolute -inset-2 rounded-full border border-[#E85D04]/20 animate-[ping_3s_ease-in-out_infinite]" />
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white dark:bg-[#060d1b] border-2 border-[#E85D04] flex items-center justify-center shadow-[0_0_24px_rgba(232,93,4,0.45)] relative">
                      <Icon className="text-[#E85D04] text-base md:text-xl" />
                    </div>
                    <span className="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#E85D04] text-white text-[8px] md:text-[10px] font-black flex items-center justify-center shadow-lg">
                      {m.id}
                    </span>
                  </motion.div>
                </div>

                <div
                  className={`absolute top-1/2 -translate-y-1/2 h-px hidden md:block ${
                    isLeft ? "right-1/2 mr-[34px]" : "left-1/2 ml-[34px]"
                  }`}
                  style={{
                    width: "60px",
                    background: isLeft
                      ? "linear-gradient(to left, #E85D04, transparent)"
                      : "linear-gradient(to right, #E85D04, transparent)",
                    opacity: 0.5,
                  }}
                />

                <div
                  className="absolute top-1/2 -translate-y-1/2 left-[calc(10%+20px)] h-px w-6 md:hidden"
                  style={{
                    background:
                      "linear-gradient(to right, #E85D04, transparent)",
                    opacity: 0.4,
                  }}
                />

                {/* card */}
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-10%" }}
                  className={`relative z-20
                    w-[calc(100%-80px)] ml-auto
                    md:w-[calc(50%-50px)] ${isLeft ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0"}
                  `}
                >
                  <Link to={m.link} className="block group">
                    <div className="relative bg-white/90 dark:bg-[#0b1425]/80 backdrop-blur-md border border-slate-200 dark:border-[#1a2744] rounded-xl p-4 md:p-6 hover:border-[#E85D04]/40 dark:hover:border-[#E85D04]/40 hover:bg-white dark:hover:bg-[#0e1a30]/90 transition-all duration-300 shadow-md shadow-slate-200/50 dark:shadow-sm">
                      <div className="w-8 h-[3px] bg-[#E85D04] rounded-full mb-2 md:mb-3" />
                      <h3 className="text-slate-900 dark:text-white font-bold text-sm md:text-lg mb-1">
                        {m.title}
                      </h3>
                      <p className="text-slate-600 dark:text-[#6b7fa3] text-xs md:text-sm leading-relaxed pr-6">
                        {m.desc}
                      </p>
                      <CardIcon className="absolute bottom-3 right-3 md:bottom-4 md:right-4 text-[#E85D04]/30 text-base md:text-lg group-hover:text-[#E85D04]/60 transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/*  CTA bottom  */}
      <div className="relative z-10 text-center mt-20 md:mt-36 px-4">
        <div className="w-3 h-3 rounded-full bg-[#E85D04] mx-auto mb-6 md:mb-8 shadow-[0_0_16px_rgba(232,93,4,0.6)]" />

        <h2 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 md:mb-5 leading-tight">
          Ready For Your Next <span className="text-[#E85D04]">Adventure?</span>
        </h2>
        <p className="text-slate-600 dark:text-[#7b8fb0] text-sm md:text-lg mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed">
          Join millions of travelers discovering the magic of India with
          TravelBharat.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-12 md:mb-16">
          <Link
            to="/states"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-[#E85D04] text-white font-bold text-sm rounded-full shadow-[0_0_20px_rgba(232,93,4,0.35)] hover:bg-[#d05203] hover:scale-105 transition-all"
          >
            <FiCompass className="text-base" /> Explore India
          </Link>
          <Link
            to="/user/trips"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-transparent border border-slate-300 dark:border-[#1e3050] text-slate-800 dark:text-white font-bold text-sm rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          >
            <FiBookOpen className="text-base" /> Plan My Journey
          </Link>
        </div>

        {/* stats row */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-0 max-w-2xl mx-auto">
          {[
            {
              value: stats.states ? `${stats.states}+` : "—",
              label: "States Covered",
            },
            {
              value: stats.destinations ? `${stats.destinations}+` : "—",
              label: "Destinations",
            },
            { value: stats.cities ? `${stats.cities}+` : "—", label: "Cities" },
            {
              value: stats.experiences ? `${stats.experiences}+` : "—",
              label: "Experiences",
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`py-4 md:py-5 md:flex-1 md:min-w-[120px]
                ${i % 2 !== 0 ? "border-l border-slate-200 dark:border-[#1a2744]" : ""}
                ${i >= 2 ? "border-t border-slate-200 dark:border-[#1a2744] md:border-t-0" : ""}
                ${i > 0 ? "md:border-l border-slate-200 dark:md:border-[#1a2744]" : ""}
              `}
            >
              <div className="text-xl md:text-3xl font-black text-[#E85D04] mb-1">
                {s.value}
              </div>
              <div className="text-[9px] md:text-[11px] font-semibold text-[#4f6382] uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
