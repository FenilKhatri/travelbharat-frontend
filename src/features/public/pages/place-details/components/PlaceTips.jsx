import { motion } from "framer-motion";
import { FiInfo } from "react-icons/fi";
import Reveal from "../../../../../components/ui/Reveal";
const PlaceTips = ({ place }) => {
  if (!place.tips?.length) return null;
  return (
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
                className="w-[280px] sm:w-[320px] aspect-square bg-linear-to-br from-[#E85D04] to-orange-600 p-8 shadow-[10px_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-center text-center cursor-default"
              >
                <FiInfo className="text-white/30 mx-auto mb-4" size={40} />
                <p className="text-white font-bold text-lg leading-relaxed">{tip}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
export default PlaceTips;