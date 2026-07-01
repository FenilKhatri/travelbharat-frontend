import { useAdminForm } from "../../hooks/useAdminForm";
import { INITIAL_CITY_FORM } from "../constants/city.constants";

export const useCityFormLogic = () => {
  return useAdminForm({
    queryKey: "adminCities",
    fetchEndpoint: (id) => `/cities/admin/${id}`,
    createEndpoint: "/cities/admin/create",
    updateEndpoint: (id) => `/cities/admin/${id}`,
    listRoute: "/admin/cities",
    initialState: INITIAL_CITY_FORM,
    dataExtractor: (res) => {
      const c = res?.data?.city || res?.city;
      if (!c) return INITIAL_CITY_FORM;
      return {
        ...INITIAL_CITY_FORM,
        ...c,
        mapCoordinates: {
          lat: c.mapCoordinates?.coordinates?.[1] || 0,
          lng: c.mapCoordinates?.coordinates?.[0] || 0,
        }
      };
    }
  });
};