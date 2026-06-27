import axiosInstance from "../lib/axios";

export const restaurantService = {
  getRestaurants: (params) => axiosInstance.get("/restaurants", { params }),
  getRestaurantBySlug: (slug) => axiosInstance.get(`/restaurants/${slug}`),
};
