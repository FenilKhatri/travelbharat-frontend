import { memo } from "react";
import CollectionCard from "../ui/CollectionCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const FeaturedCollections = ({ collections, badgeConfig, onCollectionClick }) => {
  if (!collections || collections.length === 0) return null;

  return (
    <div className="relative z-20 -mt-10 px-4 md:px-8 xl:px-12 max-w-[1600px] mx-auto mb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-primary tracking-tight">Featured Collections</h2>
        <div className="h-px flex-1 bg-linear-to-r from-border-theme to-transparent ml-6 hidden sm:block" />
      </div>

      {/* Infinite Carousel Container */}
      <Swiper
        modules={[Autoplay]}
        spaceBetween={24}
        slidesPerView="auto"
        loop={true}
        speed={4000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="w-full pb-8 [&>.swiper-wrapper]:!ease-linear"
      >
        {[...collections, ...collections, ...collections].map((collection, idx) => (
          <SwiperSlide key={idx} className="w-auto!" >
            <CollectionCard
              title={collection.title}
              subtitle={collection.subtitle}
              image={collection.image}
              badgeConfig={badgeConfig?.[collection.badgeName]}
              onClick={() => onCollectionClick(collection.badgeName)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default memo(FeaturedCollections);
