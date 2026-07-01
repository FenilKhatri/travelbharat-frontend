import http from "../lib/axios";

export const contactService = {
  submitContact: async (data) => {
    return http.post("/contact", data);
  },

  // Admin
  getAllInquiries: async (params) => {
    return http.get("/contact/admin/all", { params });
  },
  getInquiryStats: async () => {
    return http.get("/contact/admin/stats");
  },
  getInquiry: async (id) => {
    return http.get(`/contact/admin/${id}`);
  },
  updateInquiryStatus: async (id, data) => {
    return http.put(`/contact/admin/${id}`, data);
  },
  deleteInquiry: async (id) => {
    return http.delete(`/contact/admin/${id}`);
  }};
