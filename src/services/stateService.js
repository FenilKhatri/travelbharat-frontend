import http from "../lib/axios";

const PREFIX = "/states";

export const stateService = {
  // Get all states (paginated/filtered)
  getAllStates: async (params) => {
    return http.get(PREFIX, { params });
  },

  // Get featured states (Gujarat first logic happens in backend or sorting)
  getFeaturedStates: async () => {
    return http.get(`${PREFIX}/featured`);
  },

  // Get single state by slug
  getStateBySlug: async (slug) => {
    return http.get(`${PREFIX}/${slug}`);
  },

  // Admin Routes
  adminGetAllStates: async (params) => {
    return http.get(`${PREFIX}/admin/all`, { params });
  },
  
  adminGetStateById: async (id) => {
    return http.get(`${PREFIX}/admin/${id}`);
  },

  adminCreateState: async (data) => {
    return http.post(`${PREFIX}/admin/create`, data);
  },

  adminUpdateState: async (id, data) => {
    return http.put(`${PREFIX}/admin/${id}`, data);
  },

  adminDeleteState: async (id) => {
    return http.delete(`${PREFIX}/admin/${id}`);
  }
};
