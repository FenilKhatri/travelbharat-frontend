import http from "../lib/axios";

export const historyService = {
  addHistory: async (data) => {
    return http.post("/history", data);
  },
  getMyHistory: async (limit = 20) => {
    return http.get(`/history?limit=${limit}`);
  },
  clearHistory: async () => {
    return http.delete("/history");
  }
};
