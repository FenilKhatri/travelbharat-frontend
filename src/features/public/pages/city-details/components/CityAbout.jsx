import { FiMapPin } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";

const CityAbout = ({ city }) => {
  if (!city.overview && !city.description) return null;

  return (
    <section className="py-24 bg-[#07090f] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4 grid lg:grid-cols-12 gap-14 items-center">
        <div className="lg:col-span-7">
          <SectionLabel icon={FiMapPin} text="About" />
          <h2 className="text-4xl md:text-5xl font-black text-[#edf2ff] mb-6">
            About <span className="text-[#E85D04]">{city.name}</span>
          </h2>
          <p className="text-[#8fa3cc] leading-relaxed text-base whitespace-pre-line">
            {city.overview || city.description}
          </p>
        </div>
        {city.images?.thumbnail && (
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
              <img src={city.images.thumbnail} alt={city.name} className="w-full h-150 object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CityAbout;
