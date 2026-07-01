import axiosInstance from "../lib/axios";

export const hotelService = {
  getHotels: (params) => axiosInstance.get("/hotels", { params }),
  getHotelBySlug: (slug) => axiosInstance.get(`/hotels/${slug}`)};
