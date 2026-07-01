import { FiInfo, FiStar } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";

const FestivalOverview = ({ festival }) => {
  if (!festival.overview && !festival.highlights?.length && !festival.celebrations && !festival.significance) return null;

  return (
    <section className="py-24 bg-[#0c1018] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <SectionLabel icon={FiInfo} text="Overview" />

        <div className="grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-8">
            <h2 className="text-4xl md:text-5xl font-black text-[#edf2ff] mb-6 leading-tight">
              The Essence of <span className="text-[#E85D04]">{festival.name}</span>
            </h2>

            {festival.overview && (
              <p className="text-[#8fa3cc] leading-relaxed mb-10 text-base whitespace-pre-line">
                {festival.overview}
              </p>
            )}

            {/* Highlights */}
            {festival.highlights?.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-[#edf2ff] mb-4 flex items-center gap-2"><FiStar className="text-[#E85D04]" /> Key Highlights</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {festival.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3 bg-[#111827] p-4 rounded-xl border border-white/5">
                      <div className="mt-1 w-2 h-2 rounded-full bg-[#E85D04] shrink-0" />
                      <span className="text-sm text-[#8fa3cc]">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Celebrations & Significance */}
            {festival.celebrations && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-[#edf2ff] mb-4">How it's Celebrated</h3>
                <p className="text-[#8fa3cc] text-sm leading-relaxed whitespace-pre-line">{festival.celebrations}</p>
              </div>
            )}

            {festival.significance && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-[#edf2ff] mb-4">Cultural Significance</h3>
                <p className="text-[#8fa3cc] text-sm leading-relaxed whitespace-pre-line">{festival.significance}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FestivalOverview;
