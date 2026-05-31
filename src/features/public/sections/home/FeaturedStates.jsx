import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import Button from "../../../../components/ui/Button";
import { stateService } from "../../../../services/stateService";
import { statsService } from "../../../../services/statsService";
import { useEffect, useState, useMemo } from "react";

const formatDestCount = (count) => {
  if (!count || count === 0) return "0 Destinations";
  if (count > 15) return "15+ Destinations";
  return `${count} ${count === 1 ? "Destination" : "Destinations"}`;
};

const FeaturedStates = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['featuredStates'],
    queryFn: () => stateService.getFeaturedStates()
  });

  // Fetch real destination counts per state
  const { data: countsData } = useQuery({
    queryKey: ['statesDestinationCounts'],
    queryFn: () => statsService.getStatesDestinationCounts(),
  });

  const destCounts = countsData?.data?.counts || {};

  const states = useMemo(() => {
    if (!data?.data?.states) return [];
    const fetchedStates = [...data.data.states];
    const gujaratIndex = fetchedStates.findIndex(s => s.name.toLowerCase() === 'gujarat');
    
    if (gujaratIndex > 0) {
      const gujarat = fetchedStates.splice(gujaratIndex, 1)[0];
      fetchedStates.unshift(gujarat);
    }
    return fetchedStates;
  }, [data]);

  if (isLoading) {
    return (
      <section className="py-20 bg-slate-50 dark:bg-[#050B14]">
        <div className="max-w-[1600px] w-full mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#050B14] relative">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Explore Iconic States
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              From the vibrant culture of Gujarat to the majestic palaces of Rajasthan, discover the diverse beauty of India state by state.
            </p>
          </div>
          <Link to="/states">
            <Button variant="outline" className="hidden md:flex">
              View All States <FiArrowRight size={18} />
            </Button>
          </Link>
        </div>

        {states.length === 0 ? (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
            No featured states available right now.
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {states.map((state, index) => {
            const realCount = destCounts[state._id] || state.totalPlaces || 0;
            return (
            <Link to={`/states/${state.slug}`} key={state._id || index}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg bg-slate-100 dark:bg-slate-800"
              >
                {/* Image */}
                {state.images?.thumbnail ? (
                  <img
                    src={state.images.thumbnail}
                    alt={state.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const ph = e.currentTarget.parentElement.querySelector("[data-placeholder]");
                      if (ph) ph.style.display = "flex";
                    }}
                  />
                ) : null}
                {/* No-image placeholder */}
                <div
                  data-placeholder
                  className="absolute inset-0 flex-col items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900"
                  style={{ display: state.images?.thumbnail ? "none" : "flex" }}
                >
                  <FiMapPin size={36} className="text-slate-400 dark:text-slate-600 mb-3" />
                  <span className="text-slate-600 dark:text-slate-400 font-bold text-lg">{state.name}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                
                {/* Gujarat Priority Badge */}
                {state.name.toLowerCase() === 'gujarat' && (
                  <div className="absolute top-4 right-4 bg-[#E85D04] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Featured Choice
                  </div>
                )}

                <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                  <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    {state.name}
                  </h3>
                  <p className="text-slate-300 text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {state.tagline}
                  </p>
                  <div className="flex items-center justify-between text-white/80 text-sm">
                    <span className="flex items-center gap-1"><FiMapPin size={14}/> {formatDestCount(realCount)}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
            );
          })}
        </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/states">
            <Button variant="outline" className="w-full">
              View All States <FiArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStates;
