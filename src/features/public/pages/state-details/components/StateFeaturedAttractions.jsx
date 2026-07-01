import ExploreIconicSection from "../../../sections/home/ExploreIconicSection";

const StateFeaturedAttractions = ({ featuredAttractions, slug }) => {
  if (!featuredAttractions || featuredAttractions.length === 0) return null;

  // Extract populated place documents
  const places = featuredAttractions
    .map(fa => fa.place)
    .filter(Boolean); // Filter out nulls if population failed

  if (places.length === 0) return null;

  return (
    <ExploreIconicSection
      type="destination"
      highlightText="Top Attractions"
      title="Must-Visit Places"
      subtitle="Explore the most iconic and highly rated tourist spots."
      data={places}
      viewAllLink={`/places?state=${slug}`}
      viewAllText="Explore All Places"
      isLoading={false}
    />
  );
};

export default StateFeaturedAttractions;
