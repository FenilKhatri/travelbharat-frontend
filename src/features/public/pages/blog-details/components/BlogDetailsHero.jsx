import { Link } from "react-router-dom";
import { FiArrowLeft, FiUser, FiCalendar, FiEye, FiHeart } from "react-icons/fi";
const BlogDetailsHero = ({ blog, likeMutation }) => {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] min-h-[500px]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${blog.images?.hero || blog.images?.thumbnail || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=2000"}')` }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#050B14] via-[#050B14]/70 to-[#050B14]/20" />
      <div className="absolute bottom-0 left-0 right-0 max-w-[1600px] w-full mx-auto px-4 pb-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <Link to="/blogs" className="inline-flex items-center gap-2 py-2 px-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 mb-8 transition font-medium text-sm">
            <FiArrowLeft size={16} /> Back to Articles
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-[#E85D04] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#E85D04]/30">
              {blog.category?.replace(/-/g, " ")}
            </span>
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-semibold">
              {blog.readTime || '5'} min Read
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium">
            <div className="flex items-center gap-3">
              {blog.author?.profileImage ? (
                <img src={blog.author.profileImage} alt={blog.author.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white border-2 border-slate-700">
                  <FiUser size={20} />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-white font-bold text-base">{blog.author?.name || "TravelBharat Editor"}</span>
                <span className="text-xs text-slate-400">Author & Explorer</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <FiCalendar className="text-[#E85D04] text-lg" />
              <div className="flex flex-col">
                <span className="text-white font-bold">{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="text-xs text-slate-400">Published Date</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-5">
              <div className="flex flex-col items-center">
                <span className="text-white font-bold flex items-center gap-1.5"><FiEye className="text-[#E85D04]" /> {blog.views || blog.viewCount || 0}</span>
                <span className="text-xs text-slate-400">Views</span>
              </div>
              <button
                onClick={() => likeMutation.mutate()}
                className="flex flex-col items-center hover:opacity-80 transition cursor-pointer"
                disabled={likeMutation.isPending}
              >
                <span className="text-white font-bold flex items-center gap-1.5"><FiHeart className="text-[#E85D04]" /> {blog.likes || blog.likeCount || 0}</span>
                <span className="text-xs text-slate-400">Likes</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default BlogDetailsHero;