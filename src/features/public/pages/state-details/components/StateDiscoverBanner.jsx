import { FiMapPin } from "react-icons/fi";

import PageContainer from "../../../../../components/layout/PageContainer";

const StateDiscoverBanner = ({ state }) => {
  return (
    <PageContainer as="section" className="pb-24 pt-12">
      <div className="relative rounded-4xl overflow-hidden bg-[#0c1018] p-12 md:p-20 text-center flex flex-col items-center justify-center border border-white/6">
        {(state.images?.hero?.url || state.heroImage?.url) && (
          <img src={state.images?.hero?.url || state.heroImage?.url} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" alt="Discover" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#07090f] via-[#07090f]/70 to-transparent pointer-events-none" />

        {/* Decorative glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full bg-[#E85D04]/8 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 justify-center text-[#E85D04] font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
            <FiMapPin size={12} /> Begin Your Journey
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#edf2ff] mb-4 leading-tight">
            Ready to Discover <span className="text-[#E85D04]">{state.name}</span>?
          </h2>
          <p className="text-base text-[#8fa3cc] mb-10">Begin your journey today and create memories that will last a lifetime.</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default StateDiscoverBanner;
