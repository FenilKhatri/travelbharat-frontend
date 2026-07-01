import { FiCalendar, FiUsers, FiCompass, FiDollarSign, FiArrowRight } from "react-icons/fi";

const travelStyles = ["Solo", "Couple", "Family", "Friends", "Group", "Pilgrim"];

const TripDetailsForm = ({ tripData, updateTripData, handleCreate, isSaving, today }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 mt-8 relative z-10 -mt-16">
      <form onSubmit={handleCreate} className="bg-[#0A0F1A] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl space-y-10">
        <div>
          <h2 className="text-2xl font-black mb-2 text-[#E85D04]">Create Your Trip</h2>
          <p className="text-white/60 text-sm">Fill in the details below to initialize your trip dashboard.</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-white/70 mb-2 uppercase tracking-wider">Trip Name *</label>
          <input
            type="text"
            required
            value={tripData.name}
            onChange={(e) => updateTripData({ name: e.target.value })}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E85D04] font-bold text-lg transition-colors"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-white/70 mb-2 flex items-center gap-2 uppercase tracking-wider"><FiCalendar /> Start Date *</label>
            <input
              type="date"
              required
              min={today}
              value={tripData.startDate}
              onChange={(e) => updateTripData({ startDate: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E85D04] transition-colors [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-white/70 mb-2 flex items-center gap-2 uppercase tracking-wider"><FiCalendar /> End Date *</label>
            <input
              type="date"
              required
              min={tripData.startDate || today}
              value={tripData.endDate}
              onChange={(e) => updateTripData({ endDate: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E85D04] transition-colors [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Travelers */}
        <div>
          <label className="block text-sm font-bold text-white/70 mb-4 flex items-center gap-2 uppercase tracking-wider"><FiUsers /> Travelers</label>
          <div className="grid grid-cols-3 gap-4">
            {['adults', 'children', 'seniors'].map(type => (
              <div key={type} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center">
                <span className="text-xs uppercase text-white/50 font-bold mb-3">{type}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateTripData({ travelers: { ...tripData.travelers, [type]: Math.max(0, tripData.travelers[type] - 1) } })}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 font-bold text-lg"
                  >-</button>
                  <span className="text-xl font-black w-6 text-center">{tripData.travelers[type]}</span>
                  <button
                    type="button"
                    onClick={() => updateTripData({ travelers: { ...tripData.travelers, [type]: tripData.travelers[type] + 1 } })}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 font-bold text-lg"
                  >+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label className="block text-sm font-bold text-white/70 mb-4 flex items-center gap-2 uppercase tracking-wider"><FiCompass /> Travel Type</label>
          <div className="flex flex-wrap gap-3">
            {travelStyles.map(style => {
              const isSelected = tripData.tripType.toLowerCase() === style.toLowerCase();
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => updateTripData({ tripType: style.toLowerCase() })}
                  className={`px-6 py-3 rounded-xl text-sm font-bold border transition-all ${isSelected
                      ? "bg-[#E85D04] border-[#E85D04] text-white"
                      : "bg-black/30 border-white/10 text-white/60 hover:border-white/30"
                    }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-bold text-white/70 mb-4 flex items-center justify-between uppercase tracking-wider">
            <span className="flex items-center gap-2"><FiDollarSign /> Estimated Budget</span>
            <span className="text-xl font-black text-[#E85D04]">₹{tripData.budget.toLocaleString('en-IN')}</span>
          </label>
          <input
            type="range"
            min="1000" max="1000000" step="1000"
            value={tripData.budget}
            onChange={(e) => updateTripData({ budget: Number(e.target.value) })}
            className="w-full accent-[#E85D04]"
          />
        </div>

        <div className="pt-8">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#E85D04] text-white px-8 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-[#D05203] transition-colors shadow-lg disabled:opacity-50"
          >
            {isSaving ? "Creating Trip..." : "Create Trip Dashboard"} <FiArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripDetailsForm;
