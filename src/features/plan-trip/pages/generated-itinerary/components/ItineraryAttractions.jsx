import { Link } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";

const ItineraryAttractions = ({ nearbyAttractions }) => {
  if (!nearbyAttractions?.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
        <FiMapPin className="text-[#E85D04]" /> Recommended Attractions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {nearbyAttractions.map((attr, idx) => (
          <Link to={`/places/${attr._id}`} key={idx} className="bg-[#0A0F1A] border border-white/5 rounded-2xl overflow-hidden flex items-center hover:border-white/20 transition-all group">
            <div className="w-24 h-24 shrink-0 bg-white/5">
              <img src={attr.images?.thumbnail || attr.images?.hero} alt={attr.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-sm mb-1 line-clamp-1">{attr.name}</h4>
              <p className="text-xs text-white/40 capitalize">{attr.category?.replace("-", " ")}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ItineraryAttractions;
