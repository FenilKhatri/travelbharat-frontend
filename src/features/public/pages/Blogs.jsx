import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  FiSearch, FiClock, FiCalendar, FiHeart, FiEye,
  FiTrendingUp, FiMessageCircle, FiMail, FiBookOpen, FiArrowRight, FiTag
} from "react-icons/fi";
import { blogService } from "../../../services/blogService";
import { motion } from "framer-motion";
import CardSkeleton from "../../../components/ui/CardSkeleton";

const categories = [
  "Travel Guide", "Destinations", "Culture", "Festivals", "Food",
  "Adventure", "Wildlife", "Heritage", "Photography"
];

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ["allBlogs", selectedCategory],
    queryFn: () => blogService.getAllBlogs({
      category: selectedCategory ? selectedCategory.toLowerCase().replace(/ /g, "-") : undefined,
    }),
  });

  const { data: popularBlogsData } = useQuery({
    queryKey: ["popularBlogs"],
    queryFn: () => blogService.getPopularBlogs(),
  });

  const { data: tagsData } = useQuery({
    queryKey: ["blogTags"],
    queryFn: () => blogService.getBlogTags(),
  });

  const blogs = blogsData?.data?.data?.blogs || blogsData?.data?.blogs || [];
  const popularBlogsList = popularBlogsData?.data?.data?.blogs || popularBlogsData?.data?.blogs || [];
  const popularTags = tagsData?.data?.data?.tags || tagsData?.data?.tags || [];

  const filteredBlogs = useMemo(
    () => blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [blogs, searchTerm]
  );

  const featuredBlog = filteredBlogs[0];
  const gridBlogs = filteredBlogs.slice(1);
  const recentBlogs = filteredBlogs.slice(0, 5);
  const hasFilters = searchTerm || selectedCategory;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] pb-24 pt-24 font-sans text-slate-800 dark:text-slate-200">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0E1E36] to-[#162544]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#E85D04]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-2 py-1.5 px-4 bg-[#E85D04]/15 text-[#E85D04] rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-[#E85D04]/20">
              <FiBookOpen size={14} /> Travel Journal
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Travel Stories, Guides & Inspiration
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed mb-10">
              Curated stories, destination guides, and cultural insights from every corner of Incredible India.
            </p>

            <div className="relative max-w-xl">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search stories, guides, destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/15 focus:outline-none focus:ring-2 focus:ring-[#E85D04] text-white placeholder-slate-400 backdrop-blur-md transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="max-w-[1600px] w-full mx-auto px-4 -mt-6 relative z-20 mb-12">
        <div className="glass rounded-2xl p-3 overflow-x-auto">
          <div className="flex flex-nowrap md:flex-wrap items-center gap-2 min-w-max md:min-w-0">
            <button
              onClick={() => setSelectedCategory("")}
              className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedCategory === "" ? "bg-[#E85D04] text-white shadow-lg shadow-[#E85D04]/25" : "text-slate-600 dark:text-slate-400 hover:text-[#E85D04] hover:bg-[#E85D04]/5"}`}
            >
              All Stories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedCategory === cat ? "bg-[#E85D04] text-white shadow-lg shadow-[#E85D04]/25" : "text-slate-600 dark:text-slate-400 hover:text-[#E85D04] hover:bg-[#E85D04]/5"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog Banner */}
      {!isLoading && featuredBlog && !hasFilters && (
        <section className="max-w-[1600px] w-full mx-auto px-4 mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#E85D04] animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#E85D04]">Featured Story</h2>
          </div>
          <Link to={`/blogs/${featuredBlog.slug}`} className="group block relative rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
            <div className="relative h-[420px] md:h-[520px]">
              <img
                src={featuredBlog.images?.hero || featuredBlog.images?.thumbnail}
                alt={featuredBlog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl">
                <span className="inline-block px-3 py-1 bg-[#E85D04] text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                  {featuredBlog.category?.replace(/-/g, " ")}
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 group-hover:text-[#E85D04] transition-colors">
                  {featuredBlog.title}
                </h2>
                <p className="text-slate-300 text-base md:text-lg line-clamp-2 mb-6">{featuredBlog.excerpt}</p>
                <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm font-medium">
                  <span className="flex items-center gap-2">
                    {featuredBlog.author?.profileImage ? (
                      <img src={featuredBlog.author.profileImage} alt="" className="w-8 h-8 rounded-full border-2 border-white/20" />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                        {featuredBlog.author?.name?.charAt(0) || "T"}
                      </span>
                    )}
                    {featuredBlog.author?.name || "TravelBharat"}
                  </span>
                  <span className="flex items-center gap-1.5"><FiCalendar size={14} /> {formatDate(featuredBlog.publishedAt || featuredBlog.createdAt)}</span>
                  <span className="flex items-center gap-1.5"><FiClock size={14} /> {featuredBlog.readTime || 5} min read</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Main Layout */}
      <section className="max-w-[1600px] w-full mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Blog Grid */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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

        {/* Sidebar */}
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
          <div className="rounded-3xl p-8 bg-gradient-to-br from-[#E85D04] to-[#C04D02] text-white relative overflow-hidden shadow-xl">
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
      </section>
    </div>
  );
};

export default Blogs;
