import { useQuery } from "@tanstack/react-query";
import { festivalService } from "../../../../services/festivalService";
import ExploreIconicSection from "./ExploreIconicSection";

const FestivalsSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['festivals'],
    queryFn: () => festivalService.getAllFestivals()
  });

  const festivals = data?.data?.festivals || [];

  return (
    <ExploreIconicSection
      type="festival"
      highlightText="Cultural Vibrance"
      title="Iconic Festivals of Bharat"
      subtitle="Immerse yourself in the colors, music, and traditions of India's most celebrated festivals."
      data={festivals.slice(0, 3)}
      viewAllLink="/festivals"
      viewAllText="View All Festivals"
      isLoading={isLoading}
    />
  );
};

export default FestivalsSection;

