import http from "../lib/axios";

export const accommodationService = {
  getAccommodationsByDestination: async (destinationId) => {
    return http.get(`/accommodations/destination/${destinationId}`);
  },
};
