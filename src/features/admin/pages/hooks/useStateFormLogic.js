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
      
      // Convert quickFacts object to array of { title, value, icon }
      const quickFactsArr = [];
      if (s.quickFacts && typeof s.quickFacts === "object" && !Array.isArray(s.quickFacts)) {
        for (const [key, value] of Object.entries(s.quickFacts)) {
          quickFactsArr.push({ title: key, value: value, icon: "FiInfo" }); 
        }
      } else if (Array.isArray(s.quickFacts)) {
          quickFactsArr.push(...s.quickFacts);
      }

      return {
        ...INITIAL_STATE_FORM,
        ...s,
        quickFacts: quickFactsArr,
        mapCoordinates: {
          lat: s.mapCoordinates?.coordinates?.[1] || 0,
          lng: s.mapCoordinates?.coordinates?.[0] || 0}
      };
    }
  });
};