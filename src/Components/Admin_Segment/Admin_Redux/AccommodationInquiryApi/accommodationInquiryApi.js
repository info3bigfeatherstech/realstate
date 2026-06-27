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
export const accommodationInquiryApi = createApi({
  reducerPath: "accommodationInquiryApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "AccommodationInquiry",
    "AccommodationInquiryDetail",
    "AccommodationInquiryStats",
  ],
  endpoints: (builder) => ({
    getInquiryStats: builder.query({
      query: () => ({
        url: "/admin/accommodation-inquiries/stats",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: [{ type: "AccommodationInquiryStats", id: "STATS" }],
    }),
    getInquiries: builder.query({
      query: (params) => ({
        url: "/admin/accommodation-inquiries",
        method: "GET",
        params,
      }),
      transformResponse: (response) => response,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "AccommodationInquiry",
                id: _id,
              })),
              { type: "AccommodationInquiry", id: "LIST" },
            ]
          : [{ type: "AccommodationInquiry", id: "LIST" }],
    }),
    getInquiryById: builder.query({
      query: (id) => ({
        url: `/admin/accommodation-inquiries/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [
        { type: "AccommodationInquiryDetail", id },
      ],
    }),
    updateInquiryStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/accommodation-inquiries/${id}/status`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "AccommodationInquiry", id: "LIST" },
        { type: "AccommodationInquiryDetail", id },
        { type: "AccommodationInquiryStats", id: "STATS" },
      ],
    }),
    updateInquiryNotes: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/accommodation-inquiries/${id}/notes`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "AccommodationInquiryDetail", id },
        { type: "AccommodationInquiry", id: "LIST" },
      ],
    }),
    deleteInquiry: builder.mutation({
      query: (id) => ({
        url: `/admin/accommodation-inquiries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "AccommodationInquiry", id: "LIST" },
        { type: "AccommodationInquiryStats", id: "STATS" },
      ],
    }),
  }),
});
export const {
  useGetInquiryStatsQuery,
  useGetInquiriesQuery,
  useGetInquiryByIdQuery,
  useUpdateInquiryStatusMutation,
  useUpdateInquiryNotesMutation,
  useDeleteInquiryMutation,
} = accommodationInquiryApi;
