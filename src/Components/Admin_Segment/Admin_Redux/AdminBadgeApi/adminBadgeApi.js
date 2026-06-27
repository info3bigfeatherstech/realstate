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
export const adminBadgeApi = createApi({
  reducerPath: "adminBadgeApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["BadgeConfig"],
  endpoints: (builder) => ({
    getBadgeConfig: builder.query({
      query: () => ({ url: "/admin/badges/config", method: "GET" }),
      transformResponse: (response) => response.data,
      providesTags: ["BadgeConfig"],
    }),
    updateBadgeConfig: builder.mutation({
      query: (body) => ({ url: "/admin/badges/config", method: "PUT", body }),
      invalidatesTags: ["BadgeConfig"],
    }),
    addBadgeTier: builder.mutation({
      query: (body) => ({ url: "/admin/badges/tiers", method: "POST", body }),
      invalidatesTags: ["BadgeConfig"],
    }),
    updateBadgeTier: builder.mutation({
      query: ({ level, ...body }) => ({
        url: `/admin/badges/tiers/${level}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["BadgeConfig"],
    }),
    toggleBadgeTierStatus: builder.mutation({
      query: ({ level, status }) => ({
        url: `/admin/badges/tiers/${level}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["BadgeConfig"],
    }),
    deleteBadgeTier: builder.mutation({
      query: (level) => ({
        url: `/admin/badges/tiers/${level}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BadgeConfig"],
    }),
  }),
});
export const {
  useGetBadgeConfigQuery,
  useUpdateBadgeConfigMutation,
  useAddBadgeTierMutation,
  useUpdateBadgeTierMutation,
  useToggleBadgeTierStatusMutation,
  useDeleteBadgeTierMutation,
} = adminBadgeApi;
