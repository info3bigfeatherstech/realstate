import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../../SERVICES/Axiosinstance";

const axiosBaseQuery = () => async ({ url, method, body, params, headers }) => {
  try {
    const response = await axiosInstance({ url, method, data: body, params, headers: { ...headers } });
    return { data: response.data };
  } catch (error) {
    return { error: { status: error.response?.status, data: error.response?.data } };
  }
};

export const inquiryApi = createApi({
  reducerPath: "inquiryApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Inquiries", "InquiryStats"],
  endpoints: (builder) => ({
    getInquiryStats: builder.query({
      query: () => ({ url: "/admin/inquiries/stats" }),
      transformResponse: (r) => r.data,
      providesTags: ["InquiryStats"],
    }),
    getInquiries: builder.query({
      query: (params) => ({ url: "/admin/inquiries", params }),
      transformResponse: (r) => ({ inquiries: r.data, meta: r.meta }),
      providesTags: ["Inquiries"],
    }),
    getInquiryById: builder.query({
      query: (id) => ({ url: `/admin/inquiries/${id}` }),
      transformResponse: (r) => r.data,
    }),
    updateInquiry: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/admin/inquiries/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Inquiries", "InquiryStats"],
    }),
    deleteInquiry: builder.mutation({
      query: (id) => ({ url: `/admin/inquiries/${id}`, method: "DELETE" }),
      invalidatesTags: ["Inquiries", "InquiryStats"],
    }),
  }),
});

export const {
  useGetInquiryStatsQuery,
  useGetInquiriesQuery,
  useGetInquiryByIdQuery,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
} = inquiryApi;
