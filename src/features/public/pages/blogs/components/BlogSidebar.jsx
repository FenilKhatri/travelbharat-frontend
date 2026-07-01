import { Link } from "react-router-dom";
import { FiTrendingUp, FiEye, FiClock, FiTag, FiMail } from "react-icons/fi";
import { formatDate, categories } from "../hooks/useBlogsData";

const BlogSidebar = ({ popularBlogsList, recentBlogs, popularTags, selectedCategory, setSelectedCategory }) => {
  return (
    <aside className="lg:col-span-4 space-y-8">

      {/* Popular Blogs */}
      <div className="glass rounded-3xl p-6">
        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2 mb-6">
          <FiTrendingUp className="text-[#E85D04]" /> Popular Blogs
        </h3>
        <div className="space-y-5">
          {popularBlogsList.slice(0, 5).map((blog, i) => (
            <Link key={blog._id} to={`/blogs/${blog.slug}`} className="flex gap-4 group">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative ring-1 ring-slate-200 dark:ring-slate-700">
                <img
                  src={blog.images?.thumbnail || blog.images?.hero}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-1 left-1 w-5 h-5 bg-[#E85D04] text-white text-[10px] font-black flex items-center justify-center rounded-full">
                  {i + 1}
                </span>
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#E85D04] transition-colors leading-snug mb-1">
                  {blog.title}
                </h4>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <FiEye size={12} /> {blog.views || blog.viewCount || 0} views
                </span>
              </div>
            </Link>
          ))}
          {popularBlogsList.length === 0 && <p className="text-slate-400 text-sm">No popular posts yet.</p>}
        </div>
      </div>

      {/* Recent Blogs */}
      <div className="glass rounded-3xl p-6">
        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2 mb-6">
          <FiClock className="text-[#E85D04]" /> Recent Blogs
        </h3>
        <div className="space-y-4">
          {recentBlogs.slice(0, 5).map((blog) => (
            <Link key={blog._id} to={`/blogs/${blog.slug}`} className="block group py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#E85D04] transition-colors mb-1">
                {blog.title}
              </h4>
              <span className="text-xs text-slate-500">{formatDate(blog.publishedAt || blog.createdAt)}</span>
            </Link>
          ))}
          {recentBlogs.length === 0 && <p className="text-slate-400 text-sm">No recent posts yet.</p>}
        </div>
      </div>

      {/* Categories */}
      <div className="glass rounded-3xl p-6">
        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2 mb-6">
          <FiTag className="text-[#E85D04]" /> Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedCategory === cat ? "bg-[#E85D04] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#E85D04]/10 hover:text-[#E85D04]"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      {popularTags.length > 0 && (
        <div className="glass rounded-3xl p-6">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm mb-6">
            Trending Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.slice(0, 12).map((tag) => (
              <span
                key={tag._id}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                #{tag._id} ({tag.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div className="rounded-3xl p-8 bg-linear-to-br from-[#E85D04] to-[#C04D02] text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <FiMail size={100} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2">Travel Inspiration Weekly</h3>
          <p className="text-white/80 text-sm mb-5">Stories and guides delivered to your inbox.</p>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition text-sm" />
            <button className="w-full py-3 bg-white text-[#E85D04] font-bold rounded-xl hover:bg-slate-50 transition text-sm">Subscribe</button>
          </form>
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;
