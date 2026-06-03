const CardSkeleton = ({ count = 1, columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", className = "" }) => {
  return (
    <div className={`grid ${columns} gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0A121F] animate-pulse"
        >
          <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 relative">
            <div className="absolute top-4 left-4 w-16 h-6 rounded-full bg-slate-300/80 dark:bg-slate-700/80" />
          </div>
          <div className="p-6 space-y-3">
            <div className="h-5 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-800 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
