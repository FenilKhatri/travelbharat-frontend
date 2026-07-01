import { FiCalendar } from "react-icons/fi";

const ItineraryDays = ({ itinerary }) => {
  return (
    <section>
      <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
        <FiCalendar className="text-[#E85D04]" /> Your Itinerary
      </h2>
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-white/10 before:to-transparent">
        {itinerary.map((day, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#050505] bg-[#E85D04] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-black text-sm">
              {day.day}
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#0A0F1A] border border-white/5 p-6 rounded-2xl shadow-xl">
              <h3 className="font-black text-xl mb-6 text-[#E85D04]">{day.title}</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-white/10">

                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center"></div>
                  <p className="text-xs font-bold text-blue-400 mb-1">{day.morning.time}</p>
                  <h4 className="font-bold text-lg mb-1">{day.morning.activity}</h4>
                  <p className="text-sm text-white/50">{day.morning.description}</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center"></div>
                  <p className="text-xs font-bold text-amber-400 mb-1">{day.afternoon.time}</p>
                  <h4 className="font-bold text-lg mb-1">{day.afternoon.activity}</h4>
                  <p className="text-sm text-white/50">{day.afternoon.description}</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center"></div>
                  <p className="text-xs font-bold text-purple-400 mb-1">{day.evening.time}</p>
                  <h4 className="font-bold text-lg mb-1">{day.evening.activity}</h4>
                  <p className="text-sm text-white/50">{day.evening.description}</p>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ItineraryDays;
