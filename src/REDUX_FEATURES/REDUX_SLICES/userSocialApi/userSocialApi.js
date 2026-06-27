import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../SERVICES/Axiosinstance";
const axiosBaseQuery =
  () =>
  async ({ url, method, params }) => {
    try {
      const response = await axiosInstance({ url, method, params });
      return { data: response.data };
    } catch (error) {
      return {
        error: { status: error.response?.status, data: error.response?.data },
      };
    }
  };
export const userSocialApi = createApi({
  reducerPath: "userSocialApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["UserSocialLinks"],
  endpoints: (builder) => ({
    getActiveSocialLinks: builder.query({
      query: () => ({ url: "/user/social", method: "GET" }),
      transformResponse: (response) => response.data,
      providesTags: ["UserSocialLinks"],
    }),
    getPropertyShareUrls: builder.query({
      query: (propertyId) => ({
        url: `/user/social/properties/${propertyId}/share`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});
export const { useGetActiveSocialLinksQuery, useGetPropertyShareUrlsQuery } =
  userSocialApi;
