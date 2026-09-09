import api from "./api";

export const createRecruiterProfile = (data) => api.post("/recruiter/profile", data);
export const getRecruiterProfile = () => api.get("/recruiter/profile");
export const updateRecruiterProfile = (data) => api.put("/recruiter/profile", data);

export const getCandidates = (params) => api.get("/recruiter/candidates", { params });
export const getEmailHistory = (candidateProfileId) =>
  api.get(`/recruiter/candidates/${candidateProfileId}/email-history`);
export const sendOutreachEmail = (candidateProfileId, data) =>
  api.post(`/recruiter/candidates/${candidateProfileId}/outreach-email`, data);

export const getMyOutreachHistory = () => api.get("/recruiter/outreach-history");