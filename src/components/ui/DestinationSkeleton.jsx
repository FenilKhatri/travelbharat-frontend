const DestinationSkeleton = ({ count = 6, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0A121F] animate-pulse flex flex-col"
        >
          <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 relative">
            <div className="absolute top-4 left-4 w-20 h-6 rounded-full bg-slate-300/80 dark:bg-slate-700/80" />
            <div className="absolute top-4 right-4 w-14 h-6 rounded-full bg-slate-300/80 dark:bg-slate-700/80" />
          </div>
          <div className="p-6 flex flex-col flex-1 space-y-3">
            <div className="h-6 w-4/5 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-11 w-full rounded-xl bg-slate-200 dark:bg-slate-800 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DestinationSkeleton;
