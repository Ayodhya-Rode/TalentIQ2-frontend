import api from "./api";

export const getPublicScorecard = (token) =>
  api.get(`/public/scorecards/${encodeURIComponent(token)}`);