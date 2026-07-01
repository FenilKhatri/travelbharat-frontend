import { FiCamera } from "react-icons/fi";
import Reveal from "../../../../../components/ui/Reveal";

const PlacePhotography = ({ place }) => {
  if (!place.photographySpots?.length) return null;

  return (
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
              <div className="break-inside-avoid relative rounded-4xl overflow-hidden border border-white/5 bg-[#050505] group p-8 hover:bg-white/5 transition-colors">
                <h3 className="text-xl font-black text-[#E85D04] mb-3">{spot.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{spot.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlacePhotography;
