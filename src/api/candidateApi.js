import api from "./api";

export const createCandidateProfile = (data) => api.post("/candidate/create-profile", data);
export const getCandidateProfile = () => api.get("/candidate/get-profile");
export const updateCandidateProfile = (data) => api.put("/candidate/update-profile", data);

export const addProject = (data) => api.post("/candidate/add-projects", data);
export const updateProject = (id, data) => api.put(`/candidate/update-projects/${id}`, data);
export const deleteProject = (id) => api .delete(`/candidate/delete-projects/${id}`);

export const addCertificate = (data) => api.post("/candidate/add-certificates", data);
export const updateCertificate = (id, data) => api.put(`/candidate/update-certificates/${id}`, data);
export const deleteCertificate = (id) => api.delete(`/candidate/delete-certificates/${id}`);

export const getCandidateDashboard = () => api.get("/candidate/dashboard");

export const getEmployeesByCategory = (categoryId) =>
  api.get("/candidate/bookings/employees", { params: { categoryId } });
export const createBookingOrder = (data) => api.post("/candidate/bookings/create-order", data);
export const verifyBookingPayment = (data) => api.post("/candidate/bookings/verify-payment", data);
export const getMyBookings = () => api.get("/candidate/bookings/my-bookings");

export const candidateConfirmComplete = (bookingId) =>
  api.post(`/interviews/candidate/bookings/${bookingId}/confirm-complete`);

export const rebookSameEmployee = (bookingId, newSlotId) =>
  api.post(`/interviews/candidate/bookings/${bookingId}/rebook-same-employee`, { newSlotId });

export const requestRefund = (bookingId) =>
  api.post(`/interviews/candidate/bookings/${bookingId}/request-refund`);

export const getEmployeeOpenSlots = (employeeProfileId) =>
  api.get(`/candidate/bookings/employee/${employeeProfileId}/slots`);

export const getCandidateProfileView = () => api.get("/candidate/profile-view");