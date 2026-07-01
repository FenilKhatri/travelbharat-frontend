import { FiMapPin } from "react-icons/fi";
import { FaTrain, FaPlane, FaCar, FaBus } from "react-icons/fa";
import SectionLabel from "../../../../../components/ui/SectionLabel";

const StateTransport = ({ state }) => {
  if (!state.transport || (!state.transport.byAir && !state.transport.byTrain && !state.transport.byRoad && !state.transport.local)) {
    return null;
  }

  return (
    <section className="py-24 bg-[#0c1018] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <SectionLabel icon={FiMapPin} text="Transportation" />
        <h2 className="text-4xl font-black text-[#edf2ff] mb-12">How to Reach {state.name}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { condition: state.transport.byAir, icon: FaPlane, title: "By Air", text: state.transport.byAir, bg: "bg-purple-900/25", border: "border-purple-500/20", hover: "hover:border-purple-500/40", text_c: "text-purple-400", shadow: "hover:shadow-purple-900/20" },
            { condition: state.transport.byTrain, icon: FaTrain, title: "By Train", text: state.transport.byTrain, bg: "bg-emerald-900/25", border: "border-emerald-500/20", hover: "hover:border-emerald-500/40", text_c: "text-emerald-400", shadow: "hover:shadow-emerald-900/20" },
            { condition: state.transport.byRoad, icon: FaCar, title: "By Road", text: state.transport.byRoad, bg: "bg-[#E85D04]/15", border: "border-[#E85D04]/20", hover: "hover:border-[#E85D04]/40", text_c: "text-[#E85D04]", shadow: "hover:shadow-[#E85D04]/10" },
            { condition: state.transport.local, icon: FaBus, title: "Local Transport", text: state.transport.local, bg: "bg-blue-900/25", border: "border-blue-500/20", hover: "hover:border-blue-500/40", text_c: "text-blue-400", shadow: "hover:shadow-blue-900/20" },
          ].filter(item => item.condition).map(({ icon: Icon, title, text, bg, border, hover, text_c, shadow }, i) => (
            <div key={i} className={`bg-[#111827] border ${border} ${hover} p-7 rounded-3xl hover:shadow-xl ${shadow} transition-all duration-300 group`}>
              <div className={`w-12 h-12 ${bg} border ${border} ${text_c} rounded-2xl flex items-center justify-center mb-7 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={22} />
              </div>
              <h4 className="text-lg font-bold text-[#edf2ff] mb-3">{title}</h4>
              <p className="text-sm text-[#8fa3cc] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StateTransport;
