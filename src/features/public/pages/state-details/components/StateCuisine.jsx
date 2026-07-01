import { FaUtensils } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import SectionLabel from "../../../../../components/ui/SectionLabel";
const StateCuisine = ({ featuredCuisine }) => {
  if (!featuredCuisine || featuredCuisine.length === 0) return null;
  // Filter out any missing populations
  const foods = featuredCuisine.filter(fc => fc.food).slice(0, 6);
  if (foods.length === 0) return null;
  return (
    <section className="py-24 bg-[#0a0d14] border-b border-white/5 relative">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionLabel icon={FaUtensils} text="Culinary Journey" />
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-[#edf2ff] mb-4">
              Local Flavors
            </h2>
            <p className="text-[#8fa3cc] text-lg">
              Savor the authentic tastes and traditional delicacies that define the regional cuisine.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((item, index) => {
            const food = item.food;
            const imageUrl = food.image?.url || food.images?.thumbnail;
            
            return (
              <motion.div 
                key={food._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-[#121621] rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-colors cursor-pointer"
              >
                <div className="aspect-4/3 overflow-hidden relative">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={food.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1a202c] flex items-center justify-center">
                      <FaUtensils size={32} className="text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-[#121621] via-transparent to-transparent opacity-80" />
                  
                  {/* Veg/Non-Veg Badge */}
                  <div className="absolute top-4 right-4">
                    {food.isVeg ? (
                      <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                        Vegetarian
                      </span>
                    ) : (
                      <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                        Non-Veg
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[#E85D04] text-xs font-bold tracking-widest uppercase">
                      {food.cuisine || "Local Cuisine"}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#E85D04] transition-colors">
                    {food.name}
                  </h3>
                  
                  <p className="text-[#8fa3cc] text-sm leading-relaxed line-clamp-3">
                    {item.description || "A delicious local specialty you must try when visiting."}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default StateCuisine;