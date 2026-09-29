import api from "./api";

export const getAiQuestions = (bookingId) =>
  api.get(`/candidate/bookings/${bookingId}/ai-questions`);

// Groq can take up to 30s, so override the default timeout
export const generateAiQuestions = (bookingId) =>
  api.post(`/candidate/bookings/${bookingId}/ai-questions`, null, { timeout: 40000 });