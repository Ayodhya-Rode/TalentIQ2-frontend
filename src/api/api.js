import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

// Lets App.jsx hand this module a React Router navigate function,
// so redirects here are client-side instead of full page reloads.
let navigateRef = null;
export const setNavigate = (navFn) => {
  navigateRef = navFn;
};

const redirectToLogin = () => {
  if (navigateRef) {
    navigateRef("/login", { replace: true });
  } else {
    // fallback only if router isn't mounted yet (shouldn't normally happen)
    window.location.href = "/login";
  }
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => {
    callback(newToken);
  });
  refreshSubscribers = [];
};

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // No response or no request config
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    // Only handle 401 errors
    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Prevent refresh endpoint from triggering another refresh
    if (originalRequest.url?.includes("/auth/refresh")) {
      setAccessToken(null);
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
        },
      );

      const newToken = response.data?.data?.accessToken;

      if (!newToken) {
        throw new Error("Access token was not returned");
      }

      setAccessToken(newToken);
      isRefreshing = false;
      onRefreshed(newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      setAccessToken(null);
      refreshSubscribers.forEach((callback) => {
        callback(null);
      });
      refreshSubscribers = [];
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  },
);

export default api;