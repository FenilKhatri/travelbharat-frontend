import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiClock, FiCalendar, FiArrowRight, FiBookOpen } from "react-icons/fi";
import { formatDate } from "../hooks/useBlogsData";
import CardSkeleton from "../../../../../components/ui/CardSkeleton";
const BlogGrid = ({ isLoading, filteredBlogs, gridBlogs, hasFilters, setSearchTerm, setSelectedCategory }) => {
  return (
    <div className="lg:col-span-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Latest Articles</h2>
        {!isLoading && (
          <span className="text-sm text-slate-500 font-medium">{filteredBlogs.length} stories</span>
        )}
      </div>
      {isLoading ? (
        <CardSkeleton count={6} columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-2" />
      ) : gridBlogs.length > 0 || (hasFilters && filteredBlogs.length > 0) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(hasFilters ? filteredBlogs : gridBlogs).map((blog, idx) => (
            <motion.article
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
              className="group flex flex-col rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A121F] hover:shadow-2xl hover:border-[#E85D04]/30 transition-all duration-500 hover:-translate-y-1"
            >
              <Link to={`/blogs/${blog.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                <img
                  src={blog.images?.thumbnail || blog.images?.hero}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-[#0A121F]/90 backdrop-blur-sm text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-wider rounded-full">
                  {blog.category?.replace(/-/g, " ")}
                </span>
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-3">
                  <span className="flex items-center gap-1"><FiClock size={12} /> {blog.readTime || 5} min</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><FiCalendar size={12} /> {formatDate(blog.publishedAt || blog.createdAt)}</span>
                </div>
                <Link to={`/blogs/${blog.slug}`}>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#E85D04] transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </Link>
                <Link
                  to={`/blogs/${blog.slug}`}
                  className="mt-auto inline-flex items-center gap-2 text-[#E85D04] font-bold text-sm group/link"
                >
                  Read More <FiArrowRight className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-[#0A121F]/50">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#E85D04]/10 flex items-center justify-center">
            <FiBookOpen className="text-[#E85D04]" size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">No Stories Found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            {hasFilters
              ? "We couldn't find any articles matching your search. Try different keywords or browse all categories."
              : "Travel stories are on their way. Check back soon for inspiring guides and destination insights."}
          </p>
          {hasFilters && (
            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory(""); }}
              className="px-8 py-3 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl transition shadow-lg shadow-[#E85D04]/25"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default BlogGrid;