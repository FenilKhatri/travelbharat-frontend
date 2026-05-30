import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaMountain, FaTree, FaCampground, FaWater } from "react-icons/fa";
import { MdCastle } from "react-icons/md";
import { FiCamera, FiCoffee, FiMusic } from "react-icons/fi";

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../../../services/categoryService";

const categoryMap = {
  "heritage": { icon: MdCastle, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  "nature": { icon: FaTree, color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
  "adventure": { icon: FaCampground, color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  "mountains": { icon: FaMountain, color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  "beaches": { icon: FaWater, color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" },
  "culture": { icon: FiMusic, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  "photography": { icon: FiCamera, color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
  "food": { icon: FiCoffee, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  "default": { icon: FiCamera, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" }
};

const TravelCategories = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAllCategories
  });

  const displayCategories = data?.data?.categories || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-slate-50 dark:bg-[#050B14]">
        <div className="max-w-[1600px] w-full mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#050B14] relative">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Travel by Category
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Whether you seek spiritual awakening, thrilling adventures, or peaceful retreats, we have curated the perfect spots for you.
          </p>
        </div>

        {displayCategories.length === 0 ? (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
            No categories found.
          </div>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayCategories.map((category, index) => {
            const mapped = categoryMap[category.name?.toLowerCase()] || categoryMap.default;
            const Icon = mapped.icon;
            return (
              <Link to={`/places?category=${category.slug}`} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white dark:bg-[#0A121F] p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group cursor-pointer"
                >
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${mapped.color}`}>
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-[#E85D04] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {category.placeCount || 0} Destinations
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};

export default TravelCategories;


