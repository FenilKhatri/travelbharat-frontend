import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FiMapPin, FiArrowLeft, FiImage, FiClock, FiStar,
  FiChevronLeft, FiChevronRight, FiX, FiPhoneCall, FiInfo,
  FiArrowRight, FiCompass, FiGlobe, FiSun, FiNavigation
} from "react-icons/fi";
import {
  FaHotel, FaUtensils, FaShoppingBag, FaPlane, FaTrain, FaBus, FaCar,
  FaMapMarkerAlt, FaMap, FaLightbulb
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
import { cityService } from "../../../services/cityService";
import { placeService } from "../../../services/placeService";
import { hotelService } from "../../../services/hotelService";
import { restaurantService } from "../../../services/restaurantService";
import LikeButton from "../../../components/ui/LikeButton";
import DestinationSkeleton from "../../../components/ui/DestinationSkeleton";
import DestinationCard from "../../../components/cards/DestinationCard";
import GalleryCarousel from "../../../components/ui/GalleryCarousel";
import { festivalService } from "../../../services/festivalService";
import ExploreIconicSection from "../sections/home/ExploreIconicSection";

const SectionLabel = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 text-[#E85D04] font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
    <Icon size={12} />
    <span>{text}</span>
  </div>
);

const CityDetailsSkeleton = () => (
  <div className="min-h-screen bg-[#07090f] pt-24">
    <div className="animate-pulse bg-[#1a2338] h-[70vh] w-full" />
    <div className="max-w-[1600px] w-full mx-auto px-4 py-16">
      <DestinationSkeleton count={6} />
    </div>
  </div>
);



const CityDetails = () => {
  const { stateSlug, citySlug } = useParams();

  const { data: cityData, isLoading: cityLoading, isError: cityError } = useQuery({
    queryKey: ["cityBySlug", citySlug],
    queryFn: () => cityService.getCityBySlug(citySlug),
    enabled: !!citySlug,
  });

  const { data: placesData, isLoading: placesLoading } = useQuery({
    queryKey: ["placesByCity", citySlug],
    queryFn: () => placeService.getPlacesByCity(citySlug, { limit: 5 }),
    enabled: !!citySlug,
  });

  const city = cityData?.data?.city;
  const places = placesData?.data?.places || [];
  const resolvedStateSlug = stateSlug || city?.stateId?.slug;

  const { data: hotelsData, isLoading: hotelsLoading } = useQuery({
    queryKey: ["hotelsByCity", city?._id],
    queryFn: () => hotelService.getHotels({ cityId: city._id, limit: 6 }),
    enabled: !!city?._id,
  });

  const { data: restaurantsData, isLoading: restaurantsLoading } = useQuery({
    queryKey: ["restaurantsByCity", city?._id],
    queryFn: () => restaurantService.getRestaurants({ cityId: city._id, limit: 6 }),
    enabled: !!city?._id,
  });

  const hotels = hotelsData?.data?.hotels || [];
  const restaurants = restaurantsData?.data?.restaurants || [];

  const { data: festivalsData, isLoading: festivalsLoading } = useQuery({
    queryKey: ["festivalsByState", resolvedStateSlug],
    queryFn: () => festivalService.getFestivalsByState(resolvedStateSlug),
    enabled: !!resolvedStateSlug,
  });

  const festivals = festivalsData?.data?.festivals || [];

  const avgRating = useMemo(() => {
    const rated = places.filter((p) => p.rating > 0);
    if (!rated.length) return null;
    return (rated.reduce((sum, p) => sum + p.rating, 0) / rated.length).toFixed(1);
  }, [places]);

  const travelTips = useMemo(() => {
    const tips = [];
    if (city?.bestTimeToVisit) tips.push(`Best time to visit: ${city.bestTimeToVisit}`);
    if (city?.transport?.local) tips.push(city.transport.local);
    const stateTips = city?.stateId?.travelTips?.filter((t) => t?.trim()) || [];
    return [...tips, ...stateTips].slice(0, 6);
  }, [city]);

  const quickFacts = useMemo(() => {
    if (!city) return [];
    return [
      { icon: FiSun, label: "Best Time To Visit", value: city.bestTimeToVisit },
      { icon: FiCompass, label: "Popular For", value: city.tagline },
      { icon: FiGlobe, label: "Local Language", value: city.stateId?.languages?.join(", ") },
      { icon: FiNavigation, label: "Transportation", value: city.transport?.local },
      { icon: FiClock, label: "Population", value: city.population },
    ].filter((f) => f.value);
  }, [city]);

  if (cityLoading) return <CityDetailsSkeleton />;

  if (cityError || !city) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090f] gap-4">
        <FaMapMarkerAlt size={56} className="text-[#E85D04]" />
        <h1 className="text-2xl font-bold text-white">City Not Found</h1>
        <p className="text-[#8fa3cc]">We couldn't find details for "{citySlug}".</p>
        <Link to="/states" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] text-white rounded-xl font-semibold text-sm hover:bg-[#D05203] transition">
          <FiArrowLeft size={16} /> Back to States
        </Link>
      </div>
    );
  }

  const validGallery = city.images?.gallery?.filter(Boolean) || [];
  const stateName = city.stateId?.name;
  const validEmergency = city.emergencyInfo && Object.values(city.emergencyInfo).some((v) => v?.trim());

  return (
    <div className="min-h-screen bg-[#07090f] font-sans text-[#edf2ff]">

      {/* Hero */}
      <section className="relative min-h-[85vh] flex flex-col justify-end pt-28">
        {city.images?.hero && (
          <div className="absolute inset-0">
            <img src={city.images.hero} alt={city.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-black/30 to-black/50" />
          </div>
        )}

        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8 flex-wrap">
            <Link to="/" className="hover:text-[#E85D04] transition">Home</Link>
            <span>/</span>
            <Link to="/states" className="hover:text-[#E85D04] transition">States</Link>
            {resolvedStateSlug && (
              <>
                <span>/</span>
                <Link to={`/states/${resolvedStateSlug}`} className="hover:text-[#E85D04] transition">{stateName}</Link>
              </>
            )}
            <span>/</span>
            <span className="text-white font-semibold">{city.name}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {stateName && (
              <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.15em]">
                {stateName}
              </span>
            )}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-none">{city.name}</h1>
            {city.tagline && (
              <p className="text-base md:text-lg text-[#E85D04] font-bold uppercase tracking-widest mb-6">{city.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-8">
              {avgRating && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white font-bold text-sm">
                  <FiStar className="text-[#E85D04] fill-[#E85D04]" /> {avgRating} Rating
                </span>
              )}
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white font-bold text-sm">
                <FiMapPin className="text-[#E85D04]" /> {city.totalPlaces || places.length} Destinations
              </span>
              <LikeButton entityId={city._id} entityType="city" initialCount={city.likeCount} className="!px-4 !py-2 !text-sm" />
            </div>

            {city.description && (
              <p className="text-white/75 max-w-2xl leading-relaxed text-sm md:text-base">{city.description}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Quick Facts */}
      {quickFacts.length > 0 && (
        <section className="py-16 bg-[#0c1018] border-b border-white/5">
          <div className="max-w-[1600px] w-full mx-auto px-4">
            <SectionLabel icon={FiInfo} text="Quick Facts" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {quickFacts.map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-2xl bg-[#111827] border border-white/6 hover:border-[#E85D04]/30 transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] mb-4 group-hover:scale-110 transition-transform">
                    <fact.icon size={18} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#4b607a] mb-1">{fact.label}</p>
                  <p className="text-sm font-bold text-[#edf2ff] leading-snug">{fact.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About City */}
      {(city.overview || city.description) && (
        <section className="py-24 bg-[#07090f] border-b border-white/5">
          <div className="max-w-[1600px] w-full mx-auto px-4 grid lg:grid-cols-12 gap-14 items-center">
            <div className="lg:col-span-7">
              <SectionLabel icon={FiMapPin} text="About" />
              <h2 className="text-4xl md:text-5xl font-black text-[#edf2ff] mb-6">
                About <span className="text-[#E85D04]">{city.name}</span>
              </h2>
              <p className="text-[#8fa3cc] leading-relaxed text-base whitespace-pre-line">
                {city.overview || city.description}
              </p>
            </div>
            {city.images?.thumbnail && (
              <div className="lg:col-span-5">
                <div className="rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
                  <img src={city.images.thumbnail} alt={city.name} className="w-full h-150 object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <div id="gallery">
        <GalleryCarousel images={validGallery} name={city.name} />
      </div>

      {/* Destinations */}
      <section id="destinations" className="py-24 bg-[#07090f] border-b border-white/5">
        <div className="max-w-[1600px] w-full mx-auto px-4">
          <SectionLabel icon={FiCompass} text="Must Visit" />
          <h2 className="text-4xl font-black text-[#edf2ff] mb-4">
            Top Places to Visit in <span className="text-[#E85D04]">{city.name}</span>
          </h2>
          <p className="text-[#8fa3cc] mb-12 max-w-2xl">
            Explore curated destinations handpicked for an unforgettable experience in {city.name}.
          </p>

          {placesLoading ? (
            <DestinationSkeleton count={6} />
          ) : places.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {places.map((place, index) => (
                <DestinationCard
                  key={place._id}
                  place={place}
                  stateSlug={resolvedStateSlug}
                  citySlug={city.slug}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-3xl border border-white/10 bg-[#111827]/50">
              <FiCompass className="mx-auto text-[#E85D04]/50 mb-4" size={40} />
              <p className="text-[#8fa3cc] font-medium">Destinations for {city.name} are coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Removed embedded Attractions since we have Destinations */}

      {/* Travel Tips */}
      {travelTips.length > 0 && (
        <section className="py-24 bg-[#07090f] border-b border-white/5">
          <div className="max-w-[1600px] w-full mx-auto px-4">
            <SectionLabel icon={FaLightbulb} text="Travel Tips" />
            <h2 className="text-4xl font-black text-[#edf2ff] mb-12">Essential Tips for {city.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {travelTips.map((tip, index) => (
                <div key={index} className="flex gap-4 p-6 rounded-2xl bg-[#111827] border border-white/6 hover:border-[#E85D04]/20 transition-all">
                  <div className="w-8 h-8 rounded-full bg-[#E85D04] text-white flex items-center justify-center font-black shrink-0 text-sm">
                    {index + 1}
                  </div>
                  <p className="text-[#8fa3cc] text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hotels */}
      {hotels.length > 0 && (
        <section className="py-24 bg-[#0c1018] border-b border-white/5">
          <div className="max-w-[1600px] w-full mx-auto px-4">
            <SectionLabel icon={FaHotel} text="Stays" />
            <h2 className="text-4xl font-black text-[#edf2ff] mb-12">Where to Stay</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel, idx) => (
                <div key={idx} className="rounded-3xl overflow-hidden border border-white/6 bg-[#111827] group hover:border-[#E85D04]/30 transition-all">
                  {hotel.images?.thumbnail && (
                    <div className="h-52 overflow-hidden relative">
                      <img src={hotel.images.thumbnail} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      {hotel.priceRange && (
                        <span className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-black/70 text-white text-xs font-bold">{hotel.priceRange}</span>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-lg font-black text-[#edf2ff]">{hotel.name}</h3>
                      {hotel.rating > 0 && (
                        <span className="flex items-center gap-1 text-[#E85D04] text-sm font-bold"><FiStar className="fill-current" size={12} /> {hotel.rating}</span>
                      )}
                    </div>
                    {hotel.description && <p className="text-sm text-[#8fa3cc] line-clamp-2">{hotel.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Restaurants */}
      {restaurants.length > 0 && (
        <section className="py-24 bg-[#07090f] border-b border-white/5">
          <div className="max-w-[1600px] w-full mx-auto px-4">
            <SectionLabel icon={FaUtensils} text="Food" />
            <h2 className="text-4xl font-black text-[#edf2ff] mb-12">Culinary Delights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((r, idx) => (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-[#111827] border border-white/6 hover:border-[#E85D04]/20 transition-all">
                  {r.images?.thumbnail ? (
                    <img src={r.images.thumbnail} alt={r.name} className="w-20 h-20 rounded-xl object-cover shrink-0" loading="lazy" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-[#1a2338] flex items-center justify-center shrink-0"><FaUtensils className="text-[#E85D04]/50" /></div>
                  )}
                  <div>
                    <h4 className="font-bold text-[#edf2ff] mb-1">{r.name}</h4>
                    {r.cuisine && <p className="text-[10px] font-black uppercase tracking-widest text-[#E85D04] mb-1">{r.cuisine}</p>}
                    {r.rating > 0 && <span className="text-xs text-[#8fa3cc] flex items-center gap-1"><FiStar className="text-yellow-500 fill-yellow-500" size={12} /> {r.rating}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Removed Shopping (embedded) */}

      {/* Transport */}
      {city.transport && (city.transport.fromAirport || city.transport.fromStation || city.transport.busStation || city.transport.local) && (
        <section className="py-24 bg-[#07090f] border-b border-white/5">
          <div className="max-w-[1600px] w-full mx-auto px-4">
            <SectionLabel icon={FiNavigation} text="Getting Around" />
            <h2 className="text-4xl font-black text-[#edf2ff] mb-12">How To Reach {city.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { condition: city.transport.fromAirport, icon: FaPlane, title: "Airport", text: city.transport.fromAirport },
                { condition: city.transport.fromStation, icon: FaTrain, title: "Railway", text: city.transport.fromStation },
                { condition: city.transport.busStation, icon: FaBus, title: "Bus", text: city.transport.busStation },
                { condition: city.transport.local, icon: FaCar, title: "Local", text: city.transport.local },
              ].filter((t) => t.condition).map((t, idx) => (
                <div key={idx} className="p-7 rounded-3xl bg-[#111827] border border-white/6 hover:border-[#E85D04]/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] mb-5">
                    <t.icon size={20} />
                  </div>
                  <h4 className="text-lg font-bold text-[#edf2ff] mb-3">{t.title}</h4>
                  <p className="text-sm text-[#8fa3cc] leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nearby Places */}
      {city.nearbyPlaces?.length > 0 && (
        <section className="py-24 bg-[#0c1018] border-b border-white/5">
          <div className="max-w-[1600px] w-full mx-auto px-4">
            <SectionLabel icon={FiMapPin} text="Day Trips" />
            <h2 className="text-4xl font-black text-[#edf2ff] mb-12">Nearby Explorations</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {city.nearbyPlaces.map((place, idx) => (
                <div key={idx} className="group text-center">
                  <div className="aspect-square rounded-3xl overflow-hidden mb-4 border-2 border-white/5 group-hover:border-[#E85D04] transition-colors ring-1 ring-white/5">
                    {place.image ? (
                      <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-[#111827] flex items-center justify-center"><FiMapPin className="text-[#E85D04]/40" /></div>
                    )}
                  </div>
                  <h4 className="font-black text-[#edf2ff] mb-1 group-hover:text-[#E85D04] transition-colors">{place.name}</h4>
                  {place.distance && <p className="text-[#4b607a] text-xs font-bold uppercase tracking-widest">{place.distance}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Emergency */}
      {validEmergency && (
        <section className="py-24 bg-[#0c1018] border-b border-white/5">
          <div className="max-w-[1600px] w-full mx-auto px-4">
            <div className="rounded-3xl border border-[#E85D04]/20 bg-[#111827] p-10 md:p-14">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FiPhoneCall size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-[#edf2ff]">Emergency Assistance</h2>
                  <p className="text-[#8fa3cc] text-sm">Important contacts during your visit</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: "Police", value: city.emergencyInfo.police },
                  { label: "Ambulance", value: city.emergencyInfo.ambulance },
                  { label: "Fire", value: city.emergencyInfo.fireBrigade },
                  { label: "Hospital", value: city.emergencyInfo.hospital },
                  { label: "Tourist Helpline", value: city.emergencyInfo.touristHelpline },
                ].filter((e) => e.value?.trim()).map((em, idx) => (
                  <div key={idx} className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#4b607a] mb-1">{em.label}</p>
                    <p className="text-lg font-black text-[#edf2ff]">{em.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Map */}
      {city.mapCoordinates?.lat && city.mapCoordinates?.lng && (
        <section className="h-[450px] w-full border-b border-white/5">
          <iframe
            title={`${city.name} Map`}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) grayscale(80%) contrast(120%)" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${city.mapCoordinates.lat},${city.mapCoordinates.lng}&hl=en&z=13&output=embed`}
          />
        </section>
      )}

      {/*  Related Festivals  */}
      <ExploreIconicSection
        type="festival"
        highlightText="Cultural Experience"
        title={`Festivals in ${stateName || 'the State'}`}
        subtitle="Immerse yourself in local traditions and celebrations nearby."
        data={festivals}
        viewAllLink="/festivals"
        viewAllText="View All Festivals"
        isLoading={festivalsLoading}
      />

      {/* CTA */}
      <section className="py-24 bg-[#07090f]">
        <div className="max-w-[1600px] w-full mx-auto px-4">
          <div className="relative rounded-[2rem] overflow-hidden bg-[#0c1018] p-12 md:p-20 text-center border border-white/6">
            {city.images?.hero && (
              <img src={city.images.hero} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-[#07090f]/80 to-transparent" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <SectionLabel icon={FiCompass} text="Start Exploring" />
              <h2 className="text-4xl md:text-5xl font-black text-[#edf2ff] mb-4">
                Explore Destinations in <span className="text-[#E85D04]">{city.name}</span>
              </h2>
              <p className="text-[#8fa3cc] mb-8">Discover the best places, hidden gems, and unforgettable experiences waiting for you.</p>
              {places.length > 0 && (
                <a href="#destinations" className="inline-flex items-center gap-2 px-8 py-4 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl transition shadow-lg shadow-[#E85D04]/30">
                  Explore Destinations <FiArrowRight />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CityDetails;
