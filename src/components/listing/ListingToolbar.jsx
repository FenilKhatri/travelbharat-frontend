import { forwardRef, memo } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import SearchAndFilter from "../ui/SearchAndFilter";

const ListingToolbar = forwardRef(({
  searchPlaceholder,
  filters,  
  sortOptions,
  totalResults,
  isLoading,
  activeBadge,
  onClearBadge
}, ref) => {
  return (
    <div ref={ref} className="relative z-40 px-4 md:px-8 xl:px-12 max-w-[1600px] mx-auto scroll-mt-24">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 bg-glass-bg backdrop-blur-xl border border-glass-border p-6 rounded-[24px] shadow-2xl">
        <div className="flex-1">
          <SearchAndFilter
            searchPlaceholder={searchPlaceholder}
            filters={filters}
            sortOptions={sortOptions}
            className="mb-0!"
          />
        </div>
        
        <div className="hidden lg:flex items-center gap-3 px-6 py-4 bg-surface-elevated rounded-xl border border-border-theme whitespace-nowrap shadow-xs">
          <FaMapMarkedAlt className="text-accent" size={20} />
          <div>
            <p className="text-xs text-muted font-bold uppercase tracking-wider">Results Found</p>
            <p className="text-xl font-black text-primary">
              {isLoading ? "..." : totalResults} <span className="text-sm font-medium text-secondary">Destinations</span>
            </p>
          </div>
        </div>
      </div>

      {activeBadge && (
        <div className="mb-8 flex items-center gap-3 animate-fadeIn">
           <span className="text-muted text-sm font-medium">Filtered by collection:</span>
           <span className="px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-black uppercase tracking-wider flex items-center gap-2">
             {activeBadge}
             <button onClick={onClearBadge} className="hover:text-primary transition-colors">
               <FiChevronDown className="rotate-180" />
             </button>
           </span>
        </div>
      )}
    </div>
  );
});

ListingToolbar.displayName = "ListingToolbar";

export default memo(ListingToolbar);
