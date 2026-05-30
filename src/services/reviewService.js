import http from "../lib/axios";

const PREFIX = "/reviews";

export const reviewService = {
  // Get reviews for a place (Public)
  getPlaceReviews: async (placeId, params) => {
    return http.get(`${PREFIX}/place/${placeId}`, { params });
  },

  // User: Create review
  createReview: async (data) => {
    return http.post(PREFIX, data);
  },

  // User: Get my reviews
  getMyReviews: async () => {
    return http.get(`${PREFIX}/my`);
  },

  // User: Update own review
  updateReview: async (id, data) => {
    return http.put(`${PREFIX}/${id}`, data);
  },

  // User: Delete own review
  deleteReview: async (id) => {
    return http.delete(`${PREFIX}/${id}`);
  },

  // Admin Routes
  adminGetAllReviews: async (params) => {
    return http.get(`${PREFIX}/admin/all`, { params });
  },
  
  adminApproveReview: async (id) => {
    return http.put(`${PREFIX}/admin/approve/${id}`);
  },

  adminRejectReview: async (id) => {
    return http.put(`${PREFIX}/admin/reject/${id}`);
  },

  adminRespondToReview: async (id, adminResponse) => {
    return http.put(`${PREFIX}/admin/respond/${id}`, { adminResponse });
  },

  adminDeleteReview: async (id) => {
    return http.delete(`${PREFIX}/admin/${id}`);
  }
};
