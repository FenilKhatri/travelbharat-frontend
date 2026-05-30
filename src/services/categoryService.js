import http from "../lib/axios";

export const categoryService = {
  getAllCategories: async (params) => {
    return http.get("/categories", { params });
  },
  getCategoryBySlug: async (slug) => {
    return http.get(`/categories/${slug}`);
  }
};
