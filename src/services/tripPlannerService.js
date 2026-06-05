import http from "../lib/axios";

export const tripPlannerService = {
  generateTrip: async (payload) => {
    return http.post("/trips/generate", payload);
  },
};
