import { motion } from "framer-motion";
import { FiClock, FiCalendar, FiWind, FiDollarSign, FiStar, FiTag } from "react-icons/fi";
const PlaceSnapshot = ({ place }) => {
  const items = [
    { icon: FiClock, label: "Duration", value: place.duration },
    { icon: FiCalendar, label: "Timings", value: place.timings },
    { icon: FiWind, label: "Best Time", value: place.bestTimeToVisit },
    { icon: FiDollarSign, label: "Entry Fee", value: place.entryFee?.indian },
    { icon: FiStar, label: "Rating", value: place.rating > 0 ? `${place.rating} / 5 (${place.reviewCount})` : null },
    { icon: FiTag, label: "Type", value: place.tripType?.[0] || place.category }
  ].filter(item => item.value && item.value !== "Free" && item.value !== "Open 24 Hours");
  if (items.length === 0) return null;
  return (
    <section className="relative z-20 -mt-10 mb-24 max-w-[1600px] mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {items.map((item, idx) => (
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
  );
};
export default PlaceSnapshot;