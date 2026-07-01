import { useQuery } from "@tanstack/react-query";
import { placeService } from "../../../../../services/placeService";
import { festivalService } from "../../../../../services/festivalService";

export const usePlaceData = (slug) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['placeDetails', slug],
    queryFn: () => placeService.getPlaceBySlug(slug)
  });

  const place = data?.data?.place;
  const stateSlug = place?.stateId?.slug;

  const { data: festivalsData, isLoading: festivalsLoading } = useQuery({
    queryKey: ['festivalsByState', stateSlug],
    queryFn: () => festivalService.getFestivalsByState(stateSlug),
    enabled: !!stateSlug
  });

  return {
    place,
    isLoading,
    isError,
    festivals: festivalsData?.data?.festivals || [],
    festivalsLoading
  };
};
