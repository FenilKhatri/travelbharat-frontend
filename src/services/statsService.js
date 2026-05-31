import http from "../lib/axios";

export const statsService = {
  getPublicStats: async () => {
    return http.get("/stats/public");
  },
  getStatesDestinationCounts: async () => {
    return http.get("/stats/states-destination-counts");
  },
};
