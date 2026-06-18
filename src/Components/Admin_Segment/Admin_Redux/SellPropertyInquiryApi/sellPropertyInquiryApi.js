// src/admin/redux/SellPropertyInquiryApi/sellPropertyInquiryApi.js
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

export const sellPropertyInquiryApi = createApi({
    reducerPath: "sellPropertyInquiryApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["SellPropertyInquiry"],
    endpoints: (builder) => ({
        getSellPropertyInquiries: builder.query({
            query: (params) => ({
                url: "/admin/inquiries",
                method: "GET",
                params: {
                    ...params,
                    formType: "sell_property",
                },
            }),
            transformResponse: (response) => ({ inquiries: response.data, meta: response.meta }),
            providesTags: ["SellPropertyInquiry"],
        }),

        getSellPropertyInquiryById: builder.query({
            query: (id) => ({
                url: `/admin/inquiries/${id}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "SellPropertyInquiry", id }],
        }),

        getSellPropertyInquiryStats: builder.query({
            query: () => ({
                url: "/admin/inquiries/stats",
                method: "GET",
                params: { formType: "sell_property" },
            }),
            transformResponse: (response) => response.data,
            providesTags: ["SellPropertyInquiry"],
        }),

        updateSellPropertyInquiry: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/admin/inquiries/${id}`,
                method: "PATCH",
                body: patch,
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["SellPropertyInquiry"],
        }),

        deleteSellPropertyInquiry: builder.mutation({
            query: (id) => ({
                url: `/admin/inquiries/${id}`,
                method: "DELETE",
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["SellPropertyInquiry"],
        }),
    }),
});

export const {
    useGetSellPropertyInquiriesQuery,
    useGetSellPropertyInquiryByIdQuery,
    useGetSellPropertyInquiryStatsQuery,
    useUpdateSellPropertyInquiryMutation,
    useDeleteSellPropertyInquiryMutation,
} = sellPropertyInquiryApi;
