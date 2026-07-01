import { useAdminForm } from "../../hooks/useAdminForm";
import { INITIAL_FESTIVAL_FORM } from "../constants/festival.constants";

export const useFestivalFormLogic = () => {
  return useAdminForm({
    queryKey: "adminFestivals",
    fetchEndpoint: (id) => `/festivals/admin/${id}`,
    createEndpoint: "/festivals/admin/create",
    updateEndpoint: (id) => `/festivals/admin/${id}`,
    listRoute: "/admin/festivals",
    initialState: INITIAL_FESTIVAL_FORM,
    dataExtractor: (res) => {
      const f = res?.data?.festival || res?.festival;
      if (!f) return INITIAL_FESTIVAL_FORM;
      return {
        ...INITIAL_FESTIVAL_FORM,
        ...f,
        stateId: f.stateId?._id || f.stateId || "",
        cityId: f.cityId?._id || f.cityId || "",
      };
    }
  });
};