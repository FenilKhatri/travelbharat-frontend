import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiClock, FiHeart, FiEye, FiBookmark, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import PageLoader from "../../../components/ui/PageLoader";
import Checkbox from "../../../components/ui/Checkbox";
import http from "../../../lib/axios";

const SavedBlogs = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['savedBlogs'],
    queryFn: () => http.get("/blogs/user/saved")
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Since http.get returns { success, message, data }, data is { blogs: [...] }
  const blogs = (data?.blogs || data?.data?.blogs || data?.data?.data?.blogs || []).filter(Boolean);

  const toggleSelectAll = () => {
    if (selectedIds.length === blogs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(blogs.map(b => b._id));
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleBulkUnsave = async () => {
    if (selectedIds.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to remove ${selectedIds.length} items from your saved list?`)) return;

    setIsProcessingBulk(true);
    
    const results = await Promise.allSettled(
      selectedIds.map(id => http.post("/saved-items/toggle", { itemId: id, itemType: "Blog" }))
    );
    
    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
      toast.error(`Failed to remove ${failed.length} items`);
    } else {
      toast.success(`Successfully removed ${selectedIds.length} items`);
    }
    
    setSelectedIds([]);
    setIsProcessingBulk(false);
    queryClient.invalidateQueries(['savedBlogs']);
    queryClient.invalidateQueries(['userProfile']);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] pb-24 pt-24 font-sans text-slate-800 dark:text-slate-200">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <FiBookmark className="text-[#E85D04]" size={32} />
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">
              Saved Articles
            </h1>
          </div>
          {blogs.length > 0 && (
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <Checkbox 
                checked={selectedIds.length === blogs.length && blogs.length > 0} 
                onChange={toggleSelectAll} 
              />
              Select All
            </label>
          )}
        </div>

        {isLoading ? (
          <PageLoader fullScreen={false} message="Loading saved blogs..." size="md" />
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group flex flex-col relative">
                <div className="absolute top-4 left-4 z-20">
                  <Checkbox 
                    checked={selectedIds.includes(blog._id)} 
                    onChange={(e) => { e.stopPropagation(); toggleSelection(blog._id); }} 
                  />
                </div>
                <Link to={`/blogs/${blog.slug}`} className="block relative w-full pt-[60%] overflow-hidden">
                  <img 
                    src={blog.images?.thumbnail || "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80"} 
                    alt={blog.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
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

      {/* Floating Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-white dark:bg-[#0c1018] backdrop-blur-xl rounded-full shadow-2xl border border-slate-200 dark:border-slate-800 p-2 flex items-center gap-4">
            <span className="pl-4 font-bold text-slate-700 dark:text-slate-200 text-sm">
              {selectedIds.length} selected
            </span>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
            <button
              onClick={handleBulkUnsave}
              disabled={isProcessingBulk}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiTrash2 />
              <span>Unsave</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="pr-4 pl-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold text-sm cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedBlogs;
