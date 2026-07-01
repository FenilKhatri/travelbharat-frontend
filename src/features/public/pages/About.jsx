import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  FiMapPin, FiCompass, FiBookOpen, FiGlobe, FiHeart, FiMap,
  FiCamera, FiArrowRight, FiStar, FiUsers, FiTarget, FiEye
} from "react-icons/fi";
import { FaMountain, FaLandmark } from "react-icons/fa";
import { statsService } from "../../../services/statsService";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }};

const features = [
  {
    icon: FiCompass,
    title: "Hidden Gems",
    description: "Discover lesser-known destinations that most tourists miss — from secluded valleys to forgotten temples.",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"},
  {
    icon: FaLandmark,
    title: "Cultural Heritage",
    description: "Explore India's rich cultural tapestry — ancient traditions, art forms, and centuries-old customs.",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"},
  {
    icon: FiMap,
    title: "State Guides",
    description: "Comprehensive state-by-state travel guides with local insights, itineraries, and practical tips.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"},
  {
    icon: FiHeart,
    title: "Local Experiences",
    description: "Immerse yourself in authentic local experiences — from street food walks to village homestays.",
    color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"},
  {
    icon: FiBookOpen,
    title: "Authentic Information",
    description: "Every piece of content is researched and verified to ensure you get reliable, authentic travel information.",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"},
  {
    icon: FiCamera,
    title: "Visual Stories",
    description: "Beautiful photography and immersive visual storytelling that brings every destination to life.",
    color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"},
];

const About = () => {
  const { data: statsData } = useQuery({
    queryKey: ["publicStats"],
    queryFn: () => statsService.getPublicStats(),
    staleTime: 60_000});

  const stats = statsData?.data || {};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1628]">
      {/*  Hero Section  */}
      <section className="relative pt-28 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#0A1628] via-[#0E1E36] to-[#162544]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#E85D04]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <motion.div {...fadeUp}>
            <span className="text-[#E85D04] font-bold tracking-widest uppercase text-xs mb-4 block">
              — About Us —
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Discover India with{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#E85D04] to-[#FFA647]">
                TravelBharat
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Your ultimate guide to exploring the incredible diversity of India —
              from snow-capped mountains to tropical beaches, ancient temples to modern cities.
            </p>
          </motion.div>
        </div>
      </section>

      {/*  Mission & Vision  */}
      <section className="py-20 bg-white dark:bg-[#0D1526]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <motion.div {...fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#E85D04]/10 flex items-center justify-center">
                  <FiTarget size={24} className="text-[#E85D04]" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  Our Mission
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                To make authentic travel information accessible to every Indian traveler.
                We believe that informed travelers have better experiences, support local communities,
                and help preserve the cultural heritage of our incredible nation.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mt-4">
                TravelBharat aims to be the most comprehensive and trusted travel platform
                for exploring India — showcasing not just popular destinations, but the hidden gems
                that make our country truly unique.
              </p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <FiEye size={24} className="text-blue-500" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  Our Vision
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                To become the go-to digital platform for domestic tourism in India,
                inspiring millions to explore their own country before venturing abroad.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mt-4">
                We envision a world where every village, town, and city in India is connected to travelers
                who appreciate and respect its unique heritage, culture, and natural beauty.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/*  Why TravelBharat  */}
      <section className="py-20 bg-slate-50 dark:bg-[#0A1628]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-[#E85D04] font-bold tracking-wider uppercase text-xs mb-3 block">
              — Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Why TravelBharat?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Built by travelers, for travelers. Here's what sets us apart.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-white dark:bg-[#0D1526] p-7 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${feature.color}`}>
                  <feature.icon size={26} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#E85D04] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/*  Journey Statistics  */}
      <section className="py-20 bg-linear-to-r from-[#E85D04] to-[#FFA647] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Our Journey in Numbers
            </h2>
            <p className="text-white/80 text-lg">
              Growing every day to cover every corner of India.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "States Covered", value: stats.states ?? "—", icon: FiMap },
              { label: "Cities Covered", value: stats.cities ?? "—", icon: FiGlobe },
              { label: "Destinations", value: stats.destinations ?? "—", icon: FiMapPin },
              { label: "Experiences", value: stats.experiences ?? "—", icon: FiStar },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon size={28} className="mx-auto text-white/60 mb-3" />
                <div className="text-4xl md:text-5xl font-black text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-white/70 font-semibold uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/*  Team / Founder  */}
      <section className="py-20 bg-white dark:bg-[#0D1526]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <span className="text-[#E85D04] font-bold tracking-wider uppercase text-xs mb-3 block">
              — The Team
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
              Built with Passion
            </h2>
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#E85D04] to-[#FFA647] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-[#E85D04]/30">
                TB
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              TravelBharat Team
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              We are a passionate team of travel enthusiasts, developers, and content creators
              united by one goal — to make every Indian proud of their heritage and inspire them
              to explore the breathtaking diversity of our nation.
            </p>
          </motion.div>
        </div>
      </section>

      {/*  CTA  */}
      <section className="py-20 bg-slate-50 dark:bg-[#0A1628]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
              Ready to Explore?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
              Start your journey across India today. Discover states, cities, and destinations
              that will leave you amazed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/states">
                <button className="px-8 py-4 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-[#E85D04]/30 mx-auto sm:mx-0">
                  <FiCompass size={20} /> Explore States
                </button>
              </Link>
              <Link to="/contact">
                <button className="px-8 py-4 bg-white dark:bg-[#0D1526] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition-colors flex items-center gap-2 hover:border-[#E85D04] mx-auto sm:mx-0">
                  <FiArrowRight size={20} /> Contact Us
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;