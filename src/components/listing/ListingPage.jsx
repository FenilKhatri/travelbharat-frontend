import { useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useListingData } from "../../hooks/listing/useListingData";
import { memo } from "react";

import ListingHero from "./ListingHero";
import FeaturedCollections from "./FeaturedCollections";
import ListingToolbar from "./ListingToolbar";
import ListingGrid from "./ListingGrid";
import CTASection from "./CTASection";

const ListingPage = ({ config }) => {
  const {
    endpoint,
    queryKeyPrefix,
    cardType,
    CardComponent,
    heroImage,
    highlightText,
    title,
    subtitle,
    searchPlaceholder,
    filters,
    sortOptions,
    emptyMessage,
    featuredCollections,
    badgeConfig
  } = config;

  const [searchParams, setSearchParams] = useSearchParams();
  const exploreRef = useRef(null);

  // Extract all query params for the hook
  const queryParams = {
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || ""};
  
  filters.forEach(f => {
    queryParams[f.key] = searchParams.get(f.key) || "";
  });

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useListingData(endpoint, queryKeyPrefix, queryParams);

  const items = data?.pages?.flatMap(page => page.items || []) || [];
  const totalResults = data?.pages?.[0]?.totalItems || 0;
  const activeBadge = searchParams.get("badge");

  const handleCollectionClick = useCallback((badgeName) => {
    setSearchParams((prev) => {
      prev.set("badge", badgeName);
      prev.set("page", "1");
      return prev;
    });
    exploreRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [setSearchParams]);

  const handleClearBadge = useCallback(() => {
    setSearchParams((prev) => {
      prev.delete("badge");
      return prev;
    });
  }, [setSearchParams]);

  const scrollToContent = useCallback(() => {
    window.scrollTo({
      top: 550, // Approximate hero height
      behavior: "smooth"
    });
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24 text-primary">
      <ListingHero
        heroImage={heroImage}
        highlightText={highlightText}
        title={title}
        subtitle={subtitle}
        onScrollClick={scrollToContent}
      />

      <FeaturedCollections
        collections={featuredCollections}
        badgeConfig={badgeConfig}
        onCollectionClick={handleCollectionClick}
      />

      <ListingToolbar
        ref={exploreRef}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        sortOptions={sortOptions}
        totalResults={totalResults}
        isLoading={isLoading}
        activeBadge={activeBadge}
        onClearBadge={handleClearBadge}
      />

      <ListingGrid
        items={items}
        isLoading={isLoading}
        isError={isError}
        error={error}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        CardComponent={CardComponent}
        cardType={cardType}
        emptyMessage={emptyMessage}
      />

      <CTASection />
    </div>
  );
};

export default memo(ListingPage);
