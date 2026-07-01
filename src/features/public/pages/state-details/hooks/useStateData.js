import { useQuery } from "@tanstack/react-query";
import { stateService } from "../../../../../services/stateService";
import { cityService } from "../../../../../services/cityService";
import { festivalService } from "../../../../../services/festivalService";
import { placeService } from "../../../../../services/placeService";
import { foodService } from "../../../../../services/foodService";
import http from "../../../../../lib/axios";

export const useStateData = (slug) => {
  const { data: stateData, isLoading: stateLoading, isError: stateError } = useQuery({
    queryKey: ["stateBySlug", slug],
    queryFn: () => stateService.getStateBySlug(slug),
    enabled: !!slug});

  const state = stateData?.data?.state;

  const { data: citiesData, isLoading: citiesLoading } = useQuery({
    queryKey: ["citiesByState", slug],
    queryFn: () => cityService.getCitiesByState(slug),
    enabled: !!slug});

  const { data: festivalsData, isLoading: festivalsLoading } = useQuery({
    queryKey: ["festivalsByState", slug],
    queryFn: () => festivalService.getFestivalsByState(slug),
    enabled: !!slug});

  const { data: placesData, isLoading: placesLoading } = useQuery({
    queryKey: ["placesByState", slug],
    queryFn: () => placeService.getPlacesByState(slug),
    enabled: !!slug});

  const { data: foodsData, isLoading: foodsLoading } = useQuery({
    queryKey: ["foodsByState", state?._id],
    queryFn: () => foodService.getFoods({ stateId: state?._id, limit: 6 }),
    enabled: !!state?._id});

  const { data: similarStatesData, isLoading: similarStatesLoading } = useQuery({
    queryKey: ["similarStates", slug],
    queryFn: () => http.get(`/states/${slug}/similar`).then(res => res.data),
    enabled: !!slug});

  return {
    state,
    stateLoading,
    stateError,
    cities: citiesData?.data?.cities || [],
    citiesLoading,
    festivals: festivalsData?.data?.festivals || [],
    festivalsLoading,
    places: placesData?.data?.places || [],
    placesLoading,
    foods: foodsData?.data?.foods || [],
    foodsLoading,
    similarStates: similarStatesData?.data?.states || [],
    similarStatesLoading};
};
