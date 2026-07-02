import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiStar, FiNavigation } from "react-icons/fi";

const ExploreIconicSection = ({
  type,
  title,
  subtitle,
  highlightText,
  data = [],
  viewAllLink,
  viewAllText = "View All",
  isLoading
}) => {
  if (isLoading) {
    return (
      <section className="py-20 bg-white dark:bg-[#060D18]">
        <div className="max-w-[1600px] w-full mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (data.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#060D18] relative overflow-hidden">
      {/* Decorative element for festivals */}
      {type === 'festival' && (
        <motion.img 
          initial={{ opacity: 0, rotate: 0 }}
          whileInView={{ opacity: 0.05, rotate: 180 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          src="/mandala.svg" 
          alt="Mandala"
          className="absolute left-[-20%] top-[-20%] w-[800px] z-0 pointer-events-none dark:invert-0 invert"
        />
      )}

      <div className="max-w-[1600px] w-full mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#E85D04] font-bold uppercase tracking-wider text-sm mb-2 block">{highlightText}</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        {viewAllLink && (
          <div className="mt-12 text-center md:text-right">
            <Link
              to={viewAllLink}
              className="inline-block px-8 py-4 border border-orange-500 hover:bg-orange-500 hover:text-white text-orange-500 font-bold rounded-xl transition shadow-lg hover:shadow-xl active:scale-95 w-full md:w-auto"
            >
              {viewAllText}
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((item, index) => {
            const isState = type === 'state';
            const isFestival = type === 'festival';
            const isPlace = type === 'destination' || type === 'city';

            let link = "";
            if (isState) link = `/states/${item.slug}`;
            else if (isFestival) link = `/festivals/${item.slug}`;
            else if (isPlace) link = `/destinations/${item.slug}`;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${isFestival && index >= 3 ? 'hidden lg:block' : ''}`} // Adjust grid for 3 vs 4 items depending on design
              >
                <Link 
                  to={link}
                  className={`group relative block ${isState ? 'h-80' : 'h-96'} rounded-[1.25rem] overflow-hidden shadow-xl shadow-slate-200/80 dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-2xl hover:shadow-slate-300 dark:hover:shadow-[0_8px_30px_rgba(232,93,4,0.2)] border border-slate-200 dark:border-white/5 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#E85D04]/50`}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${item.images?.thumbnail?.url || item.images?.hero?.url || item.heroImage?.url || 'https://images.unsplash.com/photo-1533227268428-f9ed0900f9bf?auto=format&fit=crop&q=80'}')` }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 dark:from-black/90 dark:via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges */}
                  {item.featured && (
                    <div className="absolute top-4 left-4 bg-[#E85D04] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg z-10">
                      <FiStar size={10} className="inline mr-1" /> Featured
                    </div>
                  )}

                  {isFestival && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-xs font-bold flex items-center gap-1 z-10">
                      <FiCalendar size={14} /> {item.month || 'Seasonal'}
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0 z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
                    
                    {isState && (
                      <div className="flex items-center text-white/80 text-[13px] font-semibold">
                        <span className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-sm">
                          <FiNavigation size={13} className="text-[#E85D04]" />
                          {item.totalPlaces ?? '10+'} Destinations
                        </span>
                      </div>
                    )}

                    {isFestival && (
                      <>
                        <p className="text-slate-200 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center text-white/80 text-sm gap-1">
                          <FiMapPin size={14} className="text-[#E85D04]" />
                          {item.stateId?.name || 'Across India'}
                        </div>
                      </>
                    )}

                    {isPlace && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-white/80 text-sm gap-1">
                          <FiMapPin size={14} className="text-[#E85D04]" />
                          {item.stateId?.name}
                        </div>
                        <span className="text-[#E85D04] font-black">{item.rating ?? '4.5'} ★</span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExploreIconicSection;