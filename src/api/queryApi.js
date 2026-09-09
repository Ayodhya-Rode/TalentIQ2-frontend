import api from "./api";

export const raiseQuery = (data) => api.post("/queries", data);
export const getMyQueries = () => api.get("/queries/my-queries");