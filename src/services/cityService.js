import http from "../lib/axios";

const PREFIX = "/cities";

export const cityService = {
  // Get all cities
  getAllCities: async (params) => {
    return http.get(PREFIX, { params });
  },

  // Get featured cities
  getFeaturedCities: async () => {
    return http.get(`${PREFIX}/featured`);
  },

  // Get cities by state slug
  getCitiesByState: async (stateSlug) => {
    return http.get(`${PREFIX}/state/${stateSlug}`);
  },

  // Get single city by slug
  getCityBySlug: async (slug) => {
    return http.get(`${PREFIX}/${slug}`);
  },

  // Admin Routes
  adminGetAllCities: async (params) => {
    return http.get(`${PREFIX}/admin/all`, { params });
  },
  
  adminGetCityById: async (id) => {
    return http.get(`${PREFIX}/admin/${id}`);
  },

  adminCreateCity: async (data) => {
    return http.post(`${PREFIX}/admin/create`, data);
  },

  adminUpdateCity: async (id, data) => {
    return http.put(`${PREFIX}/admin/${id}`, data);
  },

  adminDeleteCity: async (id) => {
    return http.delete(`${PREFIX}/admin/${id}`);
  }
};
