import axios from "axios";

let store = null;

export const setCustomerStore = (storeInstance) => {
  store = storeInstance;
};

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:7000/api/v1";

const customerAxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

customerAxiosInstance.interceptors.request.use(
  (config) => {
    const token = store?.getState()?.customerAuth?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

customerAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint =
      originalRequest?.url?.includes("/customer/auth/refresh-token") ||
      originalRequest?.url?.includes("/customer/auth/login") ||
      originalRequest?.url?.includes("/customer/auth/register");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return customerAxiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${baseURL}/customer/auth/refresh-token`, {}, { withCredentials: true });
        const newAccessToken = response.data.data.accessToken;

        if (store) {
          store.dispatch({ type: "customerAuth/setAccessToken", payload: newAccessToken });
        }

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return customerAxiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (store) {
          store.dispatch({ type: "customerAuth/clearCredentials" });
        }
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?returnUrl=${returnUrl}`;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default customerAxiosInstance;
