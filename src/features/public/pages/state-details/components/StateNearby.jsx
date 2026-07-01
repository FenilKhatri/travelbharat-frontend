import TravelCard from "../../../../../components/cards/TravelCard";
import SectionLabel from "../../../../../components/ui/SectionLabel";
import { FiMap } from "react-icons/fi";

const StateNearby = ({ nearbyStates }) => {
  if (!nearbyStates || nearbyStates.length === 0) return null;

  // Filter out any missing populations
  const states = nearbyStates.filter(ns => ns && ns.name);

  if (states.length === 0) return null;

  return (
    <section className="py-24 bg-[#07090f] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <SectionLabel icon={FiMap} text="Continue Your Journey" />
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="text-4xl font-black text-[#edf2ff]">Explore Nearby</h2>
          <p className="text-[#8fa3cc] text-sm font-medium">Continue your adventure in neighboring regions.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {states.slice(0, 4).map((nearbyState, index) => (
            <TravelCard key={nearbyState._id} type="state" data={nearbyState} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StateNearby;
