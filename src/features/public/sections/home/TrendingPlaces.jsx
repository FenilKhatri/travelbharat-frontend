import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiStar, FiMapPin, FiArrowRight } from "react-icons/fi";
import Button from "../../../../components/ui/Button";
import { placeService } from "../../../../services/placeService";
import { useEffect, useState } from "react";

const TrendingPlaces = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['trendingPlaces'],
    queryFn: placeService.getTrendingPlaces
  });

  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (data?.data?.places) {
      // Prioritize Surat places
      const fetchedPlaces = [...data.data.places];
      const suratPlaces = [];
      const otherPlaces = [];
      
      fetchedPlaces.forEach(p => {
        if (p.cityId?.name?.toLowerCase() === 'surat') {
          suratPlaces.push(p);
        } else {
          otherPlaces.push(p);
        }
      });
      
      setPlaces([...suratPlaces, ...otherPlaces]);
    }
  }, [data]);

  if (isLoading) {
    return (
      <section className="py-20 bg-white dark:bg-[#060D18]">
        <div className="max-w-[1600px] w-full mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#E85D04] font-bold uppercase tracking-wider text-sm mb-2 block">Top Rated</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Trending Destinations
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Discover the most sought-after locations handpicked for your next unforgettable journey.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 sm:h-96 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-[#060D18]">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[#E85D04] font-bold uppercase tracking-wider text-sm mb-2 block">Top Rated</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
            Trending Destinations
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Discover the most sought-after locations handpicked for your next unforgettable journey.
          </p>
        </div>

        {places.length === 0 ? (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
            No trending destinations found right now.
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {places.slice(0, 4).map((place, index) => (
            <Link to={`/places/${place.slug}`} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 dark:bg-[#0A1628] rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800/50 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-48 sm:h-52 md:h-60 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${place.images.thumbnail}')` }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-white shadow-sm">
                    {place.category}
                  </div>
                  {place.cityId?.name?.toLowerCase() === 'surat' && (
                    <div className="absolute top-4 right-4 bg-[#E85D04] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      Top Choice
                    </div>
                  )}
                </div>
                
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-1 mb-2 text-[#D4A72C]">
                    <FiStar size={16} fill="currentColor" />
                    <span className="font-bold text-slate-800 dark:text-white">{place.rating}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">({place.reviewCount})</span>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#E85D04] transition-colors line-clamp-1">
                    {place.name}
                  </h3>
                  
                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm gap-1 mb-2 sm:mb-4">
                    <FiMapPin size={14} className="text-[#E85D04]" />
                    <span className="line-clamp-1">{place.cityId?.name}, {place.stateId?.name}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/places">
            <Button size="lg">
              Explore All Destinations
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingPlaces;


