import { FiMapPin } from "react-icons/fi";

const PlannerHero = ({ destination }) => {
  const heroImage = destination.images?.hero || destination.images?.thumbnail || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80";

  return (
    <div className="relative h-[400px] w-full">
      <img src={heroImage} alt={destination.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/60 to-black/30" />
      <div className="absolute bottom-8 left-8 right-8 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-2">{destination.name}</h1>
        <div className="flex items-center gap-2 text-white/70 font-medium text-lg">
          <FiMapPin className="text-[#E85D04]" />
          <span>{destination.cityId?.name}, {destination.stateId?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default PlannerHero;
