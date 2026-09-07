import api from "./api";

export const getJoinToken = (bookingId) =>
  api.get(`/interviews/bookings/${bookingId}/join-token`);