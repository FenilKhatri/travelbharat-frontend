import { categories } from "../hooks/useBlogsData";

const BlogFilters = ({ selectedCategory, setSelectedCategory }) => {
  return (
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
  );
};

export default BlogFilters;
