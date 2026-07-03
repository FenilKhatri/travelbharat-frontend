import { FiCompass, FiArrowRight } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";
import SectionContainer from "../../../../../components/layout/SectionContainer";

const CityCTA = ({ city, places }) => {
  return (
    <SectionContainer className="bg-[#07090f]">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <div className="relative rounded-4xl overflow-hidden bg-[#0c1018] p-12 md:p-20 text-center border border-white/6">
          {city.images?.hero && (
            <img src={city.images.hero} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#07090f] via-[#07090f]/80 to-transparent" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <SectionLabel icon={FiCompass} text="Start Exploring" />
            <h2 className="text-4xl md:text-5xl font-black text-[#edf2ff] mb-4">
              Explore Destinations in <span className="text-[#E85D04]">{city.name}</span>
            </h2>
            <p className="text-[#8fa3cc] mb-8">Discover the best places, hidden gems, and unforgettable experiences waiting for you.</p>
            {places.length > 0 && (
              <a href="#destinations" className="inline-flex items-center gap-2 px-8 py-4 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl transition shadow-lg shadow-[#E85D04]/30">
                Explore Destinations <FiArrowRight />
              </a>
            )}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default CityCTA;
