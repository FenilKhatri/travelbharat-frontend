import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { placeService } from "../../../../services/placeService";
import ExploreIconicSection from "./ExploreIconicSection";

const TrendingPlaces = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['trendingPlaces'],
    queryFn: () => placeService.getTrendingPlaces()
  });

  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (data?.data?.places) {
      // Prioritize Surat places
      const fetchedPlaces = [...data.data.places];
      const suratPlaces = [];
      const otherPlaces = [];
      
      fetchedPlaces.forEach(p => {
        if (p.cityId?.name?.toLowerCase() === 'surat') {
          suratPlaces.push({ ...p, featured: true });
        } else {
          otherPlaces.push(p);
        }
      });
      
      setPlaces([...suratPlaces, ...otherPlaces]);
    }
  }, [data]);

  return (
    <ExploreIconicSection
      type="destination"
      highlightText="Top Rated"
      title="Trending Destinations"
      subtitle="Discover the most sought-after locations handpicked for your next unforgettable journey."
      data={places.slice(0, 4)}
      viewAllLink="/places"
      viewAllText="Explore All Destinations"
      isLoading={isLoading}
    />
  );
};

export default TrendingPlaces;



