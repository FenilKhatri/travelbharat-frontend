import http from "../lib/axios";

const PREFIX = "/places";

export const placeService = {
  // Get all places (with robust filtering)
  getAllPlaces: async (params) => {
    return http.get(PREFIX, { params });
  },

  // Get featured places
  getFeaturedPlaces: async () => {
    return http.get(`${PREFIX}/featured`);
  },

  // Get trending places
  getTrendingPlaces: async () => {
    return http.get(`${PREFIX}/trending`);
  },

  // Get place categories with counts
  getCategories: async () => {
    return http.get(`${PREFIX}/categories`);
  },

  // Get single place by slug
  getPlaceBySlug: async (slug) => {
    return http.get(`${PREFIX}/${slug}`);
  },

  // Get places by city slug
  getPlacesByCity: async (citySlug, params) => {
    return http.get(`${PREFIX}/city/${citySlug}`, { params });
  },

  // Get places by state slug
  getPlacesByState: async (stateSlug, params) => {
    return http.get(`${PREFIX}/state/${stateSlug}`, { params });
  },

  // Admin Routes
  adminGetAllPlaces: async (params) => {
    return http.get(`${PREFIX}/admin/all`, { params });
  },
  
  adminGetPlaceById: async (id) => {
    return http.get(`${PREFIX}/admin/${id}`);
  },

  adminCreatePlace: async (data) => {
    return http.post(`${PREFIX}/admin/create`, data);
  },

  adminUpdatePlace: async (id, data) => {
    return http.put(`${PREFIX}/admin/${id}`, data);
  },

  adminDeletePlace: async (id) => {
    return http.delete(`${PREFIX}/admin/${id}`);
  }
};
