import { FiPhoneCall } from "react-icons/fi";

const CityEmergency = ({ city, validEmergency }) => {
  if (!validEmergency) return null;

  return (
    <section className="py-24 bg-[#0c1018] border-b border-white/5">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <div className="rounded-3xl border border-[#E85D04]/20 bg-[#111827] p-10 md:p-14">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
              <FiPhoneCall size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#edf2ff]">Emergency Assistance</h2>
              <p className="text-[#8fa3cc] text-sm">Important contacts during your visit</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Police", value: "100" },
              { label: "Ambulance", value: "108" },
              { label: "Fire", value: city.emergencyInfo.fireBrigade },
              { label: "Hospital", value: city.emergencyInfo.hospital },
              { label: "Tourist Helpline", value: city.emergencyInfo.touristHelpline },
            ].filter((e) => e.value?.trim()).map((em, idx) => (
              <div key={idx} className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#4b607a] mb-1">{em.label}</p>
                <p className="text-lg font-black text-[#edf2ff]">{em.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityEmergency;
