import { Link } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiHeart, FiShare2, FiDownload } from "react-icons/fi";

const ItineraryHero = ({ destination, itineraryLength }) => {
  return (
    <section className="relative h-[40vh] min-h-[300px] flex items-end">
      <div className="absolute inset-0">
        <img src={destination.heroImage} alt={destination.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/80 to-black/30" />
      </div>
      <div className="relative z-10 max-w-[1200px] mx-auto w-full px-4 pb-12">
        <Link to={`/plan/${destination.id}`} className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-wider">
          <FiArrowLeft /> Back to Planner
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="bg-[#E85D04] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
              AI Generated Itinerary
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2">
              {itineraryLength} Days in {destination.name}
            </h1>
            <div className="flex items-center gap-2 text-white/70 font-medium">
              <FiMapPin className="text-[#E85D04]" />
              <span>{destination.city}, {destination.state}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
              <FiHeart /> Save Trip
            </button>
            <button className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3 rounded-xl transition-colors">
              <FiShare2 />
            </button>
            <button className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3 rounded-xl transition-colors">
              <FiDownload />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItineraryHero;
