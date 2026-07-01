import { memo } from "react";
import { FiAlertCircle, FiChevronDown, FiLoader } from "react-icons/fi";
import TravelCardSkeleton from "../cards/TravelCardSkeleton";

const ListingGrid = ({
  items,
  isLoading,
  isError,
  error,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  CardComponent,
  cardType,
  emptyMessage = "No destinations found"
}) => {
  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-2xl mx-auto mb-20">
        <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-red-500 mb-2">Failed to load destinations</h3>
        <p className="text-slate-400">{error?.message || "An unexpected error occurred."}</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 xl:px-12 max-w-[1600px] mx-auto mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {isLoading ? (
          [...Array(12)].map((_, i) => <TravelCardSkeleton key={i} />)
        ) : items.length === 0 ? (
          <div className="col-span-full py-24 text-center border border-border-glass rounded-[32px] bg-glass-bg backdrop-blur-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-elevated mb-6 border border-border-theme">
              <FiAlertCircle className="text-muted" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">{emptyMessage}</h3>
            <p className="text-muted max-w-md mx-auto">
              Try adjusting your filters or search terms to discover incredible places.
            </p>
          </div>
        ) : (
          items.map((item, index) => (
            <CardComponent
              key={item._id}
              data={item}
              type={cardType}
              index={index % 12}
            />
          ))
        )}

        {/* Skeleton loading when fetching next page */}
        {isFetchingNextPage && (
          [...Array(4)].map((_, i) => <TravelCardSkeleton key={`skeleton-${i}`} />)
        )}
      </div>

      {/* PROGRESSIVE "LOAD MORE" */}
      {!isLoading && hasNextPage && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="group relative inline-flex items-center justify-center px-10 py-5 font-black text-primary uppercase tracking-[0.15em] text-sm overflow-hidden rounded-[20px] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
          >
            <div className="absolute inset-0 bg-accent/10 border border-accent/30 rounded-[20px] group-hover:bg-accent/20 transition-all duration-300" />
            <div className="absolute inset-0 bg-linear-to-r from-accent/0 via-accent/20 to-accent/0 -translate-x-full group-hover:animate-shimmer" />

            <span className="relative z-10 flex items-center gap-3">
              {isFetchingNextPage ? (
                <>
                  <FiLoader className="animate-spin" size={20} />
                  Loading...
                </>
              ) : (
                <>
                  Explore More Regions
                  <FiChevronDown className="group-hover:translate-y-1 transition-transform" size={18} />
                </>
              )}
            </span>
          </button>
        </div>
      )}

      {/* End of list message */}
      {!isLoading && !hasNextPage && items.length > 0 && (
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-surface border border-border-theme shadow-sm">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <p className="text-muted font-bold text-xs uppercase tracking-widest">You've reached the end of the list</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ListingGrid);
