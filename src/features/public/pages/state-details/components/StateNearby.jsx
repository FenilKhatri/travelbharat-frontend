import TravelCard from "../../../../../components/cards/TravelCard";
import SectionLabel from "../../../../../components/ui/SectionLabel";
import { FiMap } from "react-icons/fi";
import SectionContainer from "../../../../../components/layout/SectionContainer";
import PageContainer from "../../../../../components/layout/PageContainer";

const StateNearby = ({ nearbyStates }) => {
  if (!nearbyStates || nearbyStates.length === 0) return null;

  // Filter out any missing populations
  const states = nearbyStates.filter(ns => ns && ns.name);

  if (states.length === 0) return null;

  return (
    <SectionContainer className="bg-slate-50 dark:bg-[#07090f] border-b border-slate-200 dark:border-white/5">
      <PageContainer>
        <SectionLabel icon={FiMap} text="Continue Your Journey" />
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="text-4xl font-black text-slate-900 dark:text-[#edf2ff]">Explore Nearby</h2>
          <p className="text-slate-500 dark:text-[#8fa3cc] text-sm font-medium">Continue your adventure in neighboring regions.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {states.slice(0, 4).map((nearbyState, index) => (
            <TravelCard key={nearbyState._id} type="state" data={nearbyState} index={index} />
          ))}
        </div>
      </PageContainer>
    </SectionContainer>
  );
};

export default StateNearby;
