import http from "../lib/axios";

const PREFIX = "/auth";

export const authService = {
  // Register new user
  register: async (userData) => {
    return http.post(`${PREFIX}/register`, userData);
  },

  // Login user
  login: async (credentials) => {
    return http.post(`${PREFIX}/login`, credentials);
  },

  // Google Auth
  googleAuth: async (token) => {
    return http.post(`${PREFIX}/google`, { token });
  },

  // Get current user (Me)
  getMe: async () => {
    return http.get(`${PREFIX}/me`);
  },

  // Logout
  logout: async () => {
    return http.post(`${PREFIX}/logout`);
  },

  // Forgot Password
  forgotPassword: async (email) => {
    return http.post(`${PREFIX}/forgot-password`, { email });
  },

  // Reset Password
  resetPassword: async (token, password) => {
    return http.post(`${PREFIX}/reset-password/${token}`, { password });
  },

  // Verify Email
  verifyEmail: async (token) => {
    return http.get(`${PREFIX}/verify-email/${token}`);
  },

  // Update Profile
  updateProfile: async (profileData) => {
    return http.put(`${PREFIX}/profile`, profileData);
  },

  // Change Password
  changePassword: async (passwordData) => {
    return http.put(`${PREFIX}/change-password`, passwordData);
  }};
