import { useQuery } from "@tanstack/react-query";
import { festivalService } from "../../../../../services/festivalService";
import { placeService } from "../../../../../services/placeService";

export const useFestivalData = (slug) => {
  const { data: festivalData, isLoading: festivalLoading, isError: festivalError } = useQuery({
    queryKey: ["festivalBySlug", slug],
    queryFn: () => festivalService.getFestivalBySlug(slug),
    enabled: !!slug});

  const festival = festivalData?.data?.festival;
  const stateSlug = festival?.stateId?.slug;

  const { data: placesData, isLoading: placesLoading } = useQuery({
    queryKey: ['placesByState', stateSlug],
    queryFn: () => placeService.getPlacesByState(stateSlug),
    enabled: !!stateSlug
  });

  const places = placesData?.data?.places || [];

  return {
    festival,
    festivalLoading,
    festivalError,
    places,
    placesLoading};
};
