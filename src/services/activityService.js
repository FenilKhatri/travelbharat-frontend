import axiosInstance from "../lib/axios";

export const activityService = {
  getActivities: (params) => axiosInstance.get("/activities", { params }),
  getActivityBySlug: (slug) => axiosInstance.get(`/activities/${slug}`),
};
