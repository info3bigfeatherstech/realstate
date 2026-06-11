// src/SERVICES/Axiosinstance.js
import axios from "axios";

let store = null;

export const setStore = (storeInstance) => {
    store = storeInstance;
};

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7000/api/v1',
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Request interceptor - get token from Redux
axiosInstance.interceptors.request.use(
    (config) => {
        const token = store?.getState()?.auth?.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Don't try to refresh if the failing request IS the refresh-token call itself,
        // or the login call — avoids infinite loops.
        const isAuthEndpoint =
            originalRequest?.url?.includes("/admin/auth/refresh-token") ||
            originalRequest?.url?.includes("/admin/auth/login");

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:7000/api/v1'}/admin/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = response.data.data.accessToken;

                // Update Redux store
                if (store) {
                    store.dispatch({
                        type: "auth/setAccessToken",
                        payload: newAccessToken,
                    });
                }

                processQueue(null, newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                if (store) {
                    store.dispatch({ type: "auth/clearCredentials" });
                }
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;