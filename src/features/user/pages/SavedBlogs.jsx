import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiClock, FiHeart, FiEye, FiBookmark } from "react-icons/fi";
import PageLoader from "../../../components/ui/PageLoader";
import http from "../../../lib/axios";

const SavedBlogs = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['savedBlogs'],
    queryFn: () => http.get("/blogs/user/saved")
  });

  // Since http.get returns { success, message, data }, data is { blogs: [...] }
  const blogs = (data?.blogs || data?.data?.blogs || data?.data?.data?.blogs || []).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] pb-24 pt-24 font-sans text-slate-800 dark:text-slate-200">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        
        <div className="flex items-center gap-3 mb-10">
          <FiBookmark className="text-[#E85D04]" size={32} />
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">
            Saved Articles
          </h1>
        </div>

        {isLoading ? (
          <PageLoader fullScreen={false} message="Loading saved blogs..." size="md" />
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group flex flex-col">
                <Link to={`/blogs/${blog.slug}`} className="block relative w-full pt-[60%] overflow-hidden">
                  <img 
                    src={blog.images?.thumbnail || "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80"} 
                    alt={blog.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-white text-xs font-bold rounded-full shadow-sm uppercase tracking-wider">
                      {blog.category?.replace(/-/g, " ")}
                    </span>
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <Link to={`/blogs/${blog.slug}`}>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#E85D04] transition-colors">
                      {blog.title}
                    </h3>
                  </Link>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-medium">
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
                    
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><FiEye /> {blog.views || blog.viewCount || 0}</span>
                      <span className="flex items-center gap-1"><FiHeart /> {blog.likes || blog.likeCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <FiBookmark className="mx-auto text-slate-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Saved Articles</h3>
            <p className="text-slate-500 mb-6">You haven't saved any articles yet. Explore our travel guides to find inspiration.</p>
            <Link to="/blogs" className="px-6 py-3 bg-[#E85D04] text-white font-bold rounded-xl hover:bg-[#D05203] transition-colors">
              Explore Blogs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedBlogs;