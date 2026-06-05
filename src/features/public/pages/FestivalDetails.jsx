import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FiMapPin, FiArrowLeft, FiImage, FiGlobe, FiCalendar,
  FiInfo, FiStar, FiClock
} from "react-icons/fi";
import {
  FaPlane, FaTrain, FaCar, FaBus, FaLightbulb, FaHistory, FaMapMarkerAlt
} from "react-icons/fa";
import { festivalService } from "../../../services/festivalService";
import LikeButton from "../../../components/ui/LikeButton";
import GalleryCarousel from "../../../components/ui/GalleryCarousel";
import { placeService } from "../../../services/placeService";
import ExploreIconicSection from "../sections/home/ExploreIconicSection";
import { motion } from "framer-motion";

//  Utility Components 
const FestivalDetailsSkeleton = () => (
  <div className="min-h-screen bg-[#07090f]">
    <div className="animate-pulse bg-[#1a2338] h-[60vh] w-full rounded-none" />
  </div>
);

const SectionLabel = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 text-[#E85D04] font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
    <Icon size={12} />
    <span>{text}</span>
  </div>
);

//  Main Component 
const FestivalDetails = () => {
  const { slug } = useParams();

  const { data: festivalData, isLoading: festivalLoading, isError: festivalError } = useQuery({
    queryKey: ["festivalBySlug", slug],
    queryFn: () => festivalService.getFestivalBySlug(slug),
    enabled: !!slug,
  });

  const festival = festivalData?.data?.festival;
  const stateSlug = festival?.stateId?.slug;

  const { data: placesData, isLoading: placesLoading } = useQuery({
    queryKey: ['placesByState', stateSlug],
    queryFn: () => placeService.getPlacesByState(stateSlug),
    enabled: !!stateSlug
  });

  const places = placesData?.data?.places || [];

  if (festivalLoading) return <FestivalDetailsSkeleton />;

  if (festivalError || !festival) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090f] gap-4">
        <FiCalendar size={56} className="text-[#E85D04]" />
        <h1 className="text-2xl font-bold text-white">Festival Not Found</h1>
        <p className="text-[#8fa3cc]">We couldn't find details for "{slug}".</p>
        <Link to="/festivals" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] text-white rounded-xl font-semibold text-sm hover:bg-[#D05203] transition">
          <FiArrowLeft size={16} /> Back to Festivals
        </Link>
      </div>
    );
  }

  const validGallery = festival.images?.gallery?.filter(img => img) || [];

  return (
    <div className="min-h-screen bg-[#07090f] font-sans text-[#edf2ff]">

      {/*  Hero Section  */}
      <section className="relative w-full min-h-[85vh] flex flex-col justify-center">
        {/* Background Image */}
        {(festival.images?.hero || festival.images?.thumbnail) && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${festival.images.hero || festival.images.thumbnail})` }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-black/20 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
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

      {/*  Overview & Celebrations  */}
      {(festival.overview || festival.highlights?.length > 0 || festival.celebrations || festival.significance) && (
        <section className="py-24 bg-[#0c1018] border-b border-white/5">
          <div className="max-w-[1600px] w-full mx-auto px-4">
            <SectionLabel icon={FiInfo} text="Overview" />

            <div className="grid lg:grid-cols-12 gap-14">
              <div className="lg:col-span-8">
                <h2 className="text-4xl md:text-5xl font-black text-[#edf2ff] mb-6 leading-tight">
                  The Essence of <span className="text-[#E85D04]">{festival.name}</span>
                </h2>

                {festival.overview && (
                  <p className="text-[#8fa3cc] leading-relaxed mb-10 text-base whitespace-pre-line">
                    {festival.overview}
                  </p>
                )}

                {/* Highlights */}
                {festival.highlights?.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-[#edf2ff] mb-4 flex items-center gap-2"><FiStar className="text-[#E85D04]" /> Key Highlights</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {festival.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-3 bg-[#111827] p-4 rounded-xl border border-white/5">
                          <div className="mt-1 w-2 h-2 rounded-full bg-[#E85D04] shrink-0" />
                          <span className="text-sm text-[#8fa3cc]">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Celebrations & Significance */}
                {festival.celebrations && (
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-[#edf2ff] mb-4">How it's Celebrated</h3>
                    <p className="text-[#8fa3cc] text-sm leading-relaxed whitespace-pre-line">{festival.celebrations}</p>
                  </div>
                )}

                {festival.significance && (
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-[#edf2ff] mb-4">Cultural Significance</h3>
                    <p className="text-[#8fa3cc] text-sm leading-relaxed whitespace-pre-line">{festival.significance}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/*  Best Places To Celebrate  */}
      {festival.bestPlacesToCelebrate?.length > 0 && (
        <section className="py-24 bg-[#07090f] border-b border-white/5">
          <div className="max-w-[1600px] w-full mx-auto px-4">
            <SectionLabel icon={FiMapPin} text="Destinations" />
            <h2 className="text-4xl font-black text-[#edf2ff] mb-12">Best Places to Celebrate</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {festival.bestPlacesToCelebrate.map((place, index) => (
                <div key={index} className="bg-[#111827] p-6 rounded-2xl border border-white/6 hover:border-[#E85D04]/30 transition-all duration-300">
                  <div className="w-12 h-12 bg-[#E85D04]/10 border border-[#E85D04]/20 text-[#E85D04] rounded-xl flex items-center justify-center mb-4">
                    <FaMapMarkerAlt size={20} />
                  </div>
                  <h4 className="text-xl font-bold text-[#edf2ff] mb-2">{place.name}</h4>
                  <p className="text-sm text-[#8fa3cc] leading-relaxed">{place.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/*  Gallery Section  */}
      <div id="gallery">
        <GalleryCarousel images={validGallery} name={festival.name} />
      </div>

      {/*  Essential Tips  */}
      {festival.travelTips?.filter(t => t.trim().length > 0).length > 0 && (
        <section className="py-24 bg-[#0c1018]">
          <div className="max-w-[1600px] w-full mx-auto px-4">
            <SectionLabel icon={FaLightbulb} text="Travel Hacks" />
            <h2 className="text-4xl font-black text-[#edf2ff] mb-12">Essential Tips for {festival.name}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {festival.travelTips.filter(t => t.trim().length > 0).map((tip, index) => (
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

      {/*  Related Destinations  */}
      <ExploreIconicSection
        type="destination"
        highlightText="Top Attractions"
        title={`Must-Visit Places in ${festival.stateId?.name || 'the State'}`}
        subtitle="Explore iconic destinations to visit while you're here."
        data={places}
        viewAllLink={`/places?state=${festival.stateId?.slug || ''}`}
        viewAllText="Explore All Places"
        isLoading={placesLoading}
      />

    </div>
  );
};

export default FestivalDetails;
