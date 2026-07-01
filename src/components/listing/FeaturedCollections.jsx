import { memo } from "react";
import CollectionCard from "../ui/CollectionCard";

const FeaturedCollections = ({
  collections,
  badgeConfig,
  onCollectionClick,
}) => {
  if (!collections || collections.length === 0) return null;

  // Duplicate the collections multiple times to ensure the marquee has enough content to loop seamlessly
  // (We create 8 copies total. The animation translates -50%, which equals exactly 4 copies).
  const marqueeItems = Array(8).fill(collections).flat();

  return (
    <div className="relative z-20 -mt-10 px-4 md:px-8 xl:px-12 max-w-[1600px] mx-auto mb-20 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-primary tracking-tight">
          Featured Collections
        </h2>
        <div className="h-px flex-1 bg-linear-to-r from-border-theme to-transparent ml-6 hidden sm:block" />
      </div>

      <div className="relative w-full overflow-hidden pb-8 group">
        <div 
          className="flex w-max gap-6 hover:[animation-play-state:paused]"
          style={{ animation: "marquee 60s linear infinite" }}
        >
          {marqueeItems.map((collection, idx) => (
            <div key={`${collection.badgeName}-${idx}`} className="shrink-0">
              <CollectionCard
                title={collection.title}
                subtitle={collection.subtitle}
                image={collection.image}
                badgeConfig={badgeConfig?.[collection.badgeName]}
                onClick={() => onCollectionClick(collection.badgeName)}
              />
            </div>
          ))}
        </div>
        
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 12px)); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default memo(FeaturedCollections);
