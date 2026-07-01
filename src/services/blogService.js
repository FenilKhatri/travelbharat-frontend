import http from "../lib/axios";

const PREFIX = "/blogs";

export const blogService = {
  // Public
  getAllBlogs: (params) => http.get(PREFIX, { params }),
  getFeaturedBlogs: () => http.get(`${PREFIX}/featured`),
  getPopularBlogs: () => http.get(`${PREFIX}/popular`),
  getBlogBySlug: (slug) => http.get(`${PREFIX}/${slug}`),
  getBlogCategories: () => http.get(`${PREFIX}/categories`),
  getBlogTags: () => http.get(`${PREFIX}/tags`),
  getBlogsByCategory: (category, params) => http.get(`${PREFIX}/category/${category}`, { params }),
  getBlogsByTag: (tag, params) => http.get(`${PREFIX}/tag/${tag}`, { params }),
  getRelatedBlogs: (slug) => http.get(`${PREFIX}/related/${slug}`),
  incrementView: (slug) => http.post(`${PREFIX}/${slug}/view`),

  // Admin
  adminGetAllBlogs: (params) => http.get(`${PREFIX}/admin/all`, { params }),
  adminGetBlog: (id) => http.get(`${PREFIX}/admin/${id}`),
  adminCreateBlog: (data) => http.post(`${PREFIX}/admin/create`, data),
  adminUpdateBlog: (id, data) => http.put(`${PREFIX}/admin/${id}`, data),
  adminDeleteBlog: (id) => http.delete(`${PREFIX}/admin/${id}`),

  // Interactions
  getSavedBlogs: () => http.get(`${PREFIX}/user/saved`),
  toggleSaveBlog: (blogId) => http.post(`${PREFIX}/${blogId}/save`),
  toggleLike: (entityId, entityType) => http.post(`/likes/toggle`, { entityId, entityType: entityType.toLowerCase() }),
  addComment: (blogId, text) => http.post(`${PREFIX}/${blogId}/comments`, { text }),
  getComments: (blogId, params) => http.get(`${PREFIX}/${blogId}/comments`, { params }),
  deleteComment: (id) => http.delete(`${PREFIX}/comments/${id}`)};
