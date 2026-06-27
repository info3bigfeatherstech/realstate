import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../../SERVICES/Axiosinstance";
const axiosBaseQuery =
  () =>
  async ({ url, method, body, params, headers }) => {
    try {
      const config = {
        url,
        method,
        data: body,
        params,
        headers: { ...headers },
      };
      const response = await axiosInstance(config);
      return { data: response.data };
    } catch (error) {
      return {
        error: { status: error.response?.status, data: error.response?.data },
      };
    }
  };
export const adminReportsApi = createApi({
  reducerPath: "adminReportsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Reports"],
  endpoints: (builder) => ({
    getPropertyViewsReport: builder.query({
      query: (params) => ({
        url: "/admin/reports/property-views",
        method: "GET",
        params,
      }),
      transformResponse: (response) => response,
      providesTags: ["Reports"],
    }),
    getLeadConversionReport: builder.query({
      query: (params) => ({
        url: "/admin/reports/leads",
        method: "GET",
        params,
      }),
      transformResponse: (response) => response,
      providesTags: ["Reports"],
    }),
    getRevenueReport: builder.query({
      query: (params) => ({
        url: "/admin/reports/revenue",
        method: "GET",
        params,
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Reports"],
    }),
    getPropertyAnalysisReport: builder.query({
      query: (params) => ({
        url: "/admin/reports/property-analysis",
        method: "GET",
        params,
      }),
      transformResponse: (response) => response,
      providesTags: ["Reports"],
    }),
    getCustomerActivityReport: builder.query({
      query: (params) => ({
        url: "/admin/reports/customers",
        method: "GET",
        params,
      }),
      transformResponse: (response) => response,
      providesTags: ["Reports"],
    }),
  }),
});
export const {
  useGetPropertyViewsReportQuery,
  useGetLeadConversionReportQuery,
  useGetRevenueReportQuery,
  useGetPropertyAnalysisReportQuery,
  useGetCustomerActivityReportQuery,
} = adminReportsApi;
