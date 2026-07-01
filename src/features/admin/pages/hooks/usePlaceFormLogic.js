import { useAdminForm } from "../../hooks/useAdminForm";
import { INITIAL_PLACE_FORM } from "../constants/place.constants";

export const usePlaceFormLogic = () => {
  return useAdminForm({
    queryKey: "adminPlaces",
    fetchEndpoint: (id) => `/places/admin/${id}`,
    createEndpoint: "/places/admin/create",
    updateEndpoint: (id) => `/places/admin/${id}`,
    listRoute: "/admin/places",
    initialState: INITIAL_PLACE_FORM,
    dataExtractor: (res) => {
      const p = res?.data?.place || res?.place;
      if (!p) return INITIAL_PLACE_FORM;
      return {
        ...INITIAL_PLACE_FORM,
        ...p,
        stateId: p.stateId?._id || p.stateId || "",
        cityId: p.cityId?._id || p.cityId || "",
        mapCoordinates: {
          lat: p.mapCoordinates?.coordinates?.[1] || 0,
          lng: p.mapCoordinates?.coordinates?.[0] || 0}
      };
    }
  });
};