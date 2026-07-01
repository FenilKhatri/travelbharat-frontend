import { useAdminForm } from "../../hooks/useAdminForm";
import { INITIAL_STATE_FORM } from "../constants/state.constants";

export const useStateFormLogic = () => {
  return useAdminForm({
    queryKey: "adminStates",
    fetchEndpoint: (id) => `/states/admin/${id}`,
    createEndpoint: "/states/admin/create",
    updateEndpoint: (id) => `/states/admin/${id}`,
    listRoute: "/admin/states",
    initialState: INITIAL_STATE_FORM,
    dataExtractor: (res) => {
      const s = res?.data?.state || res?.state;
      if (!s) return INITIAL_STATE_FORM;
      return {
        ...INITIAL_STATE_FORM,
        ...s,
        mapCoordinates: {
          lat: s.mapCoordinates?.coordinates?.[1] || 0,
          lng: s.mapCoordinates?.coordinates?.[0] || 0}
      };
    }
  });
};