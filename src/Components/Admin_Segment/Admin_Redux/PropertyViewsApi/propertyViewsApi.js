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
export const propertyViewsApi = createApi({
  reducerPath: "propertyViewsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Views"],
  endpoints: (builder) => ({
    getAllViews: builder.query({
      query: (params) => ({ url: "/admin/views", method: "GET", params }),
      transformResponse: (response) => response,
      providesTags: ["Views"],
    }),
    getPropertyViewStats: builder.query({
      query: (propertyId) => ({
        url: `/admin/views/property/${propertyId}/stats`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, propertyId) => [
        { type: "Views", id: `STATS_${propertyId}` },
      ],
    }),
    getPropertyViewers: builder.query({
      query: ({ propertyId, params }) => ({
        url: `/admin/views/property/${propertyId}/viewers`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => response,
      providesTags: (result, error, { propertyId }) => [
        { type: "Views", id: `VIEWERS_${propertyId}` },
      ],
    }),
    getAllPropertiesViewStats: builder.query({
      query: () => ({ url: "/admin/views/stats", method: "GET" }),
      transformResponse: (response) => response.data,
      providesTags: ["Views"],
    }),
  }),
});
export const {
  useGetAllViewsQuery,
  useGetPropertyViewStatsQuery,
  useGetPropertyViewersQuery,
  useGetAllPropertiesViewStatsQuery,
} = propertyViewsApi;
