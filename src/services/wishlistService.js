import http from "../lib/axios";

const PREFIX = "/wishlist";

export const wishlistService = {
  // Get full wishlist
  getWishlist: async () => {
    return http.get(PREFIX);
  },

  // Check if specific items are in wishlist
  checkWishlist: async (placeId, blogId) => {
    const params = {};
    if (placeId) params.placeId = placeId;
    if (blogId) params.blogId = blogId;
    return http.get(`${PREFIX}/check`, { params });
  },

  // Toggle place in wishlist
  togglePlace: async (placeId) => {
    return http.post(`${PREFIX}/place`, { placeId });
  },

  // Toggle blog in wishlist
  toggleBlog: async (blogId) => {
    return http.post(`${PREFIX}/blog`, { blogId });
  }
};
