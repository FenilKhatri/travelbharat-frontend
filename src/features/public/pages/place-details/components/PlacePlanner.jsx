import { FiClock, FiDollarSign, FiInfo } from "react-icons/fi";
import Reveal from "../../../../../components/ui/Reveal";

const PlacePlanner = ({ place }) => {
  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-[1600px] mx-auto px-4">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-black mb-12">Travel Planner</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          <Reveal delay={0.1}>
            <div className="bg-[#050505] p-8 rounded-[2rem] border border-white/10 h-full">
              <FiClock className="text-[#E85D04] mb-6" size={32} />
              <h3 className="text-xl font-bold mb-6 text-white/50 uppercase tracking-widest">Schedule</h3>
              <div className="space-y-4 font-medium">
                <div className="flex justify-between border-b border-white/5 pb-2"><span>Timings</span> <span className="text-white text-right">{place.timings}</span></div>
                <div className="flex justify-between border-b border-white/5 pb-2"><span>Closed On</span> <span className="text-white text-right">{place.closedOn}</span></div>
                <div className="flex justify-between"><span>Duration</span> <span className="text-white text-right">{place.duration || "N/A"}</span></div>
              </div>
            </div>
          </Reveal>

          {place.entryFee && (
            <Reveal delay={0.2}>
              <div className="bg-[#050505] p-8 rounded-[2rem] border border-white/10 h-full">
                <FiDollarSign className="text-green-500 mb-6" size={32} />
                <h3 className="text-xl font-bold mb-6 text-white/50 uppercase tracking-widest">Ticketing</h3>
                <div className="space-y-4 font-medium">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Indian</span> <span className="text-white">{place.entryFee.indian}</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span>Foreigner</span> <span className="text-white">{place.entryFee.foreigner}</span></div>
                  <div className="flex justify-between"><span>Camera</span> <span className="text-white">{place.entryFee.camera}</span></div>
                </div>
              </div>
            </Reveal>
          )}

          {place.quickFacts && (
            <Reveal delay={0.3}>
              <div className="bg-[#050505] p-8 rounded-[2rem] border border-white/10 h-full">
                <FiInfo className="text-blue-500 mb-6" size={32} />
                <h3 className="text-xl font-bold mb-6 text-white/50 uppercase tracking-widest">Quick Facts</h3>
                <div className="space-y-4 font-medium">
                  {place.quickFacts.distanceFromCity && <div className="flex justify-between border-b border-white/5 pb-2"><span>Distance</span> <span className="text-white">{place.quickFacts.distanceFromCity}</span></div>}
                  {place.quickFacts.famousFor && <div className="flex justify-between border-b border-white/5 pb-2"><span>Famous For</span> <span className="text-white text-right max-w-[50%]">{place.quickFacts.famousFor}</span></div>}
                  {place.bestTimeToVisit && <div className="flex justify-between"><span>Best Time</span> <span className="text-white text-right">{place.bestTimeToVisit}</span></div>}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
};

export default PlacePlanner;
