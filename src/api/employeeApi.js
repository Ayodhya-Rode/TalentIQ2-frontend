import api from "./api";

export const createEmployeeProfile = (data) => api.post("/employee/create-profile", data);
export const getEmployeeProfile = () => api.get("/employee/get-profile");
export const updateEmployeeProfile = (data) => api.put("/employee/update-profile", data);

export const createSlot = (data) => api.post("/employee/create-slot", data);
export const getMySlots = (params) => api.get("/employee/get-slots", { params });
export const updateSlot = (id, data) => api.put(`/employee/update-slot/${id}`, data);
export const deleteSlot = (id) => api.delete(`/employee/delete-slot/${id}`);

export const getEmployeeBookings = (params) => api.get("/employee/get-bookings", { params });
export const getEmployeeDashboard = () => api.get("/employee/dashboard");

export const employeeConfirmComplete = (bookingId) =>
  api.post(`/interviews/employee/bookings/${bookingId}/confirm-complete`);