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
export const adminSocialApi = createApi({
  reducerPath: "adminSocialApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["SocialLinks"],
  endpoints: (builder) => ({
    getSocialLinks: builder.query({
      query: () => ({ url: "/admin/social-links", method: "GET" }),
      transformResponse: (response) => response.data,
      providesTags: ["SocialLinks"],
    }),
    createSocialLink: builder.mutation({
      query: (body) => ({ url: "/admin/social-links", method: "POST", body }),
      invalidatesTags: ["SocialLinks"],
    }),
    updateSocialLink: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/social-links/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SocialLinks"],
    }),
    toggleSocialLinkStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/admin/social-links/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["SocialLinks"],
    }),
    deleteSocialLink: builder.mutation({
      query: (id) => ({ url: `/admin/social-links/${id}`, method: "DELETE" }),
      invalidatesTags: ["SocialLinks"],
    }),
  }),
});
export const {
  useGetSocialLinksQuery,
  useCreateSocialLinkMutation,
  useUpdateSocialLinkMutation,
  useToggleSocialLinkStatusMutation,
  useDeleteSocialLinkMutation,
} = adminSocialApi;
