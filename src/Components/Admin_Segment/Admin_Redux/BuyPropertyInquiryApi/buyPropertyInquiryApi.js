// src/admin/redux/BuyPropertyInquiryApi/buyPropertyInquiryApi.js
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

export const buyPropertyInquiryApi = createApi({
    reducerPath: "buyPropertyInquiryApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["BuyPropertyInquiry"],
    endpoints: (builder) => ({
        getBuyPropertyInquiries: builder.query({
            query: (params) => ({
                url: "/admin/inquiries",
                method: "GET",
                params: {
                    ...params,
                    formType: "buy_property",
                },
            }),
            transformResponse: (response) => ({ inquiries: response.data, meta: response.meta }),
            providesTags: ["BuyPropertyInquiry"],
        }),

        getBuyPropertyInquiryById: builder.query({
            query: (id) => ({
                url: `/admin/inquiries/${id}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "BuyPropertyInquiry", id }],
        }),

        getBuyPropertyInquiryStats: builder.query({
            query: () => ({
                url: "/admin/inquiries/stats",
                method: "GET",
                params: { formType: "buy_property" },
            }),
            transformResponse: (response) => response.data,
            providesTags: ["BuyPropertyInquiry"],
        }),

        updateBuyPropertyInquiry: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/admin/inquiries/${id}`,
                method: "PATCH",
                body: patch,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["BuyPropertyInquiry"],
        }),

        deleteBuyPropertyInquiry: builder.mutation({
            query: (id) => ({
                url: `/admin/inquiries/${id}`,
                method: "DELETE",
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["BuyPropertyInquiry"],
        }),
    }),
});

export const {
    useGetBuyPropertyInquiriesQuery,
    useGetBuyPropertyInquiryByIdQuery,
    useGetBuyPropertyInquiryStatsQuery,
    useUpdateBuyPropertyInquiryMutation,
    useDeleteBuyPropertyInquiryMutation,
} = buyPropertyInquiryApi;
