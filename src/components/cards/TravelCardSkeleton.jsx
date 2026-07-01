const TravelCardSkeleton = () => {
  return (
    <div className="h-full rounded-3xl overflow-hidden border border-border-glass bg-surface-elevated flex flex-col">
      <div className="relative h-56 sm:h-64 bg-slate-200/50 dark:bg-slate-800 animate-pulse overflow-hidden shrink-0">
        {/* Placeholder for badges */}
        <div className="absolute top-4 left-4 w-24 h-6 rounded-full bg-slate-300 dark:bg-slate-700" />
        <div className="absolute top-4 right-4 w-12 h-6 rounded-full bg-slate-300 dark:bg-slate-700" />
      </div>
      <div className="p-6 flex flex-col flex-1 bg-surface-elevated">
        <div className="w-3/4 h-6 bg-slate-300 dark:bg-slate-700 rounded-lg animate-pulse mb-4" />
        <div className="w-full h-3 bg-slate-300 dark:bg-slate-700 rounded-lg animate-pulse mb-2" />
        <div className="w-2/3 h-3 bg-slate-300 dark:bg-slate-700 rounded-lg animate-pulse mb-2" />
        <div className="w-1/2 h-3 bg-slate-300 dark:bg-slate-700 rounded-lg animate-pulse" />
      </div>
    </div>
  );
};

export default TravelCardSkeleton;
