// src/admin/redux/AccommodationListingInquiryApi/accommodationListingInquiryApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "../../../../SERVICES/Axiosinstance";

const axiosBaseQuery = () => async ({ url, method, body, params }) => {
    try {
        const response = await axiosInstance({
            url,
            method,
            data: body,
            params,
        });
        return { data: response.data };
    } catch (error) {
        return {
            error: {
                status: error.response?.status,
                data: error.response?.data,
            },
        };
    }
};

export const accommodationListingInquiryApi = createApi({
    reducerPath: "accommodationListingInquiryApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["AccommodationListingInquiry"],
    endpoints: (builder) => ({
        getAccommodationListingInquiries: builder.query({
            query: (params) => ({
                url: "/admin/inquiries",
                method: "GET",
                params: {
                    ...params,
                    formType: "accommodation_listing",
                },
            }),
            transformResponse: (response) => ({ inquiries: response.data, meta: response.meta }),
            providesTags: ["AccommodationListingInquiry"],
        }),

        getAccommodationListingInquiryById: builder.query({
            query: (id) => ({
                url: `/admin/inquiries/${id}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "AccommodationListingInquiry", id }],
        }),

        getAccommodationListingInquiryStats: builder.query({
            query: () => ({
                url: "/admin/inquiries/stats",
                method: "GET",
                params: { formType: "accommodation_listing" },
            }),
            transformResponse: (response) => response.data,
            providesTags: ["AccommodationListingInquiry"],
        }),

        updateAccommodationListingInquiry: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/admin/inquiries/${id}`,
                method: "PATCH",
                body: patch,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["AccommodationListingInquiry"],
        }),

        deleteAccommodationListingInquiry: builder.mutation({
            query: (id) => ({
                url: `/admin/inquiries/${id}`,
                method: "DELETE",
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["AccommodationListingInquiry"],
        }),
    }),
});

export const {
    useGetAccommodationListingInquiriesQuery,
    useGetAccommodationListingInquiryByIdQuery,
    useGetAccommodationListingInquiryStatsQuery,
    useUpdateAccommodationListingInquiryMutation,
    useDeleteAccommodationListingInquiryMutation,
} = accommodationListingInquiryApi;
