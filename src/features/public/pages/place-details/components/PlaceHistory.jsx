import { FaHistory, FaQuoteLeft } from "react-icons/fa";
import Reveal from "../../../../../components/ui/Reveal";

const PlaceHistory = ({ place }) => {
  if (!place.history && !place.legends) return null;

  return (
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
  );
};

export default PlaceHistory;
