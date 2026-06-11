// src/REDUX_FEATURES/REDUX_SLICES/auth/authApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../SERVICES/Axiosinstance";

const axiosBaseQuery = () => async ({ url, method, body, params }) => {
    try {
        const response = await axiosInstance({
            url,
            method,
            data: body,
            params,
        });
        return { data: response.data };
    } catch (error) {
        return {
            error: {
                status: error.response?.status,
                data: error.response?.data,
            },
        };
    }
};

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/admin/auth/login",
                method: "POST",
                body: credentials,
            }),
            transformResponse: (response) => response.data,
        }),
        getMe: builder.query({
            query: () => ({
                url: "/admin/auth/me",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
        refreshToken: builder.mutation({
            query: () => ({
                url: "/admin/auth/refresh-token",
                method: "POST",
            }),
            transformResponse: (response) => response.data,
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/admin/auth/logout",
                method: "POST",
            }),
        }),
    }),
});

// ✅ IMPORTANT: Export hooks
export const {
    useLoginMutation,
    useGetMeQuery,
    useLazyGetMeQuery,
    useRefreshTokenMutation,
    useLogoutMutation,
} = authApi;