import { Link } from "react-router-dom";
import { FiCalendar, FiClock } from "react-icons/fi";
import { formatDate } from "../hooks/useBlogsData";

const FeaturedBlog = ({ featuredBlog, isLoading, hasFilters }) => {
  if (isLoading || !featuredBlog || hasFilters) return null;

  return (
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
          <div className="absolute inset-0 bg-linear-to-t from-[#050B14] via-[#050B14]/50 to-transparent" />
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
  );
};

export default FeaturedBlog;
