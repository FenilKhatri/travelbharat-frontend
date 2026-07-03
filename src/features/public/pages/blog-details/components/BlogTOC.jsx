const BlogTOC = ({ headings, activeHeading, setActiveHeading }) => {
  if (!headings || headings.length === 0) return null;

  return (
    <div className="bg-transparent">
      <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6">On this page</h3>
      <ul className="space-y-4 border-l border-slate-200 dark:border-slate-800">
        {headings.map((h, idx) => (
          <li key={h.id} className="relative">
            {/* Active Indicator */}
            {activeHeading === h.id && (
              <span className="absolute -left-px top-0 bottom-0 w-[2px] bg-[#E85D04] rounded-full transition-all duration-300" />
            )}
            
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
              className={`block pl-5 py-1 text-sm transition-colors duration-300 ${
                activeHeading === h.id 
                  ? 'text-slate-900 dark:text-white font-bold' 
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {h.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogTOC;
