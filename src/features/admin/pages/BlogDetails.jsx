import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiClock, FiEye, FiTag, FiImage } from "react-icons/fi";
import http from "../../../lib/axios";
import AdminPageLayout from "../components/ui/AdminPageLayout";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminBlogDetails", id],
    queryFn: () => http.get(`/blogs/admin/${id}`),
  });

  const blog = data?.data?.blog || data?.data;

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading blog details...</div>;
  if (isError || !blog) return <div className="p-8 text-center text-red-500">Error loading blog.</div>;

  const actions = (
    <>
      <button
        onClick={() => navigate("/admin/blogs")}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
      >
        <FiArrowLeft size={16} /> Back
      </button>
      <button
        onClick={() => navigate(`/admin/blogs/edit/${id}`)}
        className="flex items-center gap-2 px-5 py-2 bg-[#E85D04] text-white font-bold rounded-xl text-sm hover:bg-[#D05203] transition cursor-pointer"
      >
        <FiEdit2 size={16} /> Edit Blog
      </button>
    </>
  );

  return (
    <AdminPageLayout
      title={blog.title}
      subtitle={`Detailed view and management for this blog post`}
      actions={actions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-3xl overflow-hidden shadow-sm">
            <div className="aspect-4/3 bg-slate-100 dark:bg-slate-800 relative">
              {blog.images?.hero || blog.images?.thumbnail ? (
                <img
                  src={(blog.images.hero?.url || blog.images.hero) || (blog.images.thumbnail?.url || blog.images.thumbnail)}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <FiImage size={48} className="mb-2" />
                  <span className="text-sm font-semibold">No Image Available</span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black shadow-lg ${blog.isPublished ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                  {blog.isPublished ? "PUBLISHED" : "DRAFT"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0A121F] p-6 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Quick Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiTag size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Category</p>
                  <p className="font-bold capitalize">{blog.category?.replace(/-/g, " ")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiEye size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Views</p>
                  <p className="font-bold">{blog.views || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiClock size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Read Time</p>
                  <p className="font-bold">{blog.readTime || 1} mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0A121F] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl shadow-sm">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Blog Content</h2>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Excerpt</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {blog.excerpt || "No excerpt provided."}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Full Content</h4>
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60"
                  dangerouslySetInnerHTML={{ __html: blog.content || "No content available." }}
                />
              </div>
            </div>
          </div>
          
          {blog.tags && blog.tags.length > 0 && (
            <div className="bg-white dark:bg-[#0A121F] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl shadow-sm">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default BlogDetails;
