import { FaPlane, FaTrain, FaBus, FaCar } from "react-icons/fa";
import { FiNavigation } from "react-icons/fi";
import SectionLabel from "../../../../../components/ui/SectionLabel";

const CityTransport = ({ city }) => {
  if (!city.transport || (!city.transport.fromAirport && !city.transport.fromStation && !city.transport.busStation && !city.transport.local)) return null;

  return (
    <section className="py-24 bg-[#07090f] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <SectionLabel icon={FiNavigation} text="Getting Around" />
        <h2 className="text-4xl font-black text-[#edf2ff] mb-12">How To Reach {city.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { condition: city.transport.fromAirport, icon: FaPlane, title: "Airport", text: city.transport.fromAirport },
            { condition: city.transport.fromStation, icon: FaTrain, title: "Railway", text: city.transport.fromStation },
            { condition: city.transport.busStation, icon: FaBus, title: "Bus", text: city.transport.busStation },
            { condition: city.transport.local, icon: FaCar, title: "Local", text: city.transport.local },
          ].filter((t) => t.condition).map((t, idx) => (
            <div key={idx} className="p-7 rounded-3xl bg-[#111827] border border-white/6 hover:border-[#E85D04]/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04] mb-5">
                <t.icon size={20} />
              </div>
              <h4 className="text-lg font-bold text-[#edf2ff] mb-3">{t.title}</h4>
              <p className="text-sm text-[#8fa3cc] leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityTransport;
