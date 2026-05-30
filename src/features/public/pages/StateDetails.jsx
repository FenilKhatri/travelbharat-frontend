import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiMapPin, FiArrowLeft, FiImage, FiCloud, FiGlobe, FiCalendar, FiStar } from "react-icons/fi";
import { FaTrain, FaPlane, FaCar, FaBus, FaLightbulb } from "react-icons/fa";
import { stateService } from "../../../services/stateService";
import { motion } from "framer-motion";

// ─── Image with placeholder fallback ──────────────────────────────────────────
const StateImage = ({ src, alt, className }) => {
  if (!src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 ${className}`}>
        <FiImage size={48} className="text-slate-300 dark:text-slate-600 mb-2" />
        <span className="text-slate-400 text-sm">{alt}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = "none";
        const ph = e.currentTarget.parentElement.querySelector("[data-placeholder]");
        if (ph) ph.style.display = "flex";
      }}
    />
  );
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`} />
);

const StateDetailsSkeleton = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#0A1628]">
    <Skeleton className="h-96 w-full rounded-none" />
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
    </div>
  </div>
);

// ─── Info Card ────────────────────────────────────────────────────────────────
const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-start gap-3">
    <div className="w-10 h-10 rounded-lg bg-[#E85D04]/10 flex items-center justify-center shrink-0">
      <Icon size={18} className="text-[#E85D04]" />
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{value || "—"}</p>
    </div>
  </div>
);

// ─── Section ──────────────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8"
  >
    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
      <span className="w-1 h-6 bg-[#E85D04] rounded-full inline-block" />
      {title}
    </h2>
    {children}
  </motion.section>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const StateDetails = () => {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["stateBySlug", slug],
    queryFn: () => stateService.getStateBySlug(slug),
    enabled: !!slug,
  });

  // stateService uses http interceptor → response = { success, data: { state } }
  const state = data?.data?.state;

  if (isLoading) return <StateDetailsSkeleton />;

  if (isError || !state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0A1628] gap-4">
        <FiMapPin size={56} className="text-slate-300" />
        <h1 className="text-2xl font-bold text-slate-700 dark:text-white">State Not Found</h1>
        <p className="text-slate-500">We couldn't find details for "{slug}".</p>
        <Link
          to="/states"
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] text-white rounded-xl font-semibold text-sm hover:bg-[#D05203] transition"
        >
          <FiArrowLeft size={16} /> Back to States
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1628] pb-20">
      {/* ── Hero ── */}
      <div className="relative h-[420px] md:h-[520px] overflow-hidden">
        {state.images?.hero ? (
          <img
            src={state.images.hero}
            alt={state.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const ph = document.getElementById("hero-placeholder");
              if (ph) ph.style.display = "flex";
            }}
          />
        ) : null}
        <div
          id="hero-placeholder"
          className="absolute inset-0 flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900"
          style={{ display: state.images?.hero ? "none" : "flex" }}
        >
          <FiImage size={56} className="text-slate-500 mb-3" />
          <span className="text-slate-300 text-xl font-bold">{state.name}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        {/* Back Button */}
        <Link
          to="/states"
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm text-white rounded-xl border border-white/20 text-sm font-semibold hover:bg-white/25 transition"
        >
          <FiArrowLeft size={16} /> All States
        </Link>
        {/* Hero Text */}
        <div className="absolute bottom-8 left-6 right-6 z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-[#E85D04] text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider capitalize">
                {state.region} India
              </span>
              {state.featured && (
                <span className="text-xs bg-amber-500 text-white px-3 py-1 rounded-full font-bold">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-2">{state.name}</h1>
            {state.tagline && (
              <p className="text-slate-300 text-lg max-w-2xl">{state.tagline}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mt-10 space-y-8">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCard icon={FiMapPin} label="Capital" value={state.capital} />
          <InfoCard icon={FiGlobe} label="Region" value={`${state.region} India`} />
          <InfoCard icon={FiStar} label="Destinations" value={state.totalPlaces} />
          <InfoCard icon={FiCalendar} label="Best Time" value={state.bestTimeToVisit} />
        </div>

        {/* Description */}
        {state.description && (
          <Section title="Overview">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{state.description}</p>
            {state.overview && state.overview !== state.description && (
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">{state.overview}</p>
            )}
          </Section>
        )}

        {/* Highlights */}
        {state.highlights?.length > 0 && (
          <Section title="Highlights">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {state.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="w-8 h-8 rounded-lg bg-[#E85D04]/10 flex items-center justify-center shrink-0">
                    <FiStar size={16} className="text-[#E85D04]" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">{h.title}</p>
                    {h.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{h.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* History & Culture */}
        {(state.history || state.culture) && (
          <Section title="History & Culture">
            <div className="space-y-5">
              {state.history && (
                <div>
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    History
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{state.history}</p>
                </div>
              )}
              {state.culture && (
                <div>
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Culture
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{state.culture}</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Weather */}
        {state.weather && Object.values(state.weather).some(Boolean) && (
          <Section title="Weather & Climate">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {state.weather.summer && (
                <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20">
                  <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase mb-1">☀️ Summer</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{state.weather.summer}</p>
                </div>
              )}
              {state.weather.monsoon && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">🌧️ Monsoon</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{state.weather.monsoon}</p>
                </div>
              )}
              {state.weather.winter && (
                <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20">
                  <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase mb-1">❄️ Winter</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{state.weather.winter}</p>
                </div>
              )}
              {state.weather.bestSeason && (
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20">
                  <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase mb-1">✅ Best Season</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{state.weather.bestSeason}</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Transport */}
        {state.transport && Object.values(state.transport).some(Boolean) && (
          <Section title="How to Reach">
            <div className="space-y-4">
              {state.transport.byAir && (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <FaPlane size={20} className="text-[#E85D04] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm mb-1">By Air</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{state.transport.byAir}</p>
                  </div>
                </div>
              )}
              {state.transport.byTrain && (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <FaTrain size={20} className="text-[#E85D04] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm mb-1">By Train</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{state.transport.byTrain}</p>
                  </div>
                </div>
              )}
              {state.transport.byRoad && (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <FaCar size={20} className="text-[#E85D04] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm mb-1">By Road</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{state.transport.byRoad}</p>
                  </div>
                </div>
              )}
              {state.transport.local && (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <FaBus size={20} className="text-[#E85D04] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm mb-1">Local Transport</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{state.transport.local}</p>
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Travel Tips */}
        {state.travelTips?.length > 0 && (
          <Section title="Travel Tips">
            <ul className="space-y-3">
              {state.travelTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#E85D04]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <FaLightbulb size={12} className="text-[#E85D04]" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{tip}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Food */}
        {state.food?.length > 0 && (
          <Section title="Must Try Food">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {state.food.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                      <FiImage size={18} className="text-slate-400" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-800 dark:text-white text-sm">{item.name}</p>
                      {item.isVeg !== undefined && (
                        <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${item.isVeg ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {item.isVeg ? "Veg" : "Non-Veg"}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Gallery */}
        {state.images?.gallery?.length > 0 && (
          <Section title="Gallery">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {state.images.gallery.map((url, i) => (
                <div key={i} className="relative aspect-video overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                  <img
                    src={url}
                    alt={`${state.name} ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Languages */}
        {state.languages?.length > 0 && (
          <Section title="Languages">
            <div className="flex flex-wrap gap-2">
              {state.languages.map((lang, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-[#E85D04]/10 text-[#E85D04] text-sm font-semibold border border-[#E85D04]/20">
                  {lang}
                </span>
              ))}
            </div>
          </Section>
        )}

      </div>
    </div>
  );
};

export default StateDetails;
