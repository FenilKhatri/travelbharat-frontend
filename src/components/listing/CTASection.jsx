import { memo } from "react";

const CTASection = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 mb-24">
      <div className="relative rounded-[32px] overflow-hidden bg-glass-bg backdrop-blur-xl border border-glass-border p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E85D04]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-xl text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-primary mb-4 leading-tight">
            Ready to start your incredible journey?
          </h2>
          <p className="text-secondary text-lg">
            Explore hidden gems, majestic mountains, and historical treasures across the country. Let TravelBharat be your compass.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button className="px-8 py-4 bg-accent hover:bg-accent-hover text-white font-black uppercase tracking-wider rounded-[16px] shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-1 transition-all duration-300">
            Plan Your Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(CTASection);
