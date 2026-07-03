import { FaPlane, FaTrain, FaCar, FaBus } from "react-icons/fa";
import Reveal from "../../../../../components/ui/Reveal";
import SectionContainer from "../../../../../components/layout/SectionContainer";

const PlaceTransport = ({ place }) => {
  if (!place.howToReach) return null;

  return (
    <SectionContainer className="bg-[#050505] border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-4">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-black mb-12">How To Reach</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { type: "Air", text: place.howToReach.byAir, icon: FaPlane, color: "text-sky-400" },
            { type: "Train", text: place.howToReach.byTrain, icon: FaTrain, color: "text-orange-400" },
            { type: "Road", text: place.howToReach.byRoad, icon: FaCar, color: "text-green-400" },
            { type: "Local", text: place.howToReach.localTransport, icon: FaBus, color: "text-purple-400" }
          ].filter(t => t.text).map((route, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2rem] h-full hover:-translate-y-2 transition-transform shadow-xl">
                <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                  <route.icon size={24} className={route.color} />
                  <h3 className="text-xl font-bold uppercase tracking-widest">{route.type}</h3>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{route.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default PlaceTransport;
