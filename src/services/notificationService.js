import http from "../lib/axios";

const PREFIX = "/notifications";

export const notificationService = {
  // Admin Routes
  getAdminNotifications: async () => {
    return http.get(`${PREFIX}/admin`);
  },
  markAsRead: async (id) => {
    return http.put(`${PREFIX}/admin/${id}/read`);
  },
  markAllAsRead: async () => {
    return http.put(`${PREFIX}/admin/read-all`);
  },
  deleteNotification: async (id) => {
    return http.delete(`${PREFIX}/admin/${id}`);
  }
};
