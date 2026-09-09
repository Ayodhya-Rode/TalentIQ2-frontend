import api from "./api";

export const getSupportDashboard = () => api.get("/support/dashboard");
export const getQueries = (status) => api.get("/support/queries", { params: status ? { status } : {} });
export const resolveQuery = (id, resolutionNote) => api.patch(`/support/queries/${id}/resolve`, { resolutionNote });