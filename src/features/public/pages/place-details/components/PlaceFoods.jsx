import Reveal from "../../../../../components/ui/Reveal";
import SectionContainer from "../../../../../components/layout/SectionContainer";

const PlaceFoods = ({ place }) => {
  if (!place.foodSpecialities?.length) return null;

  return (
    <SectionContainer className="bg-[#050505]">
      <div className="max-w-[1600px] mx-auto px-4">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-black mb-12">Culinary Delights</h2>
        </Reveal>
        <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-8 snap-x snap-mandatory">
          {place.foodSpecialities.map((food, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div className="w-[280px] sm:w-[350px] shrink-0 snap-center group rounded-4xl overflow-hidden relative border border-white/10 aspect-square">
                <img
                  src={food.images?.thumbnail || food.image || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={food.name}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-2xl font-black text-white mb-2">{food.name}</h3>
                  <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-3">{food.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default PlaceFoods;
