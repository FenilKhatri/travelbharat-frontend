import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";

const RelatedArticles = ({ relatedBlogs }) => {
  if (!relatedBlogs || relatedBlogs.length === 0) return null;

  return (
    <div className="mt-24 pt-16 border-t border-slate-200 dark:border-slate-800 font-sans">
      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-10">
        More from <span className="text-[#E85D04]">TravelBharat</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedBlogs.map(related => (
          <Link 
            key={related._id} 
            to={`/blogs/${related.slug}`}
            className="group flex flex-col bg-white dark:bg-[#0A121F] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:border-[#E85D04]/30 transition-all duration-300 hover:-translate-y-1 h-full"
          >
            <div className="aspect-4/3 overflow-hidden relative">
              <img 
                src={related.images?.thumbnail || related.images?.hero || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da"} 
                alt={related.title} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {related.category && (
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm text-slate-900 dark:text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                  {related.category.replace(/-/g, " ")}
                </div>
              )}
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">
                <span>{new Date(related.publishedAt || related.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="flex items-center gap-1"><FiClock size={12} /> {related.readTime || '5'} min</span>
              </div>
              
              <h4 className="font-black text-xl text-slate-900 dark:text-white mb-3 group-hover:text-[#E85D04] transition-colors leading-tight line-clamp-2">
                {related.title}
              </h4>
              
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">
                {related.excerpt || related.title}
              </p>

              <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50">
                 <div className="flex items-center gap-2">
                    {related.author?.profileImage ? (
                      <img src={related.author.profileImage} alt={related.author.name} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-[10px] font-bold">
                        {related.author?.name?.charAt(0) || "T"}
                      </div>
                    )}
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{related.author?.name || "Editor"}</span>
                 </div>
                 <span className="text-xs font-bold text-[#E85D04] group-hover:translate-x-1 transition-transform">Read Story &rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
