import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiArrowRight, FiClock, FiUser } from "react-icons/fi";
import { blogService } from "../../../../services/blogService";
import Button from "../../../../components/ui/Button";

const BlogsSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAllBlogs()
  });

  const blogs = data?.data?.blogs || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-slate-50 dark:bg-[#050B14]">
        <div className="max-w-[1600px] w-full mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#050B14] relative overflow-hidden">
      <div className="max-w-[1600px] w-full mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <span className="text-[#E85D04] font-bold uppercase tracking-wider text-sm mb-2 block">Travel Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Latest from our Blog
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Read travel guides, cultural insights, and tips to make your journey extraordinary.
            </p>
          </div>
          <Link to="/blogs">
            <Button variant="outline" className="hidden md:flex">
              Read All Stories <FiArrowRight size={18} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-[#0A121F] rounded-2xl overflow-hidden shadow-xl shadow-slate-200/80 dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-white/5 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-300 transition-all duration-300 group"
            >
              <Link to={`/blogs/${blog.slug}`}>
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={blog.images?.thumbnail || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80'} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#E85D04]">
                    {blog.category || 'Travel'}
                  </div>
                </div>
              </Link>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <span className="flex items-center gap-1"><FiUser size={14} /> {blog.author?.name || (typeof blog.author === 'string' ? blog.author : 'Admin')}</span>
                  <span className="flex items-center gap-1"><FiClock size={14} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <Link to={`/blogs/${blog.slug}`}>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#E85D04] transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-4">
                  {blog.excerpt || blog.content?.substring(0, 100) + '...'}
                </p>
                <Link to={`/blogs/${blog.slug}`} className="text-[#E85D04] font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Read More <FiArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;
