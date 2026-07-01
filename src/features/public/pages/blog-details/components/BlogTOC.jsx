const BlogTOC = ({ headings, activeHeading, setActiveHeading }) => {
  return (
    <aside className="lg:col-span-4 space-y-10">
      <div className="sticky top-28 space-y-10">
        {/* Table of Contents */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-black text-xl text-slate-900 dark:text-white mb-6">In this article</h3>
          <ul className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
            {headings.map(h => (
              <li key={h.id} className="relative pl-8">
                <span className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 bg-white dark:bg-slate-900 ${activeHeading === h.id ? 'border-[#E85D04]' : 'border-slate-200 dark:border-slate-700'}`} />
                <a
                  href={`#${h.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveHeading(h.id);
                    const element = document.getElementById(h.id);
                    if (element) {
                      const y = element.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  className={`text-sm font-semibold transition-colors block ${activeHeading === h.id ? 'text-[#E85D04]' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  {h.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default BlogTOC;
