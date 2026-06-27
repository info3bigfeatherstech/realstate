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
export const generalInquiryApi = createApi({
  reducerPath: "generalInquiryApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["GeneralInquiry", "GeneralInquiryDetail", "GeneralInquiryStats"],
  endpoints: (builder) => ({
    getInquiryStats: builder.query({
      query: () => ({ url: "/admin/general-inquiries/stats", method: "GET" }),
      transformResponse: (response) => response.data,
      providesTags: [{ type: "GeneralInquiryStats", id: "STATS" }],
    }),
    getInquiries: builder.query({
      query: (params) => ({
        url: "/admin/general-inquiries",
        method: "GET",
        params,
      }),
      transformResponse: (response) => ({
        inquiries: response.data,
        meta: response.meta,
      }),
      providesTags: (result) =>
        result?.inquiries
          ? [
              ...result.inquiries.map(({ _id }) => ({
                type: "GeneralInquiry",
                id: _id,
              })),
              { type: "GeneralInquiry", id: "LIST" },
            ]
          : [{ type: "GeneralInquiry", id: "LIST" }],
    }),
    getInquiryById: builder.query({
      query: (id) => ({ url: `/admin/general-inquiries/${id}`, method: "GET" }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [
        { type: "GeneralInquiryDetail", id },
      ],
    }),
    updateInquiryStatus: builder.mutation({
      query: ({ id, status, adminNotes }) => ({
        url: `/admin/general-inquiries/${id}/status`,
        method: "PATCH",
        body: { status, ...(adminNotes !== undefined ? { adminNotes } : {}) },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "GeneralInquiry", id: "LIST" },
        { type: "GeneralInquiryDetail", id },
        { type: "GeneralInquiryStats", id: "STATS" },
      ],
    }),
    deleteInquiry: builder.mutation({
      query: (id) => ({
        url: `/admin/general-inquiries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "GeneralInquiry", id: "LIST" },
        { type: "GeneralInquiryStats", id: "STATS" },
      ],
    }),
  }),
});
export const {
  useGetInquiryStatsQuery,
  useGetInquiriesQuery,
  useGetInquiryByIdQuery,
  useUpdateInquiryStatusMutation,
  useDeleteInquiryMutation,
} = generalInquiryApi;
