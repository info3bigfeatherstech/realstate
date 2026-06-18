import { createApi } from "@reduxjs/toolkit/query/react";
import customerAxiosInstance from "../../../SERVICES/CustomerAxiosInstance";

const axiosBaseQuery = () => async ({ url, method, body, params, headers }) => {
  try {
    const config = { url, method, data: body, params, headers: { ...headers } };
    if (body instanceof FormData) {
      Object.keys(config.headers).forEach((key) => {
        if (key.toLowerCase() === "content-type") delete config.headers[key];
      });
    }
    const response = await customerAxiosInstance(config);
    return { data: response.data };
  } catch (error) {
    return { error: { status: error.response?.status, data: error.response?.data } };
  }
};

export const customerAuthApi = createApi({
  reducerPath: "customerAuthApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["CustomerProfile"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: "/customer/auth/register", method: "POST", body }),
      transformResponse: (response) => response.data,
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({ url: "/customer/auth/verify-otp", method: "POST", body }),
      transformResponse: (response) => response.data,
    }),
    resendOtp: builder.mutation({
      query: (body) => ({ url: "/customer/auth/resend-otp", method: "POST", body }),
      transformResponse: (response) => response.data,
    }),
    login: builder.mutation({
      query: (body) => ({ url: "/customer/auth/login", method: "POST", body }),
      transformResponse: (response) => response.data,
    }),
    refreshToken: builder.mutation({
      query: () => ({ url: "/customer/auth/refresh-token", method: "POST", body: {} }),
      transformResponse: (response) => response.data,
    }),
    logout: builder.mutation({
      query: () => ({ url: "/customer/auth/logout", method: "POST", body: {} }),
    }),
    getMe: builder.query({
      query: () => ({ url: "/customer/auth/me" }),
      transformResponse: (response) => response.data,
      providesTags: ["CustomerProfile"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = customerAuthApi;
