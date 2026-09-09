import api from "./api";

export const getPendingUsers = (params) => api.get("/super-admin/pending-users", { params });
export const approveUser = (id) => api.patch(`/super-admin/users/${id}/approve`);
export const rejectUser = (id) => api.patch(`/super-admin/users/${id}/reject`);
export const getAllUsers = (params) => api.get("/super-admin/users", { params });
export const getDashboardSummary = () => api.get("/super-admin/dashboard");
export const getCancellationWarnings = () => api.get("/super-admin/cancellation-warnings");
export const createSupportUser = (data) => api.post("/super-admin/create-support", data);