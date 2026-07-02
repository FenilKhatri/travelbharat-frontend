import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { FiSun, FiCompass, FiGlobe, FiNavigation, FiClock } from "react-icons/fi";
import { cityService } from "../../../../../services/cityService";
import { placeService } from "../../../../../services/placeService";
import { hotelService } from "../../../../../services/hotelService";
import { restaurantService } from "../../../../../services/restaurantService";
import { festivalService } from "../../../../../services/festivalService";

export const useCityData = (citySlug, stateSlug) => {
  const { data: cityData, isLoading: cityLoading, isError: cityError } = useQuery({
    queryKey: ["cityBySlug", citySlug],
    queryFn: () => cityService.getCityBySlug(citySlug),
    enabled: !!citySlug});

  const city = cityData?.data?.city;
  const resolvedStateSlug = stateSlug || city?.stateId?.slug;

  const { data: placesData, isLoading: placesLoading } = useQuery({
    queryKey: ["placesByCity", citySlug],
    queryFn: () => placeService.getPlacesByCity(citySlug, { limit: 5 }),
    enabled: !!citySlug});

  const { data: hotelsData, isLoading: hotelsLoading } = useQuery({
    queryKey: ["hotelsByCity", city?._id],
    queryFn: () => hotelService.getHotels({ cityId: city._id, limit: 6 }),
    enabled: !!city?._id});

  const { data: restaurantsData, isLoading: restaurantsLoading } = useQuery({
    queryKey: ["restaurantsByCity", city?._id],
    queryFn: () => restaurantService.getRestaurants({ cityId: city._id, limit: 6 }),
    enabled: !!city?._id});

  const { data: festivalsData, isLoading: festivalsLoading } = useQuery({
    queryKey: ["festivalsByState", resolvedStateSlug],
    queryFn: () => festivalService.getFestivalsByState(resolvedStateSlug),
    enabled: !!resolvedStateSlug});

  const places = placesData?.data?.places || [];
  const hotels = hotelsData?.data?.hotels || [];
  const restaurants = restaurantsData?.data?.restaurants || [];
  const festivals = festivalsData?.data?.festivals || [];

  const avgRating = useMemo(() => {
    const rated = places.filter((p) => p.rating > 0);
    if (!rated.length) return null;
    return (rated.reduce((sum, p) => sum + p.rating, 0) / rated.length).toFixed(1);
  }, [places]);

  const travelTips = useMemo(() => {
    const tips = [];
    if (city?.bestTimeToVisit) tips.push(`Best time to visit: ${city.bestTimeToVisit}`);
    if (city?.transport?.local) tips.push(city.transport.local);
    const stateTips = city?.stateId?.travelTips?.map(t => typeof t === "string" ? t : t?.description)?.filter((t) => t?.trim()) || [];
    return [...tips, ...stateTips].slice(0, 6);
  }, [city]);

  const quickFacts = useMemo(() => {
    if (!city) return [];
    return [
      { icon: FiSun, label: "Best Time To Visit", value: city.bestTimeToVisit },
      { icon: FiCompass, label: "Popular For", value: city.tagline },
      { icon: FiGlobe, label: "Local Language", value: city.stateId?.languages?.join(", ") },
      { icon: FiNavigation, label: "Transportation", value: city.transport?.local },
      { icon: FiClock, label: "Population", value: city.population },
    ].filter((f) => f.value);
  }, [city]);

  return {
    city,
    cityLoading,
    cityError,
    places,
    placesLoading,
    hotels,
    hotelsLoading,
    restaurants,
    restaurantsLoading,
    festivals,
    festivalsLoading,
    resolvedStateSlug,
    avgRating,
    travelTips,
    quickFacts
  };
};
