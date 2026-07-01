import Reveal from "../../../../../components/ui/Reveal";

const PlaceHighlights = ({ place }) => {
  if (!place.highlights?.length) return null;

  return (
    <section className="py-32 overflow-hidden bg-linear-to-b from-[#050505] to-[#0a0a0a]">
      <div className="max-w-[1600px] mx-auto px-4">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Key Highlights</h2>
        </Reveal>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-[28px] left-0 w-full h-[2px] bg-linear-to-r from-transparent via-white/20 to-transparent hidden md:block" />

          <div className="flex flex-col md:flex-row gap-8 md:gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-8">
            {place.highlights.map((highlight, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div className="relative w-full md:w-[320px] shrink-0 snap-center md:pt-16 group">
                  {/* Timeline Dot */}
                  <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#E85D04] border-4 border-[#0a0a0a] hidden md:block group-hover:scale-150 transition-transform shadow-[0_0_15px_#E85D04]" />

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors h-full">
                    <h4 className="text-xl font-black mb-4 text-[#E85D04]">{highlight.title || highlight.name || `Highlight ${idx + 1}`}</h4>
                    <p className="text-white/60 leading-relaxed text-sm">
                      {highlight.description || highlight}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaceHighlights;
