import http from "../lib/axios";

const PREFIX = "/search";

export const searchService = {
  // Unified search across all entities
  searchAll: async (query, type = "", limit = 5) => {
    return http.get(PREFIX, { params: { q: query, type, limit } });
  },

  // Lightweight search suggestions for global search bar
  getSuggestions: async (query) => {
    return http.get(`${PREFIX}/suggestions`, { params: { q: query } });
  }
};
