import { FiMapPin } from "react-icons/fi";
import { FaHistory, FaStar as FaStarSolid } from "react-icons/fa";
import SectionLabel from "../../../../../components/ui/SectionLabel";
import CollapsibleText from "../../../../../components/ui/CollapsibleText";

const StateOverview = ({ state, validGallery }) => {
  if (!state.overview && !state.highlights?.length && !state.history && !state.culture && !validGallery?.length) {
    return null;
  }

  return (
    <section className="py-24 bg-[#0c1018] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <SectionLabel icon={FiMapPin} text="Overview" />

        <div className="grid lg:grid-cols-12 gap-14">
          {/* Left Content */}
          <div className="lg:col-span-7">
            <h2 className="text-4xl md:text-5xl font-black text-[#edf2ff] mb-6 leading-tight">
              The Vibrant Soul of <span className="text-[#E85D04]">{state.name}</span>
            </h2>

            {state.overview && (
              <p className="text-[#8fa3cc] leading-relaxed mb-10 text-base">
                {state.overview}
              </p>
            )}

            {/* Highlights Grid */}
            {state.highlights?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                {state.highlights.map((highlight, i) => (
                  <div key={i} className="bg-[#111827] p-5 rounded-2xl border border-white/6 hover:border-[#E85D04]/30 hover:bg-[#151e2d] transition-all duration-300 flex gap-4 items-start group">
                    <div className="bg-[#E85D04]/10 border border-[#E85D04]/20 p-2.5 rounded-xl text-[#E85D04] shrink-0 group-hover:bg-[#E85D04]/20 transition-colors">
                      <FaStarSolid size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#edf2ff] text-sm mb-1">{highlight.title}</h4>
                      <p className="text-xs text-[#4b607a] leading-relaxed line-clamp-3">{highlight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Timeline Items */}
            <div className="space-y-8">
              <CollapsibleText title="History" icon={FaHistory} content={state.history} />
              <CollapsibleText title="Culture" icon={FaStarSolid} content={state.culture} />
            </div>
          </div>

          {/* Right Images / Gallery Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
            {validGallery?.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-5">
                <a
                  href="#gallery"
                  className="col-span-3 rounded-2xl overflow-hidden h-64 shadow-2xl ring-1 ring-white/5 cursor-pointer group block"
                >
                  <img src={validGallery[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Gallery preview main" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none" />
                </a>
                {validGallery.slice(1, 4).map((src, i) => (
                  <a
                    key={i}
                    href="#gallery"
                    className="rounded-2xl overflow-hidden h-32 shadow-lg ring-1 ring-white/5 cursor-pointer group relative block"
                  >
                    <img src={src} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={`Gallery preview sub ${i + 1}`} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StateOverview;
