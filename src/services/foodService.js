import axiosInstance from "../lib/axios";

export const foodService = {
  getFoods: (params) => axiosInstance.get("/foods", { params }),
  getFoodBySlug: (slug) => axiosInstance.get(`/foods/${slug}`),
};
