import { FiBookOpen, FiSearch } from "react-icons/fi";
const BlogHero = ({ searchTerm, setSearchTerm }) => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-[#0A1628] via-[#0E1E36] to-[#162544]" />
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
  );
};
export default BlogHero;