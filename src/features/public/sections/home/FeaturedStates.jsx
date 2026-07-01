import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { stateService } from "../../../../services/stateService";
import { statsService } from "../../../../services/statsService";
import ExploreIconicSection from "./ExploreIconicSection";

const FeaturedStates = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['featuredStates'],
    queryFn: () => stateService.getFeaturedStates()
  });

  // Fetch real destination counts per state
  const { data: countsData } = useQuery({
    queryKey: ['statesDestinationCounts'],
    queryFn: () => statsService.getStatesDestinationCounts()});

  const destCounts = countsData?.data?.counts || {};

  const states = useMemo(() => {
    if (!data?.data?.states) return [];
    const fetchedStates = [...data.data.states];
    const gujaratIndex = fetchedStates.findIndex(s => s.name.toLowerCase() === 'gujarat');
    
    if (gujaratIndex > 0) {
      const gujarat = fetchedStates.splice(gujaratIndex, 1)[0];
      fetchedStates.unshift(gujarat);
    }

    return fetchedStates.map((state) => ({
      ...state,
      featured: state.name.toLowerCase() === 'gujarat',
      totalPlaces: destCounts[state._id] || state.totalPlaces || 0}));
  }, [data, destCounts]);

  return (
    <ExploreIconicSection
      type="state"
      highlightText="Explore Iconic States"
      title="Discover the diverse beauty of India"
      subtitle="From the vibrant culture of Gujarat to the majestic palaces of Rajasthan, discover the diverse beauty of India state by state."
      data={states}
      viewAllLink="/states"
      viewAllText="View All States"
      isLoading={isLoading}
    />
  );
};

export default FeaturedStates;
