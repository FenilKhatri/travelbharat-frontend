import Reveal from "../../../../../components/ui/Reveal";
const PlaceStory = ({ place, heroImage }) => {
  return (
    <section className="py-24 max-w-[1600px] mx-auto px-4">
      <div className="grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] font-serif">
              Why Visit <span className="text-[#E85D04] italic">{place.name}?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div
              className="text-white/70 text-lg md:text-xl leading-relaxed font-light prose prose-invert prose-p:mb-6 max-w-none"
              dangerouslySetInnerHTML={{ __html: place.whyVisit || place.overview || place.description }}
            />
          </Reveal>
        </div>
        <div className="lg:col-span-5 relative hidden md:block">
          <Reveal delay={0.4}>
            <motion.div
              whileHover={{ rotate: 2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative rounded-4xl overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] aspect-4/5 max-w-md ml-auto"
            >
              <img src={place.images?.thumbnail || heroImage} alt={place.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
export default PlaceStory;