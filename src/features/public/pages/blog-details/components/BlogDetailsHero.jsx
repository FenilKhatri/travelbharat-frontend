import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiClock, FiCalendar, FiRefreshCw } from "react-icons/fi";
import PageContainer from "../../../../../components/layout/PageContainer";

const BlogDetailsHero = ({ blog }) => {
  const imageUrl =
    blog.images?.hero || blog.images?.thumbnail || blog.coverImage?.url;

  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] lg:h-[85vh] min-h-[500px] max-h-[900px] bg-slate-900 flex flex-col justify-end">
      {/* Background with graceful fallback */}
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-[#1A0B02]" />
      )}

      {/* Premium Gradient Overlays */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-linear-to-t from-[#050B14] via-[#050B14]/60 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-[#050B14]/80 via-transparent to-transparent hidden md:block" />

      <PageContainer className="relative z-10 pb-6 md:pb-8 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {/* Top Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {blog.category && (
              <span className="bg-[#E85D04] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] shadow-lg">
                {blog.category.replace(/-/g, " ")}
              </span>
            )}
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-semibold">
              <FiClock size={14} />
              {blog.readTime || "5"} min Read
            </span>
          </div>

          {/* Title & Excerpt */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight text-balance">
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="text-lg md:text-xl md:leading-relaxed text-slate-300 mb-10 max-w-3xl text-balance">
              {blog.excerpt}
            </p>
          )}

          {/* Bottom Metadata Bar */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10 pt-6 border-t border-white/10">
            {/* Author */}
            <div className="flex items-center gap-4">
              {blog.author?.profileImage ? (
                <img
                  src={blog.author.profileImage}
                  alt={blog.author.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white border-2 border-white/20 font-bold text-lg">
                  {blog.author?.name?.charAt(0) || "T"}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-white font-bold">
                  {blog.author?.name || "TravelBharat Editor"}
                </span>
                <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                  Author
                </span>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-white/10" />

            {/* Dates */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300">
                  <FiCalendar size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold">
                    {new Date(
                      blog.publishedAt || blog.createdAt,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                    Published
                  </span>
                </div>
              </div>

              {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300">
                    <FiRefreshCw size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold">
                      {new Date(blog.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                      Updated
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
};

export default BlogDetailsHero;
