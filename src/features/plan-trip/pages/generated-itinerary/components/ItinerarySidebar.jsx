import { FiSun, FiDollarSign, FiCheck, FiInfo } from "react-icons/fi";

const ItinerarySidebar = ({ weather, costBreakdown, recommendedHotels, travelEssentials }) => {
  return (
    <div className="lg:col-span-4 space-y-6">

      {/* WEATHER */}
      {weather && (
        <div className="bg-linear-to-br from-sky-900/30 to-blue-900/10 border border-sky-500/20 p-6 rounded-3xl">
          <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-sky-400">
            <FiSun /> Destination Weather
          </h3>
          <div className="text-3xl font-black mb-2">{weather.temperature}</div>
          <p className="text-sm font-bold text-white/70 mb-4">{weather.condition}</p>
          <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-xs text-white/60">
            <span className="font-bold text-white/90">Pack:</span> {weather.clothing}
          </div>
        </div>
      )}

      {/* BUDGET BREAKDOWN */}
      {costBreakdown && (
        <div className="bg-[#0A0F1A] border border-white/5 p-6 rounded-3xl">
          <h3 className="font-black text-lg mb-6 flex items-center gap-2">
            <FiDollarSign className="text-emerald-400" /> Cost Estimate
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60">Transportation</span>
              <span className="font-bold">₹{costBreakdown.transportation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60">Accommodation</span>
              <span className="font-bold">₹{costBreakdown.accommodation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60">Food & Dining</span>
              <span className="font-bold">₹{costBreakdown.food.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60">Activities</span>
              <span className="font-bold">₹{costBreakdown.activities.toLocaleString()}</span>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="font-black text-[#E85D04]">Total</span>
              <span className="font-black text-xl">₹{costBreakdown.totalEstimated.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* HOTELS */}
      {recommendedHotels?.length > 0 && (
        <div className="bg-[#0A0F1A] border border-white/5 p-6 rounded-3xl">
          <h3 className="font-black text-lg mb-4 flex items-center gap-2">
            <FiCheck className="text-blue-400" /> Recommended Stays
          </h3>
          <div className="space-y-3">
            {recommendedHotels.map((hotel, idx) => (
              <div key={idx} className="bg-black/30 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm">{hotel.name}</h4>
                  <p className="text-xs text-white/40">{hotel.rating} / 5 Rating</p>
                </div>
                <div className="text-right">
                  <span className="text-[#E85D04] font-bold text-sm">{hotel.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ESSENTIALS */}
      {travelEssentials && (
        <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-3xl">
          <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-amber-500">
            <FiInfo /> Travel Essentials
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold text-white/80 mb-1 text-xs uppercase tracking-wider">Safety</p>
              <p className="text-white/50">{travelEssentials.safety}</p>
            </div>
            <div>
              <p className="font-bold text-white/80 mb-1 text-xs uppercase tracking-wider">Customs</p>
              <p className="text-white/50">{travelEssentials.customs}</p>
            </div>
            <div>
              <p className="font-bold text-white/80 mb-2 text-xs uppercase tracking-wider">Don't Forget</p>
              <div className="flex flex-wrap gap-2">
                {travelEssentials.packing.map((item, idx) => (
                  <span key={idx} className="bg-white/5 px-2 py-1 rounded text-xs text-white/70">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ItinerarySidebar;
