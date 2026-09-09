import api from "./api";

export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const logoutUser = () => api.post("/auth/logout");
export const getMe = () => api.get("/auth/me");

export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
export const verifyOtp = (data) => api.post("/auth/verify-otp", data);
export const resetPassword = (data) => api.post("/auth/reset-password", data);

export const changePassword = (data) => api.put("/auth/change-password", data);