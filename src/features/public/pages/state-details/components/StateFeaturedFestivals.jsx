import ExploreIconicSection from "../../../sections/home/ExploreIconicSection";

const StateFeaturedFestivals = ({ featuredFestivals, slug }) => {
  if (!featuredFestivals || featuredFestivals.length === 0) return null;

  // Extract populated festival documents
  const festivals = featuredFestivals
    .map(ff => ff.festival)
    .filter(Boolean); // Filter out nulls if population failed

  if (festivals.length === 0) return null;

  return (
    <ExploreIconicSection
      type="festival"
      highlightText="Cultural Experience"
      title="Vibrant Festivals"
      subtitle="Immerse yourself in local traditions and celebrations."
      data={festivals}
      viewAllLink={`/festivals?state=${slug}`}
      viewAllText="View All Festivals"
      isLoading={false}
    />
  );
};

export default StateFeaturedFestivals;
