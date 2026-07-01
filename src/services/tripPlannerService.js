import http from "../lib/axios";

export const tripPlannerService = {
  generateTrip: async (payload) => {
    return http.post("/trips/generate", payload);
  },
  getMyTrips: async () => {
    return http.get("/trips");
  },
  getTrip: async (id) => {
    return http.get(`/trips/${id}`);
  }};
