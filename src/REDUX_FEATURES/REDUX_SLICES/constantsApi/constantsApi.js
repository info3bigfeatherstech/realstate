import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../SERVICES/Axiosinstance";

const axiosBaseQuery = () => async ({ url, method, params }) => {
  try {
    const response = await axiosInstance({ url, method, params });
    return { data: response.data };
  } catch (error) {
    return { error: { status: error.response?.status, data: error.response?.data } };
  }
};

export const constantsApi = createApi({
  reducerPath: "constantsApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getConstants: builder.query({
      query: () => ({ url: "/constants", method: "GET" }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetConstantsQuery } = constantsApi;
