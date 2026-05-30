import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiSearch, FiClock, FiCalendar, FiLoader, FiHeart, FiEye, FiTrendingUp, FiMessageCircle, FiMail } from "react-icons/fi";
import { blogService } from "../../../services/blogService";
import { motion } from "framer-motion";

const categories = [
  "Travel Guide", "Destinations", "Culture", "Festivals", "Food", 
  "Adventure", "Wildlife", "Heritage", "Photography"
];

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ['allBlogs', selectedCategory],
    queryFn: () => blogService.getAllBlogs({
      category: selectedCategory ? selectedCategory.toLowerCase().replace(/ /g, "-") : undefined,
    })
  });

  const { data: popularBlogsData } = useQuery({
    queryKey: ['popularBlogs'],
    queryFn: () => blogService.getPopularBlogs()
  });

  const { data: tagsData } = useQuery({
    queryKey: ['blogTags'],
    queryFn: () => blogService.getBlogTags()
  });

  const blogs = blogsData?.data?.data?.blogs || blogsData?.data?.blogs || [];
  const popularBlogsList = popularBlogsData?.data?.data?.blogs || popularBlogsData?.data?.blogs || [];
  const popularTags = tagsData?.data?.data?.tags || tagsData?.data?.tags || [];
  
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const featuredBlogs = filteredBlogs.slice(0, 3);
  const latestBlogs = filteredBlogs.slice(3);

  // Skeleton Loader for Blogs
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
      <div className="w-full pt-[60%] bg-slate-200 dark:bg-slate-800 relative">
        <div className="absolute top-4 left-4 w-20 h-6 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
      </div>
      <div className="p-6">
        <div className="w-full h-6 bg-slate-200 dark:bg-slate-800 rounded mb-3"></div>
        <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
        <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-2 items-center">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] pb-24 pt-24 font-sans text-slate-800 dark:text-slate-200">
      
      {/* HERO SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <span className="inline-block py-1.5 px-4 bg-[#E85D04]/10 text-[#E85D04] rounded-full text-xs font-bold tracking-widest uppercase">
            Travel Stories & Guides
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight">
            Discover Incredible Stories <br className="hidden md:block" /> Across India
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Explore travel guides, cultural stories, festivals, hidden gems, food journeys, and destination insights from every corner of India.
          </p>
          
          <div className="relative max-w-xl mx-auto mt-8">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search destinations, festivals, guides..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E85D04] text-slate-900 dark:text-white shadow-xl backdrop-blur-sm transition-all"
            />
          </div>
        </motion.div>
      </section>

      {/* TRENDING CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 mb-16 overflow-x-auto pb-4">
        <div className="flex flex-nowrap md:flex-wrap items-center md:justify-center gap-3">
          <button 
            onClick={() => setSelectedCategory("")}
            className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${selectedCategory === "" ? "bg-[#E85D04] text-white shadow-[#E85D04]/30" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-[#E85D04]/50 hover:text-[#E85D04]"}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${selectedCategory === cat ? "bg-[#E85D04] text-white shadow-[#E85D04]/30" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-[#E85D04]/50 hover:text-[#E85D04]"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED BLOGS */}
      {featuredBlogs.length > 0 && !searchTerm && !isLoading && (
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Featured */}
            <div className="lg:col-span-8 group">
              <Link to={`/blogs/${featuredBlogs[0].slug}`} className="block relative w-full h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={featuredBlogs[0].images?.hero || featuredBlogs[0].images?.thumbnail || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80"} 
                  alt={featuredBlogs[0].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                  <span className="inline-block px-3 py-1 bg-[#E85D04] text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                    {featuredBlogs[0].category?.replace(/-/g, " ")}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 group-hover:text-[#E85D04] transition-colors">
                    {featuredBlogs[0].title}
                  </h2>
                  <p className="text-slate-300 text-base md:text-lg mb-6 line-clamp-2 max-w-3xl">
                    {featuredBlogs[0].excerpt}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {featuredBlogs[0].author?.profileImage ? (
                        <img src={featuredBlogs[0].author.profileImage} alt={featuredBlogs[0].author.name} className="w-8 h-8 rounded-full border-2 border-white/20" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white border-2 border-white/20">
                          {featuredBlogs[0].author?.name?.charAt(0) || 'A'}
                        </div>
                      )}
                      <span>{featuredBlogs[0].author?.name || 'TravelBharat'}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-slate-500 hidden md:block" />
                    <span className="flex items-center gap-1.5"><FiCalendar /> {new Date(featuredBlogs[0].publishedAt || featuredBlogs[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-500 hidden md:block" />
                    <span className="flex items-center gap-1.5"><FiClock /> {featuredBlogs[0].readTime || '5'} min read</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Smaller Featured */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {featuredBlogs.slice(1, 3).map(blog => (
                <Link key={blog._id} to={`/blogs/${blog.slug}`} className="block relative w-full h-[288px] rounded-3xl overflow-hidden shadow-xl group">
                  <img 
                    src={blog.images?.thumbnail || blog.images?.hero || "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80"} 
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/60 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                      {blog.category?.replace(/-/g, " ")}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight mb-3 group-hover:text-[#E85D04] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-3 text-slate-300 text-xs font-medium">
                      <span>{blog.author?.name || 'TravelBharat'}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-500" />
                      <span className="flex items-center gap-1.5"><FiClock /> {blog.readTime || '5'} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* MAIN LAYOUT */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LATEST BLOGS */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiClock className="text-[#E85D04]" /> Latest Articles
            </h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : latestBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestBlogs.map((blog, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={blog._id} 
                  className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group flex flex-col"
                >
                  <Link to={`/blogs/${blog.slug}`} className="block relative w-full pt-[60%] overflow-hidden">
                    <img 
                      src={blog.images?.thumbnail || blog.images?.hero || "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80"} 
                      alt={blog.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-white text-xs font-bold rounded-full shadow-sm">
                        {blog.category?.replace(/-/g, " ")}
                      </span>
                    </div>
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <Link to={`/blogs/${blog.slug}`}>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#E85D04] transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6">
                        {blog.excerpt}
                      </p>
                    </Link>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium gap-2">
                      <div className="flex items-center gap-2">
                        {blog.author?.profileImage ? (
                          <img src={blog.author.profileImage} alt={blog.author.name} className="w-6 h-6 rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                            {blog.author?.name?.charAt(0) || 'A'}
                          </div>
                        )}
                        <span>{blog.author?.name || 'TravelBharat'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiClock /> {blog.readTime || '5'} min read
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><FiEye /> {blog.views || blog.viewCount || 0}</span>
                        <span className="flex items-center gap-1"><FiHeart /> {blog.likes || blog.likeCount || 0}</span>
                        <span className="flex items-center gap-1"><FiMessageCircle /> {blog.commentCount || 0}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <FiSearch className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 text-lg font-semibold">No articles found matching your criteria.</p>
              <button onClick={() => {setSearchTerm(""); setSelectedCategory("");}} className="mt-4 px-6 py-2 bg-[#E85D04]/10 text-[#E85D04] font-bold rounded-full hover:bg-[#E85D04]/20 transition">Clear Filters</button>
            </div>
          )}

        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4 space-y-8">

          {/* Popular Posts Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2">
                <FiTrendingUp className="text-[#E85D04]" /> Popular Now
              </h3>
            </div>
            
            <div className="space-y-6">
              {popularBlogsList.map((blog, i) => (
                <Link key={blog._id} to={`/blogs/${blog.slug}`} className="flex gap-4 group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                    <img 
                      src={blog.images?.thumbnail || blog.images?.hero || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80"} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-1 left-1 w-5 h-5 bg-[#E85D04] text-white text-[10px] font-bold flex items-center justify-center rounded-full z-10 shadow">
                      {i + 1}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#E85D04] transition-colors mb-2 leading-snug">
                      {blog.title}
                    </h4>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <FiEye size={12}/> {blog.views || 0} views <span className="mx-1">•</span> {blog.readTime || 5} min read
                    </span>
                  </div>
                </Link>
              ))}
              {popularBlogsList.length === 0 && <p className="text-slate-400 text-sm">No popular posts yet.</p>}
            </div>
          </div>

          {/* Popular Tags Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E85D04]" /> Trending Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.slice(0, 15).map(tag => (
                <Link 
                  key={tag._id} 
                  to={`/blogs?search=${tag._id}`}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-[#E85D04] hover:text-white transition-colors uppercase tracking-wider"
                >
                  #{tag._id} ({tag.count})
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="bg-gradient-to-br from-[#E85D04] to-[#C04D02] rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <FiMail size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2">Join Our Newsletter</h3>
              <p className="text-white/80 text-sm mb-6">Get the latest travel stories, guides, and tips delivered straight to your inbox.</p>
              <form className="space-y-3" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Your email address" className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition" />
                <button className="w-full py-3 bg-white text-[#E85D04] font-bold rounded-xl hover:bg-slate-50 transition shadow-md">Subscribe Now</button>
              </form>
            </div>
          </div>
          
        </aside>
      </section>

    </div>
  );
};

export default Blogs;
