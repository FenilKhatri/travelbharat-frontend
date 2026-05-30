import http from "../lib/axios";

const PREFIX = "/festivals";

export const festivalService = {
  // Public
  getAllFestivals: (params) => http.get(PREFIX, { params }),
  getFeaturedFestivals: () => http.get(`${PREFIX}/featured`),
  getFestivalBySlug: (slug) => http.get(`${PREFIX}/${slug}`),
  getFestivalsByState: (stateSlug) => http.get(`${PREFIX}/state/${stateSlug}`),

  // Admin
  adminGetAllFestivals: (params) => http.get(`${PREFIX}/admin/all`, { params }),
  adminGetFestival: (id) => http.get(`${PREFIX}/admin/${id}`),
  adminCreateFestival: (data) => http.post(`${PREFIX}/admin/create`, data),
  adminUpdateFestival: (id, data) => http.put(`${PREFIX}/admin/${id}`, data),
  adminDeleteFestival: (id) => http.delete(`${PREFIX}/admin/${id}`),
};
